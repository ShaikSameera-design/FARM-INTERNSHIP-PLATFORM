import { FiCheckCircle } from "react-icons/fi";

function NotificationCard() {
  return (
    <div className="notice-card">
      <div className="notice-icon"><FiCheckCircle size={20} /></div>
      <div>
        <strong>Application approved</strong>
        <p>Your Organic Farm Internship application has been approved.</p>
      </div>
      <span>Today</span>
    </div>
  );
}

export default NotificationCard;
