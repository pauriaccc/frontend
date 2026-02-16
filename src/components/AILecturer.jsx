import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import logo from "../images/logo.png";

function AILecturer() {
    const [message, setMessage] = useState("")
    const [prompt, setPrompt] = useState("")
    const [loading, setLoading] = useState(false)
    const [talking, setTalking] = useState(false)
    const [saved, setSaved] = useState(false);

    function callBackend(event) {
        event.preventDefault()
        setLoading(true)
        setTalking(false)
        setMessage("")
        setSaved(false);

        fetch(`http://localhost:8080/api/ai?prompt=${encodeURIComponent(prompt)}`)
            .then((response) => response.text())
            .then((data) => {
                setMessage(data)
                setLoading(false)
                setTalking(true)
                setTimeout(() => setTalking(false), 2500)
            })
            .catch(() => {
                setMessage("Failed to fetch message.")
                setLoading(false)
            })
    }

//      function callBackendStream(event) {
//        event.preventDefault();
//        setLoading(true);
//        setTalking(false);
//        setMessage("");
//        setSaved(false);
//
//        const url = `http://localhost:8080/api/ai/stream?prompt=${encodeURIComponent(prompt)}`;
//        const es = new EventSource(url);
//
//        es.onmessage = (e) => {
//          setMessage(prev => prev + e.data + " ");
//          setLoading(false);
//          setTalking(true);
//        };
//
//        es.onerror = () => {
//          es.close();
//          setTalking(false);
//          setLoading(false);
//        };
//      }

    function saveResponseToNotepad() { //Could Dictionary save method be called?
        const newDictionary = {
            dictionaryId: "N" + crypto.randomUUID().slice(0, 5),
            title:  prompt ? prompt.charAt(0).toUpperCase() + prompt.slice(1) : "AI Explanation",
            content: message,
            tags: ["AI Lecturer"],
        };

        fetch("http://localhost:8080/api/dictionaries/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(newDictionary),
        })
            .then(() => setSaved(true))
            .catch(console.error);
    }

    return (
        <>
            <Navbar />
            <div className="main ai-page">
                <div className="ai-lecturer-card">
                    <div className="ai-lecturer">
                        <img
                            className={`logoImage ${ loading ? "thinking" : "" } ${ talking ? "talking" : "" }`}
                            src={logo}
                            alt="Placement Pal Logo"
                        />
                        <div className="thinking-wrapper">
                            {loading && (
                                <div className="thinking-dots">
                                    <div></div>
                                </div>
                            )}
                        </div>
                        <h1>How Can I Help?</h1>
                        <h4>Ask me To Explain Anything!</h4>
                    </div>
                    <form className="search-response-container" onSubmit={callBackend}>
                        <input
                            className="ai-input"
                            type="text"
                            value={prompt}
                            onChange={(e) =>
                                setPrompt(e.target.value)
                            }
                            placeholder="Enter prompt..."
                        />
                        <button className="submit-button" type="submit">Send</button>
                    </form>
                    {message && (
                        <div className="ai-response-wrapper">
                            <div className="ai-response-card">
                                <div className="ai-response-header">
                                    <span className="ai-badge">AI</span>
                                    <span className="ai-response-title">Explanation</span>
                                </div>

                                <div className="ai-response-content">
                                    {message}
                                </div>
                            </div>

                            <div className="ai-response-actions">
                                <button
                                    className="submit-button"
                                    onClick={saveResponseToNotepad}
                                    disabled={saved}
                                > {saved ? "Saved ✓" : "Save"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default AILecturer;