import React from "react";
import { certificatesApi } from "../../api/communicationApi";

export default function CertificateCard({ certificate }) {
  const { id, internship_title, farmer_name, start_date, end_date, status, certificate_uid } = certificate;

  const fmt = (d) => new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className={`cm-certificate-card ${status === "revoked" ? "cm-certificate-revoked" : ""}`}>
      <div className="cm-certificate-card-icon">🎓</div>
      <div className="cm-certificate-card-body">
        <h4>{internship_title}</h4>
        {farmer_name && <p className="cm-certificate-meta">Mentor: {farmer_name}</p>}
        <p className="cm-certificate-meta">
          {fmt(start_date)} – {fmt(end_date)}
        </p>
        <p className="cm-certificate-uid">ID: {certificate_uid}</p>
        {status === "revoked" && <span className="cm-badge-revoked">Revoked</span>}
      </div>
      <a
        className="cm-btn-primary cm-certificate-download"
        href={certificatesApi.downloadUrl(id)}
        target="_blank"
        rel="noopener noreferrer"
      >
        Download PDF
      </a>
    </div>
  );
}
