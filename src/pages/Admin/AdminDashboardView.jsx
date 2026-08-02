import React, { useState } from "react";

function AdminDashboardView({ onNavigateToUsers }) {
  // Pending verification queue state
  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: 101,
      name: "Sunrise Organic Farms",
      applicant: "Ramesh Farmer",
      type: "Farmer",
      location: "Guntur, AP",
      submittedDate: "2 hours ago",
      email: "ramesh@sunrisefarms.org",
      phone: "+91 98765 43210"
    },
    {
      id: 102,
      name: "Sri Venkateswara Agricultural College",
      applicant: "Dr. K. S. Rao",
      type: "College",
      location: "Tirupati, AP",
      submittedDate: "5 hours ago",
      email: "principal@svagri.edu",
      phone: "+91 94401 12233"
    },
    {
      id: 103,
      name: "Green Horizon Dairy & Agro",
      applicant: "Suresh Reddy",
      type: "Farmer",
      location: "Vijayawada, AP",
      submittedDate: "Yesterday",
      email: "contact@greenhorizon.in",
      phone: "+91 91234 56789"
    },
    {
      id: 104,
      name: "National Institute of Agri Tech",
      applicant: "Prof. Anitha Sharma",
      type: "College",
      location: "Hyderabad, TS",
      submittedDate: "2 days ago",
      email: "admin@niat.edu.in",
      phone: "+91 98888 77766"
    }
  ]);

  // Selected approval item modal
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // System audit activities
  const [activities] = useState([
    {
      id: 1,
      title: "New Farmer Registration",
      description: "Sunrise Organic Farms submitted documents for platform verification.",
      time: "10 mins ago",
      icon: "🌾",
      category: "registration"
    },
    {
      id: 2,
      title: "College Account Verified",
      description: "ABC Engineering College verification approved by Admin.",
      time: "2 hours ago",
      icon: "✓",
      category: "approval"
    },
    {
      id: 3,
      title: "Internship Placement Confirmed",
      description: "15 Students assigned to Green Valley Farms for Organic Agriculture.",
      time: "4 hours ago",
      icon: "👨‍🎓",
      category: "placement"
    },
    {
      id: 4,
      title: "System Audit Checklist Passed",
      description: "Monthly data backup and security audit executed successfully.",
      time: "1 day ago",
      icon: "🛡️",
      category: "system"
    }
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApprove = (id, name) => {
    setPendingApprovals(pendingApprovals.filter((item) => item.id !== id));
    if (selectedApproval && selectedApproval.id === id) setSelectedApproval(null);
    showToast(`✓ Approved ${name} successfully!`);
  };

  const handleReject = (id, name) => {
    setPendingApprovals(pendingApprovals.filter((item) => item.id !== id));
    if (selectedApproval && selectedApproval.id === id) setSelectedApproval(null);
    showToast(`Rejected ${name}`);
  };

  return (
    <div className="admin-dashboard-view">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          background: "#122c1b",
          color: "#ffffff",
          padding: "12px 20px",
          borderRadius: "10px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          zIndex: 1000,
          fontWeight: 600,
          fontSize: "13px"
        }}>
          {toastMessage}
        </div>
      )}

      {/* HERO BANNER */}
      <section className="admin-hero-section">
        <div>
          <span className="hero-tag">PLATFORM CONTROL CENTER</span>
          <h2>Farm Internship Control Center</h2>
          <p>
            Oversee user registrations, verify partner farms & colleges, monitor student internship progress, and maintain platform security.
          </p>
          <div className="hero-actions-row">
            <button className="hero-primary-btn" onClick={onNavigateToUsers}>
              👥 Manage All Users →
            </button>
            <button
              className="hero-secondary-btn"
              onClick={() => showToast("System health status: 100% Operational")}
            >
              ⚡ Run System Audit
            </button>
          </div>
        </div>
        <div className="hero-icon-graphic">🏛️</div>
      </section>

      {/* 5 KPI STAT CARDS */}
      <section className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-header">
            <div className="stat-icon green">👥</div>
            <span className="stat-trend up">+14%</span>
          </div>
          <div className="stat-body">
            <span>Total Platform Users</span>
            <h2>148</h2>
            <small>Students, Farmers, Colleges</small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-header">
            <div className="stat-icon blue">🌱</div>
            <span className="stat-trend up">+8%</span>
          </div>
          <div className="stat-body">
            <span>Active Internships</span>
            <h2>42</h2>
            <small>Ongoing farm placements</small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-header">
            <div className="stat-icon purple">🏡</div>
            <span className="stat-trend up">+5 new</span>
          </div>
          <div className="stat-body">
            <span>Registered Farms</span>
            <h2>38</h2>
            <small>Verified farm hosts</small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-header">
            <div className="stat-icon amber">🏫</div>
            <span className="stat-trend up">+2 new</span>
          </div>
          <div className="stat-body">
            <span>Affiliated Colleges</span>
            <h2>15</h2>
            <small>Educational partners</small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-header">
            <div className="stat-icon rose">⏳</div>
            <span className="stat-trend warning">Action Needed</span>
          </div>
          <div className="stat-body">
            <span>Pending Verifications</span>
            <h2>{pendingApprovals.length}</h2>
            <small>Awaiting admin review</small>
          </div>
        </div>
      </section>

      {/* GRID LAYOUT: PENDING APPROVALS & USER DISTRIBUTION */}
      <div className="admin-grid-two">
        {/* PENDING APPROVALS PANEL */}
        <section className="admin-panel">
          <div className="panel-header">
            <div>
              <h3>Pending Account Verifications</h3>
              <p>Review and verify newly registered farmers and colleges</p>
            </div>
            <span style={{ fontSize: "12px", color: "#6a796e", fontWeight: 600 }}>
              {pendingApprovals.length} Pending
            </span>
          </div>

          <div className="approvals-table-wrapper">
            {pendingApprovals.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 0", color: "#7a8a80" }}>
                ✓ All pending account verifications have been processed!
              </div>
            ) : (
              <table className="approvals-table">
                <thead>
                  <tr>
                    <th>Organization / Name</th>
                    <th>Role</th>
                    <th>Location</th>
                    <th>Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingApprovals.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-cell-avatar">
                            {item.name.charAt(0)}
                          </div>
                          <div className="user-cell-info">
                            <strong>{item.name}</strong>
                            <span>{item.applicant}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge ${item.type.toLowerCase()}`}>
                          {item.type}
                        </span>
                      </td>
                      <td style={{ color: "#56665b" }}>{item.location}</td>
                      <td style={{ color: "#7d8c82", fontSize: "12px" }}>{item.submittedDate}</td>
                      <td>
                        <div className="table-action-btns">
                          <button
                            className="action-approve-btn"
                            title="Approve verification"
                            onClick={() => handleApprove(item.id, item.name)}
                          >
                            Approve
                          </button>
                          <button
                            className="action-reject-btn"
                            title="Reject request"
                            onClick={() => handleReject(item.id, item.name)}
                          >
                            Reject
                          </button>
                          <button
                            className="table-details-btn"
                            onClick={() => setSelectedApproval(item)}
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* USER ROLE & INTERNSHIP DISTRIBUTION */}
        <section className="admin-panel">
          <div className="panel-header">
            <div>
              <h3>User & Platform Breakdown</h3>
              <p>Current distribution across platform roles</p>
            </div>
          </div>

          <div className="distribution-list">
            <div className="distribution-item">
              <div className="distribution-labels">
                <strong>Students</strong>
                <span>88 Users (59%)</span>
              </div>
              <div className="distribution-bar">
                <div className="distribution-fill students" style={{ width: "59%" }}></div>
              </div>
            </div>

            <div className="distribution-item">
              <div className="distribution-labels">
                <strong>Farmers & Farm Hosts</strong>
                <span>38 Users (26%)</span>
              </div>
              <div className="distribution-bar">
                <div className="distribution-fill farmers" style={{ width: "26%" }}></div>
              </div>
            </div>

            <div className="distribution-item">
              <div className="distribution-labels">
                <strong>Colleges & Institutions</strong>
                <span>15 Users (10%)</span>
              </div>
              <div className="distribution-bar">
                <div className="distribution-fill colleges" style={{ width: "10%" }}></div>
              </div>
            </div>

            <div className="distribution-item">
              <div className="distribution-labels">
                <strong>System Administrators</strong>
                <span>7 Users (5%)</span>
              </div>
              <div className="distribution-bar">
                <div className="distribution-fill admins" style={{ width: "5%" }}></div>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: "24px",
            paddingTop: "16px",
            borderTop: "1px solid #edf2ee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <strong style={{ fontSize: "13px", display: "block" }}>Platform Health</strong>
              <span style={{ fontSize: "11px", color: "#6a796e" }}>All systems operational</span>
            </div>
            <span style={{
              background: "#e6f7ec",
              color: "#1e793d",
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 700
            }}>
              ● 99.9% Uptime
            </span>
          </div>
        </section>
      </div>

      {/* FULL WIDTH SYSTEM ACTIVITY & AUDIT LOG */}
      <section className="admin-panel full-width">
        <div className="panel-header">
          <div>
            <h3>System Activity & Audit Log</h3>
            <p>Chronological feed of administrative and system-wide events</p>
          </div>
          <button
            className="link-btn"
            onClick={() => showToast("Exporting system audit logs...")}
          >
            Export Logs 📥
          </button>
        </div>

        <div className="activity-feed-list">
          {activities.map((act) => (
            <div className="activity-feed-item" key={act.id}>
              <div className="activity-icon-bubble">{act.icon}</div>
              <div className="activity-feed-content">
                <strong>{act.title}</strong>
                <p>{act.description}</p>
                <small>{act.time}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* APPROVAL DETAILS MODAL */}
      {selectedApproval && (
        <div className="modal-overlay" onClick={() => setSelectedApproval(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setSelectedApproval(null)}>
              ×
            </button>
            <h3>Verification Request Details</h3>
            <p className="modal-subtitle">Review organization details before approving or rejecting</p>

            <div className="detail-info-grid">
              <div className="detail-item">
                <span>Organization / Name</span>
                <strong>{selectedApproval.name}</strong>
              </div>
              <div className="detail-item">
                <span>Contact Person</span>
                <strong>{selectedApproval.applicant}</strong>
              </div>
              <div className="detail-item">
                <span>Account Role</span>
                <strong style={{ color: "#258145" }}>{selectedApproval.type}</strong>
              </div>
              <div className="detail-item">
                <span>Location</span>
                <strong>{selectedApproval.location}</strong>
              </div>
              <div className="detail-item">
                <span>Email Address</span>
                <strong>{selectedApproval.email}</strong>
              </div>
              <div className="detail-item">
                <span>Phone Number</span>
                <strong>{selectedApproval.phone}</strong>
              </div>
            </div>

            <div className="modal-footer-btns">
              <button
                className="btn-cancel"
                onClick={() => handleReject(selectedApproval.id, selectedApproval.name)}
              >
                Reject Request
              </button>
              <button
                className="btn-submit"
                onClick={() => handleApprove(selectedApproval.id, selectedApproval.name)}
              >
                Approve & Verify Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardView;
