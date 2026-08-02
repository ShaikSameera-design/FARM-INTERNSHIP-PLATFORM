import React from "react";

function AnalyticsView() {
  const monthlyData = [
    { month: "Jan", applications: 45, placements: 30 },
    { month: "Feb", applications: 60, placements: 42 },
    { month: "Mar", applications: 85, placements: 65 },
    { month: "Apr", applications: 110, placements: 88 },
    { month: "May", applications: 140, placements: 115 },
    { month: "Jun", applications: 180, placements: 148 }
  ];

  const categoryBreakdown = [
    { name: "Organic Farming", count: 48, percentage: 35, color: "#258145" },
    { name: "Dairy Farming", count: 36, percentage: 26, color: "#1a73e8" },
    { name: "Horticulture", count: 28, percentage: 20, color: "#7b1fa2" },
    { name: "Crop Management", count: 16, percentage: 12, color: "#d97706" },
    { name: "Poultry Farming", count: 10, percentage: 7, color: "#e53935" }
  ];

  return (
    <div className="admin-page-view">
      {/* PAGE HEADER */}
      <div className="admin-page-header">
        <div>
          <h2>Platform Analytics & Metrics</h2>
          <p>Real-time statistical overview of internship applications, placements, and regional growth.</p>
        </div>
        <button
          className="add-user-btn"
          onClick={() => alert("Downloading Platform Analytics PDF Report...")}
        >
          📥 Download Full Report
        </button>
      </div>

      {/* KPI METRICS GRID */}
      <div className="admin-stats-grid" style={{ marginBottom: "24px" }}>
        <div className="admin-stat-card">
          <div className="stat-header">
            <div className="stat-icon green">🎯</div>
            <span className="stat-trend up">94%</span>
          </div>
          <div className="stat-body">
            <span>Placement Success Rate</span>
            <h2>94.2%</h2>
            <small>Applied vs Placed students</small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-header">
            <div className="stat-icon blue">💰</div>
            <span className="stat-trend up">+₹500</span>
          </div>
          <div className="stat-body">
            <span>Average Stipend</span>
            <h2>₹5,250 /mo</h2>
            <small>Monthly student allowance</small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-header">
            <div className="stat-icon purple">⭐</div>
            <span className="stat-trend up">4.8 / 5</span>
          </div>
          <div className="stat-body">
            <span>Student Satisfaction</span>
            <h2>4.85 ★</h2>
            <small>Based on 120 host reviews</small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-header">
            <div className="stat-icon amber">📜</div>
            <span className="stat-trend up">Issued</span>
          </div>
          <div className="stat-body">
            <span>Certificates Awarded</span>
            <h2>385</h2>
            <small>Verified internship completions</small>
          </div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="admin-grid-two">
        {/* APPLICATIONS VS PLACEMENTS CHART */}
        <section className="admin-panel">
          <div className="panel-header">
            <div>
              <h3>Monthly Application & Placement Trends</h3>
              <p>Growth trajectory from January to June 2026</p>
            </div>
          </div>

          <div style={{ padding: "16px 0", display: "flex", flexDirection: "column", gap: "14px" }}>
            {monthlyData.map((d) => (
              <div key={d.month} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "600", color: "#19281e" }}>
                  <span>{d.month} 2026</span>
                  <span style={{ color: "#258145" }}>
                    {d.placements} Placed / {d.applications} Applications
                  </span>
                </div>
                <div style={{ height: "10px", background: "#edf3ee", borderRadius: "10px", overflow: "hidden", display: "flex" }}>
                  <div
                    style={{
                      width: `${(d.placements / 200) * 100}%`,
                      background: "linear-gradient(90deg, #258145 0%, #36a35d 100%)",
                      borderRadius: "10px"
                    }}
                  />
                  <div
                    style={{
                      width: `${((d.applications - d.placements) / 200) * 100}%`,
                      background: "#bde3c8",
                      borderRadius: "0 10px 10px 0"
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "20px", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #edf2ee", fontSize: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "12px", height: "12px", background: "#258145", borderRadius: "3px" }}></span>
              <strong>Confirmed Placements</strong>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "12px", height: "12px", background: "#bde3c8", borderRadius: "3px" }}></span>
              <strong>Applications Received</strong>
            </div>
          </div>
        </section>

        {/* DOMAIN BREAKDOWN */}
        <section className="admin-panel">
          <div className="panel-header">
            <div>
              <h3>Internship Domain Distribution</h3>
              <p>Breakdown across agricultural specializations</p>
            </div>
          </div>

          <div className="distribution-list">
            {categoryBreakdown.map((cat) => (
              <div className="distribution-item" key={cat.name}>
                <div className="distribution-labels">
                  <strong>{cat.name}</strong>
                  <span>{cat.count} Placements ({cat.percentage}%)</span>
                </div>
                <div className="distribution-bar">
                  <div
                    className="distribution-fill"
                    style={{ width: `${cat.percentage}%`, background: cat.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #edf2ee", textAlign: "center" }}>
            <span style={{ fontSize: "12px", color: "#6a796e" }}>
              💡 <strong>Top Demand:</strong> Organic & Dairy Farming represent 61% of total student interest.
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AnalyticsView;
