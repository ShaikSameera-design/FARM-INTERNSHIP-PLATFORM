import { FiArrowUpRight } from "react-icons/fi";

function StatCard({ icon: Icon, label, value, note, tone = "green" }) {
  return (
    <article className={`kpi-card ${tone}`}>
      <div className="kpi-top">
        <div className="kpi-icon"><Icon size={20} /></div>
        <span className="kpi-link"><FiArrowUpRight size={15} /></span>
      </div>
      <span className="kpi-label">{label}</span>
      <strong className="kpi-value">{value}</strong>
      <span className="kpi-note">{note}</span>
    </article>
  );
}

export default StatCard;
