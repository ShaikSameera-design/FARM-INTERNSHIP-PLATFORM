import React, { useState } from "react";
import { feedbackApi } from "../../api/communicationApi";
import StarRating from "./StarRating";

const CATEGORY_OPTIONS = [
  { value: "internship_experience", label: "Internship Experience" },
  { value: "farmer_host", label: "Farmer / Host" },
  { value: "platform", label: "Platform" },
  { value: "other", label: "Other" },
];

/**
 * Generic feedback form — works for a student rating an internship, a
 * farmer rating a student, etc. Just pass who's submitting.
 */
export default function FeedbackForm({ submittedById, submittedByRole, internshipId, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("internship_experience");
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (rating < 1) {
      setError("Please select a star rating before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const feedback = await feedbackApi.submit({
        submitted_by_id: submittedById,
        submitted_by_role: submittedByRole,
        internship_id: internshipId || null,
        category,
        rating,
        comments: comments.trim() || null,
      });
      setSuccess(true);
      setRating(0);
      setComments("");
      onSubmitted?.(feedback);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="cm-feedback-success">
        <p>Thank you — your feedback has been submitted! 🌱</p>
        <button className="cm-btn-link" onClick={() => setSuccess(false)}>
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form className="cm-feedback-form" onSubmit={handleSubmit}>
      <h3>Share your feedback</h3>

      <label className="cm-field-label">
        Category
        <select className="cm-select" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <div className="cm-field-label">
        Rating
        <StarRating value={rating} onChange={setRating} />
      </div>

      <label className="cm-field-label">
        Comments (optional)
        <textarea
          className="cm-textarea"
          rows={4}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Tell us more about your experience..."
        />
      </label>

      {error && <p className="cm-error-state">{error}</p>}

      <button type="submit" className="cm-btn-primary" disabled={submitting}>
        {submitting ? "Submitting…" : "Submit Feedback"}
      </button>
    </form>
  );
}
