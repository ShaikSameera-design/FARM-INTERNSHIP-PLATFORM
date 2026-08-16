import React, { useCallback, useEffect, useRef, useState } from "react";
import { notificationsApi } from "../../api/communicationApi";
import NotificationList from "./NotificationList";

/**
 * Compact bell icon + unread badge, meant to sit in the shared app's top
 * navbar. Clicking it opens a dropdown with the full NotificationList.
 * This is the one piece other modules are most likely to embed directly.
 */
export default function NotificationBell({ recipientId, pollIntervalMs = 20000 }) {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const containerRef = useRef(null);

  const refreshCount = useCallback(async () => {
    if (!recipientId) return;
    try {
      const { unread_count } = await notificationsApi.unreadCount(recipientId);
      setUnreadCount(unread_count);
    } catch {
      /* silently ignore — bell just won't update this cycle */
    }
  }, [recipientId]);

  useEffect(() => {
    refreshCount();
    if (!pollIntervalMs) return undefined;
    const interval = setInterval(refreshCount, pollIntervalMs);
    return () => clearInterval(interval);
  }, [refreshCount, pollIntervalMs]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="cm-bell-container" ref={containerRef}>
      <button
        className="cm-bell-button"
        onClick={() => {
          setOpen((o) => !o);
          if (!open) refreshCount();
        }}
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && <span className="cm-bell-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>}
      </button>

      {open && (
        <div className="cm-bell-dropdown">
          <NotificationList recipientId={recipientId} pollIntervalMs={0} />
        </div>
      )}
    </div>
  );
}
