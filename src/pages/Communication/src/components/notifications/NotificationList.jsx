import React, { useCallback, useEffect, useState } from "react";
import { notificationsApi } from "../../api/communicationApi";
import NotificationItem from "./NotificationItem";

/**
 * Full notification list for a logged-in user (student/farmer/admin/public).
 * `recipientId` and `recipientRole` come from whatever auth/session state
 * the main app already has — this component doesn't manage login itself.
 */
export default function NotificationList({ recipientId, pollIntervalMs = 15000 }) {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all"); // "all" | "unread"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!recipientId) return;
    try {
      const data = await notificationsApi.list(recipientId, { unreadOnly: filter === "unread" });
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [recipientId, filter]);

  useEffect(() => {
    load();
    if (!pollIntervalMs) return undefined;
    const interval = setInterval(load, pollIntervalMs);
    return () => clearInterval(interval);
  }, [load, pollIntervalMs]);

  const handleMarkRead = async (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    try {
      await notificationsApi.markRead(id);
    } catch {
      load(); // reconcile with server on failure
    }
  };

  const handleDelete = async (id) => {
    const prev = notifications;
    setNotifications((cur) => cur.filter((n) => n.id !== id));
    try {
      await notificationsApi.remove(id);
    } catch {
      setNotifications(prev);
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      await notificationsApi.markAllRead(recipientId);
    } catch {
      load();
    }
  };

  if (!recipientId) {
    return <p className="cm-empty-state">No recipient specified.</p>;
  }

  return (
    <div className="cm-notification-list">
      <div className="cm-notification-list-header">
        <h3>Notifications</h3>
        <div className="cm-notification-list-controls">
          <div className="cm-tabbar">
            <button
              className={filter === "all" ? "cm-tab cm-tab-active" : "cm-tab"}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={filter === "unread" ? "cm-tab cm-tab-active" : "cm-tab"}
              onClick={() => setFilter("unread")}
            >
              Unread
            </button>
          </div>
          <button className="cm-btn-link" onClick={handleMarkAllRead}>
            Mark all read
          </button>
        </div>
      </div>

      {loading && <p className="cm-empty-state">Loading notifications…</p>}
      {error && <p className="cm-error-state">Couldn't load notifications: {error}</p>}
      {!loading && !error && notifications.length === 0 && (
        <p className="cm-empty-state">You're all caught up — no notifications here.</p>
      )}

      <div className="cm-notification-items">
        {notifications.map((n) => (
          <NotificationItem key={n.id} notification={n} onMarkRead={handleMarkRead} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
