function AddEditModal(props) {
    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <h2>{props.isEditing ? props.isDictionary ? "Edit Dictionary" : "Edit Journal" : props.isDictionary ? "Add Dictionary" : "Add Journal"}</h2>

                {props.isDictionary && (
                    <input
                        className="modal-input"
                        placeholder="Title"
                        value={props.formData.title}
                        onChange={(e) =>
                            props.setFormData({ ...props.formData, title: e.target.value })
                        }
                    />
                )}

                <textarea
                    className="modal-textarea"
                    placeholder="Content"
                    rows="5"
                    value={props.formData.content}
                    onChange={(e) =>
                        props.setFormData({ ...props.formData, content: e.target.value })
                    }
                />

                <input
                    className="modal-input"
                    placeholder="Tags (comma separated)"
                    value={props.formData.tags}
                    onChange={(e) =>
                        props.setFormData({ ...props.formData, tags: e.target.value })
                    }
                />

                <div className="modal-actions">
                    <button className="submit-button" onClick={props.onSubmit}>
                        {props.isEditing ? "Save" : "Add"}
                    </button>
                    <button className="modal-cancel-button" onClick={props.onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddEditModal;
