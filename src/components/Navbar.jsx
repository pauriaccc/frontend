import { Link } from "react-router-dom";
import logo from "../images/logo.png";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    return (
        <nav className="navbar">
            <div className="logoDiv" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
                <h3 className="logoText">PlacementPal</h3>
                <img className="logoImage" src={logo} alt="Placement Pal Logo"/>
            </div>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/journals">Journals</Link>
            <Link to="/lecturer">AI Tutor</Link>
            <Link to="/dictionaries">Notepad</Link>
            <Link to="/quiz">AI Quiz</Link>
            <Link to="/settings">⚙</Link>
        </nav>
    )
}
export default Navbar