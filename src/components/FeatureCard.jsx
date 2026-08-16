function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card">
      <span className="feature-icon" aria-hidden="true">
        {icon}
      </span>
      <h5>{title}</h5>
      <p className="small mb-0">{description}</p>
    </div>
  );
}

export default FeatureCard;
