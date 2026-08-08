import { FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";

function InternshipCard({ internship }) {
  const { image, title, farm, location, duration, category, stipend } = internship;

  return (
    <div className="internship-card">
      <div className="internship-image-wrap">
        <img src={image} alt={title} className="internship-image" loading="lazy" />
        <span className="internship-category-badge">{category}</span>
      </div>
      <div className="internship-body">
        <h5>{title}</h5>
        <p className="small mb-2">{farm}</p>

        <ul className="internship-meta">
          <li><FaMapMarkerAlt className="me-2 text-brand-primary" /> {location}</li>
          <li><FaCalendarAlt className="me-2 text-brand-primary" /> {duration}</li>
          <li><FaMoneyBillWave className="me-2 text-brand-primary" /> {stipend}</li>
        </ul>

        <button type="button" className="btn btn-brand-outline w-100 mt-3">
          View Details
        </button>
      </div>
    </div>
  );
}

export default InternshipCard;
