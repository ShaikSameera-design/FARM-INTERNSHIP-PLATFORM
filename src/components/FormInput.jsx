import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function FormInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  autoComplete,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label brand-form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="position-relative">
        <input
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`form-control brand-form-control ${error ? "is-invalid" : ""}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          style={type === "password" ? { paddingRight: "2.5rem" } : {}}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="btn btn-link position-absolute"
            style={{
              top: "50%",
              right: "0.5rem",
              transform: "translateY(-50%)",
              color: "#6c757d",
              padding: 0,
              textDecoration: "none",
              border: "none",
              background: "none",
              display: "flex",
              alignItems: "center",
              zIndex: 10
            }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        )}
        {error && (
          <div className="invalid-feedback" id={`${name}-error`}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default FormInput;
