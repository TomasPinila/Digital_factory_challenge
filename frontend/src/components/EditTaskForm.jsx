import { useState, useEffect } from "react";

function EditTaskForm({ task, onUpdate, onCancel }) {
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");

    useEffect(() => {
        setEditTitle(task.title);
        setEditContent(task.content);
    }, [task]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(task._id, {
            title: editTitle,
            content: editContent,
        });
    };

    return (
        <div className="edit-form">
            <h4 className="mb-3">Edit Task</h4>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="editTitle" className="form-label">
                        Title:
                    </label>
                    <input
                        type="text"
                        id="editTitle"
                        className="form-control"
                        required
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="editContent" className="form-label">
                        Content:
                    </label>
                    <textarea
                        id="editContent"
                        className="form-control"
                        required
                        rows="3"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                    ></textarea>
                </div>

                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success">
                        Save Changes
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditTaskForm;
