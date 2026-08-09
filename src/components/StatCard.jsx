import "../styles/cards.css";

function StatCard({ title, value, color }) {
  return (
    <div className="card">
      <h3>{value}</h3>
      <p>{title}</p>
      <div
        className="line"
        style={{ background: color }}
      ></div>
    </div>
  );
}

export default StatCard;