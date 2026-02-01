import { useState, useEffect } from "react";
import LandingHeader from "./LandingHeader";
import { Link } from "react-router-dom";
import logo from "../images/logo.png";

function LandingPage() {
  const words = ["Placement.", "Internship.", "Grad Role.", "Career."];
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];

    let timeout = setTimeout(() => {
      if (!deleting) {
        setText(currentWord.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);

        if (charIndex + 1 === currentWord.length) {
          setTimeout(() => setDeleting(true), 1000);
        }
      } else {
        setText(currentWord.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);

        if (charIndex - 1 === 0) {
          setDeleting(false);
          setWordIndex((wordIndex + 1) % words.length);
        }
      }
    }, deleting ? 100 : 150);

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, words]);

  return (
    <>
      <LandingHeader />
      <section className="landing-hero">
          <div className="hero-left">
          <h1>Own Your <span id="dynamic-text">{text}</span></h1>
          <h2> Built by placement students, for placement students to help you succeed during industrial placement — and stand out after. </h2>
          <Link to="/createaccount" className="submit-button"> Start </Link>
        </div>
        <div className="hero-right">
            <img src={logo} alt="Logo" className="hero-image" />
        </div>
      </section>
    </>
  );
}

export default LandingPage;