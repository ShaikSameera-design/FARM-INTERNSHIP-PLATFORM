import React from "react";
import "./Farmer.css";

function SelectedInterns({ applications = [], onMessageIntern }) {
  const defaultInterns = [
    {
      id: 1,
      name: "Sirisha Rao",
      course: "B.Sc Horticulture",
      internship: "Horticulture Internship",
      startDate: "01 Sep 2026",
      duration: "3 Months",
      progress: 25,
    },
    {
      id: 2,
      name: "Arjun Reddy",
      course: "B.Sc Agriculture",
      internship: "Organic Farming Internship",
      startDate: "05 Sep 2026",
      duration: "3 Months",
      progress: 10,
    },
    {
      id: 3,
      name: "Priya Sharma",
      course: "B.Tech Agricultural Engineering",
      internship: "Crop Management Internship",
      startDate: "10 Sep 2026",
      duration: "2 Months",
      progress: 5,
    },
    {
      id: 4,
      name: "Vijay Kumar",
      course: "B.Sc Agriculture",
      internship: "Organic Farming Internship",
      startDate: "12 Sep 2026",
      duration: "3 Months",
      progress: 0,
    },
  ];

  const selectedFromApps = applications
    .filter((a) => a.status === "Selected")
    .map((a) => ({
      id: a.id,
      name: a.name,
      course: a.course || "B.Sc Agriculture",
      internship: a.internship,
      startDate: "01 Sep 2026",
      duration: "3 Months",
      progress: 20,
    }));

  const interns = selectedFromApps.length > 0 ? selectedFromApps : defaultInterns;

  return (
    <div className="farmer-page">

      <div className="page-header">
        <p className="page-label">INTERNSHIP MANAGEMENT</p>

        <h1>Selected Interns</h1>

        <p>
          Manage students who have been selected for your internships.
        </p>
      </div>

      <div className="selected-header-card">

        <div>
          <h2>Current Interns</h2>
          <p>
            You currently have {interns.length} selected interns.
          </p>
        </div>

        <div className="selected-count">
          🎓 {interns.length}
        </div>

      </div>

      <div className="selected-interns-grid">

        {interns.map((intern) => (
          <div className="selected-intern-card" key={intern.id}>

            <div className="selected-card-top">

              <div className="large-student-avatar">
                {intern.name.charAt(0)}
              </div>

              <span className="selected-label">
                Selected
              </span>

            </div>

            <h3>{intern.name}</h3>

            <p className="student-course">
              {intern.course}
            </p>

            <div className="intern-info-row">
              <span>🌱 Internship</span>
              <strong>{intern.internship}</strong>
            </div>

            <div className="intern-info-row">
              <span>📅 Start Date</span>
              <strong>{intern.startDate}</strong>
            </div>

            <div className="intern-info-row">
              <span>⏱ Duration</span>
              <strong>{intern.duration}</strong>
            </div>

            <div className="progress-section">

              <div className="progress-label">
                <span>Progress</span>
                <strong>{intern.progress}%</strong>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${intern.progress}%` }}
                ></div>
              </div>

            </div>

            <button
              className="message-intern-button"
              onClick={() => onMessageIntern && onMessageIntern(intern.name)}
            >
              💬 Message Intern
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default SelectedInterns;