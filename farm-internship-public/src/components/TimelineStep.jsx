function TimelineStep({ index, title, description, isLast }) {
  return (
    <div className="timeline-step">
      <div className="timeline-marker-wrap">
        <span className="timeline-marker">{index}</span>
        {!isLast && <span className="timeline-connector" aria-hidden="true" />}
      </div>
      <div className="timeline-content">
        <h6>{title}</h6>
        <p className="small mb-0">{description}</p>
      </div>
    </div>
  );
}

export default TimelineStep;
