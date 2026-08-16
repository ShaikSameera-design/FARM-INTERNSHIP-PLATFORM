import React, { useCallback, useEffect, useState } from "react";
import { feedbackApi } from "../../api/communicationApi";
import StarRating from "./StarRating";

/**
 * Lists feedback, optionally scoped to one internship. If `isAdmin` is
 * true, admins can post a response to each entry directly from this view.
 */
export default function FeedbackList({ internshipId, isAdmin = false, adminId }) {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyDrafts, setReplyDrafts] = useState({});

  const load = useCallback(async () => {
    try {
      const [list, sum] = await Promise.all([
        feedbackApi.list({ internshipId }),
        feedbackApi.summary(internshipId),
      ]);
      setItems(list);
      setSummary(sum);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [internshipId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleReply = async (feedbackId) => {
    const text = (replyDrafts[feedbackId] || "").trim();
    if (!text) return;
    try {
      const updated = await feedbackApi.respond(feedbackId, {
        responded_by_id: adminId,
        admin_response: text,
      });
      setItems((prev) => prev.map((f) => (f.id === feedbackId ? updated : f)));
      setReplyDrafts((prev) => ({ ...prev, [feedbackId]: "" }));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="cm-empty-state">Loading feedback…</p>;
  if (error) return <p className="cm-error-state">Couldn't load feedback: {error}</p>;

  return (
    <div className="cm-feedback-list">
      {summary && (
        <div className="cm-feedback-summary">
          <span className="cm-feedback-summary-avg">{summary.average_rating.toFixed(1)}</span>
          <div>
            <StarRating value={Math.round(summary.average_rating)} onChange={() => {}} readOnly />
            <p className="cm-feedback-summary-count">{summary.count} review(s)</p>
          </div>
        </div>
      )}

      {items.length === 0 && <p className="cm-empty-state">No feedback yet.</p>}

      {items.map((fb) => (
        <div key={fb.id} className="cm-feedback-item">
          <div className="cm-feedback-item-header">
            <StarRating value={fb.rating} onChange={() => {}} readOnly />
            <span className="cm-feedback-category">{fb.category.replace("_", " ")}</span>
          </div>
          {fb.comments && <p className="cm-feedback-comments">{fb.comments}</p>}

          {fb.admin_response && (
            <div className="cm-feedback-response">
              <strong>Response:</strong> {fb.admin_response}
            </div>
          )}

          {isAdmin && !fb.admin_response && (
            <div className="cm-feedback-reply-box">
              <textarea
                className="cm-textarea"
                rows={2}
                placeholder="Write a response…"
                value={replyDrafts[fb.id] || ""}
                onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [fb.id]: e.target.value }))}
              />
              <button className="cm-btn-secondary" onClick={() => handleReply(fb.id)}>
                Send response
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
