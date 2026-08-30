import "../College/College.css";

function PublicPage() {
  const navigateToRole = (path) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const portalCards = [
    {
      title: "College",
      icon: "🏫",
      color: "#10b981",
      description: "Manage internship programs, monitor student progress, and coordinate with farm partners.",
      path: "/college",
      accent: "#ecfdf5",
    },
    {
      title: "Student",
      icon: "👨‍🎓",
      color: "#3b82f6",
      description: "Apply for internships, track attendance, and stay on top of your placement journey.",
      path: "/student",
      accent: "#eff6ff",
    },
    {
      title: "Farmer",
      icon: "🚜",
      color: "#16a34a",
      description: "Post internships, approve students, and mentor the next generation of agri talent.",
      path: "/farmer",
      accent: "#f0fdf4",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #f7faf7 0%, #eef7f1 100%)", fontFamily: "Inter, sans-serif" }}>
      <header style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "18px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "30px" }}>🌱</span>
          <div>
            <h2 style={{ margin: 0, fontSize: "22px", color: "#0f172a" }}>FarmIntern</h2>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Agri-Internship Platform</span>
          </div>
        </div>

        <nav style={{ display: "flex", gap: "18px", alignItems: "center", flexWrap: "wrap" }}>
          <a href="#home" style={{ color: "#1f2937", textDecoration: "none", fontWeight: 600 }}>Home</a>
          <a href="#about" style={{ color: "#1f2937", textDecoration: "none", fontWeight: 600 }}>About</a>
          <a href="#features" style={{ color: "#1f2937", textDecoration: "none", fontWeight: 600 }}>Features</a>
          <a href="#contact" style={{ color: "#1f2937", textDecoration: "none", fontWeight: 600 }}>Contact</a>
        </nav>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={() => navigateToRole("/college")} style={{ padding: "10px 16px", borderRadius: "999px", border: "1px solid #dbe6df", background: "#fff", color: "#1f2937", fontWeight: 600, cursor: "pointer" }}>
            College Login
          </button>
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px 60px" }}>
        <section id="home" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "28px", alignItems: "center", background: "linear-gradient(135deg, #113b2d 0%, #1a7b4f 50%, #3fa96c 100%)", borderRadius: "28px", padding: "42px 38px", color: "#fff", marginBottom: "42px", boxShadow: "0 22px 44px rgba(17, 59, 45, 0.18)" }}>
          <div>
            <span style={{ display: "inline-block", background: "rgba(255,255,255,0.16)", padding: "7px 12px", borderRadius: "999px", fontSize: "11px", letterSpacing: "0.12em", fontWeight: 700 }}>
              NEXT-GEN FARM INTERNSHIP PLATFORM
            </span>
            <h1 style={{ fontSize: "clamp(2.3rem, 4vw, 4rem)", margin: "18px 0 14px", lineHeight: 1.1, letterSpacing: "-0.05em" }}>
              Build a stronger farm internship network.
            </h1>
            <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.9)", margin: "0 0 26px", maxWidth: "620px", lineHeight: 1.7 }}>
              Connect colleges, students, and farm partners through one smart platform for internships, attendance, progress tracking, and communication.
            </p>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <button
                onClick={() => navigateToRole("/college")}
                style={{ padding: "14px 22px", borderRadius: "12px", background: "#fff", color: "#0f5a3c", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "15px" }}
              >
                Login as College
              </button>
              <button
                onClick={() => navigateToRole("/student")}
                style={{ padding: "14px 22px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.08)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "15px" }}
              >
                Student Login
              </button>
              <button
                onClick={() => navigateToRole("/farmer")}
                style={{ padding: "14px 22px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.08)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "15px" }}
              >
                Farmer Login
              </button>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "260px", fontSize: "150px", opacity: 0.95 }}>
            🌾
          </div>
        </section>

        <section style={{ marginBottom: "42px", display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "18px" }}>
          {[
            { value: "15+", label: "Partner colleges" },
            { value: "350+", label: "Students tracked" },
            { value: "120+", label: "Farm partners" },
            { value: "95%", label: "Satisfaction rate" },
          ].map((stat) => (
            <div key={stat.label} style={{ background: "#fff", borderRadius: "18px", padding: "22px 18px", border: "1px solid #e6efe9", textAlign: "center", boxShadow: "0 10px 26px rgba(16, 42, 31, 0.05)" }}>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "#0f5a3c", marginBottom: "6px" }}>{stat.value}</div>
              <div style={{ color: "#64748b", fontSize: "13px" }}>{stat.label}</div>
            </div>
          ))}
        </section>

        <section id="about" style={{ background: "#fff", borderRadius: "28px", border: "1px solid #e4eee7", padding: "38px 30px", marginBottom: "42px" }}>
          <div style={{ textAlign: "center", marginBottom: "26px" }}>
            <span style={{ display: "inline-block", fontSize: "12px", letterSpacing: "0.12em", color: "#0f5a3c", fontWeight: 700, textTransform: "uppercase" }}>About</span>
            <h2 style={{ fontSize: "32px", margin: "12px 0 10px", color: "#162f26" }}>A connected ecosystem for agricultural learning</h2>
            <p style={{ maxWidth: "760px", margin: "0 auto", color: "#64748b", lineHeight: 1.7 }}>
              FarmIntern brings together academic institutions, students, and farm partners to simplify internship placement, improve supervision, and strengthen practical agricultural training.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "22px" }}>
            <div style={{ background: "#f9fbfa", borderRadius: "20px", padding: "24px 20px", border: "1px solid #edf2ef" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🎓</div>
              <h3 style={{ margin: "0 0 10px", color: "#162f26" }}>For Colleges</h3>
              <p style={{ margin: 0, color: "#64748b", lineHeight: 1.7 }}>Coordinate placements, monitor progress, and evaluate student internship outcomes with real-time insight.</p>
            </div>
            <div style={{ background: "#f9fbfa", borderRadius: "20px", padding: "24px 20px", border: "1px solid #edf2ef" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🧑‍🎓</div>
              <h3 style={{ margin: "0 0 10px", color: "#162f26" }}>For Students</h3>
              <p style={{ margin: 0, color: "#64748b", lineHeight: 1.7 }}>Discover internship opportunities, manage applications, and remain informed about attendance and progress.</p>
            </div>
            <div style={{ background: "#f9fbfa", borderRadius: "20px", padding: "24px 20px", border: "1px solid #edf2ef" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🚜</div>
              <h3 style={{ margin: "0 0 10px", color: "#162f26" }}>For Farmers</h3>
              <p style={{ margin: 0, color: "#64748b", lineHeight: 1.7 }}>Post internships, assess candidates, and support students with guided practical field experience.</p>
            </div>
          </div>
        </section>

        <section id="features" style={{ marginBottom: "42px" }}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <span style={{ display: "inline-block", fontSize: "12px", letterSpacing: "0.12em", color: "#0f5a3c", fontWeight: 700, textTransform: "uppercase" }}>Features</span>
            <h2 style={{ fontSize: "32px", margin: "12px 0 10px", color: "#162f26" }}>Everything needed to run internship programs smoothly</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "22px" }}>
            {portalCards.map((portal) => (
              <div key={portal.title} style={{ background: "#fff", borderRadius: "22px", padding: "28px 24px", border: "1px solid #e4eee7", boxShadow: "0 12px 28px rgba(16, 42, 31, 0.06)" }}>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "58px", height: "58px", borderRadius: "16px", background: portal.accent, fontSize: "30px", marginBottom: "14px" }}>
                  {portal.icon}
                </div>

                <h3 style={{ margin: "0 0 10px", fontSize: "24px", color: "#162f26" }}>{portal.title}</h3>
                <p style={{ margin: "0 0 18px", color: "#64748b", lineHeight: 1.65, fontSize: "14px" }}>
                  {portal.description}
                </p>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => navigateToRole(portal.path)}
                    style={{ padding: "11px 16px", borderRadius: "10px", background: portal.color, color: "#fff", border: "none", fontWeight: 700, cursor: "pointer" }}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigateToRole(portal.path)}
                    style={{ padding: "11px 16px", borderRadius: "10px", background: "#f8fafc", color: "#0f172a", border: "1px solid #dfe7e3", fontWeight: 700, cursor: "pointer" }}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ background: "#113b2d", borderRadius: "28px", padding: "34px 30px", color: "#fff", marginBottom: "42px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "26px" }}>
            {[
              { step: "01", title: "Choose your role", text: "Select the portal that matches your journey as a college, student, or farmer." },
              { step: "02", title: "Create account", text: "Register and gain immediate access to the tools designed for your role." },
              { step: "03", title: "Track outcomes", text: "Monitor internship progress, approvals, attendance, and communication in one place." },
            ].map((item) => (
              <div key={item.step} style={{ background: "rgba(255,255,255,0.06)", borderRadius: "18px", padding: "20px", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize: "12px", letterSpacing: "0.14em", color: "#c7f1d4", fontWeight: 800, marginBottom: "10px" }}>{item.step}</div>
                <h3 style={{ margin: "0 0 10px", fontSize: "24px" }}>{item.title}</h3>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" style={{ background: "#fff", borderRadius: "28px", border: "1px solid #e4eee7", padding: "34px 30px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 0.9fr", gap: "26px", alignItems: "center" }}>
            <div>
              <span style={{ display: "inline-block", fontSize: "12px", letterSpacing: "0.12em", color: "#0f5a3c", fontWeight: 700, textTransform: "uppercase" }}>Contact</span>
              <h2 style={{ margin: "12px 0 10px", fontSize: "32px", color: "#162f26" }}>Let’s grow your internship program together.</h2>
              <p style={{ margin: 0, color: "#64748b", lineHeight: 1.7 }}>
                Need support, want a demo, or want to partner with us? Reach out and we’ll help you build the right system for your institution.
              </p>
            </div>

            <div style={{ background: "#f7fbf8", borderRadius: "20px", padding: "22px", border: "1px solid #edf3ee" }}>
              <div style={{ marginBottom: "14px" }}><strong style={{ color: "#162f26" }}>Email:</strong> <span style={{ color: "#64748b" }}>hello@farmintern.com</span></div>
              <div style={{ marginBottom: "14px" }}><strong style={{ color: "#162f26" }}>Phone:</strong> <span style={{ color: "#64748b" }}>+91 98765 43210</span></div>
              <div><strong style={{ color: "#162f26" }}>Office:</strong> <span style={{ color: "#64748b" }}>Agri Innovation Hub, Hyderabad</span></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default PublicPage;
