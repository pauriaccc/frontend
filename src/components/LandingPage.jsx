import { useState, useEffect, useMemo } from "react";
import LandingHeader from "./LandingHeader";
import Footer from "./Footer";
import logo from "../images/logo.png";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const words = useMemo(() => ["Placement.", "Internship.", "Grad Role.", "Career."],[]);

  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

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
              <button className="submit-button" onClick={() => navigate("/createaccount")}> Get Started </button>
          </div>
          <div className="hero-right">
              <img src={logo} alt="Logo" className="hero-image" />
          </div>
          <div className="scroll-indicator">
              <span></span>
              <span></span>
              <span></span>
          </div>
      </section>

      <section className="landing-btf">
          <h1 className="btf-header"> Why Placement Pal? </h1>
          <div className="btf-card">
              <h2>Track Your Progress</h2>
              <p>Monitor your daily and weekly placement achievements, track the skills you’re developing, and build a portfolio of real, tangible progress that shows your growth over time. Keep notes, set milestones, and see your journey clearly, so you never lose track of what you’ve accomplished, , so you never lose track of what you’ve accomplished.</p>
          </div>
          <div className="btf-card">
              <h2>Reflect & Improve</h2>
              <p>Analyze your placement performance in detail, discover strengths and weaknesses, and identify areas for growth. Reflect on what went well, what challenges you faced, and plan your next steps effectively. With structured reflection, you can improve continuously and maximize your learning during every stage of your placement.</p>
          </div>
          <div className="btf-card">
              <h2>Build Your Network</h2>
              <p>Connect with peers, mentors, and placement alumni to expand your professional network. Share insights, ask questions, and gain valuable guidance. Building relationships now will help you access opportunities, learn from experienced professionals, and create lasting connections that support your career for years to come.</p>
          </div>
          <div className="btf-card">
              <h2>Stand Out</h2>
              <p>Create a standout placement portfolio that impresses recruiters and showcases your real-world skills. Highlight projects you’ve completed, the impact you’ve made, and the problem-solving abilities you’ve demonstrated. Showcasing concrete achievements will make your application shine and differentiate you from other candidates.</p>
          </div>
          <div className="btf-card">
              <h2>Stay Motivated</h2>
              <p>Receive insights, tips, and encouragement to stay on track during your placement journey. Celebrate small wins, learn from challenges, and maintain momentum as you progress. With continuous motivation and actionable guidance, you’ll stay focused, confident, and ready to make the most of your placement experience, and ready to make the most of your placement experience.</p>
          </div>
          <div className="btf-ending">
              <h2>Ready to start your journey?</h2>
              <p>Take the first step today and create your account. Your career growth begins now!</p>
              <button className="submit-button" onClick={() => navigate("/createaccount")}>Start Now</button>
          </div>
      </section>
      <Footer />
    </>
  );
}

export default LandingPage;