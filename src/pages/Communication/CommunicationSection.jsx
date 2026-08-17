import { useMemo, useState } from "react";
import "./CommunicationSection.css";

const initialNotifications = [
  {
    id: 1,
    title: "Application received",
    message: "Your internship application for Green Valley Farms has been received and is under review.",
    time: "2 hours ago",
    type: "info",
    unread: true,
  },
  {
    id: 2,
    title: "Progress reminder",
    message: "Student Anjali Reddy submitted a weekly internship update. Please review the latest activity.",
    time: "5 hours ago",
    type: "alert",
    unread: true,
  },
  {
    id: 3,
    title: "Farm partner approved",
    message: "Sunrise Farms has been added as a verified internship partner for this semester.",
    time: "Yesterday",
    type: "success",
    unread: false,
  },
];

const initialFeedbackItems = [
  {
    id: 1,
    student: "Anjali Reddy",
    topic: "Mentor Support",
    rating: 5,
    summary: "The mentor guidance was clear and helpful throughout the first month.",
    response: "Thank you for the feedback. We are happy to support your learning progress.",
    status: "Responded",
  },
  {
    id: 2,
    student: "Ravi Teja",
    topic: "Work Environment",
    rating: 4,
    summary: "The farm environment was practical and engaging, and the tasks were well explained.",
    response: null,
    status: "Pending",
  },
  {
    id: 3,
    student: "Meghana S",
    topic: "Learning Outcome",
    rating: 3,
    summary: "The internship taught useful techniques, but more hands-on exposure would be ideal.",
    response: "We have scheduled an additional field demonstration session for the upcoming week.",
    status: "Responded",
  },
];

const initialCertificates = [
  {
    id: 1,
    student: "Anjali Reddy",
    internship: "Organic Farming",
    issued: "18 Jul 2026",
    status: "Issued",
  },
  {
    id: 2,
    student: "Ravi Teja",
    internship: "Dairy Farming",
    issued: "09 Jul 2026",
    status: "Verified",
  },
  {
    id: 3,
    student: "Priya Kumar",
    internship: "Crop Management",
    issued: "02 Jul 2026",
    status: "Pending",
  },
];

function CommunicationSection() {
  const [activeTab, setActiveTab] = useState("notifications");
  const [notifications, setNotifications] = useState(initialNotifications);
  const [feedbackItems, setFeedbackItems] = useState(initialFeedbackItems);
  const [certificates, setCertificates] = useState(initialCertificates);

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: false } : item))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  const respondToFeedback = (id) => {
    setFeedbackItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              response: "Thanks for the update. We have scheduled a follow-up review for your internship experience.",
              status: "Responded",
            }
          : item
      )
    );
  };

  const verifyCertificate = (id) => {
    setCertificates((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "Pending" ? "Verified" : item.status }
          : item
      )
    );
  };

  const summary = useMemo(() => {
    const unreadCount = notifications.filter((item) => item.unread).length;
    const pendingFeedback = feedbackItems.filter((item) => item.status === "Pending").length;
    const issuedCertificates = certificates.filter(
      (item) => item.status === "Issued" || item.status === "Verified"
    ).length;

    return {
      unreadCount,
      pendingFeedback,
      issuedCertificates,
    };
  }, [notifications, feedbackItems, certificates]);

  return (
    <section className="communication-section">
      <div className="communication-header">
        <div>
          <p className="section-kicker">COMMUNICATION</p>
          <h2>Communication Center</h2>
        </div>
        <button className="communication-bell" type="button" onClick={markAllNotificationsRead}>
          🔔
        </button>
      </div>

      <div className="communication-summary">
        <div className="summary-card">
          <span className="summary-icon green">🔔</span>
          <div>
            <strong>{summary.unreadCount}</strong>
            <small>Unread alerts</small>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon orange">💬</span>
          <div>
            <strong>{summary.pendingFeedback}</strong>
            <small>Pending feedback</small>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon blue">🏅</span>
          <div>
            <strong>{summary.issuedCertificates}</strong>
            <small>Certificates</small>
          </div>
        </div>
      </div>

      <div className="communication-tabs">
        <button
          type="button"
          className={activeTab === "notifications" ? "active" : ""}
          onClick={() => setActiveTab("notifications")}
        >
          Notifications
        </button>
        <button
          type="button"
          className={activeTab === "feedback" ? "active" : ""}
          onClick={() => setActiveTab("feedback")}
        >
          Feedback
        </button>
        <button
          type="button"
          className={activeTab === "certificates" ? "active" : ""}
          onClick={() => setActiveTab("certificates")}
        >
          Certificates
        </button>
      </div>

      {activeTab === "notifications" && (
        <div className="communication-panel">
          {notifications.map((item) => (
            <div className="message-card" key={item.id} onClick={() => markNotificationRead(item.id)}>
              <div className={`message-icon ${item.type}`}>
                {item.type === "success" ? "✓" : item.type === "alert" ? "!" : "i"}
              </div>
              <div className="message-content">
                <div className="message-topline">
                  <strong>{item.title}</strong>
                  {item.unread && <span className="dot-badge">New</span>}
                </div>
                <p>{item.message}</p>
                <small>{item.time}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "feedback" && (
        <div className="communication-panel feedback-grid">
          {feedbackItems.map((item) => (
            <div className="feedback-card" key={item.id}>
              <div className="feedback-header">
                <div>
                  <strong>{item.student}</strong>
                  <small>{item.topic}</small>
                </div>
                <span className={`status-pill ${item.status === "Pending" ? "pending" : "responded"}`}>
                  {item.status}
                </span>
              </div>

              <div className="stars" aria-label={`${item.rating} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, index) => (
                  <span key={index} className={index < item.rating ? "filled" : ""}>★</span>
                ))}
              </div>

              <p>{item.summary}</p>

              <div className="admin-response">
                <span>Admin response</span>
                <p>{item.response || "No response received yet."}</p>
              </div>

              {item.status === "Pending" && (
                <button type="button" className="action-button" onClick={() => respondToFeedback(item.id)}>
                  Respond
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "certificates" && (
        <div className="communication-panel certificate-list">
          {certificates.map((item) => (
            <div className="certificate-card" key={item.id}>
              <div className="certificate-left">
                <div className="certificate-icon">🏅</div>
                <div>
                  <strong>{item.student}</strong>
                  <small>{item.internship}</small>
                </div>
              </div>

              <div className="certificate-meta">
                <span>Issued</span>
                <strong>{item.issued}</strong>
              </div>

              <div className="certificate-actions">
                <span className={`status-pill ${item.status === "Pending" ? "pending" : "responded"}`}>
                  {item.status}
                </span>
                {item.status === "Pending" && (
                  <button type="button" className="action-button" onClick={() => verifyCertificate(item.id)}>
                    Verify
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default CommunicationSection;
