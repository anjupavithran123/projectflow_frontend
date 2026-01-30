import { useState } from "react";
import { createProject } from "../api/project";
import { useAuth } from "../context/AuthContext";

export default function CreateProject({ onCreated }) {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const project = await createProject({ name, description }, token);
    onCreated(project);
    setName("");
    setDescription("");
  };

  return (
    <form onSubmit={submit} className="bg-white shadow-md rounded-xl p-6 space-y-4 max-w-md">
      <h3 className="text-lg font-semibold text-gray-800">Create New Project</h3>
      <input
        type="text"
        placeholder="Project name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="3"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Create Project
      </button>
    </form>
  );
}
