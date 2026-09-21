import React, { useState } from "react";
import "./Farmer.css";

function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    applicationNotifications: true,
    messageNotifications: true,
    internshipVisibility: true,
  });

  const toggleSetting = (name) => {
    setSettings({
      ...settings,
      [name]: !settings[name],
    });
  };

  const saveSettings = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="farmer-page">

      <div className="page-header">
        <p className="page-label">ACCOUNT SETTINGS</p>

        <h1>Settings</h1>

        <p>
          Manage your Farmer Portal preferences and notifications.
        </p>
      </div>

      <div className="settings-card">

        <div className="settings-section">

          <h2>Notifications</h2>

          <p className="settings-description">
            Choose which notifications you would like to receive.
          </p>

          <div className="setting-row">

            <div>
              <h3>Email Notifications</h3>
              <p>Receive important updates through email.</p>
            </div>

            <button
              className={
                settings.emailNotifications
                  ? "toggle active-toggle"
                  : "toggle"
              }
              onClick={() => toggleSetting("emailNotifications")}
            >
              <span></span>
            </button>

          </div>

          <div className="setting-row">

            <div>
              <h3>New Application Alerts</h3>
              <p>Get notified when students apply for internships.</p>
            </div>

            <button
              className={
                settings.applicationNotifications
                  ? "toggle active-toggle"
                  : "toggle"
              }
              onClick={() =>
                toggleSetting("applicationNotifications")
              }
            >
              <span></span>
            </button>

          </div>

          <div className="setting-row">

            <div>
              <h3>Message Notifications</h3>
              <p>Receive notifications when interns send messages.</p>
            </div>

            <button
              className={
                settings.messageNotifications
                  ? "toggle active-toggle"
                  : "toggle"
              }
              onClick={() =>
                toggleSetting("messageNotifications")
              }
            >
              <span></span>
            </button>

          </div>

        </div>

        <div className="settings-section">

          <h2>Internship Preferences</h2>

          <p className="settings-description">
            Control how your internship opportunities are displayed.
          </p>

          <div className="setting-row">

            <div>
              <h3>Internship Visibility</h3>
              <p>
                Allow students to discover your active internships.
              </p>
            </div>

            <button
              className={
                settings.internshipVisibility
                  ? "toggle active-toggle"
                  : "toggle"
              }
              onClick={() =>
                toggleSetting("internshipVisibility")
              }
            >
              <span></span>
            </button>

          </div>

        </div>

        <div className="settings-section">

          <h2>Account</h2>

          <div className="account-setting-row">

            <div>
              <h3>Change Password</h3>
              <p>
                Update your Farmer Portal password.
              </p>
            </div>

            <button className="settings-outline-button">
              Change Password
            </button>

          </div>

          <div className="account-setting-row">

            <div>
              <h3>Account Status</h3>
              <p>
                Your farmer account is currently active.
              </p>
            </div>

            <span className="account-active">
              Active
            </span>

          </div>

        </div>

        <div className="settings-actions">

          <button
            className="save-button"
            onClick={saveSettings}
          >
            Save Settings
          </button>

        </div>

      </div>

    </div>
  );
}

export default Settings;