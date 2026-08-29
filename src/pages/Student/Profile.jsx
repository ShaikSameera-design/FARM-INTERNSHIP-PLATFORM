import { FiMail, FiBookOpen, FiMapPin, FiEdit3, FiCheckCircle } from "react-icons/fi";
import Navbar from "../../components/Navbar";

function Profile() {
  return (
    <>
      <Navbar title="My Profile" description="View your student information and academic details." />
      <section className="profile-hero panel">
        <div className="profile-avatar">RK</div>
        <div className="profile-main">
          <span className="verified"><FiCheckCircle /> Verified Student</span>
          <h2>Rahul Kumar</h2>
          <p>Computer Science & Engineering · B.Tech</p>
          <span className="profile-location"><FiMapPin /> Andhra Pradesh, India</span>
        </div>
        <button className="secondary-btn"><FiEdit3 /> Edit Profile</button>
      </section>

      <div className="profile-grid">
        <section className="panel profile-card">
          <div className="profile-card-title"><div><FiMail /></div><span><strong>Contact Information</strong><small>Your primary contact details</small></span></div>
          <div className="profile-info"><span>Email</span><strong>rahul.kumar@student.com</strong></div>
          <div className="profile-info"><span>Phone</span><strong>+91 98765 43210</strong></div>
        </section>
        <section className="panel profile-card">
          <div className="profile-card-title"><div><FiBookOpen /></div><span><strong>Academic Information</strong><small>Your education details</small></span></div>
          <div className="profile-info"><span>College</span><strong>Rgukt College of Engineering</strong></div>
          <div className="profile-info"><span>Department</span><strong>Computer Science & Engineering</strong></div>
          <div className="profile-info"><span>Year</span><strong>3rd Year</strong></div>
        </section>
      </div>
    </>
  );
}

export default Profile;
