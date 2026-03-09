import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../images/logo.png";

function Navbar() {
    const navigate = useNavigate();
    const [noteCount, setNoteCount] = useState(0);
    const [loadingNotes, setLoadingNotes] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function loadNotes() {
            try {
                const res = await fetch("http://localhost:8080/api/dictionaries", { credentials: "include" });

                if (!res.ok) { throw new Error("Failed to fetch notes"); }

                const data = await res.json();
                if (!cancelled) {
                    setNoteCount(Array.isArray(data) ? data.length : 0);
                }
            } catch (err) {
                console.error(err);
                if (!cancelled) {
                    setNoteCount(0);
                }
            } finally {
                if (!cancelled) {
                    setLoadingNotes(false);
                }
            }
        }

        loadNotes();
        return () => {
            cancelled = true;
        };
    }, []);

    const quizLocked = loadingNotes || noteCount < 10;
    const quizTooltip = loadingNotes
        ? "Checking your notes..."
        : `Add 10 Notes to Unlock! ${noteCount}/10`;

    const summaryTooltip = "Development in Progress :)";

    return (
        <nav className="navbar">
            <div
                className="logoDiv"
                onClick={() => navigate("/dashboard")}
                style={{ cursor: "pointer" }}
            >
                <h3 className="logoText">PlacementPal</h3>
                <img className="logoImage" src={logo} alt="Placement Pal Logo" />
            </div>

            <Link to="/dashboard">Dashboard</Link>
            <Link to="/journals">Journals</Link>
            <Link to="/dictionaries">Notepad</Link>
            <Link to="/lecturer">AI Tutor</Link>

            {quizLocked ? (
                <span
                    className="navbar-locked-link"
                    data-tooltip={quizTooltip}
                    aria-disabled="true"
                >
                    AI Quiz
                </span>
            ) : (
                <Link to="/quiz">AI Quiz</Link>
            )}

            <span
                className="navbar-locked-link"
                data-tooltip={summaryTooltip}
                aria-disabled="true"
            >
                AI Summary
            </span>

            <Link to="/settings">⚙</Link>
        </nav>
    )
}
export default Navbar