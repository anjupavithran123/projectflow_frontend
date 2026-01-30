// src/pages/Projects.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

import { getUsers } from "../api/user";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} from "../api/project";
import CreateProject from "../components/CreateProject";

export default function Projects() {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  // Track editing / member input states
  const [editData, setEditData] = useState({});
  const [memberInput, setMemberInput] = useState({});

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);


  
//users

useEffect(() => {
  const loadUsers = async () => {
    try {
      const data = await getUsers(token);
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  if (token) loadUsers();
}, [token]);


  const loadProjects = async () => {
    try {
      const data = await getProjects(token);
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load projects:", err);
    }
  };

  // Update project
  const handleUpdate = async (projectId) => {
    const { name, description } = editData[projectId] || {};
    if (!name) return;
    const updated = await updateProject(projectId, { name, description }, token);
    setProjects((prev) => prev.map((p) => (p.id === projectId ? updated : p)));
    setEditData((prev) => ({ ...prev, [projectId]: {} }));
  };

  // Delete project
  const handleDelete = async (projectId) => {
    await deleteProject(projectId, token);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };



  // Add member
  const handleAddMember = async (projectId) => {
    const user_id = memberInput[projectId];
    if (!user_id) return alert("Select a user first");
  
    try {
      await addMember(projectId, { user_id }, token);
      setMemberInput((prev) => ({ ...prev, [projectId]: "" }));
      loadProjects(); // refresh projects with updated members
    } catch (err) {
      console.error("Add member failed", err);
      alert("Add member failed");
    }
  };
  
  // Remove member
  const handleRemoveMember = async (projectId, userId) => {
    if (!userId) return alert("Invalid member selected");
  
    try {
      await removeMember(projectId, userId, token);
      loadProjects(); // refresh after removing
    } catch (err) {
      console.error("Remove member failed", err);
      alert("Remove member failed");
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
  <h2 className="text-2xl font-bold text-gray-800">My Projects</h2>

  <button
    onClick={() => setShowCreate((prev) => !prev)}
    className="
      px-4 py-2 bg-blue-600 text-white text-sm font-medium
      rounded hover:bg-blue-700 transition
    "
  >
    + New Project
  </button>
</div>

        {/* Create Project */}
        {showCreate && (
  <CreateProject
    onCreated={(p) => {
      setProjects([p, ...projects]);
      setShowCreate(false); // auto-close after create
    }}
  />
)}


        <div className="grid gap-6">
          {projects.length === 0 && (
            <p className="text-gray-500">No projects yet.</p>
          )}

          {projects.map((p) => (
            <div key={p.id} className="bg-white shadow rounded-xl p-6 space-y-4">
              {/* Project Info */}
              <div>
                <input
                  type="text"
                  placeholder="Project Name"
                  value={editData[p.id]?.name ?? p.name}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      [p.id]: { ...prev[p.id], name: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border rounded mb-2"
                />
                <textarea
                  placeholder="Description"
                  value={editData[p.id]?.description ?? p.description}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      [p.id]: { ...prev[p.id], description: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border rounded mb-2"
                  rows="2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(p.id)}
                    className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                  >
                    Delete Project
                  </button>
                    {/* ✅ CORRECT: p is in scope */}
                    <Link
  to={`/projects/${p.id}`}
  state={{ projectName: p.name }}
  className="px-3 py-1 bg-blue-100 text-blue-700 rounded"
>
  View Tickets →
</Link>

     
  
                </div>
              </div>

            {/* Members Management */}
<div className="mt-4 border-t pt-4">
  <h4 className="font-semibold text-gray-700 mb-2">Members</h4>

  <div className="flex gap-2 mb-2">
  <select
  value={memberInput[p.id] || ""}
  onChange={(e) =>
    setMemberInput((prev) => ({ ...prev, [p.id]: e.target.value }))
  }
  className="px-3 py-2 border rounded w-full"
>
  <option value="">Select user</option>
  {users
    .filter(u => !p.members?.some(m => m.user_id === u.id)) // exclude current members
    .map(u => (
      <option key={u.id} value={u.id}>
        {u.name || u.email}
      </option>
    ))}
</select>


    <button
      onClick={() => handleAddMember(p.id)}
      className="px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
    >
      Add Member
    </button>
  </div>

  <div className="flex flex-wrap gap-2">
    {p.members?.length > 0 ? (
      p.members.map((m, index) => (
        <div
          key={`${p.id}-${m.user_id}-${index}`} // ✅ unique key per project + member
          className="bg-blue-50 text-blue-700 px-2 py-1 rounded flex items-center gap-2"
        >
          <span>
            {m.users?.name || m.users?.email} ({m.role})
          </span>
          <button
  onClick={() => handleRemoveMember(p.id, m.users.id)}
  className="text-red-500 hover:text-red-700"
>
  &times;
</button>

        </div>
      ))
    ) : (
      <p className="text-gray-400 text-sm">No members yet.</p>
    )}
  </div>
</div>

            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}
