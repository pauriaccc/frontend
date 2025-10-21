import React, { useState } from "react";

function App() {
  const [message, setMessage] = useState(":p");

  const callBackend = () => {
    fetch("http://localhost:8080/api/hello")
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
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>FrontEnd</h1>
      <button onClick={callBackend}>Press Me</button>
      <p>
        <strong>{message}</strong>
      </p>
    </div>
  );
}

export default App;