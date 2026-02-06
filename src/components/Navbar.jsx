import { Link } from "react-router-dom";
import logo from "../images/logo.png";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="logoDiv">
                <h3 className="logoText">PlacementPal</h3>
                <img className="logoImage" src={logo} alt="Placement Pal Logo"/>
            </div>
            <Link to="/journals">Journals</Link>
            <Link to="/dictionaries">Notepad</Link>
            <Link to="/lecturer">AI Lecturer</Link>
            <Link to="/settings">⚙</Link>
        </nav>
    )
}
export default Navbar