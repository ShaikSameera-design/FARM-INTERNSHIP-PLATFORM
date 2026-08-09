function TestimonialCard({ testimonial }) {
  const { photo, name, college, review } = testimonial;

  return (
    <div className="testimonial-card">
      <p className="testimonial-quote">“{review}”</p>
      <div className="testimonial-author">
        <img src={photo} alt={name} className="testimonial-photo" loading="lazy" />
        <div>
          <strong>{name}</strong>
          <p className="small mb-0">{college}</p>
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;
