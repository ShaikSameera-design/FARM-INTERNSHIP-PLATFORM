import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import FormInput from "../components/FormInput.jsx";
import FormSelect from "../components/FormSelect.jsx";

const initialState = { role: "", email: "", password: "" };

function validate(values) {
  const errors = {};

  if (!values.role) {
    errors.role = "Role is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  }

  return errors;
}

function Login() {
  const location = useLocation();
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get("role");
    if (roleParam && ["Student", "Farmer", "College"].includes(roleParam)) {
      setValues((prev) => ({ ...prev, role: roleParam }));
    }
  }, [location.search]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Frontend-only demo: no backend call is made.
      setSubmitted(true);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-9 col-xl-8">
          <div className="auth-panel row g-0">
            <div className="col-md-5 auth-illustration-col">
              <span className="badge-brand" style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff" }}>
                Welcome Back!
              </span>
              <h3 className="mt-3 text-white">Log in to your account</h3>
              <p className="mt-2" style={{ color: "rgba(255,255,255,0.85)" }}>
                Continue exploring hands-on agricultural internships and manage your journey.
              </p>
              <img
                src="src/assets/b-udaykiran-1JsVrsGCAlY-unsplash.jpg"
                alt="Farmer in a green field"
                className="auth-illustration-img"
              />
            </div>

            <div className="col-md-7 auth-form-col">
              <h2>Welcome Back!</h2>
              <p className="mb-4">Login to your account to continue.</p>

              {submitted && (
                <div className="alert alert-success" role="status">
                  Login form validated successfully. (Demo only — no account was created.)
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <FormSelect
                  label="Select Role"
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  options={["Student", "Farmer", "College"]}
                  error={errors.role}
                  required
                />
                <FormInput
                  label="Email Address"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  error={errors.email}
                  autoComplete="email"
                  required
                />
                <FormInput
                  label="Password"
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  error={errors.password}
                  autoComplete="current-password"
                  required
                />

                <div className="auth-form-options">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="rememberMe" />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember Me
                    </label>
                  </div>
                  <a href="#forgot-password">Forgot Password?</a>
                </div>

                <button type="submit" className="btn btn-brand-primary w-100">
                  Login
                </button>
              </form>

              <p className="auth-footer-text">
                Don&apos;t have an account?<br/>
                <Link to="/register/student">Student</Link> &middot;{" "}
                <Link to="/register/farmer">Farmer</Link> &middot;{" "}
                <Link to="/register/college">College</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
