"""Central configuration. Everything is read from environment variables (or backend/.env)."""
import os
import secrets
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent  # backend/

try:  # optional: load backend/.env when python-dotenv is installed
    from dotenv import load_dotenv
    load_dotenv(BASE_DIR / ".env")
except Exception:  # pragma: no cover
    pass


def _bool(name, default):
    raw = os.getenv(name)
    if raw is None or raw == "":
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


ENVIRONMENT = os.getenv("ENVIRONMENT", "development").strip().lower()
IS_PROD = ENVIRONMENT == "production"

_WEAK_SECRETS = {
    "", "change-me", "replace-with-a-long-random-secret", "farmintern-change-this-secret",
    "secret", "changeme",
}


def _load_secret():
    value = os.getenv("APP_SECRET", "").strip()
    if value and value not in _WEAK_SECRETS and len(value) >= 32:
        return value
    if IS_PROD:
        raise RuntimeError(
            "APP_SECRET must be set to a random string of at least 32 characters in production. "
            "Generate one with:  python3 -c \"import secrets; print(secrets.token_urlsafe(48))\""
        )
    # Development only: generate once and persist so tokens survive restarts.
    path = BASE_DIR / ".dev_secret"
    if path.exists():
        stored = path.read_text().strip()
        if len(stored) >= 32:
            return stored
    stored = secrets.token_urlsafe(48)
    path.write_text(stored)
    try:
        os.chmod(path, 0o600)
    except OSError:
        pass
    return stored


APP_SECRET = _load_secret()


def _load_database_url():
    url = os.getenv("DATABASE_URL", "").strip()
    if not url:
        if IS_PROD:
            raise RuntimeError("DATABASE_URL (PostgreSQL) must be set when ENVIRONMENT=production.")
        return f"sqlite:///{BASE_DIR / 'farmintern.db'}"  # local development fallback only
    if url.startswith("postgres://"):
        url = "postgresql+psycopg2://" + url[len("postgres://"):]
    elif url.startswith("postgresql://"):
        url = "postgresql+psycopg2://" + url[len("postgresql://"):]
    return url


DATABASE_URL = _load_database_url()
IS_SQLITE = DATABASE_URL.startswith("sqlite")

# Comma separated list of browser origins allowed to call the API (only needed when the
# frontend is hosted on a different origin than the API).
CORS_ORIGINS = [o.strip().rstrip("/") for o in os.getenv(
    "CORS_ORIGINS",
    "" if IS_PROD else "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173",
).split(",") if o.strip()]

# Password-reset behaviour. In production the link is only e-mailed (SMTP_*), never returned by the API.
EXPOSE_RESET_LINK = _bool("EXPOSE_RESET_LINK", not IS_PROD)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587") or 587)
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USER or "no-reply@farmintern.local")

# Unverified farmers may not publish internships when this is on (default on in production).
REQUIRE_FARMER_VERIFICATION = _bool("REQUIRE_FARMER_VERIFICATION", IS_PROD)

TOKEN_TTL_SECONDS = int(os.getenv("TOKEN_TTL_SECONDS", str(60 * 60 * 12)))

# Optional: serve the built frontend (npm run build -> ../frontend/dist or ../dist) from this same process.
_default_dist = BASE_DIR.parent / "frontend" / "dist"
if not _default_dist.exists() and (BASE_DIR.parent / "dist").exists():
    _default_dist = BASE_DIR.parent / "dist"
FRONTEND_DIST = Path(os.getenv("FRONTEND_DIST", str(_default_dist)))

