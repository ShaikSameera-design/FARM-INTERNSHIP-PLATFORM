import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import "../styles/navbar.css";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/#about" },
  { label: "Internships", to: "/#internships" },
  { label: "For Farmers", to: "/#categories" },
  { label: "Contact", to: "/#contact" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isFirstMount = useRef(true);

  // Scroll to section based on URL hash or top of page
  useEffect(() => {
    let isReload = false;
    if (isFirstMount.current) {
      const navEntries = window.performance.getEntriesByType("navigation");
      isReload = navEntries.length > 0 && navEntries[0].type === "reload";
      isFirstMount.current = false;
    }

    if (isReload && location.pathname === "/") {
      window.scrollTo(0, 0);
      if (location.hash) {
        navigate("/", { replace: true });
      }
      return;
    }

    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    }
  }, [location.pathname, location.hash, navigate]);

  const handleNavClick = (e, link) => {
    setIsOpen(false);
    
    // Scroll to top if clicking Home while already on Home
    if (link.label === "Home" && location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      navigate("/", { replace: true });
      return;
    }
    
    // Smooth scroll for hash links if already on Home page
    if (link.to.startsWith("/#") && location.pathname === "/") {
      e.preventDefault();
      const id = link.to.replace("/#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        navigate(link.to, { replace: true });
      }
    }
  };

  return (
    <nav className="navbar navbar-expand-lg brand-navbar sticky-top">
      <div className="container-fluid px-lg-5">
        <Link 
          to="/" 
          className="navbar-brand brand-logo"
          onClick={(e) => {
            if (location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              navigate("/", { replace: true });
            }
          }}
        >
          <span className="brand-logo-icon"><FaLeaf /></span>
          <span>
            Agri<span className="text-brand-primary">Intern</span>
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="mainNavbar"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="mainNavbar">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            {navLinks.map((link) => (
              <li className="nav-item" key={link.label}>
                <NavLink 
                  to={link.to} 
                  className="nav-link brand-nav-link" 
                  onClick={(e) => handleNavClick(e, link)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li className="nav-item dropdown ms-lg-3 mt-2 mt-lg-0">
              <button 
                className="btn btn-brand-primary dropdown-toggle" 
                type="button" 
                id="loginDropdown" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                Login
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="loginDropdown">
                <li><Link className="dropdown-item" to="/login?role=Student" onClick={() => setIsOpen(false)}>Student</Link></li>
                <li><Link className="dropdown-item" to="/login?role=Farmer" onClick={() => setIsOpen(false)}>Farmer</Link></li>
                <li><Link className="dropdown-item" to="/login?role=College" onClick={() => setIsOpen(false)}>College</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

