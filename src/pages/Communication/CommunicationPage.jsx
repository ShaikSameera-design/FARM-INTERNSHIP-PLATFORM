import "../College/College.css";
import CommunicationSection from "./CommunicationSection";

function CommunicationPage() {
  const navigate = (path) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="college-dashboard">
      <aside className="college-sidebar">
        <div className="college-logo">
          <div className="logo-icon">🌱</div>
          <div>
            <h2>FarmIntern</h2>
            <span>College Portal</span>
          </div>
        </div>

        <nav className="college-nav">
          <button className="" onClick={() => navigate("/")}>
            <span>▦</span>
            Dashboard
          </button>
          <button className="" onClick={() => navigate("/")}>
            <span>🏫</span>
            College Profile
          </button>
          <button className="" onClick={() => navigate("/")}>
            <span>👨‍🎓</span>
            Student Activities
          </button>
          <button className="" onClick={() => navigate("/")}>
            <span>🏫</span>
            College Activities
          </button>
          <button className="" onClick={() => navigate("/")}>
            <span>🔔</span>
            Recent Activity
          </button>
          <button className="active" onClick={() => navigate("/communication")}>
            <span>💬</span>
            Communication
          </button>
        </nav>

        <div className="college-sidebar-bottom">
          <div className="college-user">
            <div className="user-avatar">C</div>
            <div>
              <strong>College Admin</strong>
              <span>ABC College</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="college-main">
        <header className="college-topbar">
          <div>
            <p className="welcome-text">Welcome back 👋</p>
            <h1>Communication Center</h1>
          </div>

          <div className="topbar-actions">
            <div className="portal-switcher" style={{ display: "flex", gap: "8px", alignItems: "center", marginRight: "12px" }}>
              <button
                type="button"
                className="portal-badge-btn"
                onClick={() => navigate("/")}
                style={{ padding: "6px 12px", borderRadius: "20px", border: "1px solid #e5e7eb", background: "#ffffff", color: "#374151", fontWeight: 500, fontSize: "12px", cursor: "pointer" }}
              >
                🏫 College
              </button>
              <button
                type="button"
                className="portal-badge-btn"
                onClick={() => navigate("/student")}
                style={{ padding: "6px 12px", borderRadius: "20px", border: "1px solid #e5e7eb", background: "#ffffff", color: "#374151", fontWeight: 500, fontSize: "12px", cursor: "pointer" }}
              >
                👨‍🎓 Student
              </button>
              <button
                type="button"
                className="portal-badge-btn active"
                onClick={() => navigate("/communication")}
                style={{ padding: "6px 12px", borderRadius: "20px", border: "1px solid #10b981", background: "#ecfdf5", color: "#047857", fontWeight: 600, fontSize: "12px", cursor: "pointer" }}
              >
                💬 Communication
              </button>
              <button
                type="button"
                className="portal-badge-btn"
                onClick={() => navigate("/farmer")}
                style={{ padding: "6px 12px", borderRadius: "20px", border: "1px solid #e5e7eb", background: "#ffffff", color: "#374151", fontWeight: 500, fontSize: "12px", cursor: "pointer" }}
              >
                🚜 Farmer
              </button>
            </div>
            <button className="notification-btn" type="button">
              🔔
              <span></span>
            </button>
            <div className="college-admin-avatar">C</div>
          </div>
        </header>

        <section className="page-section">
          <div className="page-title">
            <h2>Communication Center</h2>
            <p>Manage alerts, feedback, and internship updates.</p>
          </div>
          <CommunicationSection />
        </section>
      </main>
    </div>
  );
}

export default CommunicationPage;
