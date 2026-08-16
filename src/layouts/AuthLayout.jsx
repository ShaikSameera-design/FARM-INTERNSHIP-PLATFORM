import { Outlet, Link } from "react-router-dom";
import { FaLeaf, FaArrowLeft } from "react-icons/fa";
import "../styles/auth.css";

function AuthLayout() {
  return (
    <div className="auth-shell">
      <header className="auth-topbar">
        <Link to="/" className="auth-brand">
          <span className="auth-brand-icon"><FaLeaf /></span>
          <span>
            Agri<span className="text-brand-primary">Intern</span>
          </span>
        </Link>
        <Link to="/" className="auth-back-link">
          <FaArrowLeft className="me-2" /> Back to Home
        </Link>
      </header>
      <main className="auth-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AuthLayout;
