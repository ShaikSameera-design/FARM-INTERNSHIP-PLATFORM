"""Non-destructive schema upgrade.

`create_all` creates any missing tables. For tables that already exist (from earlier versions) this
adds missing columns and indexes and back-fills the new Placement records for applications that were
already Selected. It never drops or rewrites existing rows.
"""
import logging
from datetime import date
from sqlalchemy import inspect, text
from app.database import Base, engine, SessionLocal
from app.models.all_models import Application, Placement, Task, Evaluation

log = logging.getLogger("farmintern.migrate")

NEW_COLUMNS = [
    ("users", "active", "BOOLEAN NOT NULL DEFAULT TRUE"),
    ("applications", "decided_at", "TIMESTAMP"),
    ("tasks", "placement_id", "INTEGER"),
    ("tasks", "student_note", "TEXT"),
    ("tasks", "updated_at", "TIMESTAMP"),
    ("evaluations", "placement_id", "INTEGER"),
    ("notifications", "link", "VARCHAR(40) DEFAULT ''"),
]


def run_migrations():
    Base.metadata.create_all(bind=engine)
    insp = inspect(engine)
    with engine.begin() as conn:
        for table, column, ddl in NEW_COLUMNS:
            if table in insp.get_table_names() and column not in {c["name"] for c in insp.get_columns(table)}:
                conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {column} {ddl}"))
                log.info("added column %s.%s", table, column)
        try:
            with conn.begin_nested():  # savepoint, so a failure cannot poison the PostgreSQL transaction
                conn.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS uq_app_internship_student "
                                  "ON applications (internship_id, student_id)"))
        except Exception as exc:  # duplicates from legacy data: leave the data untouched
            log.warning("could not create unique application index: %s", exc)
    backfill_placements()


def backfill_placements():
    db = SessionLocal()
    try:
        for a in db.query(Application).filter(Application.status == "Selected").all():
            if db.query(Placement).filter_by(application_id=a.id).first():
                continue
            if db.query(Placement).filter_by(internship_id=a.internship_id, student_id=a.student_id).first():
                continue
            when = a.decided_at or a.applied_at
            db.add(Placement(application_id=a.id, internship_id=a.internship_id, student_id=a.student_id,
                             farmer_id=a.internship.farmer_id, status="Active",
                             start_date=when.date() if when else date.today()))
        db.flush()
        for t in db.query(Task).filter(Task.placement_id.is_(None)).all():
            p = db.query(Placement).filter_by(internship_id=t.internship_id, student_id=t.student_id).first()
            if p:
                t.placement_id = p.id
        for e in db.query(Evaluation).filter(Evaluation.placement_id.is_(None)).all():
            p = db.query(Placement).filter_by(internship_id=e.internship_id, student_id=e.student_id).first()
            if p:
                e.placement_id = p.id
        db.commit()
    except Exception:
        db.rollback()
        log.exception("placement back-fill failed (existing data left unchanged)")
    finally:
        db.close()
