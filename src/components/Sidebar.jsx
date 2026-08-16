import { NavLink } from "react-router-dom";
import { FiBarChart2, FiBriefcase, FiClipboard, FiCalendar, FiUser, FiLogOut } from "react-icons/fi";
import "../styles/sidebar.css";

const links = [
  { to: "/student/dashboard", label: "Dashboard", icon: FiBarChart2 },
  { to: "/student/browse", label: "Browse Internships", icon: FiBriefcase },
  { to: "/student/applications", label: "My Applications", icon: FiClipboard },
  { to: "/student/attendance", label: "Attendance", icon: FiCalendar },
  { to: "/student/profile", label: "Profile", icon: FiUser },
];

function Sidebar() {
  return (
    <aside className="student-sidebar">
      <div>
        <div className="brand">
          <div className="brand-mark">FI</div>
          <div>
            <strong>Farm Internship</strong>
            <span>Student Portal</span>
          </div>
        </div>

        <div className="nav-label">MAIN MENU</div>
        <nav className="student-nav">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar small">RK</div>
          <div>
            <strong>Rahul Kumar</strong>
            <span>Student</span>
          </div>
        </div>
        <button className="logout-btn" type="button" onClick={() => alert("Logout can be connected to authentication later.")}>
          <FiLogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
