import LandingHeader from "./LandingHeader";

function Login() {
  return (
    <>
      <LandingHeader isCreateAccount={false}/>
      <div className="account-page">
          <div className="account-card login-card">
              <div className="account-header-section">
                  <h1>Login</h1>
                  <p>Welcome back! Enter your credentials to continue.</p>
              </div>
              <form className="account-form">
                  <input
                      type="email"
                      placeholder="Email"
                      className="auth-input"
                  />
                  <input
                      type="password"
                      placeholder="Password"
                      className="auth-input"
                  />
                  <button className="submit-button auth-submit">Login</button>
              </form>
              <p style={{ textAlign: "center", marginTop: "15px", color: "#ccc", fontSize: "0.9rem" }}>Don't have an account? <a href="/createaccount" style={{ color: "#ffd866", textDecoration: "none" }}>Sign Up</a></p>
          </div>
      </div>
    </>
  );
}

export default Login;