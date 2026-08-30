import React, { useState } from "react";

function ManageUsersView() {
  // Mock users database state
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Anjali Reddy",
      email: "anjali.reddy@Rguktcollege.edu",
      role: "Student",
      organization: "Rgukt Engineering College",
      phone: "+91 98765 11111",
      joinDate: "12 May 2026",
      status: "Active",
      internship: "Organic Farming Placement"
    },
    {
      id: 2,
      name: "Ramesh Farmer",
      email: "ramesh@sunrisefarms.org",
      role: "Farmer",
      organization: "Sunrise Organic Farms",
      phone: "+91 98765 43210",
      joinDate: "01 Jun 2026",
      status: "Pending",
      internship: "Host Farm Partner"
    },
    {
      id: 3,
      name: "Dr. K. S. Rao",
      email: "principal@svagri.edu",
      role: "College",
      organization: "SV Agricultural College",
      phone: "+91 94401 12233",
      joinDate: "15 Apr 2026",
      status: "Active",
      internship: "Institutional Representative"
    },
    {
      id: 4,
      name: "Ravi Teja",
      email: "ravi.teja@Rguktcollege.edu",
      role: "Student",
      organization: "Rgukt Engineering College",
      phone: "+91 98765 22222",
      joinDate: "10 May 2026",
      status: "Active",
      internship: "Dairy Farming Placement"
    },
    {
      id: 5,
      name: "Suresh Reddy",
      email: "contact@greenhorizon.in",
      role: "Farmer",
      organization: "Green Horizon Agro",
      phone: "+91 91234 56789",
      joinDate: "20 May 2026",
      status: "Pending",
      internship: "Host Farm Partner"
    },
    {
      id: 6,
      name: "Meghana S",
      email: "meghana.s@Rguktcollege.edu",
      role: "Student",
      organization: "Rgukt Engineering College",
      phone: "+91 98765 33333",
      joinDate: "18 May 2026",
      status: "Suspended",
      internship: "Horticulture Placement"
    },
    {
      id: 7,
      name: "System Admin",
      email: "admin@farmintern.org",
      role: "Admin",
      organization: "FarmIntern HQ",
      phone: "+91 90000 00001",
      joinDate: "01 Jan 2026",
      status: "Active",
      internship: "System Administrator"
    },
    {
      id: 8,
      name: "Priya Kumar",
      email: "priya.k@Rguktcollege.edu",
      role: "Student",
      organization: "Rgukt Engineering College",
      phone: "+91 98765 44444",
      joinDate: "22 May 2026",
      status: "Active",
      internship: "Crop Management Placement"
    }
  ]);

  // Filtering State
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & Triggers
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // New User Form State
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Student",
    organization: "",
    status: "Active"
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter computation
  const filteredUsers = users.filter((u) => {
    const matchesRole =
      selectedRole === "All" ||
      (selectedRole === "Student" && u.role === "Student") ||
      (selectedRole === "Farmer" && u.role === "Farmer") ||
      (selectedRole === "College" && u.role === "College") ||
      (selectedRole === "Admin" && u.role === "Admin");

    const matchesStatus =
      selectedStatus === "All" || u.status.toLowerCase() === selectedStatus.toLowerCase();

    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.organization.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRole && matchesStatus && matchesSearch;
  });

  // Action handlers
  const handleToggleStatus = (user) => {
    const nextStatus =
      user.status === "Active" ? "Suspended" : user.status === "Pending" ? "Active" : "Active";
    setUsers(
      users.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
    );
    showToast(`Updated status of ${user.name} to ${nextStatus}`);
  };

  const handleDeleteUser = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      setUsers(users.filter((u) => u.id !== user.id));
      if (selectedUser && selectedUser.id === user.id) setSelectedUser(null);
      showToast(`User ${user.name} deleted`);
    }
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      alert("Please fill in required fields (Name & Email)");
      return;
    }
    const createdUser = {
      id: Date.now(),
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone || "+91 99999 00000",
      role: newUser.role,
      organization: newUser.organization || "Independent",
      joinDate: "Just now",
      status: newUser.status,
      internship: `${newUser.role} Account`
    };
    setUsers([createdUser, ...users]);
    setShowAddModal(false);
    setNewUser({
      name: "",
      email: "",
      phone: "",
      role: "Student",
      organization: "",
      status: "Active"
    });
    showToast(`✓ Added new user: ${createdUser.name}`);
  };

  return (
    <div className="manage-users-view">
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

      {/* PAGE HEADER */}
      <div className="users-page-header">
        <div className="users-page-title">
          <h2>Manage Users & Accounts</h2>
          <p>Full control to view, filter, add, verify, suspend, or remove platform users.</p>
        </div>
        <button className="add-user-btn" onClick={() => setShowAddModal(true)}>
          <span>+</span> Add New User
        </button>
      </div>

      {/* FILTERING & CONTROL BAR */}
      <div className="users-filter-bar">
        {/* ROLE TABS */}
        <div className="role-tabs">
          {["All", "Student", "Farmer", "College", "Admin"].map((role) => (
            <button
              key={role}
              className={`role-tab-btn ${selectedRole === role ? "active" : ""}`}
              onClick={() => setSelectedRole(role)}
            >
              {role === "All" ? "All Users" : `${role}s`} (
              {role === "All"
                ? users.length
                : users.filter((u) => u.role === role).length}
              )
            </button>
          ))}
        </div>

        {/* CONTROLS */}
        <div className="users-controls">
          <div className="search-input-wrapper">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search name, email, org..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="status-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Pending">Pending Only</option>
            <option value="Suspended">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* USERS DATA TABLE */}
      <div className="users-table-card">
        {filteredUsers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#79887e" }}>
            No users found matching your filter criteria.
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Organization / Institution</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-cell-avatar">
                        {user.name.charAt(0)}
                      </div>
                      <div className="user-cell-info">
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <strong style={{ fontSize: "13px", color: "#25362a" }}>
                      {user.organization}
                    </strong>
                  </td>
                  <td style={{ color: "#748579", fontSize: "12px" }}>{user.joinDate}</td>
                  <td>
                    <span className={`status-badge ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-action-btns">
                      <button
                        className="table-icon-btn"
                        title="View Full Profile"
                        onClick={() => setSelectedUser(user)}
                      >
                        👁️
                      </button>
                      <button
                        className="table-icon-btn"
                        title={
                          user.status === "Active"
                            ? "Suspend Account"
                            : "Activate Account"
                        }
                        onClick={() => handleToggleStatus(user)}
                      >
                        {user.status === "Active" ? "🔒" : "🔓"}
                      </button>
                      <button
                        className="table-icon-btn danger"
                        title="Delete User"
                        onClick={() => handleDeleteUser(user)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ADD NEW USER MODAL */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setShowAddModal(false)}>
              ×
            </button>
            <h3>Add New User</h3>
            <p className="modal-subtitle">Create a user account and assign platform permissions</p>

            <form onSubmit={handleAddUserSubmit}>
              <div className="modal-form-grid">
                <div className="form-group full-width">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="rajesh@example.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 00000"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="Student">Student</option>
                    <option value="Farmer">Farmer</option>
                    <option value="College">College Admin</option>
                    <option value="Admin">System Admin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Initial Status</label>
                  <select
                    value={newUser.status}
                    onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending Verification</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Organization / College / Farm Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Green Organic Farms / Rgukt College"
                    value={newUser.organization}
                    onChange={(e) => setNewUser({ ...newUser, organization: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer-btns">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Create User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USER DETAILS MODAL */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setSelectedUser(null)}>
              ×
            </button>

            <div className="user-profile-header">
              <div className="user-profile-avatar-big">
                {selectedUser.name.charAt(0)}
              </div>
              <div className="user-profile-meta">
                <h3>{selectedUser.name}</h3>
                <p>{selectedUser.email}</p>
                <span className={`role-badge ${selectedUser.role.toLowerCase()}`}>
                  {selectedUser.role} Account
                </span>
              </div>
            </div>

            <div className="detail-info-grid">
              <div className="detail-item">
                <span>Account Status</span>
                <strong className={`status-badge ${selectedUser.status.toLowerCase()}`}>
                  {selectedUser.status}
                </strong>
              </div>
              <div className="detail-item">
                <span>Phone Number</span>
                <strong>{selectedUser.phone}</strong>
              </div>
              <div className="detail-item">
                <span>Organization / Farm</span>
                <strong>{selectedUser.organization}</strong>
              </div>
              <div className="detail-item">
                <span>Join Date</span>
                <strong>{selectedUser.joinDate}</strong>
              </div>
              <div className="detail-item" style={{ gridColumn: "1 / -1" }}>
                <span>Associated Program / Activity</span>
                <strong>{selectedUser.internship}</strong>
              </div>
            </div>

            <div className="modal-footer-btns">
              <button
                className="btn-cancel"
                onClick={() => handleToggleStatus(selectedUser)}
              >
                {selectedUser.status === "Active" ? "Suspend Account" : "Activate Account"}
              </button>
              <button className="btn-submit" onClick={() => setSelectedUser(null)}>
                Close Profile View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsersView;
