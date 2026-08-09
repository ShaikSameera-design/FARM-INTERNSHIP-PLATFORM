import { Link } from "react-router-dom";
import "../styles/hero.css";

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="row align-items-center gy-5">
          <div className="col-lg-6">
            <span className="badge-brand">Farm Internship Platform</span>
            <h1 className="hero-heading mt-3">
              Learn. Grow. Contribute. <br />
              Your Journey in Agriculture <span className="text-brand-primary">Starts Here!</span>
            </h1>
            <p className="hero-description mt-3">
              Discover meaningful farm internships, gain hands-on experience and build
              real agricultural skills with verified farmers across the country.
            </p>

            <form className="hero-search" role="search" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                className="form-control hero-search-input"
                placeholder="Search internships..."
                aria-label="Search internships"
              />
              <input
                type="text"
                className="form-control hero-search-input"
                placeholder="Location"
                aria-label="Location"
              />
              <button type="submit" className="btn btn-brand-primary hero-search-btn">
                Search
              </button>
            </form>

            <div className="d-flex flex-wrap gap-3 mt-4">
              <Link to="/register/student" className="btn btn-brand-primary btn-lg">
                Register as Student
              </Link>
              <Link to="/register/farmer" className="btn btn-brand-outline btn-lg">
                Register as Farmer
              </Link>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="hero-image-wrap">
              <img
                src="src/assets/b-udaykiran-1JsVrsGCAlY-unsplash.jpg"
                alt="Farmer smiling in an agricultural field"
                className="hero-image"
              />
              <div className="hero-floating-card">
                <span className="hero-floating-icon"></span>
                <div>
                  <strong>Certified Program</strong>
                  <p className="mb-0 small">Recognized by partner colleges</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


export default HeroSection;
