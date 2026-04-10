import Navbar from "./Navbar";
import Footer from "./Footer";
import logo from "../images/logo.png";
import { useState } from "react";

function Summary() {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleGeneratePDF = async () => {
      setGenerating(true);
      setError("");
      setSuccess(false);

      try {
        const res = await fetch("http://localhost:8080/api/ai/summary/pdf", {
          method: "POST",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to generate PDF");
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "placement-certificate.pdf";
        a.click();
        window.URL.revokeObjectURL(url);

        setSuccess(true);
      } catch (err) {
        console.error(err);
        setError("Could not generate PDF.");
      } finally {
        setGenerating(false);
      }
    };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <main className="main ai-page">
          <div className="ai-lecturer-card quiz-start-lecturer-card">
            <div className="ai-lecturer">
              <img className="summary-logo-image " src={logo} alt="Placement Pal Logo" />
              <div className="thinking-wrapper">
                {generating && (
                  <div className="thinking-dots">
                    <div></div>
                  </div>
                )}
              </div>
              <h1>Congratulations!</h1>
              <h4>Generate a PDF summarising your placement, based on your journal and Notepad entries.</h4>
            </div>

            <div className="search-response-container">
              <button
                className="submit-button"
                onClick={handleGeneratePDF}
                disabled={generating || success}
              >
                {success ? "Generated ✓" : generating ? "Generating..." : "Generate PDF"}
              </button>
              {error && <p className="quiz-error">{error}</p>}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
export default Summary;