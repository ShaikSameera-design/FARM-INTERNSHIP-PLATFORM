import { Link } from "react-router-dom";
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaLinkedin, 
  FaLeaf, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaPhone 
} from "react-icons/fa";
import "../styles/footer.css";

const socialLinks = [
  { label: "Facebook", icon: <FaFacebook />, href: "#" },
  { label: "Instagram", icon: <FaInstagram />, href: "#" },
  { label: "Twitter", icon: <FaTwitter />, href: "#" },
  { label: "LinkedIn", icon: <FaLinkedin />, href: "#" },
];

function Footer() {
  return (
    <footer className="brand-footer" id="contact">
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4 col-md-6">
            <Link to="/" className="brand-logo footer-logo">
              <span className="brand-logo-icon"><FaLeaf /></span>
              <span>
                Agri<span className="text-brand-primary">Intern</span>
              </span>
            </Link>
            <p className="footer-text mt-3">
              Connecting students, farmers and colleges through hands-on agricultural
              internships across the country.
            </p>
            <div className="d-flex gap-2 mt-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="footer-social-icon"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="footer-heading">Quick Links</h6>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/#internships">Internships</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register/student">Student Registration</Link>
              </li>
              <li>
                <Link to="/register/farmer">Farmer Registration</Link>
              </li>
              <li>
                <Link to="/register/college">College Registration</Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="footer-heading">For Farmers</h6>
            <ul className="footer-links">
              <li>
                <Link to="/register/farmer">List an Internship</Link>
              </li>
              <li>
                <Link to="/#categories">Farming Categories</Link>
              </li>
              <li>
                <Link to="/#about">Why Partner With Us</Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="footer-heading">Contact</h6>
            <ul className="footer-links">
              <li><FaMapMarkerAlt className="me-2" /> MG Road, Bengaluru, India</li>
              <li><FaEnvelope className="me-2" /> support@agrintern.example</li>
              <li><FaPhone className="me-2" /> +91 9959534200</li>
            </ul>
          </div>
        </div>

        <hr className="footer-divider" />

        <p className="footer-copyright">
          © {new Date().getFullYear()} AgriIntern. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
