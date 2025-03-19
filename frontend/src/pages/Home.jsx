import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Task from "../components/Task";
import EditTaskForm from "../components/EditTaskForm";
import { ACCESS_TOKEN } from "../constants";
import "../styles/Home.css";
import LoadingIndicator from "../components/LoadingIndicator";

function Home() {
    const [tasks, setTasks] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getTasks();
    }, []);

    const getTasks = () => {
        setLoading(true);
        api.get("/api/tasks")
            .then((res) => res.data)
            .then((data) => {
                setTasks(data.tasks || []);
                //console.log(data);
                setLoading(false);
            })
            .catch((err) => alert(err));
    };

    const handleLogout = () => {
        localStorage.removeItem(ACCESS_TOKEN);
        navigate("/login");
    };

    const deleteTask = (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            api.delete(`/api/tasks/${id}/`)
                .then((res) => {
                    if (res.status === 200) {
                        getTasks();
                    } else {
                        alert("Failed to delete task.");
                    }
                })
                .catch((error) => alert(error));
        }
    };

    const createTask = (e) => {
        e.preventDefault();
        api.post("/api/tasks", { title, content })
            .then((res) => {
                if (res.data && !res.data.error) {
                    getTasks();
                    setContent("");
                    setTitle("");
                } else {
                    alert("Failed to create task.");
                }
            })
            .catch((err) => alert(err));
    };

    const startEdit = (task) => {
        setEditingTask(task);
    };

    const cancelEdit = () => {
        setEditingTask(null);
    };

    const updateTask = (taskId, updatedData) => {
        api.put(`/api/tasks/${taskId}`, updatedData)
            .then((res) => {
                if (res.data.error === false) {
                    getTasks();
                    cancelEdit();
                } else {
                    alert("Failed to update task.");
                }
            })
            .catch((err) => {
                console.error("Update error:", err);
                alert("Error updating task");
            });
    };

    return (
        <div className="container">
            <div className="app-header">
                <h1 className="app-title">Task Manager</h1>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>

            <div className="task-list">
                <h2 className="mb-4">Your Tasks</h2>
                {loading ? (
                    <LoadingIndicator />
                ) : Array.isArray(tasks) && tasks.length > 0 ? (
                    tasks.map((task) => (
                        <div key={task._id} className="task-item">
                            {editingTask && editingTask._id === task._id ? (
                                <EditTaskForm
                                    task={task}
                                    onUpdate={updateTask}
                                    onCancel={cancelEdit}
                                />
                            ) : (
                                <Task
                                    task={task}
                                    onDelete={deleteTask}
                                    onEdit={() => startEdit(task)}
                                />
                            )}
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <p>No tasks found. Create a new task below!</p>
                    </div>
                )}
            </div>

            <div className="create-task-section">
                <h2 className="mb-4">Create a Task</h2>
                <form onSubmit={createTask}>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                            Title:
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="form-control"
                            required
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="content" className="form-label">
                            Content:
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            className="form-control"
                            rows="4"
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Create Task
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Home;
