import { useMemo, useState } from "react";
import { FiBriefcase, FiClock, FiMapPin, FiSearch, FiArrowRight, FiFilter } from "react-icons/fi";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { internships } from "../../data/studentData";

function BrowseInternships() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...new Set(internships.map((item) => item.category))];
  const filtered = useMemo(() => internships.filter((item) => {
    const text = `${item.title} ${item.organization} ${item.location}`.toLowerCase();
    return text.includes(search.toLowerCase()) && (category === "All" || item.category === category);
  }), [search, category]);

  return (
    <>
      <Navbar title="Browse Internships" description="Find practical opportunities that match your skills." />
      <section className="page-intro">
        <div>
          <span className="eyebrow">INTERNSHIP DIRECTORY</span>
          <h2>Find your next opportunity</h2>
          <p>Explore verified farm internships and gain hands-on industry experience.</p>
        </div>
        <div className="result-count"><FiBriefcase /> {filtered.length} opportunities</div>
      </section>

      <section className="filter-bar">
        <div className="search-field">
          <FiSearch size={18} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by internship, organization or location..." />
        </div>
        <div className="select-field">
          <FiFilter size={17} />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </section>

      <section className="internship-grid">
        {filtered.map((item) => (
          <article className="internship-card" key={item.id}>
            <div className={`internship-cover ${item.color}`}>
              <div className="farm-symbol">{item.category === "Dairy" ? "🐄" : item.category === "Apiculture" ? "🐝" : "🌱"}</div>
              <span className="open-badge">OPEN</span>
            </div>
            <div className="internship-body">
              <span className="category-pill">{item.category}</span>
              <h3>{item.title}</h3>
              <p className="organization">{item.organization}</p>
              <div className="meta-row">
                <span><FiMapPin /> {item.location}</span>
                <span><FiClock /> {item.duration}</span>
              </div>
              <div className="card-bottom">
                <div><small>Stipend</small><strong>{item.stipend}</strong></div>
                <Link to={`/student/internship/${item.id}`} className="outline-btn">View Details <FiArrowRight /></Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      {filtered.length === 0 && (
        <div className="empty-state">
          <FiSearch size={28} />
          <h3>No internships found</h3>
          <p>Try another search term or category.</p>
        </div>
      )}
    </>
  );
}

export default BrowseInternships;
