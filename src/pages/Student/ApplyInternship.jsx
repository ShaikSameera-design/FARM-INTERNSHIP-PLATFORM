import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiFileText, FiSend } from "react-icons/fi";
import Navbar from "../../components/Navbar";
import { internships } from "../../data/studentData";
import { addApplication, getApplications } from "../../utils/storage";

function ApplyInternship() {
  const { id } = useParams();
  const internship = internships.find((item) => item.id === Number(id));
  const alreadyApplied = getApplications().some((item) => item.internshipId === Number(id));
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ phone: "", college: "", department: "", statement: "" });

  if (!internship) {
    return <div className="empty-state"><h3>Internship not found</h3><Link to="/student/browse" className="primary-btn">Back to internships</Link></div>;
  }

  const submit = (event) => {
    event.preventDefault();
    if (alreadyApplied) return;
    addApplication({
      id: Date.now(),
      internshipId: internship.id,
      appliedOn: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      status: "Pending",
      student: form,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <Navbar title="Application Submitted" description="Your application has been recorded successfully." />
        <div className="success-state panel">
          <div className="success-icon"><FiCheckCircle /></div>
          <span className="eyebrow">APPLICATION RECEIVED</span>
          <h2>Your application is on its way.</h2>
          <p>You have successfully applied for <strong>{internship.title}</strong>. You can track the status from My Applications.</p>
          <div className="success-actions">
            <Link to="/student/applications" className="primary-btn">View My Applications</Link>
            <Link to="/student/browse" className="secondary-btn">Browse More</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar title="Apply for Internship" description={`Submit your application for ${internship.title}.`} />
      <Link className="back-link" to={`/student/internship/${internship.id}`}><FiArrowLeft /> Back to internship</Link>

      <div className="application-layout">
        <section className="panel application-form-card">
          <div className="form-header">
            <div className="form-icon"><FiFileText /></div>
            <div><h2>Application Form</h2><p>Complete your details carefully before submitting.</p></div>
          </div>

          {alreadyApplied ? (
            <div className="warning-box"><FiCheckCircle /><div><strong>Already applied</strong><p>You have already submitted an application for this internship. Check My Applications for the latest status.</p></div></div>
          ) : (
            <form onSubmit={submit}>
              <div className="form-section-title">Personal & academic details</div>
              <div className="form-grid">
                <label>Full Name<input value="Rahul Kumar" readOnly /></label>
                <label>Email<input value="rahul.kumar@student.com" readOnly /></label>
                <label>Phone Number<input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Enter phone number" /></label>
                <label>College Name<input required value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} placeholder="Enter college name" /></label>
                <label>Department<input required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="e.g. Agriculture / CSE" /></label>
                <label className="full-field">Why are you interested?<textarea required rows="5" value={form.statement} onChange={(e) => setForm({ ...form, statement: e.target.value })} placeholder="Briefly describe why this internship is relevant to your goals..." /></label>
              </div>
              <button className="primary-btn submit-btn" type="submit"><FiSend /> Submit Application</button>
            </form>
          )}
        </section>

        <aside className="panel application-summary">
          <span className="eyebrow">APPLYING FOR</span>
          <div className={`summary-logo ${internship.color}`}>🌱</div>
          <h3>{internship.title}</h3>
          <p>{internship.organization}</p>
          <div className="summary-line"><span>Duration</span><strong>{internship.duration}</strong></div>
          <div className="summary-line"><span>Stipend</span><strong>{internship.stipend}</strong></div>
          <div className="summary-line"><span>Location</span><strong>{internship.location}</strong></div>
        </aside>
      </div>
    </>
  );
}

export default ApplyInternship;
