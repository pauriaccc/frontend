import Navbar from "./Navbar";
import logo from "../images/logo.png";
import Graph from "../images/graphplaceholder.png";
import Typewriter from "./Typewriter";
import Footer from "./Footer";
import { getPlacementProgressAndLevel, getPlacementWeekTitle, calculateJournalStreak } from "../utils/HelperMethods";
import { GREETINGS, QUIPS } from "../utils/Constants";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const studentName = localStorage.getItem("studentName") || "Student";
  const placementStart = localStorage.getItem("placementStart");
  const placementEnd = localStorage.getItem("placementEnd");
  const { progress, level, status } = getPlacementProgressAndLevel(placementStart,placementEnd);
  const progressPct = Math.round(progress * 100);
  const navigate = useNavigate();
  const studentInitials = studentName.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
  const [recentEntries, setRecentEntries] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [hasTodayJournal, setHasTodayJournal] = useState(false);
  const [loadingTodayJournal, setLoadingTodayJournal] = useState(true);
  const [streak, setStreak] = useState(0);

  const [greeting] = useState(() => {
    return GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
  });

  const [quip] = useState(() => {
    const quips = QUIPS(studentName);
    return quips[Math.floor(Math.random() * quips.length)];
  });

  const weekTitle = getPlacementWeekTitle(placementStart, placementEnd);

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

useEffect(() => {
  let cancelled = false;
  async function checkTodayJournal() {
    try {
      setLoadingTodayJournal(true);
      const res = await fetch("http://localhost:8080/api/journals/has-today", {
        credentials: "include",
      });

      if (!cancelled) {
        setHasTodayJournal(res.ok);
      }
    } catch (e) {
      console.error(e);
      if (!cancelled) setHasTodayJournal(false);
    } finally {
      if (!cancelled) setLoadingTodayJournal(false);
    }
  }
  checkTodayJournal();
  return () => {
    cancelled = true;
  };
}, []);

useEffect(() => {
  let cancelled = false;
  async function loadStreak() {
    try {
      const res = await fetch("http://localhost:8080/api/journals", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch journals: ${res.status}`);
      }

      const journals = await res.json();

      if (!cancelled) {
        const journalDates = Array.isArray(journals) ? journals.map((journal) => journal.createdTs).filter(Boolean) : [];
        setStreak(calculateJournalStreak(journalDates));
      }
    } catch (err) {
      console.error(err);
      if (!cancelled) {
        setStreak(0);
      }
    }
  }
  loadStreak();
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
                <div className="dash-streak" data-tooltip="Enter Weekday Journals to Maintain Your Streak!">
                  <span>{streak}</span> 🔥
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
                       You don’t have any notes yet — click <b>New Entry</b> to add your first note!
                      </div>
                    )}

                    {!loadingRecent &&
                      recentEntries.map((item) => (
                        <button
                          key={item.dictionaryId}
                          className="dash-list-item"
                          type="button"
                          onClick={() =>
                            navigate("/dictionaries")
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
                       Level {level}
                     </div>

                     <div className="dash-progress" aria-label="Placement progress">
                       <div
                         className="dash-progress-fill"
                         style={{ width: `${progressPct}%` }}
                       />
                     </div>

                     <div className="dash-mini-muted" style={{ marginTop: 8 }}>
                       {status === "not_started" && `Starts on ${placementStart}`}
                       {status === "in_progress" && `${progressPct}% through your placement.`}
                       {status === "complete" && "Placement complete — well done!"}
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
                      {loadingTodayJournal
                        ? "Checking today's journal…"
                        : hasTodayJournal
                          ? "You’ve entered today’s journal."
                          : "You have not entered today's journal!"}
                    </div>
                    <button
                      className="dash-btn dash-btn-small"
                      type="button"
                      onClick={() =>
                        navigate("/journals", {
                          state: { openNew: !hasTodayJournal },
                        })
                      }
                    >
                      {hasTodayJournal ? "View" : "Enter"}
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