import LandingHeader from "./LandingHeader";
import Footer from "./Footer";
import Typewriter from "./Typewriter";
import FeatureRow from "./FeatureRow";
import logo from "../images/logo.png";
import { useNavigate } from "react-router-dom";
import Aurora from "./Aurora";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-shell">
      <Aurora
        colorStops={["#ad16e3","#ea7910","#fbff14"]}
        blend={1}
        amplitude={1.0}
        speed={1.0}
      />
      <div className="landing-content">
        <LandingHeader isLandingPage={true} />
        <section className="landing-hero">
          <div className="hero-left">
            <h1>
              Own Your{" "}
              <Typewriter
                words={["Placement.", "Internship.", "Grad Role.", "Career."]}
              />
            </h1>
            <h2>
              Built by placement students, for placement students to help you
              succeed during industrial placement — and stand out after.
            </h2>
            <button
              className="submit-button"
              onClick={() => navigate("/createaccount")}
            >
              Get Started
            </button>
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
          <h1 className="btf-header">Why Placement Pal?</h1>
          <FeatureRow
              title="Track Your Progress with Journals"
              text="Capture your daily placement experiences in a personal journal designed to support reflection and growth. Record what you learned, note challenges you overcame, and track how your skills are developing over time. Your journal helps you build a clear picture of your progress, making it easier to recognise achievements, identify areas to improve, and create a meaningful record of your professional journey."
              video="/videos/journals.mov"
          />
          <FeatureRow
             title="Reflect & Improve with Your Notepad"
             text="Keep all your important definitions, key concepts, and new learnings in one organised space. Use the notepad to quickly capture ideas, clarify terminology, and create your own personalised reference guide as you progress through your placement. Over time, your notes become a valuable knowledge base you can revisit anytime to reinforce understanding and support your continued development."
             video="/videos/notepad.mov"
             reverse
          />

          <FeatureRow
             title="Learn with Your AI Tutor"
             text="Ask questions whenever you encounter something new or unclear. The AI Tutor helps explain concepts, provide clear definitions, and break down complex topics into simple, easy-to-understand answers. Whether you need quick clarification or deeper insight, it supports your learning in real time, helping you build confidence and understanding as you progress through your placement."
             video="/videos/tutor.mov"
          />

          <FeatureRow
             title="Test Yourself with an AI Quiz"
             text="Reinforce your learning with personalised quizzes generated from the notes in your notepad. The AI creates questions based on the definitions, concepts, and topics you’ve saved, helping you check your understanding and identify areas to improve. Regular self-testing strengthens memory, builds confidence, and ensures your new knowledge stays with you as you progress through your placement."
             video="/videos/quiz.mov"
             reverse
          />

          <FeatureRow
             title="Generate an AI Placement Summary"
             text="Turn your placement experiences into a professional summary ready for your CV or portfolio. The AI reviews your journal entries, notes, and recorded achievements to generate a clear overview of the skills you’ve developed, the tasks you’ve completed, and the progress you’ve made. Save time while ensuring your experience is presented in a confident, well-structured way that highlights your growth and accomplishments."
             video="/videos/summary.mov"
          />
          <div className="btf-ending">
            <h2>Ready to start your journey?</h2>
            <p>
              Take the first step today and create your account. Your career
              growth begins now!
            </p>
            <button
              className="submit-button"
              onClick={() => navigate("/createaccount")}
            >
              Start Now
            </button>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}

export default LandingPage;