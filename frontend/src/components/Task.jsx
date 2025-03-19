import React from "react";

function Task({ task, onDelete, onEdit }) {
    const formattedDate = new Date(task.createdOn).toLocaleDateString();

    return (
        <div className="task d-flex justify-content-between align-items-center">
            <div className="task-info">
                <h3>{task.title}</h3>
                <p className="task-content">{task.content}</p>
                <p className="task-date">Created on: {formattedDate}</p>
            </div>
            <div className="task-actions">
                <button
                    onClick={() => onEdit(task)}
                    className="btn btn-primary btn-sm mb-2 d-block w-100"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(task._id)}
                    className="btn btn-danger btn-sm d-block w-100"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default Task;
