import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

function QuickAction({ to, icon: Icon, title, description }) {
  return (
    <Link to={to} className="action-card">
      <div className="action-icon"><Icon size={21} /></div>
      <div className="action-content">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
      <FiArrowUpRight className="action-arrow" size={18} />
    </Link>
  );
}

export default QuickAction;
