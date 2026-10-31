"""FarmIntern API.

Every state change follows: request -> validation -> authorization/ownership -> database -> response.
"""
import base64
import json
import logging
import re
import secrets
import smtplib
import time
from collections import defaultdict
from datetime import date, datetime, timedelta
from email.message import EmailMessage
import email.utils
from typing import Optional

from fastapi import (BackgroundTasks, Depends, FastAPI, HTTPException, Query, Request, WebSocket,
                     WebSocketDisconnect)
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, ConfigDict, Field, field_validator
from sqlalchemy import func, or_, select, text
from sqlalchemy.orm import Session

from app import config, recommender
from app.auth import (create_token, current_user, hash_password, require_roles, user_from_token,
                      verify_password)
from app.database import SessionLocal, get_db
from app.migrate import run_migrations
from app.models.all_models import (Application, CallInvite, CollegeActivity, Conversation,
                                   ConversationMember, Evaluation, Internship, Message, Notification,
                                   PasswordResetToken, Placement, Profile, Task, User, utcnow)

log = logging.getLogger("farmintern")
run_migrations()

app = FastAPI(title="FarmIntern Platform API", version="4.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=False,  # auth uses a Bearer header, not cookies
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.exception_handler(RequestValidationError)
async def validation_handler(_req, exc):
    parts = []
    for err in exc.errors():
        field = ".".join(str(x) for x in err.get("loc", []) if x not in ("body", "query"))
        msg = str(err.get("msg", "Invalid value")).replace("Value error, ", "")
        parts.append(f"{field}: {msg}" if field else msg)
    return JSONResponse(status_code=422, content={"detail": "; ".join(parts) or "Invalid request"})


# ---------------------------------------------------------------- schemas
EMAIL_RE = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
ROLES = {"student", "farmer", "college", "admin"}
SELF_REGISTER_ROLES = {"student", "farmer", "college"}
INTERNSHIP_STATUSES = {"Active", "Paused", "Closed"}


class In(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="ignore")


def check_password_strength(pw: str):
    if len(pw) < 8 or not re.search(r"[A-Za-z]", pw) or not re.search(r"\d", pw):
        raise ValueError("Password must be at least 8 characters and include a letter and a number")
    return pw


class Login(In):
    email: str = Field(max_length=180)
    password: str = Field(min_length=1, max_length=200)
    role: Optional[str] = None


class Register(In):
    name: str = Field(min_length=2, max_length=120)
    email: str = Field(max_length=180, pattern=EMAIL_RE)
    password: str = Field(max_length=200)
    role: str
    institution: str = Field(default="", max_length=180)

    @field_validator("password")
    @classmethod
    def password_strong(cls, v):
        return check_password_strength(v)


class GoogleAuth(In):
    role: Optional[str] = "student"
    email: Optional[str] = None
    name: Optional[str] = None
    credential: Optional[str] = None



class ForgotPassword(In):
    email: str = Field(default="", max_length=2000)


class ResetPassword(In):
    token: str = Field(min_length=10, max_length=200)
    password: str = Field(max_length=200)

    @field_validator("password")
    @classmethod
    def password_strong(cls, v):
        return check_password_strength(v)


class SMTPSetup(In):
    user: str = Field(min_length=3, max_length=180)
    password: str = Field(min_length=4, max_length=100)
    host: Optional[str] = "smtp.gmail.com"
    port: Optional[int] = 587



class InternshipIn(In):
    title: str = Field(min_length=3, max_length=180)
    category: str = Field(default="Agriculture", max_length=100)
    description: str = Field(default="", max_length=5000)
    location: str = Field(default="", max_length=160)
    duration: str = Field(default="", max_length=80)
    stipend: str = Field(default="", max_length=80)
    openings: int = Field(default=1, ge=1, le=500)


class InternshipUpdate(In):
    title: Optional[str] = Field(default=None, min_length=3, max_length=180)
    category: Optional[str] = Field(default=None, max_length=100)
    description: Optional[str] = Field(default=None, max_length=5000)
    location: Optional[str] = Field(default=None, max_length=160)
    duration: Optional[str] = Field(default=None, max_length=80)
    stipend: Optional[str] = Field(default=None, max_length=80)
    openings: Optional[int] = Field(default=None, ge=1, le=500)
    status: Optional[str] = None


class ApplicationIn(In):
    internship_id: int
    cover_letter: str = Field(default="", max_length=3000)


class DecisionIn(In):
    status: str


class PlacementUpdate(In):
    status: str


class TaskIn(In):
    placement_id: Optional[int] = None
    student_id: Optional[int] = None
    internship_id: Optional[int] = None
    title: str = Field(min_length=3, max_length=180)
    description: str = Field(default="", max_length=3000)
    due_date: Optional[date] = None


class TaskUpdate(In):
    progress: Optional[int] = Field(default=None, ge=0, le=100)
    note: Optional[str] = Field(default=None, max_length=2000)
    title: Optional[str] = Field(default=None, min_length=3, max_length=180)
    description: Optional[str] = Field(default=None, max_length=3000)
    due_date: Optional[date] = None
    status: Optional[str] = None  # accepted for backward compatibility; the server derives status from progress


class EvaluationIn(In):
    placement_id: Optional[int] = None
    student_id: Optional[int] = None
    internship_id: Optional[int] = None
    rating: float = Field(ge=1, le=5)
    feedback: str = Field(min_length=3, max_length=3000)


class MessageIn(In):
    conversation_id: Optional[int] = None
    recipient_id: Optional[int] = None
    body: str = Field(min_length=1, max_length=4000)


class ProfileIn(In):
    name: Optional[str] = Field(default=None, min_length=2, max_length=120)
    headline: str = Field(default="", max_length=180)
    bio: str = Field(default="", max_length=3000)
    institution: str = Field(default="", max_length=180)
    course: str = Field(default="", max_length=160)
    year: str = Field(default="", max_length=40)
    skills: str = Field(default="", max_length=500)
    phone: str = Field(default="", max_length=40, pattern=r"^[0-9+()\-\s]*$")
    location: str = Field(default="", max_length=160)


class CallStart(In):
    recipient_id: int
    kind: str = "video"


class CallRespond(In):
    action: str


# ---------------------------------------------------------------- helpers
def iso(dt):
    return dt.isoformat() + "Z" if dt else None


def user_json(u):
    return {"id": u.id, "name": u.name, "email": u.email, "role": u.role, "phone": u.phone or "",
            "location": u.location or "", "verified": bool(u.verified), "active": bool(u.active),
            "created_at": iso(u.created_at)}


def student_card(db, u):
    """Applicant/placement view of a student including profile data the farmer needs to decide."""
    p = db.query(Profile).filter_by(user_id=u.id).first()
    return {**user_json(u), "headline": p.headline if p else "", "bio": p.bio if p else "",
            "institution": p.institution if p else "", "course": p.course if p else "",
            "year": p.year if p else "", "skills": p.skills if p else ""}


def notify(db, user_id, title, body="", link=""):
    """Adds a notification to the current transaction (the caller commits)."""
    db.add(Notification(user_id=user_id, title=title[:180], body=body, link=link))


def hired_count(db, internship_id):
    return db.query(Placement).filter(Placement.internship_id == internship_id,
                                      Placement.status != "Terminated").count()


def sync_internship_status(db, i):
    hired = hired_count(db, i.id)
    if i.status == "Active" and hired >= i.openings:
        i.status = "Filled"
    elif i.status == "Filled" and hired < i.openings:
        i.status = "Active"
    return hired


def internship_json(i, db, my_status=None):
    hired = hired_count(db, i.id)
    f = db.get(User, i.farmer_id)
    return {"id": i.id, "title": i.title, "category": i.category, "description": i.description,
            "location": i.location, "duration": i.duration, "stipend": i.stipend, "openings": i.openings,
            "hired": hired, "openings_left": max(i.openings - hired, 0), "status": i.status,
            "created_at": iso(i.created_at), "farmer": f.name if f else "Farm Partner",
            "farmer_id": i.farmer_id, "my_application": my_status}


def placement_json(p, db):
    tasks = db.query(Task).filter_by(placement_id=p.id).all()
    evs = db.query(Evaluation).filter_by(placement_id=p.id).all()
    return {"id": p.id, "status": p.status, "start_date": str(p.start_date) if p.start_date else None,
            "end_date": str(p.end_date) if p.end_date else None, "application_id": p.application_id,
            "student": student_card(db, p.student), "internship_id": p.internship_id,
            "internship": p.internship.title if p.internship else "",
            "farmer": p.farmer.name if p.farmer else "", "farmer_id": p.farmer_id,
            "tasks": len(tasks), "completed_tasks": sum(t.status == "Completed" for t in tasks),
            "progress": round(sum(t.progress for t in tasks) / len(tasks)) if tasks else 0,
            "evaluations": len(evs),
            "average_rating": round(sum(e.rating for e in evs) / len(evs), 2) if evs else None}


def application_json(a, db):
    return {"id": a.id, "status": a.status, "cover_letter": a.cover_letter, "applied_at": iso(a.applied_at),
            "decided_at": iso(a.decided_at), "student": student_card(db, a.student),
            "internship": internship_json(a.internship, db),
            "placement": ({"id": a.placement.id, "status": a.placement.status,
                           "start_date": str(a.placement.start_date) if a.placement.start_date else None}
                          if a.placement else None)}


def task_json(t, db):
    overdue = bool(t.due_date and t.status != "Completed" and t.due_date < date.today())
    return {"id": t.id, "placement_id": t.placement_id, "title": t.title, "description": t.description,
            "due_date": str(t.due_date) if t.due_date else None, "status": t.status, "progress": t.progress,
            "note": t.student_note or "", "overdue": overdue, "updated_at": iso(t.updated_at),
            "student_id": t.student_id, "student": t.student.name if t.student else "",
            "internship_id": t.internship_id, "internship": t.internship.title if t.internship else "",
            "placement_status": t.placement.status if t.placement else None}


def evaluation_json(e):
    return {"id": e.id, "placement_id": e.placement_id, "student": e.student.name if e.student else "",
            "student_id": e.student_id, "internship": e.internship.title if e.internship else "",
            "internship_id": e.internship_id, "rating": e.rating, "feedback": e.feedback,
            "evaluator": e.evaluator.name if e.evaluator else "", "evaluator_role": e.evaluator.role if e.evaluator else "",
            "created_at": iso(e.created_at)}


def institution_of(db, user):
    p = db.query(Profile).filter_by(user_id=user.id).first()
    return (p.institution or "").strip() if p else ""


def college_student_ids(db, college):
    """A college only sees students whose profile institution matches its own."""
    inst = institution_of(db, college).lower()
    if not inst:
        return []
    rows = (db.query(Profile.user_id).join(User, User.id == Profile.user_id)
            .filter(User.role == "student", func.lower(func.trim(Profile.institution)) == inst).all())
    return [r[0] for r in rows]


def farmer_internship_ids(db, farmer):
    return [r[0] for r in db.query(Internship.id).filter(Internship.farmer_id == farmer.id).all()]


def scoped(q, model, user, db):
    """Restrict a query on Application/Placement/Task/Evaluation to what the caller may see."""
    if user.role == "admin":
        return q
    if user.role == "student":
        return q.filter(model.student_id == user.id)
    if user.role == "farmer":
        return q.filter(model.internship_id.in_(farmer_internship_ids(db, user) or [-1]))
    if user.role == "college":
        return q.filter(model.student_id.in_(college_student_ids(db, user) or [-1]))
    return q.filter(model.id == -1)


# ---------------------------------------------------------------- auth
_failed = defaultdict(list)
MAX_FAILS, WINDOW = 8, 600


def _throttle_key(request, email):
    return f"{request.client.host if request.client else 'unknown'}|{email.lower()}"


@app.get("/api/health")
def health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"name": "FarmIntern", "status": "online", "version": "4.0.0", "environment": config.ENVIRONMENT,
            "database": "sqlite" if config.IS_SQLITE else "postgresql"}


@app.post("/api/auth/login")
def login(data: Login, request: Request, db: Session = Depends(get_db)):
    key = _throttle_key(request, data.email)
    now = time.time()
    _failed[key] = [t for t in _failed[key] if now - t < WINDOW]
    if len(_failed[key]) >= MAX_FAILS:
        raise HTTPException(429, "Too many failed attempts. Try again in a few minutes.")
    u = db.query(User).filter(func.lower(User.email) == data.email.strip().lower()).first()
    if not u or not verify_password(data.password, u.password_hash):
        _failed[key].append(now)
        raise HTTPException(401, "Invalid email or password")
    if not u.active:
        raise HTTPException(403, "This account has been deactivated. Contact an administrator.")
    if u.role == "admin" and data.role and data.role != "admin":
        _failed[key].append(now)
        raise HTTPException(401, "Invalid email or password")
    if data.role and data.role != u.role:
        raise HTTPException(403, f"This is a {u.role} account. Select the {u.role.title()} tab to sign in.")
    _failed.pop(key, None)
    return {"token": create_token(u), "user": user_json(u)}


@app.post("/api/admin/login")
def admin_login(data: Login, request: Request, db: Session = Depends(get_db)):
    key = _throttle_key(request, data.email)
    now = time.time()
    _failed[key] = [t for t in _failed[key] if now - t < WINDOW]
    if len(_failed[key]) >= MAX_FAILS:
        raise HTTPException(429, "Too many failed attempts. Try again in a few minutes.")
    ident = data.email.strip().lower()
    u = db.query(User).filter(
        User.role == "admin",
        (
            (func.lower(User.email) == ident) |
            (func.lower(User.name) == ident)
        )
    ).first()
    if not u or not verify_password(data.password, u.password_hash) or u.role != "admin":
        _failed[key].append(now)
        raise HTTPException(401, "Invalid administrative credentials.")
    if not u.active:
        raise HTTPException(403, "This administrative account has been deactivated.")
    _failed.pop(key, None)
    return {"token": create_token(u), "user": user_json(u)}


@app.post("/api/auth/register")
def register(data: Register, db: Session = Depends(get_db)):
    role = data.role.lower().strip()
    if role not in SELF_REGISTER_ROLES:
        raise HTTPException(400, "Invalid role")
    email = data.email.lower().strip()
    if db.query(User).filter(func.lower(User.email) == email).first():
        raise HTTPException(409, "Email already registered")
    u = User(name=data.name.strip(), email=email, password_hash=hash_password(data.password), role=role,
             verified=False, active=True)
    db.add(u)
    db.flush()
    prof = db.query(Profile).filter_by(user_id=u.id).first()
    if prof:
        prof.institution = data.institution or prof.institution
    else:
        db.add(Profile(user_id=u.id, institution=data.institution))
    db.commit()
    return {"token": create_token(u), "user": user_json(u)}


@app.post("/api/auth/google")
def google_auth(data: GoogleAuth, db: Session = Depends(get_db)):
    role = (data.role or "student").lower()
    if role not in SELF_REGISTER_ROLES:
        role = "student"

    email = (data.email or "").strip().lower()
    name = (data.name or "").strip()

    # If Google credential (ID Token JWT) was provided by Google Identity Services:
    if data.credential:
        try:
            parts = data.credential.split(".")
            if len(parts) >= 2:
                payload_str = base64.urlsafe_b64decode(parts[1] + "===").decode("utf-8", errors="ignore")
                payload = json.loads(payload_str)
                if payload.get("email"):
                    email = payload["email"].strip().lower()
                if payload.get("name") and not name:
                    name = payload["name"].strip()
        except Exception as e:
            log.warning("Could not decode Google credential JWT: %s", e)

    if not email:
        raise HTTPException(400, "Google email address is required.")

    if not name:
        name = email.split("@")[0].capitalize()

    u = db.query(User).filter(func.lower(User.email) == email).first()
    if u:
        if not u.active:
            raise HTTPException(403, "This Google account has been deactivated. Contact an administrator.")
        p = db.query(Profile).filter_by(user_id=u.id).first()
        if not p:
            db.add(Profile(user_id=u.id, institution="Partner Institution", headline=f"Google Verified {u.role.title()}", bio="Verified account"))
            db.commit()
        return {"token": create_token(u), "user": user_json(u)}

    temp_pw = secrets.token_urlsafe(32)
    u = User(
        name=name,
        email=email,
        password_hash=hash_password(temp_pw),
        role=role,
        verified=True,
        active=True
    )
    db.add(u)
    db.flush()  # Generate the user ID before creating the profile
    prof = db.query(Profile).filter_by(user_id=u.id).first()
    if prof:
        prof.institution = prof.institution or "Agricultural Partner"
        prof.headline = prof.headline or f"Google Certified {role.title()}"
        prof.bio = prof.bio or "Verified member via Google Single Sign-On."
    else:
        db.add(Profile(
            user_id=u.id,
            institution="Agricultural Partner",
            headline=f"Google Certified {role.title()}",
            bio="Verified member via Google Single Sign-On."
        ))
    db.commit()
    return {"token": create_token(u), "user": user_json(u)}


@app.get("/api/auth/google/accounts")
def google_suggested_accounts():
    # Never return project-registered user emails to prevent leaking accounts
    return []







def _send_reset_email(to: str, link: str) -> bool:
    host = config.SMTP_HOST.strip() if config.SMTP_HOST else ""
    user = config.SMTP_USER.strip() if config.SMTP_USER else ""
    password = (config.SMTP_PASSWORD or "").strip().replace(" ", "")
    port = config.SMTP_PORT or 587

    if not host or not user or not password:
        log.warning("SMTP not configured with host and user; email for %s skipped. Set SMTP_USER and SMTP_PASSWORD in backend/.env", to)
        raise RuntimeError("SMTP email service is not configured on the server.")

    recipient = to.strip().lower()
    if "@" not in recipient or "." not in recipient.split("@")[-1]:
        raise ValueError(f"Invalid email recipient: {to}")

    domain = recipient.split("@")[-1]
    if domain in ("farmintern.local", "localhost", "test.local", "example.com"):
        raise ValueError(f"Cannot send live email to internal domain '@{domain}'. Please use a valid registered email address (e.g., @gmail.com).")

    sender = user
    msg = EmailMessage()
    msg["Subject"] = "FarmIntern password reset link"
    msg["From"] = f"FarmIntern <{sender}>"
    msg["To"] = recipient
    msg["Reply-To"] = sender
    msg["Date"] = email.utils.formatdate(localtime=True)

    plain_text = f"""Hello,

We received a request to update the password for your FarmIntern account ({recipient}).

To set a new password, click or copy the link below into your browser (link expires in 30 minutes):
{link}

If you did not request a password reset, you can safely ignore this email.

Thank you,
FarmIntern Team
"""
    msg.set_content(plain_text)

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Reset your password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7faf8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f7faf8; padding: 25px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; border: 1px solid #dbe5de; overflow: hidden;">
          <tr>
            <td style="padding: 24px 28px 16px; border-bottom: 1px solid #eef3ef;">
              <span style="font-size: 18px; font-weight: 700; color: #1c3324;">FarmIntern</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 28px 24px;">
              <h2 style="margin: 0 0 14px; font-size: 20px; font-weight: 700; color: #1c3324;">Reset your password</h2>
              <p style="margin: 0 0 16px; font-size: 14.5px; line-height: 1.5; color: #3f5245;">
                Hello,
              </p>
              <p style="margin: 0 0 20px; font-size: 14.5px; line-height: 1.5; color: #3f5245;">
                A password reset was requested for your FarmIntern account: <strong style="color: #1c3324;">{recipient}</strong>. Click below to choose your new password:
              </p>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 22px 0;">
                <tr>
                  <td align="center" style="border-radius: 8px; background-color: #1e8b50;">
                    <a href="{link}" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 14.5px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 8px; background-color: #1e8b50;">Choose New Password →</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 6px; font-size: 13px; color: #627468;">
                Or paste this link into your browser:
              </p>
              <p style="margin: 0 0 20px; font-size: 12px; line-height: 1.4; word-break: break-all;">
                <a href="{link}" target="_blank" style="color: #1e8b50; text-decoration: underline;">{link}</a>
              </p>
              <div style="border-top: 1px solid #edf2ee; padding-top: 16px;">
                <p style="margin: 0; font-size: 12px; color: #7f9184;">
                  This link expires in 30 minutes. If you did not make this request, you can safely ignore this email.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 28px; background-color: #fbfdfb; border-top: 1px solid #edf2ee; text-align: center;">
              <p style="margin: 0; font-size: 11.5px; color: #8e9f93;">
                FarmIntern Platform
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""
    msg.add_alternative(html_content, subtype="html")

    try:
        if port == 465:
            with smtplib.SMTP_SSL(host, port, timeout=15) as s:
                s.login(user, password)
                refused = s.send_message(msg)
                if refused:
                    raise RuntimeError(f"Email rejected for recipient(s): {list(refused.keys())}")
        else:
            with smtplib.SMTP(host, port, timeout=15) as s:
                s.starttls()
                s.login(user, password)
                refused = s.send_message(msg)
                if refused:
                    raise RuntimeError(f"Email rejected for recipient(s): {list(refused.keys())}")
        log.info("Reset email successfully sent to %s", recipient)
        return True
    except Exception as e:
        log.exception("could not send reset email to %s: %s", recipient, e)
        raise


def save_smtp_env(host: str, port: int, user: str, password: str):
    config.SMTP_HOST = host
    config.SMTP_PORT = port
    config.SMTP_USER = user
    config.SMTP_PASSWORD = password
    config.SMTP_FROM = f"FarmIntern Platform <{user}>"

    target_files = [config.BASE_DIR.parent / ".env", config.BASE_DIR / ".env"]
    saved_paths = set()
    for env_path in target_files:
        try:
            real_p = env_path.resolve()
            if real_p in saved_paths:
                continue
            saved_paths.add(real_p)

            lines = []
            if real_p.exists():
                lines = real_p.read_text().splitlines()

            new_lines = []
            keys_written = set()
            for line in lines:
                if line.startswith("SMTP_HOST="):
                    new_lines.append(f"SMTP_HOST={host}")
                    keys_written.add("SMTP_HOST")
                elif line.startswith("SMTP_PORT="):
                    new_lines.append(f"SMTP_PORT={port}")
                    keys_written.add("SMTP_PORT")
                elif line.startswith("SMTP_USER="):
                    new_lines.append(f"SMTP_USER={user}")
                    keys_written.add("SMTP_USER")
                elif line.startswith("SMTP_PASSWORD="):
                    new_lines.append(f"SMTP_PASSWORD={password}")
                    keys_written.add("SMTP_PASSWORD")
                elif line.startswith("SMTP_FROM="):
                    new_lines.append(f"SMTP_FROM=FarmIntern Platform <{user}>")
                    keys_written.add("SMTP_FROM")
                else:
                    new_lines.append(line)

            if "SMTP_HOST" not in keys_written:
                new_lines.append(f"SMTP_HOST={host}")
            if "SMTP_PORT" not in keys_written:
                new_lines.append(f"SMTP_PORT={port}")
            if "SMTP_USER" not in keys_written:
                new_lines.append(f"SMTP_USER={user}")
            if "SMTP_PASSWORD" not in keys_written:
                new_lines.append(f"SMTP_PASSWORD={password}")
            if "SMTP_FROM" not in keys_written:
                new_lines.append(f"SMTP_FROM=FarmIntern Platform <{user}>")

            real_p.write_text("\n".join(new_lines) + "\n")
        except Exception as e:
            log.warning("Could not write to %s: %s", env_path, e)


@app.get("/api/auth/smtp-status")
def get_smtp_status():
    configured = bool(config.SMTP_HOST and config.SMTP_USER and config.SMTP_PASSWORD)
    masked_user = ""
    if config.SMTP_USER:
        if "@" in config.SMTP_USER:
            parts = config.SMTP_USER.split("@")
            masked_user = (parts[0][:3] + "***@" + parts[1]) if len(parts[0]) > 3 else ("***@" + parts[1])
        else:
            masked_user = config.SMTP_USER[:3] + "***"
    return {
        "configured": configured,
        "host": config.SMTP_HOST,
        "port": config.SMTP_PORT,
        "sender": config.SMTP_USER if not configured else masked_user
    }


@app.post("/api/auth/smtp-configure")
def configure_smtp(data: SMTPSetup, admin_user=Depends(require_roles("admin"))):
    user = data.user.strip()
    password = data.password.strip().replace(" ", "")
    host = data.host.strip() or "smtp.gmail.com"
    port = data.port or 587

    try:
        if port == 465:
            with smtplib.SMTP_SSL(host, port, timeout=12) as s:
                s.login(user, password)
        else:
            with smtplib.SMTP(host, port, timeout=12) as s:
                s.starttls()
                s.login(user, password)
    except Exception as e:
        raise HTTPException(
            400,
            f"SMTP Authentication failed: {str(e)}. "
            "Please check that you entered your Gmail address and a 16-character Google App Password (from https://myaccount.google.com/apppasswords)."
        )

    save_smtp_env(host, port, user, password)
    log.info("Live SMTP configured and verified for %s via %s:%s", user, host, port)
    return {
        "ok": True,
        "message": f"Successfully connected to Gmail! Live reset emails will now be sent directly from {user} to recipients' inboxes."
    }


RESET_TOKEN_TTL_MINUTES = 30
_SINGLE_EMAIL_RE = re.compile(r"^[^@\s,;<>()\[\]\\\"]+@[^@\s,;<>()\[\]\\\"]+\.[^@\s,;<>()\[\]\\\"]+$")


def _single_email(raw: str) -> str:
    """Return one normalised email address, or raise 400. Lists of addresses are rejected."""
    value = (raw or "").strip().lower()
    if not value:
        raise HTTPException(400, "Please enter your registered email address.")
    if re.search(r"[,;\s]", value) or value.count("@") > 1:
        raise HTTPException(400, "Please enter only one email address.")
    if not _SINGLE_EMAIL_RE.match(value):
        raise HTTPException(400, "Please enter a valid email address.")
    return value


def _reset_base_url(request: Request) -> str:
    """Origin used to build the reset link. A caller-supplied Origin header is only trusted when it is
    one of the configured frontend origins, so a forged header cannot point the e-mailed link elsewhere."""
    trusted = {config.FRONTEND_URL.rstrip("/"), *config.CORS_ORIGINS}
    origin = (request.headers.get("origin") or "").strip().rstrip("/")
    if origin and origin in trusted:
        return origin
    return (config.FRONTEND_URL or "http://localhost:5173").rstrip("/")


@app.post("/api/auth/forgot-password")
def forgot_password(data: ForgotPassword, request: Request, db: Session = Depends(get_db)):
    em = _single_email(data.email)

    u = db.query(User).filter(func.lower(User.email) == em).first()
    if not u:  # never auto-create an account from a reset request
        raise HTTPException(404, "No account is registered with this email address.")
    if not u.active:
        raise HTTPException(403, "This account has been deactivated. Please contact support.")

    has_smtp = bool(config.SMTP_HOST and config.SMTP_USER and config.SMTP_PASSWORD)
    expose_link = bool(config.EXPOSE_RESET_LINK and not has_smtp)  # never when SMTP delivers the e-mail
    if not has_smtp and not expose_link:
        # Nothing could deliver the link, so do not create a token that nobody can use.
        log.error("Password reset requested but SMTP is not configured and link exposure is off.")
        raise HTTPException(503, "Password reset e-mail is temporarily unavailable. Please try again later.")

    token = secrets.token_urlsafe(48)
    new_row = PasswordResetToken(user_id=u.id, token=token,
                                 expires_at=utcnow() + timedelta(minutes=RESET_TOKEN_TTL_MINUTES), used=False)
    db.add(new_row)
    db.commit()
    new_id, user_id, user_email, user_name, user_role = new_row.id, u.id, u.email, u.name, u.role
    reset_url = f"{_reset_base_url(request)}/reset-password?token={token}"

    if has_smtp:
        try:
            _send_reset_email(user_email, reset_url)
        except Exception:
            log.exception("SMTP delivery failed for %s", user_email)
            # The link never reached the user: remove the new token (earlier tokens are left as they were).
            try:
                db.query(PasswordResetToken).filter(PasswordResetToken.id == new_id).delete(synchronize_session=False)
                db.commit()
            except Exception:
                db.rollback()
                log.exception("could not delete unsent reset token; marking it used instead")
                try:
                    db.query(PasswordResetToken).filter(PasswordResetToken.id == new_id).update({"used": True})
                    db.commit()
                except Exception:
                    db.rollback()
                    log.exception("could not invalidate unsent reset token %s", new_id)
            raise HTTPException(502, "We could not send the reset email right now. Please try again later.")
    else:
        log.warning("SMTP not configured (development). Reset link for %s: %s", user_email, reset_url)

    # The new link is live: retire every earlier unused token so only the newest one works.
    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user_id,
        PasswordResetToken.used == False,  # noqa: E712
        PasswordResetToken.id != new_id,
    ).update({"used": True}, synchronize_session=False)
    db.commit()

    if has_smtp:
        msg = f"A password reset link has been sent to {user_email}. It expires in {RESET_TOKEN_TTL_MINUTES} minutes."
    else:
        msg = f"Password reset link generated for {user_email}. It expires in {RESET_TOKEN_TTL_MINUTES} minutes."
    return {
        "ok": True,
        "message": msg,
        "email": user_email,
        "name": user_name,
        "role": user_role,
        "token": token if expose_link else None,
        "reset_url": f"/reset-password?token={token}" if expose_link else None,
        "full_url": reset_url if expose_link else None,
        "smtp_configured": has_smtp,
    }


@app.post("/api/auth/reset-password")
def reset_password(data: ResetPassword, db: Session = Depends(get_db)):
    r = db.query(PasswordResetToken).filter_by(token=data.token, used=False).first()
    if not r or r.expires_at < utcnow():
        raise HTTPException(400, "This reset link is invalid or expired. Request a new one.")
    u = db.get(User, r.user_id)
    if not u:
        raise HTTPException(400, "Account no longer exists.")
    u.password_hash = hash_password(data.password)  # also invalidates every previously issued token
    r.used = True
    db.commit()
    return {"message": "Password updated successfully. Please sign in with your new password."}


@app.get("/api/auth/me")
def me(user=Depends(current_user)):
    return user_json(user)


# ---------------------------------------------------------------- profile
def profile_json(user, db):
    p = db.query(Profile).filter_by(user_id=user.id).first()
    extra = ({"headline": p.headline, "bio": p.bio, "institution": p.institution, "course": p.course,
              "year": p.year, "skills": p.skills} if p else {})
    return {**user_json(user), **extra}


@app.get("/api/profile")
def get_profile(user=Depends(current_user), db: Session = Depends(get_db)):
    return profile_json(user, db)


@app.put("/api/profile")
def update_profile(data: ProfileIn, user=Depends(current_user), db: Session = Depends(get_db)):
    p = db.query(Profile).filter_by(user_id=user.id).first()
    if not p:
        p = Profile(user_id=user.id)
        db.add(p)
    for k in ["headline", "bio", "institution", "course", "year", "skills"]:
        setattr(p, k, getattr(data, k))
    if data.name:
        user.name = data.name
    user.phone, user.location = data.phone, data.location
    db.commit()
    db.refresh(user)
    return profile_json(user, db)


@app.get("/api/home/stats")
def home_stats(db: Session = Depends(get_db)):
    return {"students": db.query(User).filter_by(role="student", active=True).count(),
            "farmers": db.query(User).filter_by(role="farmer", active=True).count(),
            "colleges": db.query(User).filter_by(role="college", active=True).count(),
            "internships": db.query(Internship).filter_by(status="Active").count(),
            "placements": db.query(Placement).filter(Placement.status != "Terminated").count()}


# ---------------------------------------------------------------- internships
@app.get("/api/internships")
def internships(search: str = "", category: str = "", status: str = "Active", user=Depends(current_user),
                db: Session = Depends(get_db)):
    q = db.query(Internship)
    if user.role == "student":
        status = "Active"  # students only ever browse open positions
    if status != "all":
        q = q.filter(Internship.status == status)
    if search:
        like = f"%{search}%"
        q = q.filter(or_(Internship.title.ilike(like), Internship.location.ilike(like),
                         Internship.category.ilike(like), Internship.description.ilike(like)))
    if category and category != "All":
        q = q.filter(Internship.category == category)
    if user.role == "farmer":
        q = q.filter(Internship.farmer_id == user.id)
    mine = {}
    if user.role == "student":
        mine = {a.internship_id: a.status for a in db.query(Application).filter_by(student_id=user.id).all()}
    return [internship_json(i, db, mine.get(i.id)) for i in q.order_by(Internship.created_at.desc()).all()]


@app.post("/api/internships")
def create_internship(data: InternshipIn, user=Depends(require_roles("farmer")), db: Session = Depends(get_db)):
    if config.REQUIRE_FARMER_VERIFICATION and not user.verified:
        raise HTTPException(403, "Your farm account is awaiting administrator verification before you can publish.")
    i = Internship(farmer_id=user.id, **data.model_dump())
    db.add(i)
    db.commit()
    db.refresh(i)
    return internship_json(i, db)


@app.patch("/api/internships/{iid}")
def update_internship(iid: int, data: InternshipUpdate, user=Depends(require_roles("farmer", "admin")),
                      db: Session = Depends(get_db)):
    i = db.execute(select(Internship).where(Internship.id == iid).with_for_update()).scalar_one_or_none()
    if not i:
        raise HTTPException(404, "Internship not found")
    if user.role == "farmer" and i.farmer_id != user.id:
        raise HTTPException(403, "Not your internship")
    changes = data.model_dump(exclude_unset=True)
    if user.role == "admin" and set(changes) - {"status"}:
        raise HTTPException(403, "Administrators can change listing status only")
    if "status" in changes and changes["status"] not in INTERNSHIP_STATUSES:
        raise HTTPException(400, "Status must be Active, Paused or Closed")
    hired = hired_count(db, i.id)
    if "openings" in changes and changes["openings"] < hired:
        raise HTTPException(409, f"{hired} intern(s) already hired; openings cannot go below that")
    for k, v in changes.items():
        setattr(i, k, v)
    db.flush()
    sync_internship_status(db, i)
    db.commit()
    return internship_json(i, db)


# ---------------------------------------------------------------- applications & hiring
@app.get("/api/applications")
def applications(status: str = "", internship_id: Optional[int] = None, user=Depends(current_user),
                 db: Session = Depends(get_db)):
    q = scoped(db.query(Application), Application, user, db)
    if status:
        q = q.filter(Application.status == status)
    if internship_id:
        q = q.filter(Application.internship_id == internship_id)
    return [application_json(a, db) for a in q.order_by(Application.applied_at.desc()).all()]


@app.get("/api/applications/{aid}")
def application_detail(aid: int, user=Depends(current_user), db: Session = Depends(get_db)):
    a = scoped(db.query(Application).filter(Application.id == aid), Application, user, db).first()
    if not a:
        raise HTTPException(404, "Application not found")
    return application_json(a, db)


@app.post("/api/applications")
def apply(data: ApplicationIn, user=Depends(require_roles("student")), db: Session = Depends(get_db)):
    i = db.get(Internship, data.internship_id)
    if not i:
        raise HTTPException(404, "Internship not found")
    if i.status == "Filled":
        raise HTTPException(409, "All positions for this internship are filled")
    if i.status != "Active":
        raise HTTPException(409, "This internship is not accepting applications")
    existing = db.query(Application).filter_by(internship_id=i.id, student_id=user.id).first()
    if existing and existing.status != "Withdrawn":
        raise HTTPException(409, f"You already applied (status: {existing.status})")
    if existing:  # re-apply after withdrawing
        existing.status, existing.cover_letter, existing.applied_at, existing.decided_at = (
            "Pending", data.cover_letter, utcnow(), None)
        a = existing
    else:
        a = Application(internship_id=i.id, student_id=user.id, cover_letter=data.cover_letter)
        db.add(a)
    db.flush()
    notify(db, i.farmer_id, "New internship application", f"{user.name} applied for {i.title}.", "applicants")
    db.commit()
    return application_json(a, db)


@app.patch("/api/applications/{aid}/withdraw")
def withdraw(aid: int, user=Depends(require_roles("student")), db: Session = Depends(get_db)):
    a = db.query(Application).filter_by(id=aid, student_id=user.id).first()
    if not a:
        raise HTTPException(404, "Application not found")
    if a.status not in ("Pending", "Shortlisted"):
        raise HTTPException(409, f"An application that is {a.status} cannot be withdrawn")
    a.status, a.decided_at = "Withdrawn", utcnow()
    notify(db, a.internship.farmer_id, "Application withdrawn", f"{user.name} withdrew from {a.internship.title}.", "applicants")
    db.commit()
    return application_json(a, db)


TRANSITIONS = {"Pending": {"Shortlisted", "Selected", "Rejected"},
               "Shortlisted": {"Selected", "Rejected"},
               "Rejected": {"Shortlisted"}}


@app.patch("/api/applications/{aid}")
def application_status(aid: int, data: DecisionIn, user=Depends(require_roles("farmer", "admin")),
                       db: Session = Depends(get_db)):
    a = db.get(Application, aid)
    if not a:
        raise HTTPException(404, "Application not found")
    # Lock the internship row so two concurrent selections cannot exceed the number of openings.
    i = db.execute(select(Internship).where(Internship.id == a.internship_id).with_for_update()).scalar_one()
    if user.role == "farmer" and i.farmer_id != user.id:
        raise HTTPException(403, "This application belongs to another farm")
    db.refresh(a)
    new = data.status
    if new not in {"Shortlisted", "Selected", "Rejected"}:
        raise HTTPException(400, "Status must be Shortlisted, Selected or Rejected")
    if new not in TRANSITIONS.get(a.status, set()):
        raise HTTPException(409, f"An application that is {a.status} cannot be changed to {new}")
    if new == "Selected":
        if i.status == "Closed":
            raise HTTPException(409, "This internship is closed")
        if hired_count(db, i.id) >= i.openings:
            raise HTTPException(409, f"All {i.openings} opening(s) are already filled")
        if db.query(Placement).filter_by(internship_id=i.id, student_id=a.student_id).first():
            raise HTTPException(409, "This student already has a placement for this internship")
        db.add(Placement(application_id=a.id, internship_id=i.id, student_id=a.student_id,
                         farmer_id=i.farmer_id, status="Active", start_date=date.today()))
    a.status, a.decided_at = new, utcnow()
    db.flush()
    sync_internship_status(db, i)
    messages = {
        "Shortlisted": f"You have been shortlisted for {i.title}.",
        "Selected": f"Congratulations! You were selected for {i.title}. Your internship placement is now active.",
        "Rejected": f"Your application for {i.title} was not selected this time."}
    notify(db, a.student_id, f"Application {new.lower()}", messages[new], "applications")
    if new == "Selected":
        stu = db.get(User, a.student_id)
        inst = institution_of(db, stu).lower()
        if inst:
            for c in db.query(User).filter_by(role="college", active=True).all():
                if institution_of(db, c).lower() == inst:
                    notify(db, c.id, "Student placed", f"{stu.name} was selected for {i.title}.", "progress")
    db.commit()
    return application_json(a, db)


# ---------------------------------------------------------------- placements
@app.get("/api/placements")
def placements(status: str = "", user=Depends(current_user), db: Session = Depends(get_db)):
    q = scoped(db.query(Placement), Placement, user, db)
    if status:
        q = q.filter(Placement.status == status)
    return [placement_json(p, db) for p in q.order_by(Placement.created_at.desc()).all()]


@app.patch("/api/placements/{pid}")
def update_placement(pid: int, data: PlacementUpdate, user=Depends(require_roles("farmer", "admin")),
                     db: Session = Depends(get_db)):
    p = db.get(Placement, pid)
    if not p:
        raise HTTPException(404, "Placement not found")
    if user.role == "farmer" and p.farmer_id != user.id:
        raise HTTPException(403, "Not your placement")
    if data.status not in {"Completed", "Terminated"}:
        raise HTTPException(400, "Status must be Completed or Terminated")
    if p.status != "Active":
        raise HTTPException(409, f"This placement is already {p.status}")
    p.status, p.end_date = data.status, date.today()
    db.flush()  # autoflush is off: make the new status visible to the opening count
    sync_internship_status(db, p.internship)
    notify(db, p.student_id, f"Internship {data.status.lower()}",
           f"Your placement for {p.internship.title} is now {data.status}.", "progress")
    db.commit()
    return placement_json(p, db)


# ---------------------------------------------------------------- tasks
def derive_status(progress):
    return "Completed" if progress >= 100 else "Pending" if progress <= 0 else "In Progress"


def check_due(d):
    if d and d < date.today() - timedelta(days=1):
        raise HTTPException(400, "Due date cannot be in the past")


@app.get("/api/tasks")
def tasks(user=Depends(current_user), db: Session = Depends(get_db)):
    q = scoped(db.query(Task), Task, user, db)
    return [task_json(t, db) for t in q.order_by(Task.id.desc()).all()]


@app.post("/api/tasks")
def create_task(data: TaskIn, user=Depends(require_roles("farmer")), db: Session = Depends(get_db)):
    if data.placement_id:
        p = db.get(Placement, data.placement_id)
    else:
        p = db.query(Placement).filter_by(internship_id=data.internship_id, student_id=data.student_id).first()
    if not p or p.farmer_id != user.id:
        raise HTTPException(403, "Choose a student placed in one of your internships")
    if p.status != "Active":
        raise HTTPException(409, f"This placement is {p.status}; tasks can only be assigned to active placements")
    check_due(data.due_date)
    t = Task(placement_id=p.id, internship_id=p.internship_id, student_id=p.student_id, title=data.title,
             description=data.description, due_date=data.due_date, status="Pending", progress=0)
    db.add(t)
    db.flush()
    notify(db, p.student_id, "New task assigned", data.title, "progress")
    db.commit()
    db.refresh(t)
    return task_json(t, db)


@app.patch("/api/tasks/{tid}")
def update_task(tid: int, data: TaskUpdate, user=Depends(require_roles("student", "farmer")),
                db: Session = Depends(get_db)):
    t = db.get(Task, tid)
    if not t:
        raise HTTPException(404, "Task not found")
    p = t.placement
    if user.role == "student":
        if t.student_id != user.id:
            raise HTTPException(403, "Not your task")
        if data.progress is None:
            raise HTTPException(422, "progress is required")
        if p and p.status != "Active":
            raise HTTPException(409, f"This placement is {p.status}; progress can no longer be updated")
        if t.status == "Completed":
            raise HTTPException(409, "This task is already completed. Ask your farm partner to reopen it.")
        t.progress = data.progress
        if data.note is not None:
            t.student_note = data.note
    else:
        if t.internship.farmer_id != user.id:
            raise HTTPException(403, "Not your task")
        for k in ("title", "description"):
            if getattr(data, k) is not None:
                setattr(t, k, getattr(data, k))
        if data.due_date is not None:
            check_due(data.due_date)
            t.due_date = data.due_date
        if data.progress is not None:
            t.progress = data.progress
    t.status = derive_status(t.progress)
    t.updated_at = utcnow()
    if user.role == "student":
        notify(db, t.internship.farmer_id, "Task progress updated", f"{user.name} updated “{t.title}” to {t.progress}%.", "tasks")
    else:
        notify(db, t.student_id, "Task updated by your farm partner", t.title, "progress")
    db.commit()
    return task_json(t, db)


@app.delete("/api/tasks/{tid}")
def delete_task(tid: int, user=Depends(require_roles("farmer")), db: Session = Depends(get_db)):
    t = db.get(Task, tid)
    if not t:
        raise HTTPException(404, "Task not found")
    if t.internship.farmer_id != user.id:
        raise HTTPException(403, "Not your task")
    notify(db, t.student_id, "Task removed", t.title, "progress")
    db.delete(t)
    db.commit()
    return {"ok": True}


# ---------------------------------------------------------------- evaluations
@app.get("/api/evaluations")
def evaluations(user=Depends(current_user), db: Session = Depends(get_db)):
    q = scoped(db.query(Evaluation), Evaluation, user, db)
    return [evaluation_json(e) for e in q.order_by(Evaluation.created_at.desc()).all()]


@app.post("/api/evaluations")
def create_evaluation(data: EvaluationIn, user=Depends(require_roles("farmer", "college")),
                      db: Session = Depends(get_db)):
    if data.placement_id:
        p = db.get(Placement, data.placement_id)
    else:
        p = db.query(Placement).filter_by(internship_id=data.internship_id, student_id=data.student_id).first()
    if not p:
        raise HTTPException(404, "No placement exists for that student and internship. A student must be selected first.")
    if user.role == "farmer" and p.farmer_id != user.id:
        raise HTTPException(403, "Not your placement")
    if user.role == "college" and p.student_id not in college_student_ids(db, user):
        raise HTTPException(403, "This student does not belong to your institution")
    e = Evaluation(placement_id=p.id, student_id=p.student_id, internship_id=p.internship_id,
                   evaluator_id=user.id, rating=data.rating, feedback=data.feedback)
    db.add(e)
    notify(db, p.student_id, "New evaluation available", f"{user.name} published feedback for {p.internship.title}.", "feedback")
    if user.role == "college":
        notify(db, p.farmer_id, "College feedback published", f"{user.name} evaluated {p.student.name}.", "evaluations")
        db.add(CollegeActivity(college_id=user.id, student_id=p.student_id, activity="Evaluation published",
                               details=f"{data.rating}/5 for {p.internship.title}"))
    db.commit()
    db.refresh(e)
    return evaluation_json(e)


# ---------------------------------------------------------------- notifications
@app.get("/api/notifications")
def notifications(user=Depends(current_user), db: Session = Depends(get_db)):
    rows = db.query(Notification).filter_by(user_id=user.id).order_by(Notification.created_at.desc()).limit(100).all()
    return [{"id": n.id, "title": n.title, "body": n.body, "link": n.link or "", "read": bool(n.read),
             "created_at": iso(n.created_at)} for n in rows]


@app.patch("/api/notifications/{nid}/read")
def read_notification(nid: int, user=Depends(current_user), db: Session = Depends(get_db)):
    n = db.query(Notification).filter_by(id=nid, user_id=user.id).first()
    if not n:
        raise HTTPException(404, "Notification not found")
    n.read = True
    db.commit()
    return {"ok": True}


@app.post("/api/notifications/read-all")
def read_all_notifications(user=Depends(current_user), db: Session = Depends(get_db)):
    db.query(Notification).filter_by(user_id=user.id, read=False).update({"read": True})
    db.commit()
    return {"ok": True}


# ---------------------------------------------------------------- dashboards, reports, college, admin
def avg(values):
    values = list(values)
    return round(sum(values) / len(values)) if values else 0


@app.get("/api/dashboard")
def dashboard(user=Depends(current_user), db: Session = Depends(get_db)):
    apps = scoped(db.query(Application), Application, user, db).all()
    pls = scoped(db.query(Placement), Placement, user, db).all()
    tks = scoped(db.query(Task), Task, user, db).all()
    evs = scoped(db.query(Evaluation), Evaluation, user, db).count()
    focus = avg(t.progress for t in tks)
    if user.role == "student":
        return {"stats": [["Applications", len(apps)], ["Selected", len(pls)], ["Tasks", len(tks)],
                          ["Completed", sum(t.status == "Completed" for t in tks)]], "focus": focus, "evaluations": evs}
    if user.role == "farmer":
        ints = db.query(Internship).filter_by(farmer_id=user.id).all()
        return {"stats": [["Internships", len(ints)], ["Active", sum(i.status == "Active" for i in ints)],
                          ["Applications", len(apps)], ["Selected", len(pls)]], "focus": focus}
    if user.role == "college":
        ids = college_student_ids(db, user)
        return {"stats": [["Students", len(ids)], ["Applications", len(apps)], ["Selected", len(pls)],
                          ["Evaluations", evs]], "focus": round(len(pls) / len(apps) * 100) if apps else 0,
                "institution": institution_of(db, user)}
    return {"stats": [["Users", db.query(User).count()], ["Internships", db.query(Internship).count()],
                      ["Applications", db.query(Application).count()], ["Messages", db.query(Message).count()]],
            "focus": db.query(User).filter_by(verified=True).count()}


@app.get("/api/college/students")
def college_students(user=Depends(require_roles("college", "admin")), db: Session = Depends(get_db)):
    q = db.query(User).filter(User.role == "student")
    if user.role == "college":
        q = q.filter(User.id.in_(college_student_ids(db, user) or [-1]))
    out = []
    for s in q.order_by(User.name).all():
        apps = db.query(Application).filter_by(student_id=s.id).all()
        pls = db.query(Placement).filter_by(student_id=s.id).all()
        tks = db.query(Task).filter_by(student_id=s.id).all()
        evs = db.query(Evaluation).filter_by(student_id=s.id).all()
        out.append({**student_card(db, s), "applications": len(apps), "selected": len(pls), "tasks": len(tks),
                    "progress": avg(t.progress for t in tks), "evaluations": len(evs),
                    "average_rating": round(sum(e.rating for e in evs) / len(evs), 2) if evs else None,
                    "placements": [{"id": p.id, "internship": p.internship.title, "farmer": p.farmer.name,
                                    "status": p.status} for p in pls]})
    return {"institution": institution_of(db, user) if user.role == "college" else "All institutions",
            "students": out}


@app.get("/api/admin/users")
def admin_users(user=Depends(require_roles("admin")), db: Session = Depends(get_db)):
    return [user_json(u) for u in db.query(User).order_by(User.created_at.desc()).all()]


@app.patch("/api/admin/users/{uid}/verify")
def verify_user(uid: int, user=Depends(require_roles("admin")), db: Session = Depends(get_db)):
    u = db.get(User, uid)
    if not u:
        raise HTTPException(404, "User not found")
    u.verified = not u.verified
    notify(db, u.id, "Verification status changed",
           "Your account is now verified." if u.verified else "Your account verification was revoked.")
    db.commit()
    return user_json(u)


@app.patch("/api/admin/users/{uid}/active")
def toggle_active(uid: int, user=Depends(require_roles("admin")), db: Session = Depends(get_db)):
    u = db.get(User, uid)
    if not u:
        raise HTTPException(404, "User not found")
    if u.id == user.id:
        raise HTTPException(400, "You cannot deactivate your own account")
    u.active = not u.active
    db.commit()
    return user_json(u)


@app.get("/api/reports")
def reports(user=Depends(require_roles("college", "admin", "farmer")), db: Session = Depends(get_db)):
    apps = scoped(db.query(Application), Application, user, db)
    pls = scoped(db.query(Placement), Placement, user, db)
    tks = scoped(db.query(Task), Task, user, db)
    evs = scoped(db.query(Evaluation), Evaluation, user, db)
    ints = db.query(Internship)
    if user.role == "farmer":
        ints = ints.filter(Internship.farmer_id == user.id)
    rating = evs.with_entities(func.avg(Evaluation.rating)).scalar() or 0
    return {"applications": apps.count(), "selected": pls.count(),
            "active_placements": pls.filter(Placement.status == "Active").count(),
            "completed_placements": pls.filter(Placement.status == "Completed").count(),
            "tasks": tks.count(), "completed_tasks": tks.filter(Task.status == "Completed").count(),
            "evaluations": evs.count(), "average_rating": round(float(rating), 2),
            "internships": ints.count(), "openings": sum(i.openings for i in ints.all())}


# ---------------------------------------------------------------- messages
def permitted_conversation(db, cid, user):
    return db.query(ConversationMember).filter_by(conversation_id=cid, user_id=user.id).first()


def can_message(sender, recipient):
    if not recipient or not recipient.active or recipient.id == sender.id:
        return False
    return not (recipient.role == "admin" and sender.role != "admin")


def get_or_create_conversation(db, a, b):
    mine = [m.conversation_id for m in db.query(ConversationMember).filter_by(user_id=a.id).all()]
    for cid in mine:
        members = {m.user_id for m in db.query(ConversationMember).filter_by(conversation_id=cid).all()}
        if members == {a.id, b.id}:
            return cid
    c = Conversation(subject="FarmIntern conversation")
    db.add(c)
    db.flush()
    db.add_all([ConversationMember(conversation_id=c.id, user_id=a.id),
                ConversationMember(conversation_id=c.id, user_id=b.id)])
    db.flush()
    return c.id


def unread_messages(db, user):
    mine = [m.conversation_id for m in db.query(ConversationMember).filter_by(user_id=user.id).all()]
    if not mine:
        return 0
    return db.query(Message).filter(Message.conversation_id.in_(mine), Message.sender_id != user.id,
                                    Message.read == False).count()  # noqa: E712


@app.get("/api/messages")
def messages(user=Depends(current_user), db: Session = Depends(get_db)):
    ids = [x.conversation_id for x in db.query(ConversationMember).filter_by(user_id=user.id).all()]
    out = []
    for c in (db.query(Conversation).filter(Conversation.id.in_(ids)).all() if ids else []):
        others = [db.get(User, m.user_id) for m in db.query(ConversationMember).filter_by(conversation_id=c.id).all()
                  if m.user_id != user.id]
        msgs = db.query(Message).filter_by(conversation_id=c.id).order_by(Message.created_at.desc()).limit(200).all()[::-1]
        out.append({"id": c.id, "subject": c.subject,
                    "participants": [{"id": x.id, "name": x.name, "role": x.role} for x in others if x],
                    "unread": sum(1 for m in msgs if m.sender_id != user.id and not m.read),
                    "last_at": iso(msgs[-1].created_at) if msgs else iso(c.created_at),
                    "messages": [{"id": m.id, "sender_id": m.sender_id, "body": m.body,
                                  "created_at": iso(m.created_at)} for m in msgs]})
    out.sort(key=lambda c: c["last_at"] or "", reverse=True)
    return out


@app.post("/api/messages/{cid}/read")
def mark_conversation_read(cid: int, user=Depends(current_user), db: Session = Depends(get_db)):
    if not permitted_conversation(db, cid, user):
        raise HTTPException(403, "Conversation access denied")
    db.query(Message).filter(Message.conversation_id == cid, Message.sender_id != user.id,
                             Message.read == False).update({"read": True})  # noqa: E712
    db.commit()
    return {"ok": True}


@app.get("/api/contacts")
def contacts(user=Depends(current_user), db: Session = Depends(get_db)):
    q = db.query(User).filter(User.id != user.id, User.active == True)  # noqa: E712
    if user.role != "admin":
        q = q.filter(User.role != "admin")
    return [{"id": x.id, "name": x.name, "role": x.role} for x in q.order_by(User.role, User.name).all()]


@app.post("/api/messages")
def send_message(data: MessageIn, user=Depends(current_user), db: Session = Depends(get_db)):
    body = data.body.strip()
    if not body:
        raise HTTPException(400, "Message cannot be empty")
    cid = data.conversation_id
    if cid:
        if not permitted_conversation(db, cid, user):
            raise HTTPException(403, "Conversation access denied")
        others = [m.user_id for m in db.query(ConversationMember).filter_by(conversation_id=cid).all() if m.user_id != user.id]
        if not any(can_message(user, db.get(User, o)) for o in others):
            raise HTTPException(403, "You can no longer message this person")
    else:
        if not data.recipient_id:
            raise HTTPException(400, "recipient_id required")
        recipient = db.get(User, data.recipient_id)
        if not can_message(user, recipient):
            raise HTTPException(403, "You cannot message this user")
        cid = get_or_create_conversation(db, user, recipient)
        others = [recipient.id]
    m = Message(conversation_id=cid, sender_id=user.id, body=body)
    db.add(m)
    for uid in others:  # one coalesced unread notification per sender
        existing = db.query(Notification).filter_by(user_id=uid, read=False, title=f"New message from {user.name}"[:180]).first()
        if existing:
            existing.body, existing.created_at = body[:120], utcnow()
        else:
            notify(db, uid, f"New message from {user.name}", body[:120], "messages")
    db.commit()
    return {"id": m.id, "conversation_id": cid}


@app.get("/api/recommendations")
def recommendations(limit: int = Query(6, ge=1, le=20), user=Depends(require_roles("student")),
                    db: Session = Depends(get_db)):
    """Personalised, explainable internship matches computed from the student's profile and live listings."""
    ranked, meta = recommender.recommend_for_student(db, user, limit)
    mine = {a.internship_id: a.status for a in db.query(Application).filter_by(student_id=user.id).all()}
    items = []
    for cand, r in ranked:
        items.append({"internship": internship_json(cand["row"], db, mine.get(cand["id"])),
                      "match": r["match"], "reasons": r["reasons"], "matched_skills": r["matched_skills"],
                      "skill_gaps": r["skill_gaps"]})
    return {"items": items, **meta,
            "tip": None if meta["has_skills"] else "Add your skills in Profile for much more accurate matches."}


# ---------------------------------------------------------------- calls
RING_SECONDS = 45


def expire_invites(db):
    cutoff = utcnow() - timedelta(seconds=RING_SECONDS)
    db.query(CallInvite).filter(CallInvite.status == "ringing", CallInvite.created_at < cutoff).update({"status": "missed"})


def invite_json(c, db):
    caller = db.get(User, c.caller_id)
    return {"id": c.id, "conversation_id": c.conversation_id, "kind": c.kind, "status": c.status,
            "caller": {"id": caller.id, "name": caller.name, "role": caller.role} if caller else None,
            "callee_id": c.callee_id}


@app.post("/api/calls")
def start_call(data: CallStart, user=Depends(current_user), db: Session = Depends(get_db)):
    if data.kind not in {"audio", "video"}:
        raise HTTPException(400, "kind must be audio or video")
    recipient = db.get(User, data.recipient_id)
    if not can_message(user, recipient):
        raise HTTPException(403, "You cannot call this user")
    expire_invites(db)
    cid = get_or_create_conversation(db, user, recipient)
    db.query(CallInvite).filter(CallInvite.caller_id == user.id, CallInvite.status == "ringing").update({"status": "ended"})
    c = CallInvite(conversation_id=cid, caller_id=user.id, callee_id=recipient.id, kind=data.kind)
    db.add(c)
    notify(db, recipient.id, f"Incoming {data.kind} call", f"{user.name} is calling you.", "messages")
    db.commit()
    db.refresh(c)
    return invite_json(c, db)


@app.get("/api/calls/incoming")
def incoming_calls(user=Depends(current_user), db: Session = Depends(get_db)):
    expire_invites(db)
    db.commit()
    c = (db.query(CallInvite).filter_by(callee_id=user.id, status="ringing")
         .order_by(CallInvite.created_at.desc()).first())
    return invite_json(c, db) if c else None


@app.get("/api/calls/{cid}")
def call_status(cid: int, user=Depends(current_user), db: Session = Depends(get_db)):
    expire_invites(db)
    db.commit()
    c = db.get(CallInvite, cid)
    if not c or user.id not in (c.caller_id, c.callee_id):
        raise HTTPException(404, "Call not found")
    return invite_json(c, db)


@app.post("/api/calls/{cid}/respond")
def respond_call(cid: int, data: CallRespond, user=Depends(current_user), db: Session = Depends(get_db)):
    expire_invites(db)
    c = db.get(CallInvite, cid)
    if not c or c.callee_id != user.id:
        raise HTTPException(404, "Call not found")
    if c.status != "ringing":
        raise HTTPException(409, f"This call is already {c.status}")
    if data.action not in {"accept", "decline"}:
        raise HTTPException(400, "action must be accept or decline")
    c.status = "accepted" if data.action == "accept" else "declined"
    db.commit()
    return invite_json(c, db)


@app.post("/api/calls/{cid}/end")
def end_call(cid: int, user=Depends(current_user), db: Session = Depends(get_db)):
    c = db.get(CallInvite, cid)
    if not c or user.id not in (c.caller_id, c.callee_id):
        raise HTTPException(404, "Call not found")
    if c.status in ("ringing", "accepted"):
        c.status = "ended"
        db.commit()
    return invite_json(c, db)


@app.get("/api/poll")
def poll(user=Depends(current_user), db: Session = Depends(get_db)):
    """Cheap endpoint the UI polls for unread counts and an incoming call."""
    expire_invites(db)
    db.commit()
    c = db.query(CallInvite).filter_by(callee_id=user.id, status="ringing").order_by(CallInvite.created_at.desc()).first()
    return {"notifications": db.query(Notification).filter_by(user_id=user.id, read=False).count(),
            "messages": unread_messages(db, user), "incoming_call": invite_json(c, db) if c else None}


# WebRTC signalling relay. Rooms live in this process: run a single worker (or add Redis) for scale-out.
call_rooms = {}


@app.websocket("/ws/call/{conversation_id}")
async def call_socket(websocket: WebSocket, conversation_id: int, token: str = Query(default="")):
    await websocket.accept()
    db = SessionLocal()
    try:
        user = user_from_token(token, db)
        allowed = bool(user and permitted_conversation(db, conversation_id, user))
        uid = user.id if user else None
    finally:
        db.close()
    if not allowed:
        await websocket.close(code=4401)
        return
    room = call_rooms.setdefault(conversation_id, {})
    old = room.get(uid)
    if old is not None:
        try:
            await old.close(code=4000)
        except Exception:
            pass
    room[uid] = websocket
    peers = [p for p in room if p != uid]
    await websocket.send_json({"type": "peers", "peers": peers})
    for p in peers:
        try:
            await room[p].send_json({"type": "peer-joined", "from": uid})
        except Exception:
            pass
    try:
        while True:
            msg = await websocket.receive_json()
            if not isinstance(msg, dict) or msg.get("type") not in {"offer", "answer", "ice", "media", "hangup"}:
                continue
            msg["from"] = uid  # never trust a client-supplied sender id
            for p, sock in list(room.items()):
                if p != uid:
                    try:
                        await sock.send_json(msg)
                    except Exception:
                        pass
    except (WebSocketDisconnect, RuntimeError, ValueError):
        pass
    finally:
        if room.get(uid) is websocket:
            room.pop(uid, None)
            for sock in list(room.values()):
                try:
                    await sock.send_json({"type": "peer-left", "from": uid})
                except Exception:
                    pass
        if not room:
            call_rooms.pop(conversation_id, None)


# ---------------------------------------------------------------- optional: serve the built frontend
_dist = config.FRONTEND_DIST
if _dist.is_dir() and (_dist / "index.html").exists():
    if (_dist / "assets").is_dir():
        app.mount("/assets", StaticFiles(directory=_dist / "assets"), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    def spa(full_path: str):
        if full_path.startswith(("api/", "ws/")):
            raise HTTPException(404, "Not found")
        target = (_dist / full_path).resolve()
        if full_path and target.is_file() and _dist.resolve() in target.parents:
            return FileResponse(target)
        return FileResponse(_dist / "index.html")
else:
    @app.get("/", include_in_schema=False)
    def root():
        return {"name": "FarmIntern API", "docs": "/docs", "health": "/api/health"}
