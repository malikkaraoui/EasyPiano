export default function StarRating({ rating, max = 5, onChange }) {
  const stars = [];

  for (let i = 1; i <= max; i++) {
    const filled = i <= Math.round(rating);
    stars.push(
      <span
        key={i}
        className={`star ${filled ? "star-filled" : "star-empty"} ${onChange ? "star-clickable" : ""}`}
        onClick={onChange ? () => onChange(i) : undefined}
        role={onChange ? "button" : undefined}
        tabIndex={onChange ? 0 : undefined}
        onKeyDown={
          onChange ? (e) => e.key === "Enter" && onChange(i) : undefined
        }
      >
        {filled ? "★" : "☆"}
      </span>,
    );
  }

  return <div className="star-rating">{stars}</div>;
}
