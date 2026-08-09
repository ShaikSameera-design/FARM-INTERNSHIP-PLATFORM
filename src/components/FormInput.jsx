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
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label brand-form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`form-control brand-form-control ${error ? "is-invalid" : ""}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <div className="invalid-feedback" id={`${name}-error`}>
          {error}
        </div>
      )}
    </div>
  );
}

export default FormInput;
