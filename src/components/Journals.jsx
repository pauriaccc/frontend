import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import Journal from "./Journal";
import Footer from "./Footer";
import AddEditModal from "./AddEditModal";
import Searchbar from "./Searchbar";
import { useLocation } from "react-router-dom";

function Journals() {
    const location = useLocation();
    const [journals, setJournals] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ content: "", tags: "" });
    const [editingJournal, setEditingJournal] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    function fetchJournals() {
        fetch("http://localhost:8080/api/journals" , {
            credentials: "include"
           })
       .then((res) => res.json())
               .then((data) => {
                   setJournals(data);
               })
           .catch(console.error);
    }

    function fetchJournalsByQuery(search) {
        const baseUrl = "http://localhost:8080/api/journals/search";
        const url = search.trim() ? `${baseUrl}?query=${encodeURIComponent(search)}` : "http://localhost:8080/api/journals";

        fetch(url, { credentials: "include" })
            .then((res) => res.json())
            .then((data) => { setJournals(data)})
            .catch(console.error);
    }

    useEffect(() => {
        const timeout = setTimeout(() => fetchJournalsByQuery(searchTerm), 300);
        return () => clearTimeout(timeout);
    }, [searchTerm]);

    useEffect(() => fetchJournals(), []);

    function addNewJournal() {
        const newJournal = {
            journalId: "J" + crypto.randomUUID().slice(0, 5),
            content: formData.content,
            tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        };

        fetch("http://localhost:8080/api/journals/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newJournal),
            credentials: "include"
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
            tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        };

        fetch("http://localhost:8080/api/journals/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedJournal),
            credentials: "include"
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
        fetch(`http://localhost:8080/api/journals/delete/${journalId}`,
            { method: "DELETE", credentials: "include" }
        )
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

    useEffect(() => {
      if (location.state?.openNew) {
        setEditingJournal(null);
        setFormData({ content: "", tags: "" });
        setShowForm(true);

        // clear state so refresh/back doesn't reopen
        window.history.replaceState({}, document.title);
      }
    }, [location]);

    return (
        <div className="page-container">
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
            <div className="main">
                <div className="add-search-container">
                    <button
                        className="add-button"
                        onClick={() => {
                            setEditingJournal(null);
                            setFormData({ content: "", tags: "" });
                            setShowForm(true);
                        }}
                    > + </button>
                    {journals.length !== 0 && <Searchbar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        words={["Content...", "YYYY-MM-DD...", "Tags..."]}
                        />
                    }
                </div>
                <div className="journal-grid">
                  {journals.length === 0 ? (
                    <div className="empty-state">
                      <p className="empty-text"> You don’t have any journals yet. </p>
                      <p className="empty-hint"> Click the <span className="plus">+</span> above to add your first journal! </p>
                    </div>
                  ) : (journalComponents)}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Journals;