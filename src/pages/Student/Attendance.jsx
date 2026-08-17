import { FiCalendar, FiCheckCircle, FiClock, FiXCircle, FiTrendingUp } from "react-icons/fi";
import Navbar from "../../components/Navbar";
import { attendanceRecords } from "../../data/studentData";

function Attendance() {
  const present = attendanceRecords.filter((item) => item.status === "Present").length;
  const percentage = Math.round((present / attendanceRecords.length) * 100);

  return (
    <>
      <Navbar title="Attendance" description="Monitor your internship attendance and daily participation." />
      <section className="attendance-hero panel">
        <div>
          <span className="eyebrow">CURRENT INTERNSHIP</span>
          <h2>Organic Farm Internship</h2>
          <p>Green Valley Farms · Guntur, Andhra Pradesh</p>
        </div>
        <div className="attendance-score"><strong>{percentage}%</strong><span>Attendance</span></div>
      </section>

      <section className="attendance-kpis">
        <div className="panel attendance-kpi"><div className="attendance-icon green"><FiCheckCircle /></div><span>Present Days</span><strong>{present}</strong><small>Recorded days</small></div>
        <div className="panel attendance-kpi"><div className="attendance-icon red"><FiXCircle /></div><span>Absent Days</span><strong>{attendanceRecords.length - present}</strong><small>Needs attention</small></div>
        <div className="panel attendance-kpi"><div className="attendance-icon blue"><FiClock /></div><span>Avg. Daily Hours</span><strong>7.8h</strong><small>Based on records</small></div>
        <div className="panel attendance-kpi"><div className="attendance-icon purple"><FiTrendingUp /></div><span>Performance</span><strong>Excellent</strong><small>Keep it up</small></div>
      </section>

      <section className="panel table-panel">
        <div className="panel-head"><div><h3>Attendance History</h3><p>Your latest daily attendance records.</p></div><button className="calendar-button"><FiCalendar /> August 2026</button></div>
        <div className="application-table-wrap">
          <table className="application-table attendance-table">
            <thead><tr><th>Date</th><th>Day</th><th>Status</th><th>Working Hours</th></tr></thead>
            <tbody>{attendanceRecords.map((item) => <tr key={item.date}><td><strong>{item.date}</strong></td><td>{item.day}</td><td><span className={`status-badge ${item.status.toLowerCase()}`}>{item.status === "Present" ? <FiCheckCircle /> : <FiXCircle />} {item.status}</span></td><td>{item.hours}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default Attendance;
