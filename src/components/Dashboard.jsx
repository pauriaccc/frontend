import Navbar from "./Navbar";
import logo from "../images/logo.png";
import Graph from "../images/graphplaceholder.png";
import Typewriter from "./Typewriter";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const studentName = localStorage.getItem("studentName") || "Student";

  const studentInitials = studentName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const [recentEntries, setRecentEntries] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  const greetings = [
    "Welcome",
    "Hey",
    "Hello",
    "Welcome Back",
    "Greetings",
    "Hi There",
    "Good To See You",
    "Ready To Learn",
  ];

  const quips = [
    "Let’s get it done.",
    "Tiny steps count.",
    "One more win today.",
    "You’ve got this.",
    "Progress > perfection.",
    "Consistency beats intensity.",
    "Momentum matters.",
    "Future you will thank you.",
    "Keep the streak alive.",
    "Ship it.",
    "Make it make sense.",
    "Brains on. Let’s go.",
    "Debug first. Panic later.",
    "Compile your thoughts.",
    "One bug at a time.",
    "Readable > clever.",
    "It works. Don’t touch it.",
    "Push small. Push often.",
    "Think, then type.",
    "Don’t forget your journal!",
    "Log it while it’s fresh.",
    "Today counts.",
    "Practice beats theory.",
    "Learn once. Apply twice.",
    "This will click soon.",
    "You’re closer than you think.",
    "Trust the process.",
    `${studentName}, you’re building momentum.`,
    `${studentName}, focus mode: activated.`,
    `Small improvements, big future — ${studentName}.`,
    `Stay consistent, ${studentName}.`,
    `${studentName}, progress looks good on you.`,
    `Lock in, ${studentName}.`,
    `${studentName}, think like an engineer.`,
    `Future ${studentName} appreciates this.`,
    `Level up, ${studentName}.`,
    `${studentName}, earn the streak.`,
    `Keep your standards high, ${studentName}.`,
    `${studentName}, discipline > motivation.`,
    `${studentName}, master the basics.`,
    `${studentName}, stay curious.`,
  ];

  const [greeting] = useState(() => {
    return greetings[Math.floor(Math.random() * greetings.length)];
  });

  const [quip] = useState(() => {
    return quips[Math.floor(Math.random() * quips.length)];
  });

  const weekTitle = "Placement Week One";

  useEffect(() => {
    let cancelled = false;

    async function loadRecent() {
      try {
        setLoadingRecent(true);

        const res = await fetch(
          "http://localhost:8080/api/dictionaries/recent",
          { credentials: "include" }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch recent: ${res.status}`);
        }

        const data = await res.json();

        if (!cancelled) {
          setRecentEntries(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setRecentEntries([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingRecent(false);
        }
      }
    }

    loadRecent();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="page-container">
        <main className="main dashboard">
          <div className="dash-topbar">
            <div className="dash-topbar-inner">
              <div className="dash-topbar-left" />
              <div className="dash-topbar-right">
                <div className="dash-streak" title="Streak">
                  <span>6</span> 🔥
                </div>
                <div className="dash-avatar" title={studentName}>
                  {studentInitials}
                </div>
              </div>
            </div>
          </div>

          <div className="dash-container">
            <div className="dash-grid">
              <section className="dash-left">
                <div className="dash-welcome">
                  <img
                    className="dash-logo-image"
                    src={logo}
                    alt="Placement Pal Logo"
                  />
                  <div className="dash-welcome-text">
                    <h1 className="dash-title">
                      {greeting} {studentName}!
                    </h1>
                    <div className="dash-subtitle">{weekTitle}</div>
                    <div className="dash-subtitle-two">
                      <Typewriter words={[quip]} deleteAfter={false} />
                    </div>
                  </div>
                </div>

                <div className="dash-card">
                  <div className="dash-card-header">
                    <h2 className="dash-card-title">My Learning</h2>
                  </div>

                  <div className="dash-list">
                    {loadingRecent && (
                      <div className="dash-list-empty">
                        Loading your recent notes…
                      </div>
                    )}

                    {!loadingRecent && recentEntries.length === 0 && (
                      <div className="dash-list-empty">
                        No notes yet — click <b>New Entry</b> to add one.
                      </div>
                    )}

                    {!loadingRecent &&
                      recentEntries.map((item) => (
                        <button
                          key={item.dictionaryId}
                          className="dash-list-item"
                          type="button"
                          onClick={() =>
                            navigate("/dictionaries", {
                              state: { focusId: item.dictionaryId },
                            })
                          }
                        >
                          <div className="dash-list-text">
                            <div className="dash-list-title">
                              {item.title}
                            </div>
                            <div className="dash-list-desc">
                              {item.content}
                            </div>
                          </div>
                          <span
                            className="dash-arrow"
                            aria-hidden="true"
                          >
                            ➜
                          </span>
                        </button>
                      ))}
                  </div>

                  <div className="dash-actions">
                    <button
                      className="dash-btn dash-btn-ghost"
                      type="button"
                      onClick={() => navigate("/dictionaries")}
                    >
                      View Notes
                    </button>

                    <button
                      className="dash-btn"
                      type="button"
                      onClick={() =>
                        navigate("/dictionaries", {
                          state: { openNew: true },
                        })
                      }
                    >
                      New Entry
                    </button>
                  </div>
                </div>
              </section>

              <aside className="dash-right">
                <div className="dash-mini-card">
                  <div className="dash-mini-title">Your Stats</div>

                  <div className="dash-stats-row">
                    <div className="dash-avatar">
                      {studentInitials}
                    </div>

                    <div className="dash-stats-info">
                      <div className="dash-stats-name">
                        {studentName}
                      </div>
                      <div className="dash-stats-level">
                        Level 1
                      </div>

                      <div className="dash-progress">
                        <div
                          className="dash-progress-fill"
                          style={{ width: "55%" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dash-mini-card">
                  <div className="dash-mini-title">
                    Today's Journal
                  </div>
                  <div className="dash-mini-body">
                    <div className="dash-mini-muted">
                      You have not entered today's journal!
                    </div>
                    <button
                      className="dash-btn dash-btn-small"
                      type="button"
                      onClick={() =>
                        navigate("/journals", {
                          state: { openNew: true },
                        })
                      }
                    >
                      Enter
                    </button>
                  </div>
                </div>

                <div className="dash-mini-card">
                  <div className="dash-mini-title">
                    Struggling to Understand?
                  </div>
                  <div className="dash-mini-body">
                    <div className="dash-mini-muted">
                      Speak to your AI Lecturer
                    </div>
                    <button
                      className="dash-btn dash-btn-small"
                      type="button"
                      onClick={() => navigate("/lecturer")}
                    >
                      Say Hi
                    </button>
                  </div>
                </div>

                <div
                  className="dash-mini-card"
                  style={{ height: 300 }}
                >
                  <div className="dash-mini-title">
                    Learning Progress
                  </div>
                  <div className="dash-mini-body">
                    <div className="dash-mini-muted">
                      <img
                        src={Graph}
                        alt="Learning progress graph"
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Dashboard;