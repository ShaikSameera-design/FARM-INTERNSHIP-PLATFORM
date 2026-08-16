import React from "react";

const TYPE_ICON = {
  info: "ℹ️",
  success: "✅",
  warning: "⚠️",
  alert: "🚨",
};

function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationItem({ notification, onMarkRead, onDelete }) {
  const { id, title, message, type, is_read, created_at, link } = notification;

  return (
    <div className={`cm-notification-item ${is_read ? "cm-read" : "cm-unread"}`}>
      <div className="cm-notification-icon" aria-hidden="true">
        {TYPE_ICON[type] || "ℹ️"}
      </div>
      <div className="cm-notification-body">
        <div className="cm-notification-title-row">
          <span className="cm-notification-title">{title}</span>
          <span className="cm-notification-time">{timeAgo(created_at)}</span>
        </div>
        <p className="cm-notification-message">{message}</p>
        {link && (
          <a className="cm-notification-link" href={link}>
            View details →
          </a>
        )}
      </div>
      <div className="cm-notification-actions">
        {!is_read && (
          <button className="cm-btn-link" onClick={() => onMarkRead(id)} title="Mark as read">
            Mark read
          </button>
        )}
        <button className="cm-btn-link cm-btn-danger" onClick={() => onDelete(id)} title="Delete">
          ✕
        </button>
      </div>
    </div>
  );
}
