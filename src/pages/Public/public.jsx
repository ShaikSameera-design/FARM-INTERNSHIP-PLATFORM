import "../College/College.css";

function PublicPage() {
  const navigateToRole = (path) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Inter, sans-serif" }}>
      {/* HEADER */}
      <header style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "28px" }}>🌱</span>
          <div>
            <h2 style={{ margin: 0, fontSize: "20px", color: "#0f172a" }}>FarmIntern</h2>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Agri-Internship Platform</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => navigateToRole("/")}
            style={{ padding: "8px 16px", borderRadius: "6px", background: "#10b981", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }}
          >
            College Portal
          </button>
          <button
            onClick={() => navigateToRole("/student")}
            style={{ padding: "8px 16px", borderRadius: "6px", background: "#3b82f6", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }}
          >
            Student Portal
          </button>
          <button
            onClick={() => navigateToRole("/farmer")}
            style={{ padding: "8px 16px", borderRadius: "6px", background: "#16a34a", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }}
          >
            Farmer Portal
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <main style={{ maxWidth: "1100px", margin: "40px auto", padding: "0 20px" }}>
        <section style={{ textAlign: "center", padding: "60px 20px", background: "linear-gradient(135deg, #064e3b 0%, #10b981 100%)", borderRadius: "16px", color: "#ffffff", marginBottom: "40px" }}>
          <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700 }}>
            NEXT-GEN FARM INTERNSHIP PLATFORM
          </span>
          <h1 style={{ fontSize: "36px", margin: "20px 0 12px 0" }}>Connecting Colleges, Students, and Verified Farm Partners</h1>
          <p style={{ maxWidth: "680px", margin: "0 auto 28px auto", fontSize: "16px", opacity: 0.9 }}>
            Seamlessly track student internship progress, verify farm operations, manage certifications, and communicate in real-time.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
            <button
              onClick={() => navigateToRole("/")}
              style={{ padding: "12px 28px", borderRadius: "8px", background: "#ffffff", color: "#065f46", fontSize: "15px", fontWeight: 700, border: "none", cursor: "pointer" }}
            >
              Get Started as College →
            </button>
            <button
              onClick={() => navigateToRole("/student")}
              style={{ padding: "12px 28px", borderRadius: "8px", background: "rgba(255,255,255,0.2)", color: "#ffffff", fontSize: "15px", fontWeight: 700, border: "1px solid #fff", cursor: "pointer" }}
            >
              Browse Student Portal
            </button>
          </div>
        </section>

        {/* THREE PORTAL TILES */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          <div style={{ background: "#fff", padding: "28px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🏫</div>
            <h3 style={{ fontSize: "20px", margin: "0 0 8px 0" }}>For Colleges</h3>
            <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.5" }}>
              Monitor student internship allocations, review daily attendance logs, and track overall institutional progress.
            </p>
            <button onClick={() => navigateToRole("/")} style={{ marginTop: "16px", color: "#10b981", fontWeight: 700, border: "none", background: "none", cursor: "pointer" }}>
              Open College Dashboard →
            </button>
          </div>

          <div style={{ background: "#fff", padding: "28px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>👨‍🎓</div>
            <h3 style={{ fontSize: "20px", margin: "0 0 8px 0" }}>For Students</h3>
            <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.5" }}>
              Apply to verified farm internships, track application status, log daily field practice hours, and earn certificates.
            </p>
            <button onClick={() => navigateToRole("/student")} style={{ marginTop: "16px", color: "#3b82f6", fontWeight: 700, border: "none", background: "none", cursor: "pointer" }}>
              Open Student Portal →
            </button>
          </div>

          <div style={{ background: "#fff", padding: "28px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🚜</div>
            <h3 style={{ fontSize: "20px", margin: "0 0 8px 0" }}>For Farm Partners</h3>
            <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.5" }}>
              Post hands-on farm internship opportunities, approve qualified candidates, and mentor future agricultural leaders.
            </p>
            <button onClick={() => navigateToRole("/farmer")} style={{ marginTop: "16px", color: "#16a34a", fontWeight: 700, border: "none", background: "none", cursor: "pointer" }}>
              Open Farm Partner Portal →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PublicPage;
