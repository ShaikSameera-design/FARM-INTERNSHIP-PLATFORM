import React, { useState } from "react";

export default function StarRating({ value, onChange, readOnly = false }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div className="cm-star-rating" role={readOnly ? undefined : "radiogroup"} aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`cm-star ${star <= display ? "cm-star-filled" : ""}`}
          onClick={() => !readOnly && onChange(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          style={{ cursor: readOnly ? "default" : "pointer" }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
