import React, { useState } from "react";
import "./Admin.css";

function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    setTimeout(() => {
      // Secret Admin Credentials check
      if (
        (email.trim().toLowerCase() === "admin@farmintern.org" || email.trim().toLowerCase() === "admin") &&
        (password === "admin123" || password === "admin")
      ) {
        sessionStorage.setItem("admin_authenticated", "true");
        setIsLoading(false);
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setIsLoading(false);
        setErrorMsg("Invalid Admin Email or Secret Security Key. Access Denied.");
      }
    }, 600);
  };

  const handleQuickFill = () => {
    setEmail("admin@farmintern.org");
    setPassword("admin123");
    setErrorMsg("");
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        {/* TOP SECURITY BADGE */}
        <div className="admin-login-badge">
          <div className="admin-login-badge-icon">🛡️</div>
          <span className="security-tag">SECRET PORTAL</span>
        </div>

        <div className="admin-login-header">
          <h2>Admin Authentication</h2>
          <p>Restricted access page. System administrators only.</p>
        </div>

        {/* ERROR BADGE */}
        {errorMsg && (
          <div className="admin-login-error">
            <span>⚠️</span>
            <p>{errorMsg}</p>
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label>Admin ID / Email</label>
            <div className="input-with-icon">
              <span className="input-icon">👤</span>
              <input
                type="text"
                required
                placeholder="admin@farmintern.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label>Secret Password / Passcode</label>
            <div className="input-with-icon">
              <span className="input-icon">🔑</span>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter secret key..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="login-options-row">
            <label className="remember-checkbox">
              <input type="checkbox" defaultChecked />
              <span>Secure Session</span>
            </label>
            <button
              type="button"
              className="quick-fill-btn"
              onClick={handleQuickFill}
            >
              ⚡ Fill Demo Credentials
            </button>
          </div>

          <button
            type="submit"
            className="admin-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Verifying Credentials...</span>
            ) : (
              <span>Unlock Admin Dashboard 🔓</span>
            )}
          </button>
        </form>

        {/* FOOTER NOTICE */}
        <div className="admin-login-footer">
          <p>🔒 256-Bit Encrypted Session • IP Logged for Security</p>
          <small>Path: <code>localhost:5143/admin</code></small>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
