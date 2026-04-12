import { Link } from "react-router-dom";
import logo from "../images/logo.png";
import ulsterLogo from "../images/ulster.png";

function LandingHeader(props) {
  return (
    <div>
        <nav className={`landing-header ${props.isLecturerPanel ? "lecturer" : ""}`}>
            <Link to="/" className="landingLogoDiv" style={{ textDecoration: "none" }}>
                    <h3 className="logoText">PlacementPal</h3>
                    {!props.isLecturerPanel && <img className="logoImage" src={logo} alt="Placement Pal Logo" /> }
                    {props.isLecturerPanel && <h2> | </h2>}
                    {props.isLecturerPanel && <img className="ulsterLogo" src={ulsterLogo} alt="Ulster University Logo" />}
            </Link>
            <div className="landing-links">
                {props.isLandingPage && (
                    <>
                        <Link to="/createaccount">Sign Up</Link>
                        <Link to="/login">Login</Link>
                    </>
                )}
                {!props.isAdminPanel && !props.isLecturerPanel && !props.isLandingPage && !props.isCreateAccount && <Link to="/createaccount">Sign Up</Link>}
                {props.isCreateAccount && <Link to="/login">Login</Link>}
                {(props.isAdminPanel || props.isLecturerPanel) && ( <Link to="/">Log Out</Link> )}
            </div>
        </nav>
    </div>
  )
}

export default LandingHeader;