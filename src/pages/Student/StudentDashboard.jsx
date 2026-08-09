import Sidebar from "../../components/Sidebar";
import "../../styles/dashboard.css";
import Navbar from "../../components/Navbar";
import StatCard from "../../components/StatCard";
import QuickAction from "../../components/QuickAction";

function StudentDashboard() {
  return (
    <div className="dashboard">

        <Sidebar />


      <main className="main-content">
        <Navbar />
        <div className="stats">

    <StatCard
        title="Available Internships"
        value="24"
        color="#22C55E"
    />

    <StatCard
        title="Applied"
        value="08"
        color="#3B82F6"
    />

    <StatCard
        title="Approved"
        value="05"
        color="#F59E0B"
    />

    <StatCard
        title="Attendance"
        value="96%"
        color="#EF4444"
    />

</div>
<div className="quick-section">

    <h2>Quick Actions</h2>

    <div className="quick-grid">

        <QuickAction
title="Browse Internships"
description="Find internships matching your skills"
/>

<QuickAction
title="My Applications"
description="Track application status"
/>

<QuickAction
title="Attendance"
description="View attendance details"
/>

<QuickAction
title="Profile"
description="Update your information"
/>
    </div>

</div>

        <h1>Student Dashboard</h1>

        <p>Welcome to Farm Internship Platform</p>

      </main>

    </div>
  );
}

export default StudentDashboard;