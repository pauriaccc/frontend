import { Link } from "react-router-dom";
import logo from "../images/logo.png";

function LandingHeader(props) {
  return (
    <div>
        <nav className="landing-header">
            <Link to="/" className="landingLogoDiv" style={{ textDecoration: "none" }}>
                    <h3 className="logoText">PlacementPal</h3>
                    <img className="logoImage" src={logo} alt="Placement Pal Logo" />
            </Link>
            <div className="landing-links">
                {props.isLandingPage && (
                    <>
                        <Link to="/createaccount">Sign Up</Link>
                        <Link to="/login">Login</Link>
                    </>
                )}
                {!props.isAdminPanel && !props.isLandingPage && !props.isCreateAccount && <Link to="/createaccount">Sign Up</Link>}
                {props.isCreateAccount && <Link to="/login">Login</Link>}
                {props.isAdminPanel && <Link to="/">Log Out</Link>}
            </div>
        </nav>
    </div>
  );
}

export default LandingHeader;