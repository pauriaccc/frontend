import { useState } from "react";
import Navbar from "./Navbar"
import Header from "./Header"

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
                <h1>Ai Lecturer</h1>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter prompt..."
                />
                <button onClick={callBackend}>Send</button>
                <p>
                    <strong>{message}</strong>
                </p>
          </div>
      </>
    );
}

export default AILecturer;