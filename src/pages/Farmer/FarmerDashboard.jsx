import React, { useState } from "react";

import FarmerProfile from "./FarmerProfile";
import CreateInternship from "./CreateInternship";
import ManageInternships from "./ManageInternships";
import Applications from "./Applications";
import SelectedInterns from "./SelectedInterns";
import Communication from "./Communication";
import Settings from "./Settings";

import "./Farmer.css";

function FarmerDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedStudentForChat, setSelectedStudentForChat] = useState(null);

  const [internships, setInternships] = useState([
    {
      id: 1,
      title: "Organic Farming Internship",
      category: "Organic Farming",
      location: "Guntur, Andhra Pradesh",
      duration: "3 Months",
      openings: 3,
      applications: 5,
      status: "Active",
      stipend: "₹12,000 / month",
    },
    {
      id: 2,
      title: "Crop Management Internship",
      category: "Crop Management",
      location: "Vijayawada, Andhra Pradesh",
      duration: "2 Months",
      openings: 2,
      applications: 3,
      status: "Active",
      stipend: "₹10,500 / month",
    },
    {
      id: 3,
      title: "Vegetable Cultivation",
      category: "Horticulture",
      location: "Tenali, Andhra Pradesh",
      duration: "1 Month",
      openings: 1,
      applications: 4,
      status: "Closed",
      stipend: "₹8,000 / month",
    },
  ]);

  const [applications, setApplications] = useState([
    {
      id: 1,
      name: "Anjali Reddy",
      course: "B.Tech Agricultural Engineering",
      internship: "Organic Farming Internship",
      date: "20 Aug 2026",
      status: "Pending",
    },
    {
      id: 2,
      name: "Rahul Kumar",
      course: "B.Sc Agriculture",
      internship: "Crop Management Internship",
      date: "19 Aug 2026",
      status: "Pending",
    },
    {
      id: 3,
      name: "Sirisha Rao",
      course: "B.Sc Horticulture",
      internship: "Horticulture Internship",
      date: "18 Aug 2026",
      status: "Selected",
    },
    {
      id: 4,
      name: "Kiran Kumar",
      course: "B.Sc Agriculture",
      internship: "Organic Farming Internship",
      date: "17 Aug 2026",
      status: "Rejected",
    },
  ]);



  const handleAddInternship = (newInternship) => {
    setInternships((prev) => [newInternship, ...prev]);
    setActivePage("manage-internships");
  };

  const handleToggleInternshipStatus = (id) => {
    setInternships((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "Active" ? "Closed" : "Active" }
          : item
      )
    );
  };

  const handleDeleteInternship = (id) => {
    setInternships((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateApplicationStatus = (id, newStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
  };

  const handleMessageIntern = (studentName) => {
    setSelectedStudentForChat(studentName);
    setActivePage("communication");
  };

  const activeCount = internships.filter((item) => item.status === "Active").length;
  const selectedCount = applications.filter((app) => app.status === "Selected").length;

  return (
    <div className="farmer-layout">
      {/* ================= SIDEBAR ================= */}
      <aside className="farmer-sidebar">
        <div className="farmer-brand">
          <h2>🌱 FarmIntern</h2>
          <p>Farmer Portal</p>
        </div>

        <nav className="farmer-nav">
          <button
            onClick={() => setActivePage("dashboard")}
            className={activePage === "dashboard" ? "active" : ""}
          >
            ▦ <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActivePage("profile")}
            className={activePage === "profile" ? "active" : ""}
          >
            👤 <span>Farmer Profile</span>
          </button>
          <button
            onClick={() => setActivePage("create-internship")}
            className={activePage === "create-internship" ? "active" : ""}
          >
            🌱 <span>Create Internship</span>
          </button>
          <button
            onClick={() => setActivePage("manage-internships")}
            className={activePage === "manage-internships" ? "active" : ""}
          >
            📋 <span>Manage Internships</span>
          </button>
          <button
            onClick={() => setActivePage("applications")}
            className={activePage === "applications" ? "active" : ""}
          >
            📨 <span>Applications</span>
          </button>
          <button
            onClick={() => setActivePage("selected-interns")}
            className={activePage === "selected-interns" ? "active" : ""}
          >
            🎓 <span>Selected Interns</span>
          </button>
          <button
            onClick={() => setActivePage("communication")}
            className={activePage === "communication" ? "active" : ""}
          >
            💬 <span>Communication</span>
          </button>
          <button
            onClick={() => setActivePage("settings")}
            className={activePage === "settings" ? "active" : ""}
          >
            ⚙️ <span>Settings</span>
          </button>
        </nav>

        <div className="farmer-sidebar-profile">
          <div className="sidebar-avatar">F</div>
          <div>
            <h4>Green Valley Farms</h4>
            <p>Verified Farmer Partner</p>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="farmer-main">
        {/* ================= TOPBAR ================= */}
        <header className="farmer-topbar">
          <div>
            <p className="welcome-text">Farmer Partner Portal 👋</p>
            <h1>
              {activePage === "dashboard" && "Farmer Dashboard"}
              {activePage === "profile" && "Farmer Profile"}
              {activePage === "create-internship" && "Create New Internship"}
              {activePage === "manage-internships" && "Manage Internships"}
              {activePage === "applications" && "Student Applications"}
              {activePage === "selected-interns" && "Selected Interns"}
              {activePage === "communication" && "Communication Center"}
              {activePage === "settings" && "Farmer Settings"}
            </h1>
          </div>

          <div className="farmer-actions">
            <button
              className="notification-btn"
              type="button"
              onClick={() => setActivePage("communication")}
            >
              🔔
            </button>

            <div
              className="farmer-avatar"
              onClick={() => setActivePage("profile")}
              style={{ cursor: "pointer" }}
            >
              F
            </div>
          </div>
        </header>

        {/* ================= DASHBOARD OVERVIEW ================= */}
        {activePage === "dashboard" && (
          <>
            <div className="farmer-hero">
              <div className="hero-content">
                <p className="hero-label">FARM INTERNSHIP MANAGEMENT</p>
                <h2>
                  Connect with students and
                  <br />
                  build future agricultural talent.
                </h2>
                <p className="hero-description">
                  Post internship opportunities, review student applications and manage your selected interns.
                </p>
                <button
                  className="hero-button"
                  onClick={() => setActivePage("create-internship")}
                >
                  Post New Internship →
                </button>
              </div>
              <div className="hero-icon">🌾</div>
            </div>

            <div className="farmer-stats">
              <div className="stat-card">
                <div className="stat-icon internship-icon">🌱</div>
                <div>
                  <p>Total Internships</p>
                  <h3>{internships.length}</h3>
                  <span>Posted by you</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon active-icon">🌿</div>
                <div>
                  <p>Active Internships</p>
                  <h3>{activeCount}</h3>
                  <span>Currently available</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon application-icon">📩</div>
                <div>
                  <p>Applications</p>
                  <h3>{applications.length}</h3>
                  <span>Received applications</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon selected-icon">🎓</div>
                <div>
                  <p>Selected Interns</p>
                  <h3>{selectedCount}</h3>
                  <span>Currently selected</span>
                </div>
              </div>
            </div>

            <div className="farmer-content-grid">
              <div className="content-card">
                <div className="content-card-header">
                  <div>
                    <h2>Recent Applications</h2>
                    <p>Latest student applications</p>
                  </div>
                  <button onClick={() => setActivePage("applications")}>
                    View All →
                  </button>
                </div>

                {applications.slice(0, 3).map((app) => (
                  <div className="application-item" key={app.id}>
                    <div className="student-avatar">{app.name.charAt(0)}</div>
                    <div>
                      <h4>{app.name}</h4>
                      <p>{app.internship}</p>
                    </div>
                    <span className={`status ${app.status.toLowerCase()}`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="content-card">
                <div className="content-card-header">
                  <div>
                    <h2>Your Internships</h2>
                    <p>Recently posted internships</p>
                  </div>
                  <button onClick={() => setActivePage("manage-internships")}>
                    View All →
                  </button>
                </div>

                {internships.slice(0, 3).map((item) => (
                  <div className="internship-item" key={item.id}>
                    <div className="internship-icon-box">🌱</div>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.openings} positions available</p>
                    </div>
                    <span
                      className={
                        item.status === "Active"
                          ? "active-label"
                          : "closed-label"
                      }
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activePage === "profile" && <FarmerProfile />}

        {activePage === "create-internship" && (
          <CreateInternship onAddInternship={handleAddInternship} />
        )}

        {activePage === "manage-internships" && (
          <ManageInternships
            internships={internships}
            onToggleStatus={handleToggleInternshipStatus}
            onDeleteInternship={handleDeleteInternship}
          />
        )}

        {activePage === "applications" && (
          <Applications
            applications={applications}
            onUpdateStatus={handleUpdateApplicationStatus}
          />
        )}

        {activePage === "selected-interns" && (
          <SelectedInterns
            applications={applications}
            onMessageIntern={handleMessageIntern}
          />
        )}

        {activePage === "communication" && (
          <Communication initialStudentName={selectedStudentForChat} />
        )}

        {activePage === "settings" && <Settings />}
      </main>
    </div>
  );
}

export default FarmerDashboard;