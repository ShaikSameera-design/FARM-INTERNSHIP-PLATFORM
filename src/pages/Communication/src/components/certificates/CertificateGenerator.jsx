import React, { useState } from "react";
import { certificatesApi } from "../../api/communicationApi";

const emptyForm = {
  student_id: "",
  student_name: "",
  internship_id: "",
  internship_title: "",
  farmer_name: "",
  start_date: "",
  end_date: "",
};

/**
 * Admin-facing form to issue a certificate for a student who has completed
 * an internship. In the full app, an admin would typically reach this
 * pre-filled from the student/internship record they're viewing — the
 * fields here are plain text inputs so this component has no dependency
 * on how those other modules store or fetch that data.
 */
export default function CertificateGenerator({ adminId, onIssued }) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [issued, setIssued] = useState(null);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.student_name || !form.internship_title || !form.start_date || !form.end_date) {
      setError("Student name, internship title, start date and end date are required.");
      return;
    }

    setSubmitting(true);
    try {
      const cert = await certificatesApi.issue({
        student_id: form.student_id,
        student_name: form.student_name,
        internship_id: form.internship_id || null,
        internship_title: form.internship_title,
        farmer_name: form.farmer_name || null,
        start_date: new Date(form.start_date).toISOString(),
        end_date: new Date(form.end_date).toISOString(),
        issued_by_id: adminId,
      });
      setIssued(cert);
      setForm(emptyForm);
      onIssued?.(cert);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cm-certificate-generator">
      <h3>Issue a Certificate</h3>
      <form onSubmit={handleSubmit} className="cm-certificate-form">
        <div className="cm-form-row">
          <label className="cm-field-label">
            Student ID
            <input className="cm-input" value={form.student_id} onChange={update("student_id")} />
          </label>
          <label className="cm-field-label">
            Student Name *
            <input className="cm-input" value={form.student_name} onChange={update("student_name")} required />
          </label>
        </div>

        <div className="cm-form-row">
          <label className="cm-field-label">
            Internship ID
            <input className="cm-input" value={form.internship_id} onChange={update("internship_id")} />
          </label>
          <label className="cm-field-label">
            Internship Title *
            <input
              className="cm-input"
              value={form.internship_title}
              onChange={update("internship_title")}
              required
            />
          </label>
        </div>

        <label className="cm-field-label">
          Farmer / Mentor Name
          <input className="cm-input" value={form.farmer_name} onChange={update("farmer_name")} />
        </label>

        <div className="cm-form-row">
          <label className="cm-field-label">
            Start Date *
            <input type="date" className="cm-input" value={form.start_date} onChange={update("start_date")} required />
          </label>
          <label className="cm-field-label">
            End Date *
            <input type="date" className="cm-input" value={form.end_date} onChange={update("end_date")} required />
          </label>
        </div>

        {error && <p className="cm-error-state">{error}</p>}

        <button type="submit" className="cm-btn-primary" disabled={submitting}>
          {submitting ? "Generating…" : "Generate Certificate"}
        </button>
      </form>

      {issued && (
        <div className="cm-certificate-issued-confirmation">
          <p>Certificate issued for {issued.student_name}! 🎉</p>
          <a
            className="cm-btn-secondary"
            href={certificatesApi.downloadUrl(issued.id)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
}
