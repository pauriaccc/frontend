import { Link } from "react-router-dom";
import logo from "../images/logo.png";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="logoDiv">
                <img className="logoImage" src={logo} alt="Placement Pal Logo"/>
                <h3 className="logoText">PlacementPal</h3>
            </div>
            <Link to="/lecturer">AI Lecturer</Link>
            <Link to="/journals">Journals</Link>
            <Link to="/dictionaries">Dictionaries</Link>
        </nav>
    )
}
export default Navbar