import { FiBell, FiSearch } from "react-icons/fi";
import "../styles/navbar.css";

function Navbar({ eyebrow = "Student Portal", title = "Dashboard", description = "Manage your internship journey from one place." }) {
  return (
    <header className="student-topbar">
      <div className="page-heading">
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="topbar-actions">
        <button className="icon-btn" type="button" aria-label="Search">
          <FiSearch size={19} />
        </button>
        <button className="icon-btn notification" type="button" aria-label="Notifications">
          <FiBell size={19} />
          <i />
        </button>
        <div className="top-profile">
          <div className="avatar">RK</div>
          <div>
            <strong>Rahul Kumar</strong>
            <span>Student</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
