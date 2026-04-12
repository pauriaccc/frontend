import { useEffect, useState } from "react";
import LandingHeader from "./LandingHeader";

function LecturerPanel() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [journalStats, setJournalStats] = useState({});

    useEffect(() => {
        fetch("http://localhost:8080/api/students/all")
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch students");
                return res.json();
            })
            .then(data => {
                setStudents(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        async function fetchStats() {
            const stats = {};

            for (const student of students) {
                try {
                    const res = await fetch(`http://localhost:8080/api/journals/student/${student.studentId}/stats`);
                    const data = await res.json();
                    stats[student.studentId] = data;
                } catch {
                    stats[student.studentId] = { journalCount: 0, lastJournalDate: null };
                }
            }

            setJournalStats(stats);
        }

        if (students.length > 0) {
            fetchStats();
        }
    }, [students]);

    const sendReminderToStudent = async (studentId) => {
        await fetch(`http://localhost:8080/api/students/send-reminder/${studentId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

    };

    function getJournalStatus(studentId) {
        const stats = journalStats[studentId];

        if (!stats || !stats.lastJournalDate) return "No Entries";

        const last = new Date(stats.lastJournalDate);
        const now = new Date();

        const diffDays = (now - last) / (1000 * 60 * 60 * 24);

        if (diffDays <= 3) return "Active";
        if (diffDays <= 7) return "Falling Behind";
        return "Inactive";
    }

    return (
      <>
        <LandingHeader isCreateAccount={false} isLecturerPanel={true} />

        <div className="lecturer-page lecturer-theme">
          <div className="admin-card">
            <h1 className="admin-title">UU Placement Students</h1>

            {loading && <p>Loading students...</p>}
            {error && <p className="admin-error">{error}</p>}

            {!loading && !error && (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Placement Start</th>
                    <th>Placement End</th>
                    <th>Journal Activity</th>
                    <th>Total Entries</th>
                    <th>Journal Reminder</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map(student => {
                    const status = getJournalStatus(student.studentId);

                    return (
                      <tr key={student.studentId}>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>{student.placementStart}</td>
                        <td>{student.placementEnd}</td>

                        <td>
                          <span className={`status ${status.replace(" ", "-").toLowerCase()}`}>
                            {status}
                          </span>
                        </td>

                        <td>
                          {journalStats[student.studentId]?.journalCount || 0}
                        </td>

                        <td className="admin-actions">
                          <button
                            className="lecturer-button"
                            disabled={status === "Active"}
                            onClick={() => sendReminderToStudent(student.studentId)}
                          >
                            Send Reminder
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </>
    );
}

export default LecturerPanel;