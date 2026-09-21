import React, { useState } from "react";

function FarmPartnersView() {
  const [farms, setFarms] = useState([
    {
      id: 1,
      name: "Sunrise Organic Farms",
      owner: "Ramesh Farmer",
      phone: "+91 98765 43210",
      email: "ramesh@sunrisefarms.org",
      location: "Guntur, AP",
      category: "Organic Farming",
      capacity: 12,
      activeInterns: 8,
      status: "Verified",
      rating: "4.9 ★"
    },
    {
      id: 2,
      name: "Green Valley Dairy & Agro",
      owner: "Venkatesh Rao",
      phone: "+91 94400 11223",
      email: "contact@greenvalleydairy.in",
      location: "Nellore, AP",
      category: "Dairy Farming",
      capacity: 15,
      activeInterns: 10,
      status: "Verified",
      rating: "4.8 ★"
    },
    {
      id: 3,
      name: "Happy Cows Dairy Farm",
      owner: "Suresh Reddy",
      phone: "+91 91234 56789",
      email: "info@happycows.org",
      location: "Chittoor, AP",
      category: "Dairy Farming",
      capacity: 10,
      activeInterns: 6,
      status: "Verified",
      rating: "4.7 ★"
    },
    {
      id: 4,
      name: "Sunrise Flora & Horticulture",
      owner: "K. Satyanarayana",
      phone: "+91 98888 44411",
      email: "flora@sunrise.in",
      location: "Krishna, AP",
      category: "Horticulture",
      capacity: 8,
      activeInterns: 4,
      status: "Pending",
      rating: "New"
    },
    {
      id: 5,
      name: "Godavari Poultry Hub",
      owner: "Prasad Raju",
      phone: "+91 97000 88990",
      email: "contact@godavaripoultry.com",
      location: "West Godavari, AP",
      category: "Poultry Farming",
      capacity: 20,
      activeInterns: 14,
      status: "Verified",
      rating: "4.9 ★"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [newFarm, setNewFarm] = useState({
    name: "",
    owner: "",
    email: "",
    phone: "",
    location: "",
    category: "Organic Farming",
    capacity: 10
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredFarms = farms.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "All" || f.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || f.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleVerifyFarm = (id, name) => {
    setFarms(farms.map((f) => (f.id === id ? { ...f, status: "Verified" } : f)));
    showToast(`✓ ${name} has been verified!`);
  };

  const handleAddFarmSubmit = (e) => {
    e.preventDefault();
    if (!newFarm.name || !newFarm.owner) return;

    const farmObj = {
      id: Date.now(),
      name: newFarm.name,
      owner: newFarm.owner,
      phone: newFarm.phone || "+91 90000 00000",
      email: newFarm.email || "farm@example.org",
      location: newFarm.location || "Andhra Pradesh",
      category: newFarm.category,
      capacity: parseInt(newFarm.capacity) || 10,
      activeInterns: 0,
      status: "Verified",
      rating: "5.0 ★"
    };

    setFarms([farmObj, ...farms]);
    setShowAddModal(false);
    setNewFarm({
      name: "",
      owner: "",
      email: "",
      phone: "",
      location: "",
      category: "Organic Farming",
      capacity: 10
    });
    showToast(`✓ Registered new farm partner: ${farmObj.name}`);
  };

  return (
    <div className="admin-page-view">
      {toastMessage && <div className="admin-toast">{toastMessage}</div>}

      {/* PAGE HEADER */}
      <div className="admin-page-header">
        <div>
          <h2>Farm Partners & Hosts</h2>
          <p>Manage verified partner agricultural farms, host capacities, and field placements.</p>
        </div>
        <button className="add-user-btn" onClick={() => setShowAddModal(true)}>
          <span>+</span> Register New Farm
        </button>
      </div>

      {/* KPI STAT CARDS */}
      <div className="admin-stats-grid" style={{ marginBottom: "24px" }}>
        <div className="admin-stat-card">
          <div className="stat-header">
            <div className="stat-icon green">🏡</div>
            <span className="stat-trend up">Verified</span>
          </div>
          <div className="stat-body">
            <span>Total Farm Hosts</span>
            <h2>{farms.length}</h2>
            <small>Active agricultural partners</small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-header">
            <div className="stat-icon blue">👨‍🌾</div>
            <span className="stat-trend up">Active</span>
          </div>
          <div className="stat-body">
            <span>Hosted Interns</span>
            <h2>{farms.reduce((acc, f) => acc + f.activeInterns, 0)}</h2>
            <small>Students currently placed</small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-header">
            <div className="stat-icon purple">📊</div>
            <span className="stat-trend up">Capacity</span>
          </div>
          <div className="stat-body">
            <span>Total Capacity</span>
            <h2>{farms.reduce((acc, f) => acc + f.capacity, 0)} Seats</h2>
            <small>Available internship slots</small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-header">
            <div className="stat-icon amber">⏳</div>
            <span className="stat-trend warning">Review</span>
          </div>
          <div className="stat-body">
            <span>Pending Inspections</span>
            <h2>{farms.filter((f) => f.status === "Pending").length}</h2>
            <small>Awaiting site verification</small>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="users-filter-bar">
        <div className="users-controls" style={{ width: "100%", justifyContent: "space-between" }}>
          <div className="search-input-wrapper">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search farm name, owner, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <select
              className="status-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Organic Farming">Organic Farming</option>
              <option value="Dairy Farming">Dairy Farming</option>
              <option value="Horticulture">Horticulture</option>
              <option value="Poultry Farming">Poultry Farming</option>
            </select>

            <select
              className="status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* FARM TABLE */}
      <div className="users-table-card">
        <table className="users-table">
          <thead>
            <tr>
              <th>Farm Name & Owner</th>
              <th>Category</th>
              <th>Location</th>
              <th>Intern Capacity</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFarms.map((farm) => (
              <tr key={farm.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-cell-avatar" style={{ background: "#e2f3e7", color: "#1b6834" }}>
                      🏡
                    </div>
                    <div className="user-cell-info">
                      <strong>{farm.name}</strong>
                      <span>Contact: {farm.owner} ({farm.phone})</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="role-badge farmer">{farm.category}</span>
                </td>
                <td style={{ color: "#455449", fontSize: "13px" }}>{farm.location}</td>
                <td>
                  <strong style={{ color: "#19281e" }}>
                    {farm.activeInterns} / {farm.capacity}
                  </strong>{" "}
                  <span style={{ fontSize: "11px", color: "#6a796e" }}>placed</span>
                </td>
                <td>
                  <span style={{ background: "#fff8e1", color: "#b78103", padding: "3px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "700" }}>
                    {farm.rating}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${farm.status.toLowerCase()}`}>
                    {farm.status}
                  </span>
                </td>
                <td>
                  <div className="table-action-btns">
                    {farm.status === "Pending" && (
                      <button
                        className="action-approve-btn"
                        onClick={() => handleVerifyFarm(farm.id, farm.name)}
                      >
                        Verify
                      </button>
                    )}
                    <button
                      className="table-details-btn"
                      onClick={() => setSelectedFarm(farm)}
                    >
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD FARM MODAL */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setShowAddModal(false)}>×</button>
            <h3>Register New Farm Partner</h3>
            <p className="modal-subtitle">Add farm host details to allow student placements</p>

            <form onSubmit={handleAddFarmSubmit}>
              <div className="modal-form-grid">
                <div className="form-group full-width">
                  <label>Farm Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Green Harvest Organic Farm"
                    value={newFarm.name}
                    onChange={(e) => setNewFarm({ ...newFarm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Owner / Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={newFarm.owner}
                    onChange={(e) => setNewFarm({ ...newFarm, owner: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 00000"
                    value={newFarm.phone}
                    onChange={(e) => setNewFarm({ ...newFarm, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newFarm.category}
                    onChange={(e) => setNewFarm({ ...newFarm, category: e.target.value })}
                  >
                    <option value="Organic Farming">Organic Farming</option>
                    <option value="Dairy Farming">Dairy Farming</option>
                    <option value="Horticulture">Horticulture</option>
                    <option value="Poultry Farming">Poultry Farming</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Internship Student Capacity</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newFarm.capacity}
                    onChange={(e) => setNewFarm({ ...newFarm, capacity: e.target.value })}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Location / Address</label>
                  <input
                    type="text"
                    placeholder="e.g. Guntur District, Andhra Pradesh"
                    value={newFarm.location}
                    onChange={(e) => setNewFarm({ ...newFarm, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer-btns">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Register Farm Host
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FARM DETAILS MODAL */}
      {selectedFarm && (
        <div className="modal-overlay" onClick={() => setSelectedFarm(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setSelectedFarm(null)}>×</button>
            <h3>{selectedFarm.name}</h3>
            <p className="modal-subtitle">Registered Host Farm Specifications</p>

            <div className="detail-info-grid">
              <div className="detail-item">
                <span>Owner</span>
                <strong>{selectedFarm.owner}</strong>
              </div>
              <div className="detail-item">
                <span>Category</span>
                <strong>{selectedFarm.category}</strong>
              </div>
              <div className="detail-item">
                <span>Contact Phone</span>
                <strong>{selectedFarm.phone}</strong>
              </div>
              <div className="detail-item">
                <span>Location</span>
                <strong>{selectedFarm.location}</strong>
              </div>
              <div className="detail-item">
                <span>Capacity</span>
                <strong>{selectedFarm.activeInterns} / {selectedFarm.capacity} Students Placed</strong>
              </div>
              <div className="detail-item">
                <span>Verification</span>
                <strong className={`status-badge ${selectedFarm.status.toLowerCase()}`}>{selectedFarm.status}</strong>
              </div>
            </div>

            <div className="modal-footer-btns">
              <button className="btn-submit" onClick={() => setSelectedFarm(null)}>
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FarmPartnersView;
