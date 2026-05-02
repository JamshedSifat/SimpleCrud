import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);

  // 🔹 Load data from backend
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("http://localhost:5000/items")
      .then((res) => res.json())
      .then((data) => setItems(data));
  };

  // 🔹 Add
  const handleAdd = async () => {
    if (!name) return;

    await fetch("http://localhost:5000/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    fetchData();
    setName("");
  };

  // 🔹 Delete
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/items/${id}`, {
      method: "DELETE",
    });

    setItems(items.filter((item) => item._id !== id));
  };

  // 🔹 Edit
  const handleEdit = (item) => {
    setName(item.name);
    setEditId(item._id);
  };

  // 🔹 Update
  const handleUpdate = async () => {
    if (!editId) return;

    await fetch(`http://localhost:5000/items/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    fetchData();
    setEditId(null);
    setName("");
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        
        <h1 className="text-xl font-bold text-center mb-4">
          Simple CRUD App 
        </h1>

        {/* Input */}
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full mb-3"
        />

        {/* Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleAdd}
            className="bg-green-500 text-white p-2 rounded w-full"
          >
            Add
          </button>

          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            Update
          </button>
        </div>

        {/* List */}
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item._id}
              className="flex justify-between items-center bg-gray-100 p-2 rounded"
            >
              <span>{item.name}</span>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-yellow-400 px-2 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 text-white px-2 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}

export default App;