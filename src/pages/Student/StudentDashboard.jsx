import { FiBriefcase, FiCheckCircle, FiClock, FiPercent, FiArrowRight, FiMapPin } from "react-icons/fi";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import StatCard from "../../components/StatCard";
import QuickAction from "../../components/QuickAction";
import NotificationCard from "../../components/NotificationCard";
import { internships } from "../../data/studentData";
import { getApplications } from "../../utils/storage";

function StudentDashboard() {
  const applications = getApplications();
  const approved = applications.filter((item) => item.status === "Approved").length;
  const pending = applications.filter((item) => item.status === "Pending").length;

  return (
    <>
      <Navbar
        title="Student Dashboard"
        description="A quick overview of your internship activity."
      />

      <section className="dashboard-hero">
        <div>
          <span className="hero-kicker">WELCOME BACK</span>
          <h2>Build your experience,<br /><em>one internship at a time.</em></h2>
          <p>Discover practical opportunities, track applications and stay on top of your internship progress.</p>
          <Link className="hero-btn" to="/student/browse">
            Explore Internships <FiArrowRight size={17} />
          </Link>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span>🌱</span>
          <div />
        </div>
      </section>

      <section className="kpi-grid">
        <StatCard icon={FiBriefcase} label="Available Internships" value="24" note="Open opportunities" tone="green" />
        <StatCard icon={FiClock} label="Applied" value={String(applications.length).padStart(2, "0")} note="Applications submitted" tone="blue" />
        <StatCard icon={FiCheckCircle} label="Approved" value={String(approved).padStart(2, "0")} note={`${pending} awaiting review`} tone="orange" />
        <StatCard icon={FiPercent} label="Attendance" value="96%" note="Excellent attendance" tone="purple" />
      </section>

      <div className="content-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Quick Actions</h3>
              <p>Jump to the tasks you use most.</p>
            </div>
          </div>
          <div className="actions-grid">
            <QuickAction to="/student/browse" icon={FiBriefcase} title="Browse Internships" description="Find opportunities that match your interests." />
            <QuickAction to="/student/applications" icon={FiCheckCircle} title="My Applications" description="Track every application and its status." />
            <QuickAction to="/student/attendance" icon={FiPercent} title="Attendance" description="Review your internship attendance record." />
            <QuickAction to="/student/profile" icon={FiArrowRight} title="My Profile" description="View and update your student information." />
          </div>
        </section>

        <section className="panel recent-panel">
          <div className="panel-head">
            <div>
              <h3>Recommended for You</h3>
              <p>Fresh opportunities worth exploring.</p>
            </div>
            <Link to="/student/browse">View all</Link>
          </div>
          <div className="mini-internships">
            {internships.slice(0, 3).map((item) => (
              <Link to={`/student/internship/${item.id}`} className="mini-internship" key={item.id}>
                <div className={`mini-logo ${item.color}`}>{item.title.charAt(0)}</div>
                <div>
                  <strong>{item.title}</strong>
                  <span><FiMapPin size={12} /> {item.location}</span>
                </div>
                <FiArrowRight size={16} />
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="panel notification-panel">
        <div className="panel-head">
          <div>
            <h3>Latest Update</h3>
            <p>Important information about your applications.</p>
          </div>
        </div>
        <NotificationCard />
      </section>
    </>
  );
}

export default StudentDashboard;
