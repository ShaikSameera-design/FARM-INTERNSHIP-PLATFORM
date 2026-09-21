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
              <span>Rgukt College</span>
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
