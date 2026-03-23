import { useState } from "react";
import { parseTags } from "../utils/HelperMethods";

function AddEditModal(props) {
    const [errors, setErrors] = useState({});

    function validate() {
        const newErrors = {};
        const tagArray = parseTags(props.formData.tags);
        if (props.isDictionary && !props.formData.title?.trim()) {newErrors.title = "Title is required";}
        if (!props.formData.content.trim()) {newErrors.content = "Content is required";}
        if (tagArray.length === 0) {newErrors.tags = "At least one tag is required";}
        if (tagArray.length > 3) {newErrors.tags = "Maximum 3 tags allowed";}
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit() {
        if (validate()) {props.onSubmit();}
    }

    return (
        <div className="modal-overlay">
            <div className="modal-card">

                <h2>
                    {props.isEditing
                        ? props.isDictionary ? "Edit Note" : "Edit Journal"
                        : props.isDictionary ? "Add Note" : "Add Journal"}
                </h2>

                {props.isDictionary && (
                    <>
                        <input
                            className="modal-input"
                            placeholder="Title"
                            value={props.formData.title}
                            onChange={(e) =>
                                props.setFormData({
                                    ...props.formData,
                                    title: e.target.value
                                })
                            }
                        />
                        {errors.title && (
                            <p className="modal-error">{errors.title}</p>
                        )}
                    </>
                )}

                <textarea
                    className="modal-textarea"
                    placeholder="Content"
                    rows="5"
                    value={props.formData.content}
                    onChange={(e) =>
                        props.setFormData({
                            ...props.formData,
                            content: e.target.value
                        })
                    }
                />
                {errors.content && (
                    <p className="modal-error">{errors.content}</p>
                )}

                <input
                    className="modal-input"
                    placeholder="Tags (comma separated)"
                    value={props.formData.tags}
                    onChange={(e) =>
                        props.setFormData({
                            ...props.formData,
                            tags: e.target.value
                        })
                    }
                />
                {errors.tags && (
                    <p className="modal-error">{errors.tags}</p>
                )}

                <div className="modal-actions">
                    <button
                        className="submit-button"
                        onClick={handleSubmit}
                    >
                        {props.isEditing ? "Save" : "Add"}
                    </button>

                    <button
                        className="modal-cancel-button"
                        onClick={props.onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddEditModal;