import React, { useState } from "react";
import NotificationBell from "./notifications/NotificationBell";
import NotificationList from "./notifications/NotificationList";
import FeedbackForm from "./feedback/FeedbackForm";
import FeedbackList from "./feedback/FeedbackList";
import CertificateList from "./certificates/CertificateList";
import CertificateGenerator from "./certificates/CertificateGenerator";
import "../styles/communication.css";

/**
 * Single mountable entry point for the whole Communication Module.
 *
 * This is the ONE component other modules need to import to get
 * notifications + feedback + certificates in their pages — everything
 * else in this module is an internal implementation detail.
 *
 * Usage from another module's page, e.g. a student dashboard:
 *
 *   <CommunicationModule
 *     userId={currentUser.id}
 *     userRole="student"
 *     internshipId={currentInternship?.id}
 *   />
 *
 * `userRole` controls which tabs/actions are shown:
 *   - "student" / "farmer" / "public": notifications, submit feedback, view certificates (student only)
 *   - "admin": notifications, view + respond to feedback, issue certificates
 */
export default function CommunicationModule({ userId, userRole, internshipId }) {
  const isAdmin = userRole === "admin";
  const isStudent = userRole === "student";

  const tabs = [
    { key: "notifications", label: "Notifications" },
    { key: "feedback", label: "Feedback" },
    ...(isStudent || isAdmin ? [{ key: "certificates", label: "Certificates" }] : []),
  ];

  const [activeTab, setActiveTab] = useState("notifications");

  return (
    <div className="cm-module-root">
      <div className="cm-module-header">
        <h2>Communication Center</h2>
        <NotificationBell recipientId={userId} />
      </div>

      <div className="cm-tabbar cm-module-tabbar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? "cm-tab cm-tab-active" : "cm-tab"}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="cm-module-panel">
        {activeTab === "notifications" && <NotificationList recipientId={userId} />}

        {activeTab === "feedback" && (
          <>
            {!isAdmin && (
              <FeedbackForm submittedById={userId} submittedByRole={userRole} internshipId={internshipId} />
            )}
            <FeedbackList internshipId={internshipId} isAdmin={isAdmin} adminId={isAdmin ? userId : undefined} />
          </>
        )}

        {activeTab === "certificates" && (
          <>
            {isAdmin && <CertificateGenerator adminId={userId} />}
            {isStudent && <CertificateList studentId={userId} />}
          </>
        )}
      </div>
    </div>
  );
}
