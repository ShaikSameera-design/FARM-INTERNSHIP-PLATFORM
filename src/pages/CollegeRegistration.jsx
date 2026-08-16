import { useState } from "react";
import { Link } from "react-router-dom";
import FormInput from "../components/FormInput.jsx";
import collegeImage from "./college.jpeg";

const initialState = {
  collegeName: "",
  email: "",
  phone: "",
  affiliation: "",
  address: "",
  password: "",
  confirmPassword: "",
};

function validate(values) {
  const errors = {};

  if (!values.collegeName.trim()) errors.collegeName = "College name is required.";

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!/^\d{10}$/.test(values.phone.trim())) {
    errors.phone = "Enter a valid 10-digit phone number.";
  }

  if (!values.affiliation.trim()) errors.affiliation = "University affiliation is required.";
  if (!values.address.trim()) errors.address = "College address is required.";

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

function CollegeRegistration() {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-9">
          <div className="auth-panel row g-0">
            <div className="col-md-5 auth-illustration-col">
              <span className="badge-brand" style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff" }}>
                College Registration
              </span>
              <h3 className="mt-3 text-white">Create Your Account</h3>
              <p className="mt-2" style={{ color: "rgba(255,255,255,0.85)" }}>
                Partner with AgriIntern to provide your students with real-world farming opportunities.
              </p>
              <img
                src={collegeImage}
                alt="College campus"
                className="auth-illustration-img"
              />
            </div>

            <div className="col-md-7 auth-form-col">
              <h2>Create Your Account</h2>
              <p className="mb-4">Register as a college to manage student internships.</p>

              {submitted && (
                <div className="alert alert-success" role="status">
                  Registration form validated successfully. (Demo only — no account was created.)
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="auth-radio-group" role="radiogroup" aria-label="Account type">
                  <label className="auth-radio-option selected">
                    <input type="radio" name="accountType" value="college" checked readOnly />
                    College
                  </label>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <FormInput
                      label="College Name"
                      name="collegeName"
                      value={values.collegeName}
                      onChange={handleChange}
                      placeholder="Full college name"
                      error={errors.collegeName}
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <FormInput
                      label="Email"
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      placeholder="admin@college.edu"
                      error={errors.email}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <FormInput
                      label="Phone"
                      type="tel"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      error={errors.phone}
                      autoComplete="tel"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <FormInput
                      label="University Affiliation"
                      name="affiliation"
                      value={values.affiliation}
                      onChange={handleChange}
                      placeholder="e.g. State University"
                      error={errors.affiliation}
                      required
                    />
                  </div>
                </div>

                <FormInput
                  label="College Address"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  placeholder="City, District, State"
                  error={errors.address}
                  required
                />

                <div className="row">
                  <div className="col-md-6">
                    <FormInput
                      label="Password"
                      type="password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      placeholder="At least 6 characters"
                      error={errors.password}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <FormInput
                      label="Confirm Password"
                      type="password"
                      name="confirmPassword"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      error={errors.confirmPassword}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-brand-primary w-100 mt-2">
                  Register
                </button>
              </form>

              <p className="auth-footer-text">
                Already have an account? <Link to="/login?role=College">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollegeRegistration;
