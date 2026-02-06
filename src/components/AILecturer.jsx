import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import logo from "../images/logo.png";

function AILecturer() {
    const [message, setMessage] = useState("")
    const [prompt, setPrompt] = useState("")
    const [loading, setLoading] = useState(false)
    const [talking, setTalking] = useState(false)

    function callBackend(event) {
        event.preventDefault()
        setLoading(true)
        setTalking(false)
        setMessage("")

        const systemPrompt = "Explain the following in a short, clear, and simple way that a first-year computer science undergraduate university student would understand. Keep the answer concise and avoid technical jargon: "

        fetch(`http://localhost:8080/api/ai?prompt=${encodeURIComponent(systemPrompt + prompt)}`)
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
                        <div className="ai-response">
                            <strong>{message}</strong>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default AILecturer;