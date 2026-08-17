import { useState, useMemo } from "react";
import "../College/College.css";
import { internships, attendanceRecords, studentProfileData } from "../../data/studentData";
import { getApplications, addApplication } from "../../utils/storage";

function StudentPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [applications, setApplications] = useState(() => getApplications());
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [applyingFor, setApplyingFor] = useState(null);
  const [applyForm, setApplyForm] = useState({ phone: "", statement: "" });
  const [applySubmitted, setApplySubmitted] = useState(false);

  const categories = useMemo(
    () => ["All", ...new Set(internships.map((item) => item.category))],
    []
  );

  const filteredInternships = useMemo(() => {
    return internships.filter((item) => {
      const text = `${item.title} ${item.organization} ${item.location}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [search, categoryFilter]);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!applyingFor) return;

    const newApp = addApplication({
      internshipId: applyingFor.id,
      title: applyingFor.title,
      organization: applyingFor.organization,
      location: applyingFor.location,
      coverLetter: applyForm.statement,
    });

    setApplications(getApplications());
    setApplySubmitted(true);
  };

  const navigateToRole = (path) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const presentDays = attendanceRecords.filter((r) => r.status === "Present").length;
  const attendancePercent = Math.round((presentDays / attendanceRecords.length) * 100);

  return (
    <div className="college-dashboard">
      {/* LEFT SIDEBAR */}
      <aside className="college-sidebar">
        <div className="college-logo">
          <div className="logo-icon">🎓</div>
          <div>
            <h2>FarmIntern</h2>
            <span>Student Portal</span>
          </div>
        </div>

        <nav className="college-nav">
          <button
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            <span>▦</span>
            Dashboard
          </button>
          <button
            className={activeTab === "browse" ? "active" : ""}
            onClick={() => setActiveTab("browse")}
          >
            <span>🔍</span>
            Browse Internships
          </button>
          <button
            className={activeTab === "applications" ? "active" : ""}
            onClick={() => setActiveTab("applications")}
          >
            <span>📋</span>
            My Applications
          </button>
          <button
            className={activeTab === "attendance" ? "active" : ""}
            onClick={() => setActiveTab("attendance")}
          >
            <span>📅</span>
            Attendance
          </button>
          <button
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            <span>👤</span>
            My Profile
          </button>
          <button
            className=""
            onClick={() => navigateToRole("/communication")}
          >
            <span>💬</span>
            Communication
          </button>
        </nav>

        <div className="college-sidebar-bottom">
          <div className="college-user">
            <div className="user-avatar" style={{ background: "#3b82f6" }}>AR</div>
            <div>
              <strong>{studentProfileData.name}</strong>
              <span>{studentProfileData.rollNo}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="college-main">
        {/* TOP BAR */}
        <header className="college-topbar">
          <div>
            <p className="welcome-text">Student Experience Portal 👋</p>
            <h1>
              {activeTab === "dashboard" && "Student Dashboard"}
              {activeTab === "browse" && "Explore Farm Internships"}
              {activeTab === "applications" && "My Internship Applications"}
              {activeTab === "attendance" && "Internship Attendance Log"}
              {activeTab === "profile" && "Student Academic Profile"}
            </h1>
          </div>

          <div className="topbar-actions">
            {/* PORTAL SWITCHER BUTTONS */}
            <div className="portal-switcher" style={{ display: "flex", gap: "8px", alignItems: "center", marginRight: "12px" }}>
              <button
                type="button"
                className="portal-badge-btn"
                onClick={() => navigateToRole("/")}
                style={{ padding: "6px 12px", borderRadius: "20px", border: "1px solid #e5e7eb", background: "#ffffff", color: "#374151", fontWeight: 500, fontSize: "12px", cursor: "pointer" }}
              >
                🏫 College
              </button>
              <button
                type="button"
                className="portal-badge-btn active"
                onClick={() => navigateToRole("/student")}
                style={{ padding: "6px 12px", borderRadius: "20px", border: "1px solid #3b82f6", background: "#eff6ff", color: "#1d4ed8", fontWeight: 600, fontSize: "12px", cursor: "pointer" }}
              >
                👨‍🎓 Student
              </button>
              <button
                type="button"
                className="portal-badge-btn"
                onClick={() => navigateToRole("/communication")}
                style={{ padding: "6px 12px", borderRadius: "20px", border: "1px solid #e5e7eb", background: "#ffffff", color: "#374151", fontWeight: 500, fontSize: "12px", cursor: "pointer" }}
              >
                💬 Communication
              </button>
              <button
                type="button"
                className="portal-badge-btn"
                onClick={() => navigateToRole("/farmer")}
                style={{ padding: "6px 12px", borderRadius: "20px", border: "1px solid #e5e7eb", background: "#ffffff", color: "#374151", fontWeight: 500, fontSize: "12px", cursor: "pointer" }}
              >
                🚜 Farmer
              </button>
            </div>

            <button className="notification-btn" type="button" onClick={() => navigateToRole("/communication")}>
              🔔
              <span></span>
            </button>

            <div className="college-admin-avatar" style={{ background: "#3b82f6" }}>AR</div>
          </div>
        </header>

        {/* TAB 1: DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <section className="hero-section" style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)" }}>
              <div>
                <span className="hero-label" style={{ background: "rgba(255,255,255,0.2)", color: "#ffffff" }}>STUDENT DASHBOARD</span>
                <h2>Accelerate your career in Agricultural Sciences.</h2>
                <p>Apply to verified farm internships, track real-time application approvals, and maintain your attendance record.</p>
                <button className="hero-button" onClick={() => setActiveTab("browse")}>
                  Browse Opportunities →
                </button>
              </div>
              <div className="hero-illustration">🌾</div>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon blue">🔍</div>
                <div>
                  <span>Opportunities</span>
                  <h2>{internships.length}</h2>
                  <small>Available to apply</small>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green">📋</div>
                <div>
                  <span>My Applications</span>
                  <h2>{applications.length}</h2>
                  <small>Submitted</small>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple">✓</div>
                <div>
                  <span>Approved</span>
                  <h2>{applications.filter((a) => a.status === "Approved").length}</h2>
                  <small>Verified by farm</small>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange">📅</div>
                <div>
                  <span>Attendance</span>
                  <h2>{attendancePercent}%</h2>
                  <small>{presentDays} days logged</small>
                </div>
              </div>
            </section>

            <section className="dashboard-panel full-panel">
              <div className="panel-header">
                <div>
                  <h3>Featured Internships</h3>
                  <p>Handpicked opportunities matching your specialization</p>
                </div>
                <button onClick={() => setActiveTab("browse")}>View All →</button>
              </div>

              <div className="college-activity-grid">
                {internships.slice(0, 3).map((item) => (
                  <div key={item.id} className="operation-card" style={{ textAlign: "left" }}>
                    <div style={{ fontSize: "28px", marginBottom: "8px" }}>🌱</div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#16a34a", textTransform: "uppercase" }}>{item.category}</span>
                    <h3 style={{ fontSize: "16px", marginTop: "4px", marginBottom: "4px" }}>{item.title}</h3>
                    <strong>{item.stipend}</strong>
                    <p style={{ margin: "8px 0" }}>📍 {item.location} · ⏳ {item.duration}</p>
                    <button
                      type="button"
                      className="details-button"
                      style={{ marginTop: "8px", width: "100%" }}
                      onClick={() => setSelectedInternship(item)}
                    >
                      View Details & Apply
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* TAB 2: BROWSE INTERNSHIPS */}
        {activeTab === "browse" && (
          <section className="page-section">
            <div className="page-title">
              <h2>Browse Farm Internships</h2>
              <p>Explore high-impact internships across soil science, horticulture, dairy, and smart farming.</p>
            </div>

            <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="🔍 Search title, organization or location..."
                style={{ flex: 1, minWidth: "240px", padding: "10px 16px", borderRadius: "8px", border: "1px solid #d1d5db" }}
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fff" }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="student-grid">
              {filteredInternships.map((item) => {
                const isApplied = applications.some((a) => a.internshipId === item.id);
                return (
                  <div className="student-card" key={item.id}>
                    <div className="student-card-top">
                      <div className="big-avatar" style={{ background: "#dcfce7", color: "#166534" }}>🌱</div>
                      <span className={`status ${isApplied ? "completed" : "ongoing"}`}>
                        {isApplied ? "Applied" : "Open"}
                      </span>
                    </div>

                    <h3>{item.title}</h3>
                    <p style={{ fontWeight: 600, color: "#4b5563" }}>{item.organization}</p>

                    <div className="student-detail">
                      <span>Location</span>
                      <strong>📍 {item.location}</strong>
                    </div>
                    <div className="student-detail">
                      <span>Duration & Stipend</span>
                      <strong>⏳ {item.duration} · {item.stipend}</strong>
                    </div>

                    <button
                      className="full-details-button"
                      onClick={() => setSelectedInternship(item)}
                      style={{ marginTop: "16px" }}
                    >
                      View Internship Details
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* TAB 3: MY APPLICATIONS */}
        {activeTab === "applications" && (
          <section className="page-section">
            <div className="page-title">
              <h2>My Applications</h2>
              <p>Track live application status, approval timelines, and farm mentor feedback.</p>
            </div>

            <div className="dashboard-panel full-panel">
              <div className="activity-list">
                {applications.map((app) => (
                  <div className="activity-item" key={app.id} style={{ alignItems: "center" }}>
                    <div className="activity-avatar" style={{ background: "#eff6ff", color: "#2563eb" }}>📋</div>
                    <div className="activity-content" style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong>{app.title}</strong>
                        <span className={`status ${app.status === "Approved" ? "completed" : "pending"}`}>
                          {app.status}
                        </span>
                      </div>
                      <p>{app.organization} · Applied on {app.appliedDate}</p>
                      {app.coverLetter && <small style={{ display: "block", color: "#6b7280" }}>Note: {app.coverLetter}</small>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: ATTENDANCE */}
        {activeTab === "attendance" && (
          <section className="page-section">
            <div className="page-title">
              <h2>Attendance & Daily Logs</h2>
              <p>Verified daily field hours and activity progress logs.</p>
            </div>

            <div className="stats-grid" style={{ marginBottom: "24px" }}>
              <div className="stat-card">
                <div className="stat-icon green">✓</div>
                <div>
                  <span>Present Days</span>
                  <h2>{presentDays} / {attendanceRecords.length}</h2>
                  <small>Days recorded</small>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon blue">⏱️</div>
                <div>
                  <span>Daily Avg</span>
                  <h2>7.8 Hours</h2>
                  <small>Field practice</small>
                </div>
              </div>
            </div>

            <div className="dashboard-panel full-panel">
              <div className="panel-header">
                <h3>Daily Attendance Log</h3>
              </div>
              <div className="activity-list">
                {attendanceRecords.map((log) => (
                  <div className="activity-item" key={log.id}>
                    <div className="college-activity-icon" style={{ background: log.status === "Present" ? "#dcfce7" : "#fef3c7" }}>
                      {log.status === "Present" ? "✓" : "⏳"}
                    </div>
                    <div className="activity-content">
                      <strong>{log.date} — {log.task}</strong>
                      <p>Status: {log.status} · Working Hours: {log.hours}h</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TAB 5: MY PROFILE */}
        {activeTab === "profile" && (
          <section className="page-section">
            <div className="page-title">
              <h2>Student Academic Profile</h2>
              <p>Your verified academic records and contact details.</p>
            </div>

            <div className="dashboard-panel full-panel">
              <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid #e5e7eb" }}>
                <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#3b82f6", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: "bold" }}>
                  AR
                </div>
                <div>
                  <h2 style={{ margin: 0 }}>{studentProfileData.name}</h2>
                  <p style={{ margin: "4px 0", color: "#6b7280" }}>{studentProfileData.branch} · {studentProfileData.year}</p>
                  <span style={{ fontSize: "12px", background: "#dcfce7", color: "#166534", padding: "4px 10px", borderRadius: "12px", fontWeight: 600 }}>
                    Verified Student
                  </span>
                </div>
              </div>

              <div className="college-activity-grid">
                <div className="operation-card" style={{ textAlign: "left" }}>
                  <span>🏫</span>
                  <h3>Institution</h3>
                  <strong>{studentProfileData.college}</strong>
                  <p>Roll No: {studentProfileData.rollNo}</p>
                </div>

                <div className="operation-card" style={{ textAlign: "left" }}>
                  <span>📊</span>
                  <h3>Academic CGPA</h3>
                  <strong>{studentProfileData.cgpa}</strong>
                  <p>Grade Point Average</p>
                </div>

                <div className="operation-card" style={{ textAlign: "left" }}>
                  <span>📧</span>
                  <h3>Contact Info</h3>
                  <strong>{studentProfileData.email}</strong>
                  <p>{studentProfileData.phone}</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* DETAIL & APPLY MODAL */}
      {selectedInternship && (
        <div className="modal-overlay" onClick={() => setSelectedInternship(null)}>
          <div className="student-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "560px", width: "90%" }}>
            <button className="close-modal" onClick={() => setSelectedInternship(null)}>×</button>

            <div className="modal-avatar" style={{ background: "#dcfce7", color: "#166534" }}>🌱</div>
            <h2>{selectedInternship.title}</h2>
            <p>{selectedInternship.organization} · 📍 {selectedInternship.location}</p>

            <div className="modal-details" style={{ marginTop: "16px" }}>
              <div>
                <span>Duration</span>
                <strong>{selectedInternship.duration}</strong>
              </div>
              <div>
                <span>Stipend</span>
                <strong>{selectedInternship.stipend}</strong>
              </div>
              <div>
                <span>Category</span>
                <strong>{selectedInternship.category}</strong>
              </div>
            </div>

            <div style={{ textAlign: "left", marginTop: "16px", background: "#f9fafb", padding: "12px", borderRadius: "8px" }}>
              <strong>Description:</strong>
              <p style={{ margin: "4px 0 12px 0", fontSize: "14px", color: "#4b5563" }}>{selectedInternship.description}</p>

              <strong>Requirements:</strong>
              <ul style={{ margin: "4px 0 0 18px", fontSize: "13px", color: "#4b5563" }}>
                {selectedInternship.requirements?.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>

            <button
              className="full-details-button"
              style={{ marginTop: "20px" }}
              onClick={() => {
                setApplyingFor(selectedInternship);
                setSelectedInternship(null);
                setApplySubmitted(false);
              }}
            >
              Apply For This Internship Now
            </button>
          </div>
        </div>
      )}

      {/* APPLY FORM MODAL */}
      {applyingFor && (
        <div className="modal-overlay" onClick={() => setApplyingFor(null)}>
          <div className="student-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "500px", width: "90%" }}>
            <button className="close-modal" onClick={() => setApplyingFor(null)}>×</button>

            {applySubmitted ? (
              <div>
                <div className="modal-avatar" style={{ background: "#dcfce7", color: "#166534" }}>✓</div>
                <h2>Application Submitted!</h2>
                <p>Your application for <strong>{applyingFor.title}</strong> has been sent to the farm mentor.</p>
                <button
                  className="close-button"
                  onClick={() => {
                    setApplyingFor(null);
                    setActiveTab("applications");
                  }}
                  style={{ marginTop: "20px" }}
                >
                  View My Applications
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit}>
                <h2>Apply for Internship</h2>
                <p style={{ color: "#6b7280", marginBottom: "16px" }}>{applyingFor.title} at {applyingFor.organization}</p>

                <div style={{ textAlign: "left", marginBottom: "12px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                    Statement of Interest:
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={applyForm.statement}
                    onChange={(e) => setApplyForm({ ...applyForm, statement: e.target.value })}
                    placeholder="Describe why you want to join this farm internship..."
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                  />
                </div>

                <button type="submit" className="full-details-button">
                  Submit Application
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentPage;
