import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiClock, FiDollarSign, FiUser, FiCheckCircle, FiArrowRight } from "react-icons/fi";
import Navbar from "../../components/Navbar";
import { internships } from "../../data/studentData";

function InternshipDetails() {
  const { id } = useParams();
  const internship = internships.find((item) => item.id === Number(id));

  if (!internship) {
    return <div className="empty-state"><h3>Internship not found</h3><Link to="/student/browse" className="primary-btn">Back to internships</Link></div>;
  }

  return (
    <>
      <Navbar title="Internship Details" description="Review the opportunity before submitting your application." />
      <Link className="back-link" to="/student/browse"><FiArrowLeft /> Back to internships</Link>

      <section className="details-hero">
        <div className={`details-logo ${internship.color}`}>{internship.category === "Dairy" ? "🐄" : "🌱"}</div>
        <div className="details-heading">
          <span className="category-pill">{internship.category}</span>
          <h2>{internship.title}</h2>
          <p>{internship.organization}</p>
          <div className="details-meta">
            <span><FiMapPin /> {internship.location}</span>
            <span><FiClock /> {internship.duration}</span>
            <span><FiDollarSign /> {internship.stipend}</span>
          </div>
        </div>
        <Link className="primary-btn details-apply" to={`/student/apply/${internship.id}`}>Apply Now <FiArrowRight /></Link>
      </section>

      <div className="details-grid">
        <section className="panel detail-content">
          <h3>About this internship</h3>
          <p>{internship.description}</p>
          <h3>What you will learn</h3>
          <ul className="check-list">
            {internship.skills.map((skill) => <li key={skill}><FiCheckCircle /> {skill}</li>)}
          </ul>
        </section>
        <aside className="panel opportunity-card">
          <h3>Opportunity summary</h3>
          <div><span>Duration</span><strong>{internship.duration}</strong></div>
          <div><span>Stipend</span><strong>{internship.stipend}</strong></div>
          <div><span>Location</span><strong>{internship.location}</strong></div>
          <div><span>Farmer</span><strong><FiUser /> {internship.farmer}</strong></div>
          <Link className="primary-btn full-btn" to={`/student/apply/${internship.id}`}>Apply for Internship</Link>
        </aside>
      </div>
    </>
  );
}

export default InternshipDetails;
