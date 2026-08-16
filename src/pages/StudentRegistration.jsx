import { useState } from "react";
import { Link } from "react-router-dom";
import FormInput from "../components/FormInput.jsx";
import FormSelect from "../components/FormSelect.jsx";
import studentImage from "./student.jpeg";

const initialState = {
  fullName: "",
  email: "",
  phone: "",
  college: "",
  department: "",
  year: "",
  password: "",
  confirmPassword: "",
};

const departments = [
  "Agriculture",
  "Horticulture",
  "Agricultural Engineering",
  "Food Technology",
  "Animal Husbandry",
];

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

function validate(values) {
  const errors = {};

  if (!values.fullName.trim()) errors.fullName = "Full name is required.";

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

  if (!values.college.trim()) errors.college = "College name is required.";
  if (!values.department) errors.department = "Please select a department.";
  if (!values.year) errors.year = "Please select your year.";

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

function StudentRegistration() {
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
      // Frontend-only demo: no backend call is made.
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
                Student Registration
              </span>
              <h3 className="mt-3 text-white">Create Your Account</h3>
              <p className="mt-2" style={{ color: "rgba(255,255,255,0.85)" }}>
                Join AgriIntern to browse and apply for verified farm internships.
              </p>
              <img
                src={studentImage}
                alt="Student learning in an agricultural field"
                className="auth-illustration-img"
              />
            </div>

            <div className="col-md-7 auth-form-col">
              <h2>Create Your Account</h2>
              <p className="mb-4">Register as a student to start applying for internships.</p>

              {submitted && (
                <div className="alert alert-success" role="status">
                  Registration form validated successfully. (Demo only — no account was created.)
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="auth-radio-group" role="radiogroup" aria-label="Account type">
                  <label className="auth-radio-option selected">
                    <input type="radio" name="accountType" value="student" checked readOnly />
                    Student
                  </label>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <FormInput
                      label="Full Name"
                      name="fullName"
                      value={values.fullName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      error={errors.fullName}
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
                      placeholder="you@example.com"
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
                      label="College"
                      name="college"
                      value={values.college}
                      onChange={handleChange}
                      placeholder="Your college name"
                      error={errors.college}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <FormSelect
                      label="Department"
                      name="department"
                      value={values.department}
                      onChange={handleChange}
                      options={departments}
                      error={errors.department}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <FormSelect
                      label="Year"
                      name="year"
                      value={values.year}
                      onChange={handleChange}
                      options={years}
                      error={errors.year}
                      required
                    />
                  </div>
                </div>

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
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentRegistration;
