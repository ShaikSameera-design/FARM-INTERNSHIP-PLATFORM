import "../College/College.css";

function PublicPage() {
  const currentPath = window.location.pathname.toLowerCase();

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
      loginPath: "/login/college",
    },
    {
      title: "Student",
      icon: "👨‍🎓",
      color: "#3b82f6",
      description: "Apply for internships, track attendance, and stay on top of your placement journey.",
      path: "/student",
      accent: "#eff6ff",
      loginPath: "/login/student",
    },
    {
      title: "Farmer",
      icon: "🚜",
      color: "#16a34a",
      description: "Post internships, approve students, and mentor the next generation of agri talent.",
      path: "/farmer",
      accent: "#f0fdf4",
      loginPath: "/login/farmer",
    },
  ];

  const roleConfig = {
    college: {
      title: "College Login",
      description: "Access placement operations, academic coordination, and internship analytics.",
      accent: "#10b981",
      accentSoft: "#ecfdf5",
      icon: "🏫",
      route: "/college",
      highlight: "Manage internship programs",
    },
    student: {
      title: "Student Login",
      description: "Track applications, attendance, and your internship workflow in one place.",
      accent: "#3b82f6",
      accentSoft: "#eff6ff",
      icon: "👨‍🎓",
      route: "/student",
      highlight: "Stay on top of your journey",
    },
    farmer: {
      title: "Farmer Login",
      description: "Review candidates, mentor students, and oversee practical training outcomes.",
      accent: "#16a34a",
      accentSoft: "#f0fdf4",
      icon: "🚜",
      route: "/farmer",
      highlight: "Support the next generation of growers",
    },
  };

  const loginRole = currentPath.startsWith("/login/") ? currentPath.replace("/login/", "") : "";
  const activeRole = roleConfig[loginRole] || null;

  if (activeRole) {
    return (
      <div className="farm-public-shell">
        <style>{`
          * { box-sizing: border-box; }
          body { margin: 0; font-family: Inter, sans-serif; }
          .farm-public-shell {
            min-height: 100vh;
            background: linear-gradient(135deg, #f4fbf6 0%, #edf9f1 100%);
            color: #0f172a;
            font-family: Inter, sans-serif;
          }
          .farm-login-wrap {
            max-width: 1180px;
            margin: 0 auto;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 36px 20px;
          }
          .farm-login-card {
            width: min(1040px, 100%);
            background: rgba(255, 255, 255, 0.92);
            border: 1px solid rgba(148, 163, 184, 0.18);
            border-radius: 32px;
            box-shadow: 0 30px 80px rgba(18, 58, 41, 0.12);
            display: grid;
            grid-template-columns: 1.05fr 0.95fr;
            overflow: hidden;
          }
          .farm-login-left {
            background: linear-gradient(135deg, #123c2f 0%, #0e6d4d 55%, #49b97d 100%);
            padding: 42px 36px;
            color: #fff;
            position: relative;
            overflow: hidden;
          }
          .farm-login-left::before {
            content: "";
            position: absolute;
            inset: auto -40px -35px auto;
            width: 220px;
            height: 220px;
            background: rgba(255,255,255,0.08);
            border-radius: 50%;
          }
          .farm-login-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 14px;
            border-radius: 999px;
            background: rgba(255,255,255,0.12);
            border: 1px solid rgba(255,255,255,0.18);
            font-size: 11px;
            letter-spacing: 0.15em;
            font-weight: 700;
            text-transform: uppercase;
          }
          .farm-login-illustration {
            margin-top: 30px;
            background: rgba(255,255,255,0.09);
            border: 1px solid rgba(255,255,255,0.13);
            border-radius: 24px;
            padding: 22px;
            position: relative;
          }
          .farm-card-showcase {
            background: rgba(255,255,255,0.06);
            border-radius: 18px;
            padding: 18px;
            border: 1px solid rgba(255,255,255,0.1);
          }
          .farm-mini-row {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
            margin-top: 18px;
          }
          .farm-mini-stat {
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 12px;
            padding: 12px;
            text-align: center;
          }
          .farm-login-right {
            padding: 42px 38px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .farm-role-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
          }
          .farm-role-icon {
            width: 56px;
            height: 56px;
            border-radius: 18px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: activeRole.accentSoft;
            color: activeRole.accent;
            font-size: 30px;
          }
          .farm-link-btn {
            appearance: none;
            border: none;
            background: transparent;
            color: #0f5132;
            font-weight: 700;
            cursor: pointer;
          }
          form {
            margin-top: 22px;
            display: grid;
            gap: 18px;
          }
          .farm-field {
            display: grid;
            gap: 9px;
          }
          .farm-field label {
            font-size: 13px;
            color: #475569;
            font-weight: 700;
          }
          .farm-field input {
            width: 100%;
            padding: 14px 16px;
            border-radius: 14px;
            border: 1px solid #dfe9e1;
            background: #f8fafc;
            font-size: 15px;
            color: #0f172a;
            outline: none;
          }
          .farm-field input:focus {
            border-color: #22c55e;
            box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);
          }
          .farm-password-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
          }
          .farm-remember {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #475569;
          }
          .farm-remember input {
            accent-color: #10b981;
          }
          .farm-primary-btn {
            border: none;
            border-radius: 14px;
            padding: 15px 18px;
            background: linear-gradient(135deg, #0f5a3c 0%, #10b981 100%);
            color: #fff;
            font-weight: 800;
            font-size: 15px;
            cursor: pointer;
            box-shadow: 0 16px 30px rgba(16, 185, 129, 0.28);
          }
          .farm-secondary-btn {
            border: 1px solid #dbe7df;
            border-radius: 14px;
            background: #fff;
            color: #0f172a;
            padding: 14px 18px;
            font-weight: 700;
            cursor: pointer;
          }
          .farm-divider {
            display: flex;
            align-items: center;
            gap: 12px;
            color: #94a3b8;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
          }
          .farm-divider::before,
          .farm-divider::after {
            content: "";
            flex: 1;
            height: 1px;
            background: #e2e8f0;
          }
          .farm-login-footer {
            margin-top: 12px;
            text-align: center;
            color: #64748b;
            font-size: 14px;
          }
          @media (max-width: 860px) {
            .farm-login-card {
              grid-template-columns: 1fr;
            }
            .farm-login-left,
            .farm-login-right {
              padding: 28px 22px;
            }
          }
        `}</style>

        <div className="farm-login-wrap">
          <div className="farm-login-card">
            <div className="farm-login-left">
              <div className="farm-login-badge">FarmIntern</div>

              <h1 style={{ margin: "24px 0 12px", fontSize: "clamp(2.1rem, 4vw, 3.2rem)", lineHeight: 1.1 }}>
                Welcome back to your {activeRole.title.replace(" Login", "").toLowerCase()} workspace.
              </h1>

              <p style={{ margin: 0, fontSize: "17px", lineHeight: 1.7, color: "rgba(255,255,255,0.85)" }}>
                {activeRole.description}
              </p>

              <div className="farm-login-illustration" aria-label="platform preview">
                <div className="farm-card-showcase">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                    <div>
                      <div style={{ fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>Live overview</div>
                      <div style={{ fontSize: "24px", fontWeight: 800, marginTop: 6 }}>{activeRole.highlight}</div>
                    </div>
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>✓</div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                    <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "14px", padding: "12px" }}>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>Applications</div>
                      <div style={{ fontSize: "26px", fontWeight: 800, marginTop: "8px" }}>128</div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "14px", padding: "12px" }}>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>Attendance</div>
                      <div style={{ fontSize: "26px", fontWeight: 800, marginTop: "8px" }}>94%</div>
                    </div>
                  </div>

                  <div className="farm-mini-row">
                    <div className="farm-mini-stat">
                      <div style={{ fontSize: "22px" }}>📈</div>
                      <div style={{ fontWeight: 700, marginTop: 8 }}>+18%</div>
                    </div>
                    <div className="farm-mini-stat">
                      <div style={{ fontSize: "22px" }}>👥</div>
                      <div style={{ fontWeight: 700, marginTop: 8 }}>350+</div>
                    </div>
                    <div className="farm-mini-stat">
                      <div style={{ fontSize: "22px" }}>⏱️</div>
                      <div style={{ fontWeight: 700, marginTop: 8 }}>2.4h</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="farm-login-right">
              <div className="farm-role-top">
                <div className="farm-role-icon">{activeRole.icon}</div>
                <button className="farm-link-btn" onClick={() => navigateToRole("/")}>
                  Back to home
                </button>
              </div>

              <div style={{ marginTop: "20px" }}>
                <h2 style={{ margin: 0, fontSize: "32px", color: "#162f26" }}>{activeRole.title}</h2>
                <p style={{ margin: "12px 0 0", color: "#64748b", lineHeight: 1.7 }}>
                  Sign in to continue to the {activeRole.title.replace(" Login", "").toLowerCase()} portal.
                </p>
              </div>

              <form>
                <div className="farm-field">
                  <label htmlFor="email">Email address</label>
                  <input id="email" type="email" placeholder="you@example.com" defaultValue="" />
                </div>

                <div className="farm-field">
                  <div className="farm-password-row">
                    <label htmlFor="password">Password</label>
                    <button type="button" className="farm-link-btn" style={{ fontSize: "12px" }}>Forgot password?</button>
                  </div>
                  <input id="password" type="password" placeholder="Enter your password" defaultValue="" />
                </div>

                <div className="farm-password-row">
                  <label className="farm-remember">
                    <input type="checkbox" />
                    Remember me
                  </label>
                </div>

                <button type="button" className="farm-primary-btn" onClick={() => navigateToRole(activeRole.route)}>
                  Sign in
                </button>

                <div className="farm-divider">or</div>

                <button type="button" className="farm-secondary-btn" onClick={() => navigateToRole(activeRole.route)}>
                  Continue as {activeRole.title.replace(" Login", "")}
                </button>
              </form>

              <div className="farm-login-footer">
                Don’t have an account? <button type="button" className="farm-link-btn" onClick={() => navigateToRole(activeRole.route)}>Create one</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="farm-public-shell">
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Inter, sans-serif; }
        .farm-public-shell {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(70, 190, 120, 0.10), transparent 28%),
            linear-gradient(180deg, #f7faf7 0%, #edf8f1 100%);
          color: #0f172a;
          font-family: Inter, sans-serif;
        }
        .farm-shell {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px 20px 60px;
        }
        .farm-topbar {
          position: sticky;
          top: 0;
          z-index: 20;
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(148, 163, 184, 0.15);
          border-radius: 22px;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.05);
        }
        .farm-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .farm-brand-mark {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f5a3c, #10b981);
          color: white;
          font-size: 22px;
          box-shadow: 0 12px 22px rgba(16, 185, 129, 0.24);
        }
        .farm-brand h2 { margin: 0; font-size: 22px; }
        .farm-subtitle { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #64748b; }
        .farm-nav {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
          align-items: center;
        }
        .farm-nav a {
          text-decoration: none;
          color: #1f2937;
          font-weight: 600;
          transition: color 0.2s ease;
        }
        .farm-nav a:hover { color: #0f5a3c; }
        .farm-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .farm-ghost-btn, .farm-solid-btn {
          border-radius: 999px;
          padding: 11px 18px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .farm-ghost-btn:hover, .farm-solid-btn:hover {
          transform: translateY(-1px);
        }
        .farm-ghost-btn {
          border: 1px solid #dfe9e1;
          background: white;
          color: #0f172a;
        }
        .farm-solid-btn {
          border: none;
          background: linear-gradient(135deg, #0f5a3c 0%, #10b981 100%);
          color: white;
          box-shadow: 0 14px 28px rgba(16, 185, 129, 0.24);
        }
        .farm-hero {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          align-items: center;
          gap: 34px;
          margin-top: 28px;
          background: linear-gradient(135deg, #0d392c 0%, #135a41 32%, #1d8b5d 100%);
          border-radius: 34px;
          padding: 42px 34px;
          color: white;
          box-shadow: 0 28px 64px rgba(9, 44, 31, 0.22);
          position: relative;
          overflow: hidden;
        }
        .farm-hero::before {
          content: "";
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          top: -120px;
          right: -80px;
        }
        .hero-header {
          display: inline-flex;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.14);
          font-size: 11px;
          letter-spacing: 0.13em;
          font-weight: 800;
          text-transform: uppercase;
        }
        .farm-hero h1 {
          font-size: clamp(2.8rem, 5vw, 4.7rem);
          line-height: 0.98;
          letter-spacing: -0.06em;
          margin: 18px 0 14px;
        }
        .farm-hero p {
          color: rgba(255,255,255,0.82);
          font-size: 17px;
          line-height: 1.7;
          margin: 0 0 22px;
          max-width: 620px;
        }
        .farm-cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 26px;
        }
        .farm-primary-cta { background: white; color: #0f5a3c; }
        .farm-secondary-cta { background: rgba(255,255,255,0.06); color: white; border: 1px solid rgba(255,255,255,0.32); }
        .farm-trust-row {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          align-items: center;
          color: rgba(255,255,255,0.8);
          font-size: 13px;
        }
        .farm-dots {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.8);
        }
        .farm-hero-visual {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
        }
        .farm-visual-card {
          width: min(100%, 430px);
          padding: 20px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 28px;
          backdrop-filter: blur(6px);
          box-shadow: 0 18px 36px rgba(12, 56, 42, 0.2);
        }
        .farm-chart-card {
          background: rgba(255,255,255,0.9);
          border-radius: 18px;
          padding: 18px;
          color: #0f172a;
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
        }
        .farm-svg-box {
          height: 170px;
          background: linear-gradient(180deg, #ecfdf5 0%, #dff7eb 100%);
          border-radius: 18px;
          margin-bottom: 14px;
          overflow: hidden;
          border: 1px solid rgba(16, 185, 129, 0.18);
        }
        .farm-metric-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 14px;
        }
        .farm-metric {
          background: #f8fafc;
          border: 1px solid #e8f1eb;
          border-radius: 12px;
          padding: 10px;
          text-align: center;
        }
        .farm-stat-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ecfdf5;
          color: #0f5a3c;
          padding: 6px 10px;
          border-radius: 999px;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .farm-section {
          margin-top: 42px;
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(148,163,184,0.12);
          border-radius: 30px;
          padding: 30px 24px;
          box-shadow: 0 16px 34px rgba(15, 23, 42, 0.04);
        }
        .farm-kicker {
          display: inline-block;
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 800;
          color: #0f5a3c;
        }
        .farm-headline {
          margin: 12px 0 10px;
          font-size: clamp(2rem, 3vw, 2.8rem);
          line-height: 1.1;
          letter-spacing: -0.05em;
        }
        .farm-subcopy {
          color: #64748b;
          line-height: 1.7;
          margin: 0;
        }
        .farm-stat-grid {
          margin-top: 22px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }
        .farm-stat-card {
          background: #fff;
          border: 1px solid #e7efe9;
          border-radius: 18px;
          padding: 22px 14px;
          text-align: center;
        }
        .farm-stat-card strong {
          display: block;
          font-size: 30px;
          color: #0f5a3c;
          font-weight: 900;
          margin-bottom: 6px;
        }
        .farm-stat-card span { color: #64748b; font-size: 13px; }
        .farm-about-grid,
        .farm-feature-grid,
        .farm-process-grid,
        .farm-testimonial-grid {
          margin-top: 26px;
          display: grid;
          gap: 20px;
        }
        .farm-about-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .farm-feature-grid { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
        .farm-process-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .farm-testimonial-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .farm-card {
          background: #fff;
          border: 1px solid #e4eee7;
          border-radius: 24px;
          padding: 24px 22px;
          box-shadow: 0 14px 28px rgba(15, 23, 42, 0.03);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .farm-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 34px rgba(15, 23, 42, 0.08);
        }
        .farm-card-emoji {
          width: 58px;
          height: 58px;
          border-radius: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #ecfdf5;
          font-size: 30px;
          margin-bottom: 16px;
        }
        .farm-card h3 {
          margin: 0 0 10px;
          font-size: 24px;
          color: #162f26;
        }
        .farm-card p {
          margin: 0;
          color: #64748b;
          line-height: 1.7;
        }
        .farm-role-card {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .farm-role-card .farm-card-emoji { background: #f0fdf4; }
        .farm-role-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .farm-role-btn {
          border: none;
          border-radius: 10px;
          padding: 10px 14px;
          font-weight: 700;
          cursor: pointer;
          color: white;
        }
        .farm-role-btn.secondary {
          background: #f8fafc;
          color: #0f172a;
          border: 1px solid #dde7e1;
        }
        .farm-process-card {
          background: linear-gradient(180deg, #113b2d 0%, #185a42 100%);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .farm-process-step {
          display: inline-flex;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 800;
          margin-bottom: 14px;
        }
        .farm-process-card p {
          color: rgba(255,255,255,0.8);
        }
        .farm-testimonial-card strong { display: block; margin-bottom: 14px; color: #162f26; }
        .farm-stars {
          color: #fbbf24;
          letter-spacing: 2px;
          margin-bottom: 12px;
        }
        .farm-cta-banner {
          margin-top: 42px;
          padding: 34px 28px;
          background: linear-gradient(135deg, #0d392c 0%, #156c4d 100%);
          border-radius: 28px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          box-shadow: 0 24px 52px rgba(12, 56, 42, 0.18);
        }
        .farm-cta-banner h3 { margin: 0 0 8px; font-size: clamp(1.8rem, 3vw, 2.8rem); }
        .farm-cta-banner p { margin: 0; color: rgba(255,255,255,0.8); }
        .farm-footer {
          margin-top: 28px;
          padding: 18px 6px 8px;
          display: flex;
          justify-content: space-between;
          gap: 16px;
          color: #64748b;
          font-size: 14px;
          flex-wrap: wrap;
        }
        @media (max-width: 900px) {
          .farm-hero,
          .farm-about-grid,
          .farm-process-grid,
          .farm-testimonial-grid,
          .farm-cta-banner {
            grid-template-columns: 1fr;
            display: grid;
          }
          .farm-hero {
            padding: 28px 22px;
          }
          .farm-topbar { display: grid; gap: 12px; }
          .farm-stat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 560px) {
          .farm-stat-grid,
          .farm-about-grid,
          .farm-feature-grid,
          .farm-process-grid,
          .farm-testimonial-grid {
            grid-template-columns: 1fr;
          }
          .farm-actions { justify-content: flex-start; }
        }
      `}</style>

      <div className="farm-shell">
        <header className="farm-topbar">
          <div className="farm-brand">
            <span className="farm-brand-mark">🌱</span>
            <div>
              <h2>FarmIntern</h2>
              <span className="farm-subtitle">Agri Internship Platform</span>
            </div>
          </div>

          <nav className="farm-nav" aria-label="Main navigation">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="#process">Process</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="farm-actions">
            <button className="farm-ghost-btn" onClick={() => navigateToRole("/login/college")}>College Login</button>
            <button className="farm-solid-btn" onClick={() => navigateToRole("/login/student")}>Student Login</button>
            <button className="farm-ghost-btn" onClick={() => navigateToRole("/login/farmer")}>Farmer Login</button>
          </div>
        </header>

        <main>
          <section id="home" className="farm-hero">
            <div>
              <span className="hero-header">Next-gen farm internship platform</span>
              <h1>Build a stronger agricultural talent pipeline.</h1>
              <p>
                Connect colleges, students, and farm partners through one unified internship ecosystem for placement, tracking, evaluation, and field-ready learning.
              </p>

              <div className="farm-cta-row">
                <button className="farm-ghost-btn farm-primary-cta" onClick={() => navigateToRole("/login/college")}>Login as College</button>
                <button className="farm-ghost-btn farm-secondary-cta" onClick={() => navigateToRole("/login/student")}>Student Login</button>
                <button className="farm-ghost-btn farm-secondary-cta" onClick={() => navigateToRole("/login/farmer")}>Farmer Login</button>
              </div>

              <div className="farm-trust-row">
                <span>Trusted by 120+ farms</span>
                <span className="farm-dots" aria-hidden="true" />
                <span>350+ active learners</span>
                <span className="farm-dots" aria-hidden="true" />
                <span>95% satisfaction</span>
              </div>
            </div>

            <div className="farm-hero-visual" aria-label="Platform preview illustration">
              <div className="farm-visual-card">
                <div className="farm-chart-card">
                  <div className="farm-stat-pill">● Live internship insights</div>

                  <div className="farm-svg-box">
                    <svg viewBox="0 0 360 170" width="100%" height="100%" role="img" aria-label="analytics graph">
                      <defs>
                        <linearGradient id="lineFade" x1="0" x2="1">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#0f5a3c" />
                        </linearGradient>
                      </defs>
                      <g opacity="0.18">
                        <path d="M0 140H360" stroke="#0f172a" strokeWidth="1" />
                        <path d="M0 110H360" stroke="#0f172a" strokeWidth="1" />
                        <path d="M0 80H360" stroke="#0f172a" strokeWidth="1" />
                        <path d="M0 50H360" stroke="#0f172a" strokeWidth="1" />
                      </g>
                      <path d="M10 120 C60 100, 90 80, 120 90 S180 70, 210 60 S270 40, 310 52 S340 35, 350 20" fill="none" stroke="url(#lineFade)" strokeWidth="5" strokeLinecap="round" />
                      <circle cx="210" cy="60" r="7" fill="#0f5a3c" />
                      <circle cx="350" cy="20" r="7" fill="#10b981" />
                    </svg>
                  </div>

                  <div className="farm-metric-grid">
                    <div className="farm-metric">
                      <div style={{ color: "#64748b", fontSize: "12px" }}>Placements</div>
                      <strong style={{ display: "block", marginTop: "6px", fontSize: "24px", color: "#0f5a3c" }}>320</strong>
                    </div>
                    <div className="farm-metric">
                      <div style={{ color: "#64748b", fontSize: "12px" }}>Progress</div>
                      <strong style={{ display: "block", marginTop: "6px", fontSize: "24px", color: "#0f5a3c" }}>94%</strong>
                    </div>
                    <div className="farm-metric">
                      <div style={{ color: "#64748b", fontSize: "12px" }}>Growth</div>
                      <strong style={{ display: "block", marginTop: "6px", fontSize: "24px", color: "#0f5a3c" }}>+18%</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="farm-section">
            <span className="farm-kicker">Impact</span>
            <h2 className="farm-headline">Built for stronger campus-to-farm outcomes.</h2>
            <div className="farm-stat-grid">
              {[
                { value: "15+", label: "Partners colleges" },
                { value: "350+", label: "Students tracked" },
                { value: "120+", label: "Farm partners" },
                { value: "95%", label: "Satisfaction rate" },
              ].map((stat) => (
                <div className="farm-stat-card" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="about" className="farm-section">
            <span className="farm-kicker">About</span>
            <h2 className="farm-headline">One connected ecosystem for agricultural learning.</h2>
            <p className="farm-subcopy" style={{ maxWidth: "760px" }}>
              FarmIntern brings together institutions, students, and farm teams to simplify internship placement, make attendance transparent, and improve communication across every stage of the learning journey.
            </p>

            <div className="farm-about-grid">
              <div className="farm-card">
                <div className="farm-card-emoji">🎓</div>
                <h3>For Colleges</h3>
                <p>Coordinate internship programs, monitor progress, and evaluate outcomes with smarter workflows.</p>
              </div>
              <div className="farm-card">
                <div className="farm-card-emoji">👨‍🎓</div>
                <h3>For Students</h3>
                <p>Access internship opportunities, manage applications, and keep track of attendance and milestones.</p>
              </div>
              <div className="farm-card">
                <div className="farm-card-emoji">🚜</div>
                <h3>For Farmers</h3>
                <p>Review candidates, assign tasks, and guide students with structured training and feedback.</p>
              </div>
            </div>
          </section>

          <section id="features" className="farm-section">
            <span className="farm-kicker">Features</span>
            <h2 className="farm-headline">Everything needed to run a successful internship program.</h2>

            <div className="farm-feature-grid">
              {portalCards.map((portal) => (
                <div className="farm-card farm-role-card" key={portal.title}>
                  <div className="farm-card-emoji" style={{ background: portal.accent }}>{portal.icon}</div>
                  <div>
                    <h3>{portal.title}</h3>
                    <p>{portal.description}</p>
                  </div>

                  <div className="farm-role-actions">
                    <button className="farm-role-btn" style={{ background: portal.color }} onClick={() => navigateToRole(portal.loginPath)}>
                      Login
                    </button>
                    <button className="farm-role-btn secondary" onClick={() => navigateToRole(portal.loginPath)}>
                      Sign up
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="process" className="farm-section">
            <span className="farm-kicker">How it works</span>
            <h2 className="farm-headline">From role selection to measurable learning outcomes.</h2>

            <div className="farm-process-grid">
              {[
                { step: "01", title: "Choose your role", text: "Select the portal that matches your college, student, or farm journey." },
                { step: "02", title: "Create your access", text: "Set up your role-based account and tailor your experience to your workflow." },
                { step: "03", title: "Track outcomes", text: "Measure applications, attendance, approvals, and internship performance in real time." },
              ].map((item) => (
                <div className="farm-card farm-process-card" key={item.step}>
                  <div className="farm-process-step">{item.step}</div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="farm-section">
            <span className="farm-kicker">Feedback</span>
            <h2 className="farm-headline">Loved by learners, faculty, and farm partners.</h2>

            <div className="farm-testimonial-grid">
              {[
                { quote: "The platform made student placements clearer and helped us stay aligned with every department.", author: "Dr. Meera Nair", role: "Placement Coordinator" },
                { quote: "I can easily track opportunities and stay informed about attendance and progress while learning in the field.", author: "Aditya Sharma", role: "Agriculture Student" },
                { quote: "Farm teams can review candidates quickly and provide practical guidance without extra paperwork.", author: "Raghav Patel", role: "Farm Partner" },
              ].map((item) => (
                <div className="farm-card farm-testimonial-card" key={item.author}>
                  <div className="farm-stars">★★★★★</div>
                  <strong>“{item.quote}”</strong>
                  <div style={{ color: "#0f5a3c", fontWeight: 800 }}>{item.author}</div>
                  <div style={{ color: "#64748b", marginTop: 6 }}>{item.role}</div>
                </div>
              ))}
            </div>
          </section>

          <section id="contact" className="farm-cta-banner">
            <div>
              <h3>Ready to transform your internship process?</h3>
              <p>Bring your institution, learners, and farm network together on a smarter platform.</p>
            </div>
            <button className="farm-ghost-btn farm-primary-cta" onClick={() => navigateToRole("/login/student")}>Get started</button>
          </section>

          <footer className="farm-footer">
            <span>© 2026 FarmIntern. All rights reserved.</span>
            <span>Email: hello@farmintern.com</span>
            <span>Phone: +91 98765 43210</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default PublicPage;
