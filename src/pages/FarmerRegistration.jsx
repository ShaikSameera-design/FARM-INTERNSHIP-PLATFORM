import { useState } from "react";
import { Link } from "react-router-dom";
import FormInput from "../components/FormInput.jsx";
import FormSelect from "../components/FormSelect.jsx";
import farmerImage from "./farmer.jpeg";

const initialState = {
  farmerName: "",
  email: "",
  phone: "",
  farmName: "",
  farmAddress: "",
  farmingCategory: "",
  experience: "",
  password: "",
  confirmPassword: "",
};

const farmingCategories = [
  "Organic Farming",
  "Dairy Farming",
  "Poultry",
  "Horticulture",
  "Hydroponics",
  "Smart Farming",
];

function validate(values) {
  const errors = {};

  if (!values.farmerName.trim()) errors.farmerName = "Farmer name is required.";

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

  if (!values.farmName.trim()) errors.farmName = "Farm name is required.";
  if (!values.farmAddress.trim()) errors.farmAddress = "Farm address is required.";
  if (!values.farmingCategory) errors.farmingCategory = "Please select a farming category.";

  if (!values.experience.trim()) {
    errors.experience = "Years of experience is required.";
  } else if (!/^\d+$/.test(values.experience.trim())) {
    errors.experience = "Enter a valid number of years.";
  }

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

function FarmerRegistration() {
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
                Farmer Registration
              </span>
              <h3 className="mt-3 text-white">Create Your Account</h3>
              <p className="mt-2" style={{ color: "rgba(255,255,255,0.85)" }}>
                Partner with AgriIntern to host students and share your farming expertise.
              </p>
              <img
                src={farmerImage}
                alt="Farmer working in a green field"
                className="auth-illustration-img"
              />
            </div>

            <div className="col-md-7 auth-form-col">
              <h2>Create Your Account</h2>
              <p className="mb-4">Register as a farmer to host internship opportunities.</p>

              {submitted && (
                <div className="alert alert-success" role="status">
                  Registration form validated successfully. (Demo only — no account was created.)
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="auth-radio-group" role="radiogroup" aria-label="Account type">
                  <label className="auth-radio-option selected">
                    <input type="radio" name="accountType" value="farmer" checked readOnly />
                    Farmer
                  </label>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <FormInput
                      label="Farmer Name"
                      name="farmerName"
                      value={values.farmerName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      error={errors.farmerName}
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
                      label="Farm Name"
                      name="farmName"
                      value={values.farmName}
                      onChange={handleChange}
                      placeholder="Name of your farm"
                      error={errors.farmName}
                      required
                    />
                  </div>
                </div>

                <FormInput
                  label="Farm Address"
                  name="farmAddress"
                  value={values.farmAddress}
                  onChange={handleChange}
                  placeholder="Village, District, State"
                  error={errors.farmAddress}
                  required
                />

                <div className="row">
                  <div className="col-md-6">
                    <FormSelect
                      label="Farming Category"
                      name="farmingCategory"
                      value={values.farmingCategory}
                      onChange={handleChange}
                      options={farmingCategories}
                      error={errors.farmingCategory}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <FormInput
                      label="Years of Experience"
                      name="experience"
                      value={values.experience}
                      onChange={handleChange}
                      placeholder="e.g. 5"
                      error={errors.experience}
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

export default FarmerRegistration;
