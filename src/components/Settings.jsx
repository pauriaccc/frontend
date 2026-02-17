import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

function Settings() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      } catch (e) {
        setError(e.message || "Failed to load student");
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, []);

  return (
    <>
      <Navbar />
      <div className="main">
        <h1>Settings</h1>

        {loading && <p>Loading student info...</p>}
        {error && <p style={{ color: "#dd5a7a" }}>{error}</p>}
        {student && (
          <div className="dictionary-entry" style={{ maxWidth: 700 }}>
            <h2 className="dictionary-title">Your Details</h2>
            <div className="info-container">
              {Object.entries(student).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}:</strong>{" "}
                  {typeof value === "object" && value !== null
                    ? JSON.stringify(value)
                    : String(value)}
                </p>
              ))}
            </div>
            <Link to="/" style={{ textDecoration: "none" }}>
              <button className="submit-button">Log Out</button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default Settings;