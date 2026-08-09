import "../styles/sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="logo">
        <h2>Farm Internship</h2>
        <p>Student Portal</p>
      </div>

      <nav className="menu">

        <a href="#" className="active">Dashboard</a>

        <a href="#">Browse Internships</a>

        <a href="#">My Applications</a>

        <a href="#">Attendance</a>

      </nav>

      <div className="logout">

        <button>Logout</button>

      </div>

    </aside>
  );
}

export default Sidebar;