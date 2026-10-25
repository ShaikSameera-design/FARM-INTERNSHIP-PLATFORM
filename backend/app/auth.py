import base64, hashlib, hmac, json, os, time
from fastapi import Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.config import APP_SECRET, TOKEN_TTL_SECONDS
from app.database import get_db
from app.models.all_models import User

SECRET = APP_SECRET.encode()


def hash_password(password):
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 180000)
    return base64.b64encode(salt + digest).decode()


def verify_password(password, encoded):
    try:
        raw = base64.b64decode(encoded.encode())
        salt, digest = raw[:16], raw[16:]
        check = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 180000)
        return hmac.compare_digest(digest, check)
    except Exception:
        return False


def _pw_fingerprint(user):
    # Changing the password changes this value, which invalidates every token issued before the change.
    return hashlib.sha256((user.password_hash or "").encode()).hexdigest()[:16]


def create_token(user):
    payload = {"sub": user.id, "role": user.role, "pv": _pw_fingerprint(user),
               "exp": int(time.time()) + TOKEN_TTL_SECONDS}
    body = base64.urlsafe_b64encode(json.dumps(payload, separators=(",", ":")).encode()).decode().rstrip("=")
    sig = hmac.new(SECRET, body.encode(), hashlib.sha256).digest()
    return body + "." + base64.urlsafe_b64encode(sig).decode().rstrip("=")


def decode_token(token):
    try:
        body, sig = token.split(".", 1)
        expected = hmac.new(SECRET, body.encode(), hashlib.sha256).digest()
        if not hmac.compare_digest(expected, base64.urlsafe_b64decode(sig + "===")):
            return None
        payload = json.loads(base64.urlsafe_b64decode(body + "==="))
        return None if payload["exp"] < time.time() else payload
    except Exception:
        return None


def user_from_token(token, db):
    """Returns the active user for a valid token, else None (used by REST and WebSocket auth)."""
    payload = decode_token(token or "")
    if not payload:
        return None
    user = db.get(User, int(payload["sub"]))
    if not user or not user.active or payload.get("pv") != _pw_fingerprint(user):
        return None
    return user


def current_user(authorization: str = Header(default=""), db: Session = Depends(get_db)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(401, "Authentication required")
    user = user_from_token(authorization[7:], db)
    if not user:
        raise HTTPException(401, "Invalid or expired session. Please sign in again.")
    return user


def require_roles(*roles):
    def dep(user=Depends(current_user)):
        if user.role not in roles:
            raise HTTPException(403, "You do not have permission to do that")
        return user
    return dep
