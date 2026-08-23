import React, { useState } from "react";
import "./Farmer.css";

function Applications() {
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

  const updateStatus = (id, status) => {
    setApplications(
      applications.map((application) =>
        application.id === id
          ? { ...application, status }
          : application
      )
    );
  };

  return (
    <div className="farmer-page">

      <div className="page-header">
        <p className="page-label">APPLICATION MANAGEMENT</p>

        <h1>Applications</h1>

        <p>
          Review and manage student applications for your internships.
        </p>
      </div>

      <div className="application-summary">

        <div className="application-summary-card">
          <span>📩</span>
          <div>
            <p>Total Applications</p>
            <h3>{applications.length}</h3>
          </div>
        </div>

        <div className="application-summary-card">
          <span>⏳</span>
          <div>
            <p>Pending</p>
            <h3>
              {applications.filter(
                (item) => item.status === "Pending"
              ).length}
            </h3>
          </div>
        </div>

        <div className="application-summary-card">
          <span>🎓</span>
          <div>
            <p>Selected</p>
            <h3>
              {applications.filter(
                (item) => item.status === "Selected"
              ).length}
            </h3>
          </div>
        </div>

        <div className="application-summary-card">
          <span>✕</span>
          <div>
            <p>Rejected</p>
            <h3>
              {applications.filter(
                (item) => item.status === "Rejected"
              ).length}
            </h3>
          </div>
        </div>

      </div>

      <div className="applications-card">

        <div className="section-heading">
          <h2>Student Applications</h2>
          <p>Review applicants and update their application status.</p>
        </div>

        {applications.map((application) => (
          <div className="application-row" key={application.id}>

            <div className="application-avatar">
              {application.name.charAt(0)}
            </div>

            <div className="application-details">

              <h3>{application.name}</h3>

              <p>{application.course}</p>

              <span>
                Applied for: {application.internship}
              </span>

              <small>
                Applied on {application.date}
              </small>

            </div>

            <div className="application-actions">

              <span
                className={`application-status ${application.status.toLowerCase()}`}
              >
                {application.status}
              </span>

              {application.status === "Pending" && (
                <>
                  <button
                    className="accept-button"
                    onClick={() =>
                      updateStatus(application.id, "Selected")
                    }
                  >
                    Select
                  </button>

                  <button
                    className="reject-button"
                    onClick={() =>
                      updateStatus(application.id, "Rejected")
                    }
                  >
                    Reject
                  </button>
                </>
              )}

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Applications;