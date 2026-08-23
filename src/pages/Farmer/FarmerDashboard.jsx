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

  return (
    <div className="farmer-layout">

      {/* ================= SIDEBAR ================= */}
      <aside className="farmer-sidebar">

        {/* Brand */}
        <div className="farmer-brand">
          <h2>🌱 FarmIntern</h2>
          <p>Farmer Portal</p>
        </div>

        {/* Navigation */}
        <nav className="farmer-nav">

          {/* Dashboard */}
          <button
            onClick={() => setActivePage("dashboard")}
            className={activePage === "dashboard" ? "active" : ""}
          >
            ▦ <span>Dashboard</span>
          </button>

          {/* Farmer Profile */}
          <button
            onClick={() => setActivePage("profile")}
            className={activePage === "profile" ? "active" : ""}
          >
            👤 <span>Farmer Profile</span>
          </button>

          {/* Create Internship */}
          <button
            onClick={() => setActivePage("create-internship")}
            className={
              activePage === "create-internship" ? "active" : ""
            }
          >
            🌱 <span>Create Internship</span>
          </button>

          {/* Manage Internships */}
          <button
            onClick={() => setActivePage("manage-internships")}
            className={
              activePage === "manage-internships" ? "active" : ""
            }
          >
            📋 <span>Manage Internships</span>
          </button>

          {/* Applications */}
          <button
            onClick={() => setActivePage("applications")}
            className={
              activePage === "applications" ? "active" : ""
            }
          >
            📨 <span>Applications</span>
          </button>

          {/* Selected Interns */}
          <button
            onClick={() => setActivePage("selected-interns")}
            className={
              activePage === "selected-interns" ? "active" : ""
            }
          >
            🎓 <span>Selected Interns</span>
          </button>

          {/* Communication */}
          <button
            onClick={() => setActivePage("communication")}
            className={
              activePage === "communication" ? "active" : ""
            }
          >
            💬 <span>Communication</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => setActivePage("settings")}
            className={
              activePage === "settings" ? "active" : ""
            }
          >
            ⚙️ <span>Settings</span>
          </button>

        </nav>

        {/* Sidebar Farmer Profile */}
        <div className="farmer-sidebar-profile">

          <div className="sidebar-avatar">
            F
          </div>

          <div>
            <h4>Farmer Name</h4>
            <p>Farmer</p>
          </div>

        </div>

      </aside>


      {/* ================= MAIN CONTENT ================= */}
      <main className="farmer-main">

        {/* ================= DASHBOARD ================= */}

        {activePage === "dashboard" && (
          <>
            {/* Top Bar */}
            <div className="farmer-topbar">

              <div>
                <p className="welcome-text">
                  Welcome back 👋
                </p>

                <h1>
                  Farmer Dashboard
                </h1>
              </div>

              <div className="farmer-actions">

                <button className="notification-btn">
                  🔔
                </button>

                <div className="farmer-avatar">
                  F
                </div>

              </div>

            </div>


            {/* Hero Section */}
            <div className="farmer-hero">

              <div className="hero-content">

                <p className="hero-label">
                  FARM INTERNSHIP MANAGEMENT
                </p>

                <h2>
                  Connect with students and
                  <br />
                  build future agricultural talent.
                </h2>

                <p className="hero-description">
                  Post internship opportunities, review student
                  applications and manage your selected interns.
                </p>

                <button
                  className="hero-button"
                  onClick={() =>
                    setActivePage("create-internship")
                  }
                >
                  Post New Internship →
                </button>

              </div>

              <div className="hero-icon">
                🌾
              </div>

            </div>


            {/* Statistics */}
            <div className="farmer-stats">

              <div className="stat-card">

                <div className="stat-icon">
                  🌱
                </div>

                <div>
                  <p>Total Internships</p>
                  <h3>5</h3>
                  <span>Posted by you</span>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon">
                  🌿
                </div>

                <div>
                  <p>Active Internships</p>
                  <h3>3</h3>
                  <span>Currently available</span>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon">
                  📩
                </div>

                <div>
                  <p>Applications</p>
                  <h3>8</h3>
                  <span>Received applications</span>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon">
                  🎓
                </div>

                <div>
                  <p>Selected Interns</p>
                  <h3>4</h3>
                  <span>Currently selected</span>
                </div>

              </div>

            </div>


            {/* Bottom Sections */}
            <div className="farmer-content-grid">

              {/* Recent Applications */}
              <div className="content-card">

                <div className="content-card-header">

                  <div>
                    <h2>
                      Recent Applications
                    </h2>

                    <p>
                      Latest student applications
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setActivePage("applications")
                    }
                  >
                    View All →
                  </button>

                </div>


                <div className="application-item">

                  <div className="student-avatar">
                    A
                  </div>

                  <div>
                    <h4>
                      Anjali Reddy
                    </h4>

                    <p>
                      Organic Farming Internship
                    </p>
                  </div>

                  <span className="status pending">
                    Pending
                  </span>

                </div>


                <div className="application-item">

                  <div className="student-avatar">
                    R
                  </div>

                  <div>
                    <h4>
                      Rahul Kumar
                    </h4>

                    <p>
                      Crop Management Internship
                    </p>
                  </div>

                  <span className="status pending">
                    Pending
                  </span>

                </div>


                <div className="application-item">

                  <div className="student-avatar">
                    S
                  </div>

                  <div>
                    <h4>
                      Sirisha Rao
                    </h4>

                    <p>
                      Horticulture Internship
                    </p>
                  </div>

                  <span className="status selected">
                    Selected
                  </span>

                </div>

              </div>


              {/* Your Internships */}
              <div className="content-card">

                <div className="content-card-header">

                  <div>
                    <h2>
                      Your Internships
                    </h2>

                    <p>
                      Recently posted internships
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setActivePage("manage-internships")
                    }
                  >
                    View All →
                  </button>

                </div>


                <div className="internship-item">

                  <div className="internship-icon-box">
                    🌱
                  </div>

                  <div>
                    <h4>
                      Organic Farming Internship
                    </h4>

                    <p>
                      3 positions available
                    </p>
                  </div>

                  <span className="active-label">
                    Active
                  </span>

                </div>


                <div className="internship-item">

                  <div className="internship-icon-box">
                    🌾
                  </div>

                  <div>
                    <h4>
                      Crop Management Internship
                    </h4>

                    <p>
                      2 positions available
                    </p>
                  </div>

                  <span className="active-label">
                    Active
                  </span>

                </div>


                <div className="internship-item">

                  <div className="internship-icon-box">
                    🥬
                  </div>

                  <div>
                    <h4>
                      Vegetable Cultivation
                    </h4>

                    <p>
                      1 position available
                    </p>
                  </div>

                  <span className="closed-label">
                    Closed
                  </span>

                </div>

              </div>

            </div>
          </>
        )}


        {/* ================= FARMER PROFILE ================= */}

        {activePage === "profile" && (
          <FarmerProfile />
        )}


        {/* ================= CREATE INTERNSHIP ================= */}

        {activePage === "create-internship" && (
          <CreateInternship />
        )}


        {/* ================= MANAGE INTERNSHIPS ================= */}

        {activePage === "manage-internships" && (
          <ManageInternships />
        )}


        {/* ================= APPLICATIONS ================= */}

        {activePage === "applications" && (
          <Applications />
        )}


        {/* ================= SELECTED INTERNS ================= */}

        {activePage === "selected-interns" && (
          <SelectedInterns />
        )}


        {/* ================= COMMUNICATION ================= */}

        {activePage === "communication" && (
          <Communication />
        )}


        {/* ================= SETTINGS ================= */}

        {activePage === "settings" && (
          <Settings />
        )}

      </main>

    </div>
  );
}

export default FarmerDashboard;