import React, { useEffect, useState } from "react";
import { certificatesApi } from "../../api/communicationApi";
import CertificateCard from "./CertificateCard";

/** Shows all certificates earned by a given student. */
export default function CertificateList({ studentId }) {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) return;
    certificatesApi
      .list({ studentId })
      .then(setCertificates)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <p className="cm-empty-state">Loading certificates…</p>;
  if (error) return <p className="cm-error-state">Couldn't load certificates: {error}</p>;
  if (certificates.length === 0) return <p className="cm-empty-state">No certificates issued yet.</p>;

  return (
    <div className="cm-certificate-list">
      {certificates.map((cert) => (
        <CertificateCard key={cert.id} certificate={cert} />
      ))}
    </div>
  );
}
