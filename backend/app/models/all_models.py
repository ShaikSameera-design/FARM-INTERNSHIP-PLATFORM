from datetime import datetime, timezone
from sqlalchemy import (Column, Integer, String, Text, DateTime, Date, ForeignKey, Boolean, Float,
                        Index, UniqueConstraint)
from sqlalchemy.orm import relationship
from app.database import Base


def utcnow():
    """Naive UTC timestamp (stored as UTC; serialised with a trailing Z by the API)."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    email = Column(String(180), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(30), nullable=False, index=True)
    phone = Column(String(40), default="")
    location = Column(String(160), default="")
    verified = Column(Boolean, default=False)
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=utcnow)
    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    token = Column(String(128), unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)


class Profile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    headline = Column(String(180), default="")
    bio = Column(Text, default="")
    institution = Column(String(180), default="")
    course = Column(String(160), default="")
    year = Column(String(40), default="")
    skills = Column(String(500), default="")
    user = relationship("User", back_populates="profile")


class Internship(Base):
    __tablename__ = "internships"
    id = Column(Integer, primary_key=True)
    farmer_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String(180), nullable=False)
    category = Column(String(100), default="Agriculture")
    description = Column(Text, default="")
    location = Column(String(160), default="")
    duration = Column(String(80), default="")
    stipend = Column(String(80), default="")
    openings = Column(Integer, default=1)
    status = Column(String(30), default="Active")  # Active | Paused | Closed | Filled (Filled is automatic)
    created_at = Column(DateTime, default=utcnow)
    farmer = relationship("User", foreign_keys=[farmer_id])


class Application(Base):
    __tablename__ = "applications"
    __table_args__ = (Index("uq_app_internship_student", "internship_id", "student_id", unique=True),)
    id = Column(Integer, primary_key=True)
    internship_id = Column(Integer, ForeignKey("internships.id", ondelete="CASCADE"))
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    cover_letter = Column(Text, default="")
    status = Column(String(30), default="Pending")  # Pending|Shortlisted|Selected|Rejected|Withdrawn
    applied_at = Column(DateTime, default=utcnow)
    decided_at = Column(DateTime)
    internship = relationship("Internship")
    student = relationship("User", foreign_keys=[student_id])
    placement = relationship("Placement", back_populates="application", uselist=False)


class Placement(Base):
    """The real hiring record. Created in the same transaction in which an application becomes Selected."""
    __tablename__ = "placements"
    __table_args__ = (UniqueConstraint("internship_id", "student_id", name="uq_placement_internship_student"),)
    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), unique=True, nullable=False)
    internship_id = Column(Integer, ForeignKey("internships.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    status = Column(String(30), default="Active", nullable=False)  # Active | Completed | Terminated
    start_date = Column(Date)
    end_date = Column(Date)
    created_at = Column(DateTime, default=utcnow)
    application = relationship("Application", back_populates="placement")
    internship = relationship("Internship")
    student = relationship("User", foreign_keys=[student_id])
    farmer = relationship("User", foreign_keys=[farmer_id])


class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True)
    placement_id = Column(Integer, ForeignKey("placements.id", ondelete="CASCADE"), index=True)
    internship_id = Column(Integer, ForeignKey("internships.id", ondelete="CASCADE"))
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    title = Column(String(180), nullable=False)
    description = Column(Text, default="")
    due_date = Column(Date)
    status = Column(String(30), default="Pending")  # Pending | In Progress | Completed
    progress = Column(Integer, default=0)
    student_note = Column(Text, default="")
    updated_at = Column(DateTime, default=utcnow)
    placement = relationship("Placement")
    internship = relationship("Internship")
    student = relationship("User", foreign_keys=[student_id])


class Evaluation(Base):
    __tablename__ = "evaluations"
    id = Column(Integer, primary_key=True)
    placement_id = Column(Integer, ForeignKey("placements.id", ondelete="CASCADE"), index=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    internship_id = Column(Integer, ForeignKey("internships.id", ondelete="CASCADE"))
    evaluator_id = Column(Integer, ForeignKey("users.id"))
    rating = Column(Float, default=0)
    feedback = Column(Text, default="")
    created_at = Column(DateTime, default=utcnow)
    student = relationship("User", foreign_keys=[student_id])
    internship = relationship("Internship")
    evaluator = relationship("User", foreign_keys=[evaluator_id])


class Conversation(Base):
    __tablename__ = "conversations"
    id = Column(Integer, primary_key=True)
    subject = Column(String(180), default="General")
    created_at = Column(DateTime, default=utcnow)


class ConversationMember(Base):
    __tablename__ = "conversation_members"
    id = Column(Integer, primary_key=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id", ondelete="CASCADE"), index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)


class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id", ondelete="CASCADE"), index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    body = Column(Text, nullable=False)
    created_at = Column(DateTime, default=utcnow)
    read = Column(Boolean, default=False)


class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    title = Column(String(180), nullable=False)
    body = Column(Text, default="")
    link = Column(String(40), default="")  # frontend page id the notification points to
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utcnow)


class CallInvite(Base):
    """Persistent call signalling so the callee actually gets a ringing prompt."""
    __tablename__ = "call_invites"
    id = Column(Integer, primary_key=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id", ondelete="CASCADE"), index=True)
    caller_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    callee_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    kind = Column(String(10), default="video")  # audio | video
    status = Column(String(15), default="ringing")  # ringing | accepted | declined | ended | missed
    created_at = Column(DateTime, default=utcnow)


class CollegeActivity(Base):
    __tablename__ = "college_activities"
    id = Column(Integer, primary_key=True)
    college_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    activity = Column(String(180), nullable=False)
    details = Column(Text, default="")
    created_at = Column(DateTime, default=utcnow)
