import "../styles/navbar.css";

function Navbar() {
  return (
    <div className="navbar">

      <div>
        <h2>Student Dashboard</h2>
        <p>Manage your internships efficiently</p>
      </div>

      <div className="profile">
        <img
          src="https://i.pravatar.cc/100"
          alt="profile"
        />
        <div>
          <h4>Rahul Kumar</h4>
          <p>Student</p>
        </div>
      </div>

    </div>
  );
}

export default Navbar;