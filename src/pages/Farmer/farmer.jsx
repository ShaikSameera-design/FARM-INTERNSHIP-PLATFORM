import { useState } from "react";
import "../College/College.css";

function FarmerPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const [postedInternships, setPostedInternships] = useState([
    { id: 1, title: "Organic Hydroponics & Crop Management", applicants: 4, status: "Active", stipend: "₹12,000 / month" },
    { id: 2, title: "Soil Moisture Sensors & Smart Irrigation", applicants: 2, status: "Active", stipend: "₹10,500 / month" },
  ]);

  const [applicants, setApplicants] = useState([
    { id: 101, student: "Anjali Reddy", college: "Rgukt College", rollNo: "2023-AGRI-042", status: "Approved", appliedDate: "12 Aug 2026" },
    { id: 102, student: "Ravi Teja", college: "Rgukt College", rollNo: "2023-AGRI-015", status: "Pending", appliedDate: "14 Aug 2026" },
    { id: 103, student: "Meghana S", college: "Agri Tech Institute", rollNo: "2023-AGRI-088", status: "Pending", appliedDate: "15 Aug 2026" },
  ]);

  const navigateToRole = (path) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const approveApplicant = (id) => {
    setApplicants((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: "Approved" } : app))
    );
  };

  return (
    <div className="college-dashboard">
      {/* SIDEBAR */}
      <aside className="college-sidebar">
        <div className="college-logo">
          <div className="logo-icon">🚜</div>
          <div>
            <h2>FarmIntern</h2>
            <span>Farmer Partner</span>
          </div>
        </div>

        <nav className="college-nav">
          <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>
            <span>▦</span>
            Dashboard
          </button>
          <button className={activeTab === "internships" ? "active" : ""} onClick={() => setActiveTab("internships")}>
            <span>🌱</span>
            My Internships
          </button>
          <button className={activeTab === "applicants" ? "active" : ""} onClick={() => setActiveTab("applicants")}>
            <span>👨‍🎓</span>
            Student Applicants
          </button>
          <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
            <span>🏡</span>
            Farm Profile
          </button>
          <button onClick={() => navigateToRole("/communication")}>
            <span>💬</span>
            Communication
          </button>
        </nav>

        <div className="college-sidebar-bottom">
          <div className="college-user">
            <div className="user-avatar" style={{ background: "#16a34a" }}>GV</div>
            <div>
              <strong>Green Valley Farms</strong>
              <span>Guntur, AP</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="college-main">
        {/* TOPBAR */}
        <header className="college-topbar">
          <div>
            <p className="welcome-text">Farm Partner Portal 👋</p>
            <h1>
              {activeTab === "overview" && "Farm Partner Overview"}
              {activeTab === "internships" && "Manage Farm Internships"}
              {activeTab === "applicants" && "Student Applications"}
              {activeTab === "profile" && "Green Valley Farm Profile"}
            </h1>
          </div>

          <div className="topbar-actions">
            {/* PORTAL SWITCHER */}
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
                className="portal-badge-btn"
                onClick={() => navigateToRole("/student")}
                style={{ padding: "6px 12px", borderRadius: "20px", border: "1px solid #e5e7eb", background: "#ffffff", color: "#374151", fontWeight: 500, fontSize: "12px", cursor: "pointer" }}
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
                className="portal-badge-btn active"
                onClick={() => navigateToRole("/farmer")}
                style={{ padding: "6px 12px", borderRadius: "20px", border: "1px solid #16a34a", background: "#f0fdf4", color: "#15803d", fontWeight: 600, fontSize: "12px", cursor: "pointer" }}
              >
                🚜 Farmer
              </button>
            </div>

            <button className="notification-btn" onClick={() => navigateToRole("/communication")}>
              🔔
              <span></span>
            </button>

            <div className="college-admin-avatar" style={{ background: "#16a34a" }}>GV</div>
          </div>
        </header>

        {activeTab === "overview" && (
          <>
            <section className="hero-section" style={{ background: "linear-gradient(135deg, #14532d 0%, #16a34a 100%)" }}>
              <div>
                <span className="hero-label" style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>FARM PARTNER PORTAL</span>
                <h2>Empower agricultural students with hands-on farm experience.</h2>
                <p>Post seasonal internships, evaluate student applicants, and manage field learning programs.</p>
                <button className="hero-button" onClick={() => setActiveTab("internships")}>
                  Post New Internship +
                </button>
              </div>
              <div className="hero-illustration">🏡</div>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon green">🌱</div>
                <div>
                  <span>Active Internships</span>
                  <h2>{postedInternships.length}</h2>
                  <small>Currently open</small>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon blue">👨‍🎓</div>
                <div>
                  <span>Total Applicants</span>
                  <h2>{applicants.length}</h2>
                  <small>Registered students</small>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple">✓</div>
                <div>
                  <span>Approved Interns</span>
                  <h2>{applicants.filter((a) => a.status === "Approved").length}</h2>
                  <small>Active on farm</small>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === "internships" && (
          <section className="page-section">
            <div className="page-title">
              <h2>My Posted Internships</h2>
              <p>Manage active farm internships and requirements.</p>
            </div>

            <div className="student-grid">
              {postedInternships.map((item) => (
                <div className="student-card" key={item.id}>
                  <div className="student-card-top">
                    <div className="big-avatar" style={{ background: "#dcfce7", color: "#15803d" }}>🌱</div>
                    <span className="status ongoing">{item.status}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>Stipend: {item.stipend}</p>
                  <p>Applicants: {item.applicants} students</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "applicants" && (
          <section className="page-section">
            <div className="page-title">
              <h2>Student Applications</h2>
              <p>Review and verify student internship requests.</p>
            </div>

            <div className="dashboard-panel full-panel">
              <div className="activity-list">
                {applicants.map((app) => (
                  <div className="activity-item" key={app.id} style={{ alignItems: "center" }}>
                    <div className="activity-avatar" style={{ background: "#dcfce7", color: "#166534" }}>👨‍🎓</div>
                    <div className="activity-content" style={{ flex: 1 }}>
                      <strong>{app.student} ({app.rollNo})</strong>
                      <p>{app.college} · Applied {app.appliedDate}</p>
                    </div>
                    <div>
                      {app.status === "Pending" ? (
                        <button
                          className="details-button"
                          onClick={() => approveApplicant(app.id)}
                          style={{ background: "#16a34a", color: "#fff", border: "none" }}
                        >
                          Approve Student
                        </button>
                      ) : (
                        <span className="status completed">Approved</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === "profile" && (
          <section className="page-section">
            <div className="page-title">
              <h2>Green Valley Farms Profile</h2>
              <p>Verified Farm Partner Information.</p>
            </div>

            <div className="dashboard-panel full-panel">
              <h3>Green Valley Organic Farms</h3>
              <p>Location: Guntur District, Andhra Pradesh</p>
              <p>Specialties: Organic Crop Cultivation, Hydroponics, Drip Irrigation</p>
              <p>Status: Verified Partner ✅</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default FarmerPage;
