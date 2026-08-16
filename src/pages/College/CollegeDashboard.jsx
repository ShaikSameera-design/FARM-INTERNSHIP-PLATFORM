import { useState } from "react";
import "./College.css";
import CollegeProfile from "./CollegeProfile";

function CollegeDashboard() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");

  const students = [
    {
      id: 1,
      name: "Anjali Reddy",
      rollNo: "CSE001",
      internship: "Organic Farming",
      organization: "Green Valley Farms",
      duration: "3 Months",
      progress: 85,
      status: "Ongoing",
    },
    {
      id: 2,
      name: "Ravi Teja",
      rollNo: "CSE002",
      internship: "Dairy Farming",
      organization: "Happy Cows Dairy",
      duration: "2 Months",
      progress: 100,
      status: "Completed",
    },
    {
      id: 3,
      name: "Meghana S",
      rollNo: "CSE003",
      internship: "Horticulture",
      organization: "Sunrise Farms",
      duration: "3 Months",
      progress: 45,
      status: "Ongoing",
    },
    {
      id: 4,
      name: "Priya Kumar",
      rollNo: "CSE004",
      internship: "Crop Management",
      organization: "Green Agriculture",
      duration: "2 Months",
      progress: 25,
      status: "Ongoing",
    },
    {
      id: 5,
      name: "Rahul Varma",
      rollNo: "CSE005",
      internship: "Poultry Farming",
      organization: "Healthy Poultry Farms",
      duration: "2 Months",
      progress: 0,
      status: "Pending",
    },
  ];

  const collegeActivities = [
    {
      title: "Internship Program Approved",
      description: "Organic Farming internship program was approved.",
      time: "2 hours ago",
      type: "approval",
    },
    {
      title: "Student Applications Updated",
      description: "12 students have been assigned to internships.",
      time: "5 hours ago",
      type: "student",
    },
    {
      title: "New Farm Partner Added",
      description: "Green Valley Farms joined the platform.",
      time: "Yesterday",
      type: "partner",
    },
  ];

  const studentActivities = [
    {
      student: "Anjali Reddy",
      activity: "Completed 85% of internship",
      time: "1 hour ago",
    },
    {
      student: "Ravi Teja",
      activity: "Completed internship",
      time: "4 hours ago",
    },
    {
      student: "Meghana S",
      activity: "Updated internship progress",
      time: "Yesterday",
    },
  ];

  const totalStudents = students.length;

  const activeStudents = students.filter(
    (student) => student.status === "Ongoing"
  ).length;

  const completedStudents = students.filter(
    (student) => student.status === "Completed"
  ).length;

  const pendingStudents = students.filter(
    (student) => student.status === "Pending"
  ).length;

  const averageProgress = Math.round(
    students.reduce((sum, student) => sum + student.progress, 0) /
      students.length
  );

  return (
    <div className="college-dashboard">

      {/* SIDEBAR */}

      <aside className="college-sidebar">

        <div className="college-logo">
          <div className="logo-icon">🌱</div>

          <div>
            <h2>FarmIntern</h2>
            <span>College Portal</span>
          </div>
        </div>

        <nav className="college-nav">

          <button
            className={activeSection === "overview" ? "active" : ""}
            onClick={() => setActiveSection("overview")}
          >
            <span>▦</span>
            Dashboard
          </button>
          <button
            className={activeSection === "profile" ? "active" : ""}
            onClick={() => setActiveSection("profile")}
          >
            <span>🏫</span>
            College Profile
        </button>
          <button
            className={activeSection === "students" ? "active" : ""}
            onClick={() => setActiveSection("students")}
          >
            <span>👨‍🎓</span>
            Student Activities
          </button>

          <button
            className={activeSection === "college" ? "active" : ""}
            onClick={() => setActiveSection("college")}
          >
            <span>🏫</span>
            College Activities
          </button>

          <button
            className={activeSection === "activity" ? "active" : ""}
            onClick={() => setActiveSection("activity")}
          >
            <span>🔔</span>
            Recent Activity
          </button>

        </nav>

        <div className="college-sidebar-bottom">

          <div className="college-user">
            <div className="user-avatar">C</div>

            <div>
              <strong>College Admin</strong>
              <span>ABC College</span>
            </div>
          </div>

        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="college-main">

        {/* TOP BAR */}

        <header className="college-topbar">

          <div>
            <p className="welcome-text">Welcome back 👋</p>
            <h1>ABC College Dashboard</h1>
          </div>

          <div className="topbar-actions">

            <button className="notification-btn">
              🔔
              <span></span>
            </button>

            <div className="college-admin-avatar">
              C
            </div>

          </div>

        </header>

        {/* OVERVIEW */}
        {activeSection === "profile" && <CollegeProfile />}
        {activeSection === "overview" && (

          <>
            <section className="hero-section">

              <div>
                <span className="hero-label">
                  COLLEGE INTERNSHIP MANAGEMENT
                </span>

                <h2>
                  Empower your students through
                  <br />
                  real-world farm internships.
                </h2>

                <p>
                  Monitor student progress, manage internship
                  activities and stay connected with your
                  internship partners.
                </p>

                <button
                  className="hero-button"
                  onClick={() => setActiveSection("students")}
                >
                  Track Student Progress →
                </button>
              </div>

              <div className="hero-illustration">
                🌾
              </div>

            </section>

            {/* STATISTICS */}

            <section className="stats-grid">

              <div className="stat-card">
                <div className="stat-icon blue">👨‍🎓</div>

                <div>
                  <span>Total Students</span>
                  <h2>{totalStudents}</h2>
                  <small>Registered students</small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon green">🌱</div>

                <div>
                  <span>Active Internships</span>
                  <h2>{activeStudents}</h2>
                  <small>Currently ongoing</small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon purple">✓</div>

                <div>
                  <span>Completed</span>
                  <h2>{completedStudents}</h2>
                  <small>Successfully completed</small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon orange">⏳</div>

                <div>
                  <span>Pending</span>
                  <h2>{pendingStudents}</h2>
                  <small>Awaiting internship</small>
                </div>
              </div>

            </section>

            {/* TWO COLUMN ACTIVITY */}

            <section className="dashboard-columns">

              {/* STUDENT ACTIVITY */}

              <div className="dashboard-panel">

                <div className="panel-header">

                  <div>
                    <h3>Student Activities</h3>
                    <p>Latest student internship progress</p>
                  </div>

                  <button
                    onClick={() => setActiveSection("students")}
                  >
                    View All →
                  </button>

                </div>

                <div className="activity-list">

                  {studentActivities.map((activity, index) => (

                    <div className="activity-item" key={index}>

                      <div className="activity-avatar">
                        {activity.student.charAt(0)}
                      </div>

                      <div className="activity-content">

                        <strong>{activity.student}</strong>

                        <p>{activity.activity}</p>

                        <small>{activity.time}</small>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

              {/* COLLEGE ACTIVITY */}

              <div className="dashboard-panel">

                <div className="panel-header">

                  <div>
                    <h3>College Activities</h3>
                    <p>Recent college operations</p>
                  </div>

                  <button
                    onClick={() => setActiveSection("college")}
                  >
                    View All →
                  </button>

                </div>

                <div className="activity-list">

                  {collegeActivities.map((activity, index) => (

                    <div className="activity-item" key={index}>

                      <div className="college-activity-icon">
                        {activity.type === "approval"
                          ? "✓"
                          : activity.type === "student"
                          ? "👨‍🎓"
                          : "🏡"}
                      </div>

                      <div className="activity-content">

                        <strong>{activity.title}</strong>

                        <p>{activity.description}</p>

                        <small>{activity.time}</small>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </section>

            {/* PROGRESS */}

            <section className="dashboard-panel full-panel">

              <div className="panel-header">

                <div>
                  <h3>Student Internship Progress</h3>
                  <p>Overall progress of your students</p>
                </div>

                <strong className="average-progress">
                  Average: {averageProgress}%
                </strong>

              </div>

              <div className="progress-overview">

                {students.map((student) => (

                  <div className="progress-row" key={student.id}>

                    <div className="progress-student">
                      <div className="mini-avatar">
                        {student.name.charAt(0)}
                      </div>

                      <div>
                        <strong>{student.name}</strong>
                        <span>{student.internship}</span>
                      </div>
                    </div>

                    <div className="large-progress-bar">

                      <div
                        className="large-progress-fill"
                        style={{
                          width: `${student.progress}%`,
                        }}
                      ></div>

                    </div>

                    <strong>{student.progress}%</strong>

                    <button
                      className="details-button"
                      onClick={() => setSelectedStudent(student)}
                    >
                      Details
                    </button>

                  </div>

                ))}

              </div>

            </section>
          </>

        )}

        {/* STUDENT ACTIVITIES */}

        {activeSection === "students" && (

          <section className="page-section">

            <div className="page-title">
              <h2>Student Activities</h2>
              <p>
                Monitor internship progress and student participation.
              </p>
            </div>

            <div className="student-grid">

              {students.map((student) => (

                <div className="student-card" key={student.id}>

                  <div className="student-card-top">

                    <div className="big-avatar">
                      {student.name.charAt(0)}
                    </div>

                    <span className={`status ${student.status.toLowerCase()}`}>
                      {student.status}
                    </span>

                  </div>

                  <h3>{student.name}</h3>

                  <p>{student.rollNo}</p>

                  <div className="student-detail">
                    <span>Internship</span>
                    <strong>{student.internship}</strong>
                  </div>

                  <div className="student-detail">
                    <span>Organization</span>
                    <strong>{student.organization}</strong>
                  </div>

                  <div className="card-progress">

                    <div>
                      <span>Progress</span>
                      <strong>{student.progress}%</strong>
                    </div>

                    <div className="large-progress-bar">
                      <div
                        className="large-progress-fill"
                        style={{
                          width: `${student.progress}%`,
                        }}
                      ></div>
                    </div>

                  </div>

                  <button
                    className="full-details-button"
                    onClick={() => setSelectedStudent(student)}
                  >
                    View Student Details
                  </button>

                </div>

              ))}

            </div>

          </section>

        )}

        {/* COLLEGE ACTIVITIES */}

        {activeSection === "college" && (

          <section className="page-section">

            <div className="page-title">

              <h2>College Activities</h2>

              <p>
                Manage and monitor your college's internship operations.
              </p>

            </div>

            <div className="college-activity-grid">

              <div className="operation-card">
                <span>🏫</span>
                <h3>Internship Programs</h3>
                <strong>12</strong>
                <p>Programs currently available</p>
              </div>

              <div className="operation-card">
                <span>🤝</span>
                <h3>Farm Partners</h3>
                <strong>18</strong>
                <p>Partner organizations</p>
              </div>

              <div className="operation-card">
                <span>📋</span>
                <h3>Pending Requests</h3>
                <strong>7</strong>
                <p>Requests requiring attention</p>
              </div>

              <div className="operation-card">
                <span>🎓</span>
                <h3>Students Assigned</h3>
                <strong>48</strong>
                <p>Students currently assigned</p>
              </div>

            </div>

            <div className="dashboard-panel full-panel">

              <div className="panel-header">

                <div>
                  <h3>College Activity Timeline</h3>
                  <p>Recent operations</p>
                </div>

              </div>

              <div className="activity-list">

                {collegeActivities.map((activity, index) => (

                  <div className="activity-item" key={index}>

                    <div className="college-activity-icon">
                      ✓
                    </div>

                    <div className="activity-content">
                      <strong>{activity.title}</strong>
                      <p>{activity.description}</p>
                      <small>{activity.time}</small>
                    </div>

                  </div>

                ))}

              </div>

            </div>

          </section>

        )}

        {/* RECENT ACTIVITY */}

        {activeSection === "activity" && (

          <section className="page-section">

            <div className="page-title">

              <h2>Recent Activity</h2>

              <p>
                All recent college and student activities.
              </p>

            </div>

            <div className="dashboard-panel full-panel">

              {[...studentActivities, ...collegeActivities.map(
                (activity) => ({
                  student: "College",
                  activity: activity.title,
                  time: activity.time,
                })
              )].map((activity, index) => (

                <div className="activity-item" key={index}>

                  <div className="activity-avatar">
                    {activity.student.charAt(0)}
                  </div>

                  <div className="activity-content">

                    <strong>{activity.student}</strong>

                    <p>{activity.activity}</p>

                    <small>{activity.time}</small>

                  </div>

                </div>

              ))}

            </div>

          </section>

        )}

      </main>

      {/* STUDENT DETAIL MODAL */}

      {selectedStudent && (

        <div
          className="modal-overlay"
          onClick={() => setSelectedStudent(null)}
        >

          <div
            className="student-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="close-modal"
              onClick={() => setSelectedStudent(null)}
            >
              ×
            </button>

            <div className="modal-avatar">
              {selectedStudent.name.charAt(0)}
            </div>

            <h2>{selectedStudent.name}</h2>

            <p>{selectedStudent.rollNo}</p>

            <div className="modal-details">

              <div>
                <span>Internship</span>
                <strong>{selectedStudent.internship}</strong>
              </div>

              <div>
                <span>Organization</span>
                <strong>{selectedStudent.organization}</strong>
              </div>

              <div>
                <span>Duration</span>
                <strong>{selectedStudent.duration}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{selectedStudent.status}</strong>
              </div>

            </div>

            <div className="modal-progress">

              <div>
                <span>Internship Progress</span>
                <strong>{selectedStudent.progress}%</strong>
              </div>

              <div className="large-progress-bar">

                <div
                  className="large-progress-fill"
                  style={{
                    width: `${selectedStudent.progress}%`,
                  }}
                ></div>

              </div>

            </div>

            <button
              className="close-button"
              onClick={() => setSelectedStudent(null)}
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default CollegeDashboard;