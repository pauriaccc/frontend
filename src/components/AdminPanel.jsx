import { useEffect, useState } from "react";
import LandingHeader from "./LandingHeader";

function AdminPanel() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [studentForm, setStudentForm] = useState({
        name: "",
        email: "",
        password: "",
        placementStart: "",
        placementEnd: "",
        remindersEnabled: false
    });

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

    const handleDelete = async (studentId) => {
        if (!window.confirm("Delete this student?")) return;

        await fetch(`http://localhost:8080/api/students/delete/${studentId}`, {
            method: "DELETE"
        });

        setStudents(students.filter(s => s.studentId !== studentId));
    };

    const handleAddStudent = async () => {
        const newStudent = {
            ...studentForm,
            studentId: "S" + crypto.randomUUID().slice(0, 5)
        };

        await fetch("http://localhost:8080/api/students/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newStudent)
        });

        setStudents([...students, newStudent]);
        setShowModal(false);
        resetForm();
    };

    const handleEditStudent = async () => {
        const updatedStudent = { ...studentForm, studentId: editingStudent };

        await fetch("http://localhost:8080/api/students/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedStudent)
        });

        setStudents(students.map(s =>
            s.studentId === editingStudent ? updatedStudent : s
        ));

        setShowModal(false);
        setEditingStudent(null);
        resetForm();
    };

    const openEditModal = (student) => {
        setEditingStudent(student.studentId);
        setStudentForm({
            name: student.name,
            email: student.email,
            password: student.password,
            placementStart: student.placementStart,
            placementEnd: student.placementEnd,
            remindersEnabled: student.remindersEnabled || false
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setStudentForm({
            name: "",
            email: "",
            password: "",
            placementStart: "",
            placementEnd: "",
            remindersEnabled: false
        });
    };

    const triggerReminders = async () => {
        await fetch("http://localhost:8080/api/students/send-reminders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
    };

    return (
        <>
            <LandingHeader isAdminPanel={true} />

            <div className="admin-page">
                <div className="admin-card">
                    <h2 className="admin-title">PlacementPal Users</h2>

                    {loading && <p>Loading students...</p>}
                    {error && <p className="admin-error">{error}</p>}

                    {!loading && !error && (
                        <>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Student ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Placement Start</th>
                                        <th>Placement End</th>
                                        <th>Reminders</th>
                                        <th>Edit/Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map(student => (
                                        <tr key={student.studentId} className="admin-row">
                                            <td>{student.studentId}</td>
                                            <td>{student.name}</td>
                                            <td>{student.email}</td>
                                            <td>{student.placementStart}</td>
                                            <td>{student.placementEnd}</td>
                                            <td>{student.remindersEnabled ? "Yes" : "No"}</td>
                                            <td className="admin-actions">
                                                <button
                                                    className="journal-edit-button"
                                                    onClick={() => openEditModal(student)}
                                                >
                                                    ✎
                                                </button>

                                                <button
                                                    className="journal-delete-button"
                                                    onClick={() => handleDelete(student.studentId)}
                                                >
                                                    ×
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="add-search-container">
                                <div className="add-button-center">
                                    <button
                                        className="add-button"
                                        onClick={() => {
                                            setEditingStudent(null);
                                            resetForm();
                                            setShowModal(true);
                                        }}
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    className="submit-button trigger-reminders-button"
                                    onClick={() => {
                                        triggerReminders();
                                    }}
                                >
                                    Trigger Reminders
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="admin-modal-overlay">
                    <div className="modal-card">
                        <h2>{editingStudent ? "Edit Student" : "Add Student"}</h2>

                        <input
                            className="modal-input"
                            placeholder="Name"
                            value={studentForm.name}
                            onChange={(e) =>
                                setStudentForm({ ...studentForm, name: e.target.value })
                            }
                        />

                        <input
                            className="modal-input"
                            placeholder="Email"
                            value={studentForm.email}
                            onChange={(e) =>
                                setStudentForm({ ...studentForm, email: e.target.value })
                            }
                        />

                        <input
                            type="password"
                            className="modal-input"
                            placeholder="Password"
                            value={studentForm.password}
                            onChange={(e) =>
                                setStudentForm({ ...studentForm, password: e.target.value })
                            }
                        />

                        <input
                            type="date"
                            className="modal-input date-input"
                            value={studentForm.placementStart}
                            onChange={(e) =>
                                setStudentForm({ ...studentForm, placementStart: e.target.value })
                            }
                        />

                        <input
                            type="date"
                            className="modal-input date-input"
                            value={studentForm.placementEnd}
                            onChange={(e) =>
                                setStudentForm({ ...studentForm, placementEnd: e.target.value })
                            }
                        />

                        <div className="modal-toggle-container">
                            <label className="modal-toggle-label">Enable Reminders</label>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={studentForm.remindersEnabled}
                                    onChange={(e) =>
                                        setStudentForm({ ...studentForm, remindersEnabled: e.target.checked })
                                    }
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                        <div className="modal-actions">
                            <button
                                className="modal-cancel-button"
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingStudent(null);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                className="submit-button"
                                onClick={editingStudent ? handleEditStudent : handleAddStudent}
                            >
                                {editingStudent ? "Save" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AdminPanel;