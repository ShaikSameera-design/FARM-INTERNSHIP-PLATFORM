import React, { useState } from "react";
import CommunicationModule from "./components/CommunicationModule";

/**
 * Demo shell — lets you flip between roles to see how CommunicationModule
 * adapts (student sees certificates + can submit feedback; admin sees the
 * certificate generator + can respond to feedback). This file is only for
 * previewing the module standalone; delete it once you copy the module
 * into the real platform's frontend and render <CommunicationModule .../>
 * directly wherever it belongs (e.g. the student dashboard page).
 */
export default function App() {
  const [userRole, setUserRole] = useState("student");
  const userId = userRole === "admin" ? "admin1" : "student1";

  return (
    <div style={{ padding: "32px 24px", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 760 }}>
        <div style={{ marginBottom: 20, display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#6b6b6b", marginRight: 4 }}>Viewing as:</span>
          {["student", "farmer", "admin", "public"].map((role) => (
            <button
              key={role}
              onClick={() => setUserRole(role)}
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                border: "1px solid #d8d4c6",
                background: userRole === role ? "#2e7d32" : "#fff",
                color: userRole === role ? "#fff" : "#444",
                cursor: "pointer",
                fontSize: 13,
                textTransform: "capitalize",
              }}
            >
              {role}
            </button>
          ))}
        </div>

        <CommunicationModule userId={userId} userRole={userRole} internshipId="intern1" />

        <p style={{ marginTop: 24, fontSize: 12, color: "#999" }}>
          Demo mode — data is in-memory only (see src/api/mockCommunicationApi.js) and resets on refresh.
          Certificate downloads are disabled in this mode since there's no backend generating real PDFs yet.
        </p>
      </div>
    </div>
  );
}
