import React, { useState } from "react";

function SettingsView() {
  const [activeTab, setActiveTab] = useState("general");
  const [toastMessage, setToastMessage] = useState(null);

  const [generalSettings, setGeneralSettings] = useState({
    platformName: "Farm Internship Platform",
    adminEmail: "admin@farmintern.org",
    supportPhone: "+91 1800 425 8000",
    maintenanceMode: false,
    autoVerifyColleges: false,
    autoVerifyFarmers: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: "30",
    require2FA: true,
    ipWhitelisting: false,
    minPasswordLength: "8"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailOnNewUser: true,
    emailOnVerification: true,
    weeklyReport: true,
    smsAlerts: false
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    showToast("✓ Platform General Settings updated successfully!");
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    showToast("✓ Security & Authentication Policies saved!");
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    showToast("✓ Notification Preferences saved!");
  };

  const handleRunBackup = () => {
    showToast("⚡ Full system database backup initiated...");
  };

  return (
    <div className="admin-page-view">
      {toastMessage && <div className="admin-toast">{toastMessage}</div>}

      {/* PAGE HEADER */}
      <div className="admin-page-header">
        <div>
          <h2>System Control & Settings</h2>
          <p>Configure platform preferences, security policies, automated rules, and system backups.</p>
        </div>
      </div>

      {/* TABS */}
      <div className="users-filter-bar">
        <div className="role-tabs">
          <button
            className={`role-tab-btn ${activeTab === "general" ? "active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            ⚙️ General Settings
          </button>
          <button
            className={`role-tab-btn ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            🛡️ Security & Access
          </button>
          <button
            className={`role-tab-btn ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            🔔 Notifications & Alerts
          </button>
          <button
            className={`role-tab-btn ${activeTab === "backup" ? "active" : ""}`}
            onClick={() => setActiveTab("backup")}
          >
            💾 System Backups
          </button>
        </div>
      </div>

      {/* TAB CONTENT: GENERAL */}
      {activeTab === "general" && (
        <section className="admin-panel" style={{ maxWidth: "720px" }}>
          <div className="panel-header">
            <div>
              <h3>General Platform Parameters</h3>
              <p>Basic organization branding and verification defaults</p>
            </div>
          </div>

          <form onSubmit={handleSaveGeneral}>
            <div className="modal-form-grid" style={{ gap: "20px" }}>
              <div className="form-group full-width">
                <label>Platform Name</label>
                <input
                  type="text"
                  value={generalSettings.platformName}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, platformName: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>System Administrator Email</label>
                <input
                  type="email"
                  value={generalSettings.adminEmail}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, adminEmail: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Support Helpline Number</label>
                <input
                  type="text"
                  value={generalSettings.supportPhone}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, supportPhone: e.target.value })
                  }
                />
              </div>

              <div className="form-group full-width" style={{ marginTop: "10px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={generalSettings.maintenanceMode}
                    onChange={(e) =>
                      setGeneralSettings({ ...generalSettings, maintenanceMode: e.target.checked })
                    }
                    style={{ width: "18px", height: "18px", accentColor: "#e53935" }}
                  />
                  <div>
                    <strong style={{ color: "#d32f2f" }}>Enable Platform Maintenance Mode</strong>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#6a796e" }}>
                      Prevents public access while performing database updates or upgrades.
                    </p>
                  </div>
                </label>
              </div>

              <div className="form-group full-width">
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={generalSettings.autoVerifyColleges}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        autoVerifyColleges: e.target.checked
                      })
                    }
                    style={{ width: "18px", height: "18px", accentColor: "#258145" }}
                  />
                  <div>
                    <strong>Auto-approve College Registrations</strong>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#6a796e" }}>
                      Automatically verify new accounts registered with accredited .edu domain emails.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div style={{ marginTop: "24px" }}>
              <button type="submit" className="btn-submit">
                Save General Settings
              </button>
            </div>
          </form>
        </section>
      )}

      {/* TAB CONTENT: SECURITY */}
      {activeTab === "security" && (
        <section className="admin-panel" style={{ maxWidth: "720px" }}>
          <div className="panel-header">
            <div>
              <h3>Security & Authentication Policies</h3>
              <p>Configure password rules, session timeouts, and admin 2FA</p>
            </div>
          </div>

          <form onSubmit={handleSaveSecurity}>
            <div className="modal-form-grid" style={{ gap: "20px" }}>
              <div className="form-group">
                <label>Admin Session Timeout (Minutes)</label>
                <select
                  value={securitySettings.sessionTimeout}
                  onChange={(e) =>
                    setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })
                  }
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">60 Minutes</option>
                </select>
              </div>

              <div className="form-group">
                <label>Minimum Password Length</label>
                <select
                  value={securitySettings.minPasswordLength}
                  onChange={(e) =>
                    setSecuritySettings({ ...securitySettings, minPasswordLength: e.target.value })
                  }
                >
                  <option value="8">8 Characters</option>
                  <option value="10">10 Characters</option>
                  <option value="12">12 Characters</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={securitySettings.require2FA}
                    onChange={(e) =>
                      setSecuritySettings({ ...securitySettings, require2FA: e.target.checked })
                    }
                    style={{ width: "18px", height: "18px", accentColor: "#258145" }}
                  />
                  <div>
                    <strong>Mandatory 2FA for Admin Accounts</strong>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#6a796e" }}>
                      Require TOTP or SMS verification for secret portal logins.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div style={{ marginTop: "24px" }}>
              <button type="submit" className="btn-submit">
                Save Security Settings
              </button>
            </div>
          </form>
        </section>
      )}

      {/* TAB CONTENT: NOTIFICATIONS */}
      {activeTab === "notifications" && (
        <section className="admin-panel" style={{ maxWidth: "720px" }}>
          <div className="panel-header">
            <div>
              <h3>Notification & Alert Rules</h3>
              <p>Manage system notifications sent to administrators</p>
            </div>
          </div>

          <form onSubmit={handleSaveNotifications}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={notificationSettings.emailOnNewUser}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailOnNewUser: e.target.checked
                    })
                  }
                  style={{ width: "18px", height: "18px", accentColor: "#258145" }}
                />
                <div>
                  <strong>Email alert on new registration request</strong>
                  <p style={{ margin: 0, fontSize: "12px", color: "#6a796e" }}>
                    Receive instant email when a farmer or college requests verification.
                  </p>
                </div>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={notificationSettings.weeklyReport}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      weeklyReport: e.target.checked
                    })
                  }
                  style={{ width: "18px", height: "18px", accentColor: "#258145" }}
                />
                <div>
                  <strong>Weekly Platform Digest Report</strong>
                  <p style={{ margin: 0, fontSize: "12px", color: "#6a796e" }}>
                    Weekly PDF summary of student applications and farm host counts.
                  </p>
                </div>
              </label>
            </div>

            <div style={{ marginTop: "24px" }}>
              <button type="submit" className="btn-submit">
                Save Notification Preferences
              </button>
            </div>
          </form>
        </section>
      )}

      {/* TAB CONTENT: BACKUP */}
      {activeTab === "backup" && (
        <section className="admin-panel" style={{ maxWidth: "720px" }}>
          <div className="panel-header">
            <div>
              <h3>Database Backups & Recovery</h3>
              <p>Manage automated snapshots and perform manual backups</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                background: "#f4f8f5",
                border: "1px solid #d8e5db",
                borderRadius: "12px",
                padding: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <strong style={{ fontSize: "14px", color: "#19281e" }}>Automated Daily Backup</strong>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#6a796e" }}>
                  Last snapshot: Today at 03:00 AM (Size: 42.8 MB)
                </p>
              </div>
              <span className="status-badge active">Status: Active</span>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button className="btn-submit" onClick={handleRunBackup}>
                💾 Run Immediate Backup
              </button>
              <button
                className="btn-cancel"
                onClick={() => showToast("Exporting SQL Database Dump...")}
              >
                📥 Export SQL Dump
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default SettingsView;
