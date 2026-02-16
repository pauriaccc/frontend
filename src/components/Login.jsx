import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LandingHeader from "./LandingHeader";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        if (data.role === "student") {
          localStorage.setItem("studentName", data.name);
          navigate("/dashboard");
        } else if (data.role === "admin") {
          navigate("/admin");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <>
      <LandingHeader isCreateAccount={false} />
      <div className="account-page">
        <div className="account-card login-card">
          <div className="account-header-section">
            <h1>Login</h1>
            <p>Welcome back! Enter your credentials to continue.</p>
          </div>
          <form className="account-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="submit-button auth-submit">Login</button>
          </form>
          {error && <p className="create-account-error">{error}</p>}
          <p className="account-login-text">
            Don't have an account? <a href="/createaccount" className="account-login-link">Sign Up</a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;