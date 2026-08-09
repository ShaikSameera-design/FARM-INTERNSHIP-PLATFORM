function CategoryCard({ image, title, description }) {
  return (
    <div className="category-card">
      <img src={image} alt={title} className="category-image" loading="lazy" />
      <div className="category-body">
        <h5>{title}</h5>
        <p className="small mb-0">{description}</p>
      </div>
    </div>
  );
}

export default CategoryCard;
