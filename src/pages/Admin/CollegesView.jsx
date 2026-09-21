import React, { useState } from "react";

function CollegesView() {
  const [colleges, setColleges] = useState([
    {
      id: 1,
      name: "Rgukt Agricultural Engineering College",
      code: "Rgukt-AGRI-01",
      principal: "Dr. Anjali Reddy",
      phone: "+91 94401 55667",
      email: "principal@Rguktcollege.edu",
      location: "Guntur, AP",
      enrolledStudents: 42,
      activePlacements: 28,
      status: "Active",
      mouSigned: "15 Jan 2026"
    },
    {
      id: 2,
      name: "Sri Venkateswara Agricultural University",
      code: "SVAU-TIR-02",
      principal: "Dr. K. S. Rao",
      phone: "+91 94401 12233",
      email: "principal@svagri.edu",
      location: "Tirupati, AP",
      enrolledStudents: 35,
      activePlacements: 22,
      status: "Active",
      mouSigned: "10 Feb 2026"
    },
    {
      id: 3,
      name: "National Institute of Agri Tech",
      code: "NIAT-HYD-03",
      principal: "Prof. Anitha Sharma",
      phone: "+91 98888 77766",
      email: "admin@niat.edu.in",
      location: "Hyderabad, TS",
      enrolledStudents: 18,
      activePlacements: 12,
      status: "Pending MOU",
      mouSigned: "Under Review"
    },
    {
      id: 4,
      name: "AP University of Horticultural Sciences",
      code: "APUHS-VR-04",
      principal: "Dr. M. V. Ramana",
      phone: "+91 91212 33445",
      email: "info@apuhs.edu.in",
      location: "Venkaramannagudem, AP",
      enrolledStudents: 25,
      activePlacements: 16,
      status: "Active",
      mouSigned: "01 Mar 2026"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const [newCollege, setNewCollege] = useState({
    name: "",
    code: "",
    principal: "",
    email: "",
    phone: "",
    location: ""
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredColleges = colleges.filter((c) => {
    return (
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.principal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleAddCollegeSubmit = (e) => {
    e.preventDefault();
    if (!newCollege.name || !newCollege.principal) return;

    const collegeObj = {
      id: Date.now(),
      name: newCollege.name,
      code: newCollege.code || `COL-${Math.floor(100 + Math.random() * 900)}`,
      principal: newCollege.principal,
      phone: newCollege.phone || "+91 90000 00000",
      email: newCollege.email || "college@edu.in",
      location: newCollege.location || "Andhra Pradesh",
      enrolledStudents: 0,
      activePlacements: 0,
      status: "Active",
      mouSigned: "Just now"
    };

    setColleges([collegeObj, ...colleges]);
    setShowAddModal(false);
    setNewCollege({
      name: "",
      code: "",
      principal: "",
      email: "",
      phone: "",
      location: ""
    });
    showToast(`✓ Affiliated ${collegeObj.name}`);
  };

  return (
    <div className="admin-page-view">
      {toastMessage && <div className="admin-toast">{toastMessage}</div>}

      {/* PAGE HEADER */}
      <div className="admin-page-header">
        <div>
          <h2>Affiliated Colleges & Universities</h2>
          <p>Oversee educational institutional partnerships, MOU agreements, and student cohorts.</p>
        </div>
        <button className="add-user-btn" onClick={() => setShowAddModal(true)}>
          <span>+</span> Add Partner College
        </button>
      </div>

      {/* KPI STAT CARDS */}
      <div className="admin-stats-grid" style={{ marginBottom: "24px" }}>
        <div className="admin-stat-card">
          <div className="stat-header">
            <div className="stat-icon amber">🏫</div>
            <span className="stat-trend up">Partners</span>
          </div>
          <div className="stat-body">
            <span>Affiliated Institutions</span>
            <h2>{colleges.length}</h2>
            <small>Active educational MOUs</small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-header">
            <div className="stat-icon purple">👨‍🎓</div>
            <span className="stat-trend up">Enrolled</span>
          </div>
          <div className="stat-body">
            <span>Total Enrolled Students</span>
            <h2>{colleges.reduce((acc, c) => acc + c.enrolledStudents, 0)}</h2>
            <small>Registered student accounts</small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-header">
            <div className="stat-icon green">🌱</div>
            <span className="stat-trend up">Placements</span>
          </div>
          <div className="stat-body">
            <span>Active Placements</span>
            <h2>{colleges.reduce((acc, c) => acc + c.activePlacements, 0)}</h2>
            <small>Students currently on farm internships</small>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="users-filter-bar">
        <div className="search-input-wrapper" style={{ width: "320px" }}>
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search college name, principal, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* COLLEGES TABLE */}
      <div className="users-table-card">
        <table className="users-table">
          <thead>
            <tr>
              <th>Institution Name & Code</th>
              <th>Principal / Nodal Officer</th>
              <th>Location</th>
              <th>Enrolled Students</th>
              <th>MOU Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredColleges.map((college) => (
              <tr key={college.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-cell-avatar" style={{ background: "#fff6e5", color: "#d97706" }}>
                      🏫
                    </div>
                    <div className="user-cell-info">
                      <strong>{college.name}</strong>
                      <span>Code: {college.code}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <strong style={{ fontSize: "13px", color: "#19281e" }}>{college.principal}</strong>
                  <br />
                  <span style={{ fontSize: "11px", color: "#6f7d73" }}>{college.phone}</span>
                </td>
                <td style={{ color: "#455449", fontSize: "13px" }}>{college.location}</td>
                <td>
                  <strong style={{ color: "#19281e" }}>{college.enrolledStudents}</strong> Students
                  <br />
                  <span style={{ fontSize: "11px", color: "#258145" }}>{college.activePlacements} Active Placements</span>
                </td>
                <td>
                  <span className={`status-badge ${college.status === "Active" ? "active" : "pending"}`}>
                    {college.status}
                  </span>
                </td>
                <td>
                  <div className="table-action-btns">
                    <button
                      className="table-details-btn"
                      onClick={() => setSelectedCollege(college)}
                    >
                      View Profile
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD COLLEGE MODAL */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setShowAddModal(false)}>×</button>
            <h3>Add Partner College / University</h3>
            <p className="modal-subtitle">Register educational partner for student internship programs</p>

            <form onSubmit={handleAddCollegeSubmit}>
              <div className="modal-form-grid">
                <div className="form-group full-width">
                  <label>College / University Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. State Agricultural University"
                    value={newCollege.name}
                    onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Institutional Code</label>
                  <input
                    type="text"
                    placeholder="e.g. SAU-2026"
                    value={newCollege.code}
                    onChange={(e) => setNewCollege({ ...newCollege, code: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Principal / Nodal Officer *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ramesh Chander"
                    value={newCollege.principal}
                    onChange={(e) => setNewCollege({ ...newCollege, principal: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Official Email</label>
                  <input
                    type="email"
                    placeholder="principal@college.edu"
                    value={newCollege.email}
                    onChange={(e) => setNewCollege({ ...newCollege, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 94400 00000"
                    value={newCollege.phone}
                    onChange={(e) => setNewCollege({ ...newCollege, phone: e.target.value })}
                  />
                </div>

                <div className="form-group full-width">
                  <label>City & State Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Tirupati, Andhra Pradesh"
                    value={newCollege.location}
                    onChange={(e) => setNewCollege({ ...newCollege, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer-btns">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Save & Affiliate Institution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILS MODAL */}
      {selectedCollege && (
        <div className="modal-overlay" onClick={() => setSelectedCollege(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setSelectedCollege(null)}>×</button>
            <h3>{selectedCollege.name}</h3>
            <p className="modal-subtitle">Affiliated Institution Record</p>

            <div className="detail-info-grid">
              <div className="detail-item">
                <span>Code</span>
                <strong>{selectedCollege.code}</strong>
              </div>
              <div className="detail-item">
                <span>Principal / Nodal</span>
                <strong>{selectedCollege.principal}</strong>
              </div>
              <div className="detail-item">
                <span>Location</span>
                <strong>{selectedCollege.location}</strong>
              </div>
              <div className="detail-item">
                <span>Email</span>
                <strong>{selectedCollege.email}</strong>
              </div>
              <div className="detail-item">
                <span>Enrolled Students</span>
                <strong>{selectedCollege.enrolledStudents} Accounts</strong>
              </div>
              <div className="detail-item">
                <span>Active Placements</span>
                <strong>{selectedCollege.activePlacements} Interns</strong>
              </div>
            </div>

            <div className="modal-footer-btns">
              <button className="btn-submit" onClick={() => setSelectedCollege(null)}>
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollegesView;
