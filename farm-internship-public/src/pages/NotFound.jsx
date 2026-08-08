import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: "100vh" }}>
      <h1 style={{ fontSize: "3rem" }}>404</h1>
      <p className="mb-4">The page you are looking for doesn&apos;t exist.</p>
      <Link to="/" className="btn btn-brand-primary">
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
