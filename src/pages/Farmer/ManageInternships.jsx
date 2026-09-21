import React, { useState } from "react";
import "./Farmer.css";

function ManageInternships({ internships: propsInternships, onToggleStatus, onDeleteInternship }) {
  const [localInternships, setLocalInternships] = useState([
    {
      id: 1,
      title: "Organic Farming Internship",
      category: "Organic Farming",
      location: "Guntur, Andhra Pradesh",
      duration: "3 Months",
      openings: 3,
      applications: 5,
      status: "Active",
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
    },
  ]);

  const internships = propsInternships || localInternships;

  const toggleStatus = (id) => {
    if (onToggleStatus) {
      onToggleStatus(id);
    } else {
      setLocalInternships(
        localInternships.map((internship) =>
          internship.id === id
            ? {
                ...internship,
                status:
                  internship.status === "Active"
                    ? "Closed"
                    : "Active",
              }
            : internship
        )
      );
    }
  };

  const deleteInternship = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this internship?"
    );

    if (confirmDelete) {
      if (onDeleteInternship) {
        onDeleteInternship(id);
      } else {
        setLocalInternships(
          localInternships.filter((internship) => internship.id !== id)
        );
      }
    }
  };

  return (
    <div className="farmer-page">

      <div className="page-header">
        <p className="page-label">INTERNSHIP MANAGEMENT</p>

        <h1>Manage Internships</h1>

        <p>
          View, manage and update your internship opportunities.
        </p>
      </div>

      <div className="manage-summary">

        <div className="summary-card">
          <span>🌱</span>
          <div>
            <p>Total Internships</p>
            <h3>{internships.length}</h3>
          </div>
        </div>

        <div className="summary-card">
          <span>🌿</span>
          <div>
            <p>Active</p>
            <h3>
              {internships.filter(
                (item) => item.status === "Active"
              ).length}
            </h3>
          </div>
        </div>

        <div className="summary-card">
          <span>📩</span>
          <div>
            <p>Applications</p>
            <h3>
              {internships.reduce(
                (total, item) => total + item.applications,
                0
              )}
            </h3>
          </div>
        </div>

      </div>

      <div className="internship-list-card">

        <div className="section-heading">
          <div>
            <h2>Your Internships</h2>
            <p>Recently created opportunities</p>
          </div>
        </div>

        {internships.map((internship) => (
          <div className="manage-internship-item" key={internship.id}>

            <div className="manage-internship-icon">
              🌱
            </div>

            <div className="manage-internship-info">

              <h3>{internship.title}</h3>

              <p>
                {internship.category} • {internship.location}
              </p>

              <div className="internship-meta">
                <span>⏱ {internship.duration}</span>
                <span>👥 {internship.openings} openings</span>
                <span>📩 {internship.applications} applications</span>
              </div>

            </div>

            <div className="manage-internship-actions">

              <span
                className={
                  internship.status === "Active"
                    ? "status-badge active-status"
                    : "status-badge closed-status"
                }
              >
                {internship.status}
              </span>

              <button
                className="small-action-button"
                onClick={() => toggleStatus(internship.id)}
              >
                {internship.status === "Active"
                  ? "Close"
                  : "Activate"}
              </button>

              <button
                className="delete-button"
                onClick={() => deleteInternship(internship.id)}
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default ManageInternships;