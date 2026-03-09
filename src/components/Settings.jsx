import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import Footer from "./Footer";

function Settings() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [remindersEnabled, setRemindersEnabled] = useState(false);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("http://localhost:8080/api/students/get", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Request failed (${res.status})`);
        }

        const data = await res.json();
        setStudent(data);
        setRemindersEnabled(data.remindersEnabled)
      } catch (e) {
        setError(e.message || "Failed to load student");
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, []);

  const handleReminderToggle = async () => {
    const newState = !remindersEnabled;
    setRemindersEnabled(newState);

    try {
      const res = await fetch("http://localhost:8080/api/students/update", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...student,
          remindersEnabled: newState,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed (${res.status})`);
      }
    } catch (e) {
      console.error("Failed to update reminders:", e.message);
      setRemindersEnabled(!newState);
    }
  };

  const fieldsToHide = ["password", "id", "studentid", "remindersenabled"];

  return (
    <>
      <Navbar />
      <div className="page-container">
        <main className="main settings-main">
          <div className="settings-container">
            <div className="settings-header">
              <h1 className="settings-title">Settings</h1>
              <p className="settings-subtitle">Manage your account preferences</p>
            </div>

            {loading && <p className="loading-text">Loading student info...</p>}
            {error && <p className="error-text">{error}</p>}

            {student && (
              <div className="settings-grid">
                <div className="settings-card settings-card-details">
                  <h2 className="settings-card-title">Your Details</h2>
                  <div className="settings-info">
                    {Object.entries(student).map(([key, value]) => {
                      if (fieldsToHide.includes(key.toLowerCase())) {
                        return null;
                      }

                      return (
                        <div key={key} className="settings-row">
                          <span className="settings-label">
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}:
                          </span>
                          <span className="settings-value">
                            {typeof value === "object" && value !== null
                              ? JSON.stringify(value)
                              : String(value)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="settings-column-right">
                  <div className="settings-card">
                    <h2 className="settings-card-title">Enable Notifications</h2>
                    <div className="settings-toggle-row">
                      <div>
                        <span className="settings-label"></span>
                        <p className="settings-description"> Get email reminders to write your daily journal, plus updates on streaks and milestones.</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={remindersEnabled}
                          onChange={handleReminderToggle}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <div className="settings-card">
                    <h2 className="settings-card-title">Support</h2>
                    <p className="settings-description">Need help? Contact us:</p>
                    <a href="mailto:placementpal@admin.com" className="settings-link">
                      placementpal@admin.com
                    </a>
                  </div>

                  <div className="settings-card">
                    <Link to="/" style={{ textDecoration: "none" }}>
                      <button className="logout-button">Log Out</button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      <Footer />
      </div>
    </>
  );
}

export default Settings;