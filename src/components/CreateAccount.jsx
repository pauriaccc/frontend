import LandingHeader from "./LandingHeader";

function CreateAccount() {
  return (
    <>
      <LandingHeader isCreateAccount={true}/>
      <div className="account-page">
          <div className="account-card">
              <div className="account-header-section">
                  <h1>Create Account</h1>
                  <p>Join today and unlock your full potential on placement!</p>
              </div>
              <form className="account-form">
                  <input
                      type="text"
                      placeholder="Name"
                      className="auth-input"
                  />
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
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="auth-input"
                  />
                  <div className="date-input-group">
                    <div className="date-field">
                      <label>Placement Start</label>
                      <input
                        type="date"
                        className="auth-input auth-date"
                      />
                    </div>

                    <div className="date-field">
                      <label>Placement End</label>
                      <input
                        type="date"
                        className="auth-input auth-date"
                      />
                    </div>
                  </div>
                  <button className="submit-button auth-submit">Create Account</button>
                  <p style={{ textAlign: "center", marginTop: "15px", color: "#ccc", fontSize: "0.9rem" }}>Already have an account? <a href="/login" style={{ color: "#ffd866", textDecoration: "none" }}>Login</a></p>
              </form>
          </div>
      </div>
    </>
  );
}

export default CreateAccount;