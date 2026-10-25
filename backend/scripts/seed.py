"""OPTIONAL local-development demo data. Never runs automatically.

    python scripts/seed.py            # adds 4 demo accounts + 2 internships if they do not exist yet
It never deletes or overwrites existing rows and refuses to run when ENVIRONMENT=production
(unless you pass --force).
"""
import os, sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from datetime import date, timedelta
from app import config
from app.migrate import run_migrations
from app.database import SessionLocal
from app.models.all_models import Application, Internship, Notification, Placement, Profile, Task, User
from app.auth import hash_password

if config.IS_PROD and "--force" not in sys.argv:
    sys.exit("Refusing to create demo accounts in production. Use scripts/create_admin.py instead.")

run_migrations()
db = SessionLocal()


def user(name, email, password, role):
    u = db.query(User).filter_by(email=email).first()
    if not u:
        u = User(name=name, email=email, password_hash=hash_password(password), role=role, verified=True, active=True)
        db.add(u); db.flush(); db.add(Profile(user_id=u.id))
    return u


admin = user("FarmIntern Admin", "admin@farmintern.local", "Admin@123", "admin")
student = user("Anjali Reddy", "student@farmintern.local", "Student@123", "student")
farmer = user("Green Valley Farms", "farmer@farmintern.local", "Farmer@123", "farmer")
college = user("RGUKT Ongole", "college@farmintern.local", "College@123", "college")
db.commit()
for u, vals in [(student, dict(headline="Agriculture Technology Student", institution="RGUKT Ongole", course="B.Tech CSE", year="3rd Year", skills="Python, AI, Web Development")),
                (farmer, dict(headline="Verified Farm Partner", institution="Green Valley Farms", bio="Practical agricultural internship opportunities.")),
                (college, dict(headline="College Partner", institution="RGUKT Ongole", bio="Connecting students with verified field experiences."))]:
    p = db.query(Profile).filter_by(user_id=u.id).first()
    if p and not p.institution:
        for k, v in vals.items():
            setattr(p, k, v)
if db.query(Internship).filter_by(farmer_id=farmer.id).count() == 0:
    i1 = Internship(farmer_id=farmer.id, title="Smart Organic Farming", category="Organic Farming",
                    description="Hands-on experience in sustainable crop planning, soil health and farm automation.",
                    location="Guntur, Andhra Pradesh", duration="8 weeks", stipend="₹12,000 / month", openings=3)
    i2 = Internship(farmer_id=farmer.id, title="Precision Crop Management", category="Smart Farming",
                    description="Learn sensor-driven crop monitoring and modern irrigation practices.",
                    location="Vijayawada, Andhra Pradesh", duration="6 weeks", stipend="₹10,500 / month", openings=2)
    db.add_all([i1, i2]); db.commit()
    a = Application(internship_id=i1.id, student_id=student.id, status="Selected",
                    cover_letter="I would like to work on practical smart farming workflows.")
    db.add(a); db.flush()
    pl = Placement(application_id=a.id, internship_id=i1.id, student_id=student.id, farmer_id=farmer.id,
                   status="Active", start_date=date.today())
    db.add(pl); db.flush()
    db.add(Task(placement_id=pl.id, internship_id=i1.id, student_id=student.id, title="Prepare soil health report",
                description="Record soil observations and upload findings.", due_date=date.today() + timedelta(days=7),
                status="In Progress", progress=55))
    db.add(Notification(user_id=student.id, title="Application selected", body="You were selected for Smart Organic Farming.", link="applications"))
    db.commit()
print("Demo data ready (local development only):")
print("  admin@farmintern.local   / Admin@123")
print("  student@farmintern.local / Student@123")
print("  farmer@farmintern.local  / Farmer@123")
print("  college@farmintern.local / College@123")
