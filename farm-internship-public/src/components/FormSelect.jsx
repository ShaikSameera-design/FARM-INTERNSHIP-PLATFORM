function FormSelect({ label, name, value, onChange, options, error, required = false }) {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label brand-form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`form-select brand-form-control ${error ? "is-invalid" : ""}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && (
        <div className="invalid-feedback" id={`${name}-error`}>
          {error}
        </div>
      )}
    </div>
  );
}

export default FormSelect;
