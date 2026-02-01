import { Link } from "react-router-dom";

function LandingHeader() {
  return (
    <div>
        <nav className="landing-navbar">
            <div className="logoDiv">
                <h3 className="logoText">PlacementPal</h3>
            </div>

            <div className="landing-links">
                <Link to="/about">About</Link>
                <Link to="/services">Services</Link>
                <Link to="/login">Login</Link>
            </div>
        </nav>
    </div>
  );
}

export default LandingHeader;