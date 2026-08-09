import "../styles/cards.css";

function QuickAction({ title, description }) {
  return (
    <div className="quick-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default QuickAction;