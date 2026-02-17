import Navbar from "./Navbar";
import AddEditModal from "./AddEditModal";
import { useState, useEffect } from "react";
import Dictionary from "./Dictionary";
import Footer from "./Footer";
import Searchbar from "./Searchbar";

function Dictionaries() {
    const [dictionaries, setDictionaries] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: "", content: "", tags: "" });
    const [editingDictionary, setEditingDictionary] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    function fetchDictionaries() {
        fetch("http://localhost:8080/api/dictionaries", {
            credentials: "include"
        })
            .then((res) => res.json())
            .then((data) => setDictionaries(data))
            .catch(console.error)
    }

    function fetchDictionariesByQuery(query) {
        const baseUrl = "http://localhost:8080/api/dictionaries/search"
        const url = query.trim() ? `${baseUrl}?query=${encodeURIComponent(query)}` : "http://localhost:8080/api/dictionaries"

        fetch(url, { credentials: "include" })
            .then((res) => res.json())
            .then((data) => setDictionaries(data))
            .catch(console.error)
    }

    useEffect(() => {
        const timeout = setTimeout(() => fetchDictionariesByQuery(searchTerm), 300);
        return () => clearTimeout(timeout)
    }, [searchTerm])

    useEffect(() => fetchDictionaries(), [])

    function saveEditedDictionary() {
        const updatedDictionary = {
            ...editingDictionary,
            title: formData.title,
            content: formData.content,
            tags: formData.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
        }

        fetch("http://localhost:8080/api/dictionaries/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedDictionary),
            credentials: "include"
        })
            .then(() => fetchDictionaries())
            .then(() => {
                setShowForm(false)
                setEditingDictionary(null)
                setFormData({ title: "", content: "", tags: "" })
            })
            .catch(console.error)
    }

    function addNewDictionary() {
        const newDictionary = {
            dictionaryId: crypto.randomUUID(),
            title: formData.title,
            content: formData.content,
            tags: formData.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
        }

        fetch("http://localhost:8080/api/dictionaries/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newDictionary),
            credentials: "include"
        })
            .then(() => fetchDictionaries())
            .then(() => {
                setShowForm(false)
                setFormData({ title: "", content: "", tags: "" })
            })
            .catch(console.error)
    }

    function handleDelete(dictionaryId) {
        fetch(
            `http://localhost:8080/api/dictionaries/delete/${dictionaryId}`,
            { method: "DELETE", credentials: "include" }
        )
            .then(() => fetchDictionaries())
            .catch(console.error)
    }

    function handleEdit(dictionary) {
        setEditingDictionary(dictionary)
        setFormData({
            title: dictionary.title,
            content: dictionary.content,
            tags: dictionary.tags.join(", "),
        })
        setShowForm(true)
    }

    const dictionaryComponents = dictionaries.map((dictionary) => (
        <Dictionary
            key={dictionary.dictionaryId}
            dictionaryId={dictionary.dictionaryId}
            title={dictionary.title}
            content={dictionary.content}
            tags={dictionary.tags}
            onDelete={handleDelete}
            onEdit={() => handleEdit(dictionary)}
        />
    ))

    return (
        <div className="page-container">
            {showForm && (
                <AddEditModal
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={editingDictionary ? saveEditedDictionary : addNewDictionary}
                    onClose={() => {
                        setShowForm(false)
                        setEditingDictionary(null)
                        setFormData({ title: "", content: "", tags: "" })
                    }}
                    isEditing={!!editingDictionary}
                    isDictionary={true}
                />
            )}

            <Navbar />
            <div className="main">
                <div className="add-search-container">
                    <button
                        className="add-button"
                        onClick={() => {
                            setEditingDictionary(null)
                            setFormData({ title: "", content: "", tags: "" })
                            setShowForm(true)
                        }}
                    > +
                    </button>
                    {dictionaries.length !== 0 && <Searchbar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            words={["Title...", "Content...", "Tags..."]}
                        />
                    }
                </div>
                <div className="dictionary-grid">
                    {dictionaries.length === 0 ? (
                        <div className="empty-state">
                            <p className="empty-text"> You don’t have any notes yet. </p>
                            <p className="empty-hint">Click the <span className="plus">+</span> above to add your first note!</p>
                        </div>
                    ) : (dictionaryComponents)}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Dictionaries;