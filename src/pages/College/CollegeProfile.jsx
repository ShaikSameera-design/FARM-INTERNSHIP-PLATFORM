
import "./CollegeProfile.css";

function CollegeProfile() {
  return (
    <div className="college-profile-page">

      {/* PAGE HEADER */}

      <div className="profile-page-header">
        <div>
          <p className="profile-breadcrumb">College Portal / Profile</p>

          <h1>College Profile</h1>

          <p>
            View and manage your college information.
          </p>
        </div>

        <button className="edit-profile-btn">
          ✏️ Edit Profile
        </button>
      </div>


      {/* COLLEGE HERO */}

      <section className="college-profile-hero">

        <div className="college-profile-logo">
          RG
        </div>

        <div className="college-profile-main-info">

          <span className="verified-badge">
            ✓ Registered Institution
          </span>

          <h2>
            Rajiv Gandhi University of Knowledge Technologies, Ongole
          </h2>

          <p>
            Catering to the Educational Needs of Gifted Rural Youth
          </p>

          <div className="college-location">
            📍 Santhanuthalapadu, Prakasam District, Andhra Pradesh
          </div>

        </div>

      </section>


      {/* INFORMATION GRID */}

      <div className="profile-information-grid">

        {/* BASIC INFORMATION */}

        <section className="profile-card">

          <div className="profile-card-header">
            <div className="profile-card-icon">
              🏫
            </div>

            <div>
              <h3>College Information</h3>
              <p>Basic institution details</p>
            </div>
          </div>

          <div className="information-list">

            <div className="information-item">
              <span>Institution Name</span>
              <strong>
                Rajiv Gandhi University of Knowledge Technologies, Ongole
              </strong>
            </div>

            <div className="information-item">
              <span>Short Name</span>
              <strong>RGUKT Ongole</strong>
            </div>

            <div className="information-item">
              <span>Institution Type</span>
              <strong>University / Technical Institution</strong>
            </div>

            <div className="information-item">
              <span>Established</span>
              <strong>2016</strong>
            </div>

            <div className="information-item">
              <span>College ID</span>
              <strong>RGUKT-ONGOLE</strong>
            </div>

          </div>

        </section>


        {/* LOCATION */}

        <section className="profile-card">

          <div className="profile-card-header">

            <div className="profile-card-icon">
              📍
            </div>

            <div>
              <h3>Location & Contact</h3>
              <p>Institution contact information</p>
            </div>

          </div>

          <div className="information-list">

            <div className="information-item">

              <span>Campus Address</span>

              <strong>
                RGUKT Ongole Campus,
                <br />
                Kurnool Road,
                <br />
                Santhanuthalapadu (V&M),
                <br />
                Prakasam District,
                <br />
                Andhra Pradesh - 523225
              </strong>

            </div>

            <div className="information-item">

              <span>Official Website</span>

              <strong>
                www.rguktong.ac.in
              </strong>

            </div>

            <div className="information-item">

              <span>State</span>

              <strong>
                Andhra Pradesh
              </strong>

            </div>

          </div>

        </section>


        {/* ACADEMIC INFORMATION */}

        <section className="profile-card">

          <div className="profile-card-header">

            <div className="profile-card-icon">
              🎓
            </div>

            <div>
              <h3>Academic Information</h3>
              <p>Academic structure</p>
            </div>

          </div>

          <div className="information-list">

            <div className="information-item">

              <span>Academic Model</span>

              <strong>
                Six-Year Integrated Programme
              </strong>

            </div>

            <div className="information-item">

              <span>Programme Structure</span>

              <strong>
                2 Years Pre-University + 4 Years Engineering
              </strong>

            </div>

            <div className="information-item">

              <span>Engineering Degree</span>

              <strong>
                B.Tech
              </strong>

            </div>

            <div className="information-item">

              <span>Learning Model</span>

              <strong>
                Learning by Doing & Problem-Based Learning
              </strong>

            </div>

          </div>

        </section>


        {/* INTERNSHIP INFORMATION */}

        <section className="profile-card">

          <div className="profile-card-header">

            <div className="profile-card-icon">
              🌱
            </div>

            <div>
              <h3>Internship Information</h3>
              <p>Farm internship platform details</p>
            </div>

          </div>

          <div className="information-list">

            <div className="information-item">

              <span>Platform Role</span>

              <strong>
                College
              </strong>

            </div>

            <div className="information-item">

              <span>Internship Coordinator</span>

              <strong>
                Not configured
              </strong>

            </div>

            <div className="information-item">

              <span>Registered Students</span>

              <strong>
                0
              </strong>

            </div>

            <div className="information-item">

              <span>Active Internships</span>

              <strong>
                0
              </strong>

            </div>

          </div>

        </section>

      </div>


      {/* INTERNSHIP COORDINATOR */}

      <section className="profile-card coordinator-card">

        <div className="profile-card-header">

          <div className="profile-card-icon">
            👤
          </div>

          <div>
            <h3>Internship Coordinator</h3>
            <p>
              Person responsible for managing student internships
            </p>
          </div>

        </div>

        <div className="coordinator-content">

          <div className="coordinator-avatar">
            ?
          </div>

          <div>

            <h3>
              Coordinator Not Configured
            </h3>

            <p>
              The internship coordinator details can be added
              when the college profile is configured.
            </p>

          </div>

          <button className="add-coordinator-btn">
            + Add Coordinator
          </button>

        </div>

      </section>


      {/* PLATFORM CONNECTION */}

      <section className="profile-card platform-card">

        <div>

          <span className="platform-label">
            FARM INTERNSHIP PLATFORM
          </span>

          <h2>
            Connect your students with real-world
            agricultural opportunities.
          </h2>

          <p>
            Manage internship participation, monitor student
            progress and coordinate with farming organizations
            through one platform.
          </p>

        </div>

        <div className="platform-icon">
          🌾
        </div>

      </section>

    </div>
  );
}

export default CollegeProfile;