import { Link } from "react-router-dom";
import logo from "../images/logo.png";

function LandingHeader() {
  return (
    <div>
        <nav className="landing-header">
            <div className="landingLogoDiv">
                 <h3 className="logoText">PlacementPal</h3>
                <img className="logoImage" src={logo} alt="Placement Pal Logo"/>
            </div>
            <div className="landing-links">
                <Link to="/createaccount">Sign Up</Link>
                <Link to="/login">Login</Link>
            </div>
        </nav>
    </div>
  );
}

export default LandingHeader;