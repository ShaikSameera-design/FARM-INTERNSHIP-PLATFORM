function SectionTitle({ eyebrow, title, description, align = "center" }) {
  return (
    <div className={`mb-5 ${align === "center" ? "text-center mx-auto" : ""}`} style={{ maxWidth: 680 }}>
      {eyebrow && <span className="badge-brand mb-3">{eyebrow}</span>}
      <h2 className="mt-3" style={{ fontSize: "2.1rem" }}>
        {title}
      </h2>
      {description && <p className="mt-3">{description}</p>}
    </div>
  );
}

export default SectionTitle;
