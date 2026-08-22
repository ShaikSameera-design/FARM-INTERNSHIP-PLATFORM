import { useMemo, useState } from "react";
import { FiBriefcase, FiCheckCircle, FiClock, FiXCircle, FiSearch, FiEye, FiMapPin } from "react-icons/fi";
import Navbar from "../../components/Navbar";
import { internships } from "../../data/studentData";
import { getApplications } from "../../utils/storage";
import { Link } from "react-router-dom";

function StatusBadge({ status }) {
  const Icon = status === "Approved" ? FiCheckCircle : status === "Rejected" ? FiXCircle : FiClock;
  return <span className={`status-badge ${status.toLowerCase()}`}><Icon /> {status}</span>;
}

function MyApplications() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const applications = getApplications();

  const rows = useMemo(() => applications.map((app) => ({ ...app, internship: internships.find((item) => item.id === app.internshipId) })).filter((row) => {
    const matchFilter = filter === "All" || row.status === filter;
    const matchSearch = row.internship?.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  }), [applications, filter, search]);

  return (
    <>
      <Navbar title="My Applications" description="Track the progress of every internship application." />

      <section className="application-stats">
        <div><FiBriefcase /><span>Total</span><strong>{applications.length}</strong></div>
        <div><FiCheckCircle /><span>Approved</span><strong>{applications.filter((x) => x.status === "Approved").length}</strong></div>
        <div><FiClock /><span>Pending</span><strong>{applications.filter((x) => x.status === "Pending").length}</strong></div>
        <div><FiXCircle /><span>Rejected</span><strong>{applications.filter((x) => x.status === "Rejected").length}</strong></div>
      </section>

      <section className="panel table-panel">
        <div className="panel-head">
          <div><h3>Application History</h3><p>All your submitted internship applications.</p></div>
        </div>
        <div className="table-toolbar">
          <div className="search-field compact"><FiSearch /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search applications..." /></div>
          <div className="filter-tabs">
            {["All", "Approved", "Pending", "Rejected"].map((item) => <button className={filter === item ? "selected" : ""} onClick={() => setFilter(item)} key={item}>{item}</button>)}
          </div>
        </div>
        <div className="application-table-wrap">
          <table className="application-table">
            <thead><tr><th>Internship</th><th>Location</th><th>Applied On</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td><div className="table-title"><div className={`table-logo ${row.internship?.color}`}>🌱</div><div><strong>{row.internship?.title}</strong><span>{row.internship?.organization}</span></div></div></td>
                  <td><span className="location-cell"><FiMapPin /> {row.internship?.location}</span></td>
                  <td>{row.appliedOn}</td>
                  <td><StatusBadge status={row.status} /></td>
                  <td><Link className="table-action" to={`/student/internship/${row.internship?.id}`}><FiEye /> View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <div className="empty-table"><FiSearch /><p>No applications match your filter.</p></div>}
      </section>
    </>
  );
}

export default MyApplications;
