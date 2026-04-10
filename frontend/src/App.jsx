import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/tasks");

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();
      setTasks(data);

      console.log("Fetched from backend"); // 👈 for testing

    } catch (err) {
      console.error("Fetch error:", err);
      setError("Backend not running or failed to load tasks");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ Add task
  const addTask = async () => {
    if (!title.trim()) return;

    setError("");

    try {
      const res = await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) {
        throw new Error("Add failed");
      }

      setTitle("");
      fetchTasks();

    } catch (err) {
      console.error("Add error:", err);
      setError("Failed to add task (backend may be down)");
    }
  };

  // ✅ Toggle task
  const toggleTask = async (id) => {
    try {
      await fetch(`http://localhost:5000/tasks/${id}`, {
        method: "PATCH",
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError("Failed to update task");
    }
  };

  // ✅ Delete task
  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:5000/tasks/${id}`, {
        method: "DELETE",
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError("Failed to delete task");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h1 style={{ textAlign: "center" }}>Task Manager</h1>

      {/* Add Task */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task"
          style={{ flex: 1 }}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {/* States */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Empty State */}
      {!loading && tasks.length === 0 && (
        <p>No tasks yet. Add one!</p>
      )}

      {/* Task List */}
      {tasks.map((task) => (
        <div
          key={task.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
            padding: "8px",
            border: "1px solid #ccc",
          }}
        >
          <span
            onClick={() => toggleTask(task.id)}
            style={{
              cursor: "pointer",
              textDecoration: task.completed ? "line-through" : "none",
            }}
          >
            {task.title}
          </span>

          <button onClick={() => deleteTask(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;