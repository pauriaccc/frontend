import Navbar from "./Navbar";
import Header from "./Header";
import { useState, useEffect } from "react";
import Journal from "./Journal";
import AddEditModal from "./AddEditModal";

function Journals() {
    const [journals, setJournals] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        content: "",
        tags: "",
    });
    const [editingJournal, setEditingJournal] = useState(null);

    function fetchJournals() {
        fetch("http://localhost:8080/api/journals/STU001")
            .then((res) => res.json())
            .then((data) => setJournals(data))
            .catch(console.error);
    }

    useEffect(() => {
        fetchJournals();
    }, []);

    function addNewJournal() {
        const newJournal = {
            journalId: crypto.randomUUID(),
            studentId: "STU001",
            content: formData.content,
            createdTs: new Date().toISOString().split("T")[0],
            tags: formData.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
        };

        fetch("http://localhost:8080/api/journals/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newJournal),
        })
            .then(() => fetchJournals())
            .then(() => {
                setShowForm(false);
                setFormData({ content: "", tags: "" });
            })
            .catch(console.error);
    }

    function saveEditedJournal() {
        const updatedJournal = {
            ...editingJournal,
            content: formData.content,
            tags: formData.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
        };

        fetch("http://localhost:8080/api/journals/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedJournal),
        })
            .then(() => fetchJournals())
            .then(() => {
                setShowForm(false);
                setEditingJournal(null);
                setFormData({ content: "", tags: "" });
            })
            .catch(console.error);
    }

    function handleEdit(journal) {
        setEditingJournal(journal);
        setFormData({
            content: journal.content,
            tags: journal.tags.join(", "),
        });
        setShowForm(true);
    }

    function handleDelete(journalId) {
        fetch(`http://localhost:8080/api/journals/delete/STU001/${journalId}`, {
            method: "DELETE",
        })
            .then(() => fetchJournals())
            .catch(console.error);
    }

    const journalComponents = journals.map((journal) => (
        <Journal
            key={journal.journalId}
            date={journal.createdTs}
            content={journal.content}
            tags={journal.tags}
            onEdit={() => handleEdit(journal)}
            onDelete={() => handleDelete(journal.journalId)}
        />
    ));

    return (
        <>
            {showForm && (
                <AddEditModal
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={editingJournal ? saveEditedJournal : addNewJournal}
                    onClose={() => {
                        setShowForm(false);
                        setEditingJournal(null);
                        setFormData({ content: "", tags: "" });
                    }}
                    isEditing={!!editingJournal}
                    isDictionary={false}
                />
            )}

            <Navbar />
            <Header />
            <div className="main">
                <div className="add-button-container">
                    <button
                        className="add-button"
                        onClick={() => {
                            setEditingJournal(null);
                            setFormData({ content: "", tags: "" });
                            setShowForm(true);
                        }}
                    > +
                    </button>
                </div>
                <div className="journal-grid">{journalComponents}</div>
            </div>
        </>
    );
}

export default Journals;