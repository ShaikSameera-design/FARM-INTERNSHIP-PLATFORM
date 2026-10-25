"""Create (or promote) an administrator account securely.

Usage:
  Interactive setup (prompts for email, name, and masked password):
      python scripts/create_admin.py

  Direct CLI arguments (prompts securely for masked password):
      python scripts/create_admin.py you@example.com "Your Name"

  Automated / Headless deployment (uses ADMIN_PASSWORD environment variable):
      ADMIN_PASSWORD='YourPassword123!' python scripts/create_admin.py you@example.com "Your Name"

Note:
  Admins cannot self-register through public portals.
  Existing user accounts and database data are completely preserved.
"""
import getpass
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app.migrate import run_migrations
from app.database import SessionLocal
from app.models.all_models import Profile, User
from app.auth import hash_password
from app.main import check_password_strength


def main():
    if len(sys.argv) >= 2:
        email = sys.argv[1].strip().lower()
        name = sys.argv[2].strip() if len(sys.argv) > 2 else "Platform Administrator"
        password = os.getenv("ADMIN_PASSWORD")
        if not password:
            try:
                password = getpass.getpass("Enter secure admin password: ")
                confirm = getpass.getpass("Confirm secure admin password: ")
                if password != confirm:
                    sys.exit("Error: Passwords do not match.")
            except (KeyboardInterrupt, EOFError):
                sys.exit("\nAdmin setup cancelled.")
    else:
        print("==================================================")
        print("       FarmIntern Secure Admin Account Setup      ")
        print("==================================================")
        print("Create a new administrator or promote an existing account.")
        print("No passwords will be stored in plain text or scripts.\n")
        try:
            email = input("Admin Email: ").strip().lower()
            if not email or "@" not in email:
                sys.exit("Error: Please provide a valid email address.")
            name = input("Admin Full Name [Platform Administrator]: ").strip() or "Platform Administrator"
            password = os.getenv("ADMIN_PASSWORD")
            if not password:
                password = getpass.getpass("Enter secure admin password: ")
                confirm = getpass.getpass("Confirm secure admin password: ")
                if password != confirm:
                    sys.exit("Error: Passwords do not match.")
        except (KeyboardInterrupt, EOFError):
            sys.exit("\nAdmin setup cancelled.")

    try:
        check_password_strength(password)
    except ValueError as exc:
        sys.exit(f"Password error: {exc}")

    # Ensure database schema is up-to-date without touching existing data
    run_migrations()
    db = SessionLocal()
    try:
        u = db.query(User).filter_by(email=email).first()
        if u:
            u.role = "admin"
            u.verified = True
            u.active = True
            u.password_hash = hash_password(password)
            if name and (not u.name or u.name == "Administrator"):
                u.name = name
            db.commit()
            print(f"\n[SUCCESS] Existing account '{email}' was promoted to Administrator.")
        else:
            u = User(name=name, email=email, password_hash=hash_password(password), role="admin", verified=True, active=True)
            db.add(u)
            db.flush()
            db.add(Profile(user_id=u.id))
            db.commit()
            print(f"\n[SUCCESS] Administrator account created successfully for '{email}'.")

        print("--------------------------------------------------")
        print(f"  Account Email  : {email}")
        print(f"  Assigned Role  : admin")
        print(f"  Verified Status: True")
        print(f"  Active Status  : True")
        print(f"  Admin Login URL: /admin/login")
        print("--------------------------------------------------")
    finally:
        db.close()


if __name__ == "__main__":
    main()
