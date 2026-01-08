import Navbar from "./Navbar";
import AddEditModal from "./AddEditModal";
import Header from "./Header";
import { useState, useEffect } from "react";
import Dictionary from "./Dictionary";

function Dictionaries() {
    const [dictionaries, setDictionaries] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        tags: "",
    })
    const [editingDictionary, setEditingDictionary] = useState(null)

    function fetchDictionaries() {
        fetch("http://localhost:8080/api/dictionaries/STU001")
            .then((res) => res.json())
            .then((data) => setDictionaries(data))
            .catch(console.error)
    }

    useEffect(() => {
        fetchDictionaries()
    }, [])

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
            studentId: "STU001",
            title: formData.title,
            content: formData.content,
            createdTs: new Date().toISOString().split("T")[0],
            tags: formData.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
        }

        fetch("http://localhost:8080/api/dictionaries/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newDictionary),
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
            `http://localhost:8080/api/dictionaries/delete/STU001/${dictionaryId}`,
            { method: "DELETE" }
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
        <>
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
            <Header />
            <div className="main">
                <div className="add-button-container">
                    <button
                        className="add-button"
                        onClick={() => {
                            setEditingDictionary(null)
                            setFormData({ title: "", content: "", tags: "" })
                            setShowForm(true)
                        }}
                    > +
                    </button>
                </div>
                <div className="dictionary-grid">
                    {dictionaryComponents}
                </div>
            </div>
        </>
    )
}

export default Dictionaries;