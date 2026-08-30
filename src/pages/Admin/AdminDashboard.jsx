import React, { useState } from "react";
import "./Admin.css";
import AdminDashboardView from "./AdminDashboardView";
import ManageUsersView from "./ManageUsersView";
import FarmPartnersView from "./FarmPartnersView";
import CollegesView from "./CollegesView";
import AnalyticsView from "./AnalyticsView";
import SettingsView from "./SettingsView";

function AdminDashboard({ onLogout }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationList = [
    { id: 1, text: "Sunrise Organic Farms applied for farm partner verification.", time: "10m ago" },
    { id: 2, text: "Rgukt College registered 12 new student accounts.", time: "2h ago" },
    { id: 3, text: "System security scan completed with 0 errors.", time: "1d ago" }
  ];

  const handleLogoutClick = () => {
    sessionStorage.removeItem("admin_authenticated");
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = "/";
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case "dashboard":
        return "Admin Dashboard";
      case "users":
        return "Manage Users";
      case "farms":
        return "Farm Partners";
      case "colleges":
        return "Colleges & Universities";
      case "analytics":
        return "Platform Analytics";
      case "settings":
        return "System Settings";
      default:
        return "Admin Overview";
    }
  };

  return (
    <div className="admin-dashboard">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <div className="admin-logo-icon">🌱</div>
          <div>
            <h2>FarmIntern</h2>
            <span>Admin Portal</span>
          </div>
        </div>

        <nav className="admin-nav">
          <button
            className={activeSection === "dashboard" ? "active" : ""}
            onClick={() => setActiveSection("dashboard")}
          >
            <span className="nav-icon">▦</span>
            <span>Dashboard</span>
          </button>

          <button
            className={activeSection === "users" ? "active" : ""}
            onClick={() => setActiveSection("users")}
          >
            <span className="nav-icon">👥</span>
            <span>Manage Users</span>
          </button>

          <button
            className={activeSection === "farms" ? "active" : ""}
            onClick={() => setActiveSection("farms")}
          >
            <span className="nav-icon">🏡</span>
            <span>Farm Partners</span>
          </button>

          <button
            className={activeSection === "colleges" ? "active" : ""}
            onClick={() => setActiveSection("colleges")}
          >
            <span className="nav-icon">🏫</span>
            <span>Colleges</span>
          </button>

          <button
            className={activeSection === "analytics" ? "active" : ""}
            onClick={() => setActiveSection("analytics")}
          >
            <span className="nav-icon">📊</span>
            <span>Analytics</span>
          </button>

          <button
            className={activeSection === "settings" ? "active" : ""}
            onClick={() => setActiveSection("settings")}
          >
            <span className="nav-icon">⚙️</span>
            <span>Settings</span>
          </button>
        </nav>

        <div className="admin-sidebar-bottom">
          <button
            onClick={handleLogoutClick}
            className="admin-logout-sidebar-btn"
          >
            <span>🚪</span>
            <span>Logout Secret Portal</span>
          </button>

          <div className="admin-user">
            <div className="admin-avatar">A</div>
            <div className="admin-user-info">
              <strong>Super Admin</strong>
              <span>admin@farmintern.org</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN LAYOUT CONTENT */}
      <main className="admin-main">
        {/* TOP BAR */}
        <header className="admin-topbar">
          <div>
            <p className="welcome-text">Platform Administration Panel 👋</p>
            <h1>{getSectionTitle()}</h1>
          </div>

          <div className="topbar-actions">
            {/* PORTAL SWITCHER */}
            <div className="portal-switcher" style={{ display: "flex", gap: "8px", alignItems: "center", marginRight: "12px" }}>
              <button
                type="button"
                className="portal-badge-btn"
                onClick={() => {
                  window.history.pushState({}, "", "/");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                style={{ padding: "6px 12px", borderRadius: "20px", border: "1px solid #e5e7eb", background: "#ffffff", color: "#374151", fontWeight: 500, fontSize: "12px", cursor: "pointer" }}
              >
                🏫 College
              </button>
              <button
                type="button"
                className="portal-badge-btn"
                onClick={() => {
                  window.history.pushState({}, "", "/student");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                style={{ padding: "6px 12px", borderRadius: "20px", border: "1px solid #e5e7eb", background: "#ffffff", color: "#374151", fontWeight: 500, fontSize: "12px", cursor: "pointer" }}
              >
                👨‍🎓 Student
              </button>
              <button
                type="button"
                className="portal-badge-btn"
                onClick={() => {
                  window.history.pushState({}, "", "/communication");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                style={{ padding: "6px 12px", borderRadius: "20px", border: "1px solid #e5e7eb", background: "#ffffff", color: "#374151", fontWeight: 500, fontSize: "12px", cursor: "pointer" }}
              >
                💬 Communication
              </button>
              <button
                type="button"
                className="portal-badge-btn"
                onClick={() => {
                  window.history.pushState({}, "", "/farmer");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                style={{ padding: "6px 12px", borderRadius: "20px", border: "1px solid #e5e7eb", background: "#ffffff", color: "#374151", fontWeight: 500, fontSize: "12px", cursor: "pointer" }}
              >
                🚜 Farmer
              </button>
              <button
                type="button"
                className="portal-badge-btn active"
                onClick={() => {
                  window.history.pushState({}, "", "/admin");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                style={{ padding: "6px 12px", borderRadius: "20px", border: "1px solid #6366f1", background: "#eef2ff", color: "#4338ca", fontWeight: 600, fontSize: "12px", cursor: "pointer" }}
              >
                ⚙️ Admin
              </button>
            </div>

            {/* SEARCH */}
            <div className="search-input-wrapper">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Global admin search..."
              />
            </div>

            {/* NOTIFICATION BUTTON */}
            <div style={{ position: "relative" }}>
              <button
                className="notification-btn"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (unreadNotifications > 0) setUnreadNotifications(0);
                }}
                title="Notifications"
              >
                🔔
                {unreadNotifications > 0 && <span className="pulse-dot"></span>}
              </button>

              {/* NOTIFICATION DROPDOWN */}
              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-dropdown-header">
                    <strong>Notifications</strong>
                    <span onClick={() => setUnreadNotifications(0)}>Mark all read</span>
                  </div>
                  <div className="notification-dropdown-list">
                    {notificationList.map((n) => (
                      <div key={n.id} className="notification-item">
                        <p>{n.text}</p>
                        <span>{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* USER BADGE & LOGOUT */}
            <div className="topbar-user-badge">
              <div className="admin-avatar" style={{ width: "32px", height: "32px", fontSize: "13px" }}>
                SA
              </div>
              <strong>System Admin</strong>
              <button
                onClick={handleLogoutClick}
                className="topbar-logout-btn"
                title="Logout from Admin Portal"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* SECTION ROUTING */}
        {activeSection === "dashboard" && (
          <AdminDashboardView onNavigateToUsers={() => setActiveSection("users")} />
        )}

        {activeSection === "users" && <ManageUsersView />}

        {activeSection === "farms" && <FarmPartnersView />}

        {activeSection === "colleges" && <CollegesView />}

        {activeSection === "analytics" && <AnalyticsView />}

        {activeSection === "settings" && <SettingsView />}
      </main>
    </div>
  );
}

export default AdminDashboard;
