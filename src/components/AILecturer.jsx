import { useState } from "react";
import Navbar from "./Navbar";
import Header from "./Header";

function AILecturer() {
  const [message, setMessage] = useState("");
  const [prompt, setPrompt] = useState("");

  const callBackend = () => {
    fetch(`http://localhost:8080/api/ai?prompt=${encodeURIComponent(prompt)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then((data) => setMessage(data))
      .catch((error) => {
        console.error("Error fetching message:", error);
        setMessage("Failed to fetch message from API.");
      });
  };

  return (
    <>
      <Navbar />
      <Header />
      <div className="main">
        <h1>AI Lecturer</h1>

        <div className="ai-lecturer-card">
          <input
            className="ai-input"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter prompt..."
          />
          <button className="ai-button" onClick={callBackend}>Send</button>

          {message && (
            <div className="ai-response">
              <strong>{message}</strong>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AILecturer;