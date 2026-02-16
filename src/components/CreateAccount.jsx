import { useState } from "react";
import LandingHeader from "./LandingHeader";

function CreateAccount() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    placementStart: "",
    placementEnd: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");

      const name = formData.name.trim();
      const email = formData.email.trim();
      const password = formData.password;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const nameRegex = /^[A-Za-z ]+$/;

      if (name.length < 2) {
          setError("Name must be at least 2 characters long");
          return;
      }

      if (!nameRegex.test(name)) {
          setError("Name can only contain letters and spaces");
          return;
      }

      if (await emailExists(email)) {
        setError("An account with this email already exists, please login");
        return;
      }

      if (!emailRegex.test(email)) {
          setError("Please enter a valid email address");
          return;
      }

      if (password.length < 8) {
        setError("Password must be at least 8 characters long");
        return;
      }

      if (!/[A-Z]/.test(password)) {
        setError("Password must contain at least one uppercase letter");
        return;
      }

      if (!/[a-z]/.test(password)) {
        setError("Password must contain at least one lowercase letter");
        return;
      }

      if (!/[0-9]/.test(password)) {
        setError("Password must contain at least one number");
        return;
      }

      if (!/[!@#$%-^&*(),.?":{}|<>]/.test(password)) {
        setError("Password must contain at least one special character");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      try {
        setLoading(true);
        const newStudent = {
            studentId: "S" + crypto.randomUUID().slice(0, 5),
            name: formData.name,
            email: formData.email,
            password: formData.password,
            placementStart: formData.placementStart,
            placementEnd: formData.placementEnd
        };

        const response = await fetch("http://localhost:8080/api/students/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newStudent)
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || "Failed to create account");
        }

        alert("Account created successfully!");
        window.location.href = "/login";

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const emailExists = async (email) => {
      const response = await fetch(
        `http://localhost:8080/api/students/email-exists?email=${encodeURIComponent(email)}`
      );
      return response.ok;
    };

  return (
    <>
      <LandingHeader isCreateAccount={true} />
      <div className="account-page">
        <div className="account-card">
          <div className="account-header-section">
            <h1>Create Account</h1>
            <p>Join today and unlock your full potential on placement!</p>
          </div>
          <form className="account-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="auth-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="auth-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="auth-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="auth-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <div className="date-input-group">
              <div className="date-field">
                <label>Placement Start</label>
                <input
                  type="date"
                  name="placementStart"
                  className="auth-input auth-date"
                  value={formData.placementStart}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="date-field">
                <label>Placement End</label>
                <input
                  type="date"
                  name="placementEnd"
                  className="auth-input auth-date"
                  value={formData.placementEnd}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {error && (
              <p className="create-account-error">
                {error}
              </p>
            )}
            <button
              className="submit-button auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
            <p className="account-login-text">
              Already have an account?{" "}
              <a href="/login" className="account-login-link">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateAccount;