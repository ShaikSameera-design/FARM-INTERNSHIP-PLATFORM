import React from "react";
import "./Farmer.css";

function FarmerProfile() {
  return (
    <div className="farmer-page">

      <div className="page-header">
        <div>
          <p className="page-label">ACCOUNT</p>
          <h1>Farmer Profile</h1>
          <p>Manage your personal and farm information.</p>
        </div>
      </div>

      <div className="profile-card">

        {/* Profile Header */}
        <div className="profile-card-header">
          <div className="large-profile-avatar">
            F
          </div>

          <div>
            <h2>Farmer Name</h2>
            <p>Farmer</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="profile-section">
          <h3>Personal Information</h3>

          <div className="profile-form-grid">

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                placeholder="Enter your location"
              />
            </div>

          </div>
        </div>

        {/* Farm Information */}
        <div className="profile-section">
          <h3>Farm Information</h3>

          <div className="profile-form-grid">

            <div className="form-group">
              <label>Farm Name</label>
              <input
                type="text"
                placeholder="Enter your farm name"
              />
            </div>

            <div className="form-group">
              <label>Farm Type</label>

              <select defaultValue="">
                <option value="" disabled>
                  Select farm type
                </option>
                <option>Organic Farming</option>
                <option>Crop Farming</option>
                <option>Dairy Farming</option>
                <option>Poultry Farming</option>
                <option>Horticulture</option>
                <option>Mixed Farming</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Farm Description</label>

              <textarea
                rows="4"
                placeholder="Describe your farm and agricultural activities"
              ></textarea>
            </div>

          </div>
        </div>

        {/* Actions */}
        <div className="profile-actions">
          <button className="cancel-button">
            Cancel
          </button>

          <button className="save-button">
            Save Changes
          </button>
        </div>

      </div>

    </div>
  );
}

export default FarmerProfile;