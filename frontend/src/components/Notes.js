import React, { useEffect, useState } from "react";
import API, { setToken } from "../api";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const res = await API.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error(err);
      alert("Could not fetch notes");
    }
  }

  async function submit(e) {
    e.preventDefault();
    try {
      if (editing) {
        await API.put(`/notes/${editing}`, form);
        setEditing(null);
      } else {
        await API.post("/notes", form);
      }
      setForm({ title: "", description: "" });
      fetchNotes();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete?")) return;
    await API.delete(`/notes/${id}`);
    fetchNotes();
  }

  function startEdit(note) {
    setEditing(note._id);
    setForm({ title: note.title, description: note.description });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
          ✨ Notes Manager
        </h2>

        {/* Form */}
        <form onSubmit={submit} className="mb-10 space-y-4">
          <input
            placeholder="Enter note title..."
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            placeholder="Write your note description..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="4"
          />
          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transform transition duration-300 ${
              editing
                ? "bg-green-600 hover:bg-green-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {editing ? " Update Note" : "➕ Create Note"}
          </button>
        </form>

        {/* Notes List */}
        <div className="grid gap-6 sm:grid-cols-2">
          {notes.map((n) => (
            <div
              key={n._id}
              className="bg-gray-50 p-5 min-h-[160px] rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] transition transform"
            >
              <h3 className="text-xl font-semibold text-gray-800 break-words">
                {n.title}
              </h3>
              <p className="text-gray-600 mt-3 break-words max-h-32 overflow-y-auto pr-1">
                {n.description}
              </p>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => startEdit(n)}
                  className="px-3 py-1.5 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow-sm"
                >
                   Edit
                </button>
                <button
                  onClick={() => remove(n._id)}
                  className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm"
                >
                   Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {notes.length === 0 && (
          <p className="text-center text-gray-500 mt-6 italic">
            No notes yet. Create one above 👆
          </p>
        )}
      </div>
    </div>
  );
}
