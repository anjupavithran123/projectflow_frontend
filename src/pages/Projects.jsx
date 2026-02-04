import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import {
  FaSave,
  FaUserPlus,
  FaUsers,
  FaTrash,
  FaTicketAlt,
} from "react-icons/fa";

import { getUsers } from "../api/user";
import {
  getProjects,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} from "../api/project";
import CreateProject from "../components/CreateProject";

export default function Projects() {
  const { token } = useAuth();
  const location = useLocation();
  const selectedProjectId = location.state?.selectedProjectId;

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  const [editData, setEditData] = useState({});
  const [memberInput, setMemberInput] = useState({});
  const [membersVisible, setMembersVisible] = useState({});

  useEffect(() => {
    if (!token) return;
    getUsers(token).then(setUsers).catch(console.error);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    getProjects(token)
      .then((data) => {
        if (!Array.isArray(data)) return setProjects([]);
        if (selectedProjectId) {
          const selected = data.find((p) => p.id === selectedProjectId);
          const rest = data.filter((p) => p.id !== selectedProjectId);
          setProjects(selected ? [selected, ...rest] : data);
        } else setProjects(data);
      })
      .catch(console.error);
  }, [token, selectedProjectId]);

  const handleUpdate = async (projectId) => {
    const { name, description } = editData[projectId] || {};
    if (!name) return;
    const updated = await updateProject(projectId, { name, description }, token);
    setProjects((p) => p.map((x) => (x.id === projectId ? updated : x)));
    setEditData((p) => ({ ...p, [projectId]: {} }));
  };

  const handleDelete = async (projectId) => {
    await deleteProject(projectId, token);
    setProjects((p) => p.filter((x) => x.id !== projectId));
  };

  const toggleMembers = (projectId) => {
    setMembersVisible((p) => ({ ...p, [projectId]: !p[projectId] }));
  };

  const handleAddMember = async (projectId) => {
    const user_id = memberInput[projectId];
    if (!user_id) return;
    await addMember(projectId, { user_id }, token);
    setMemberInput((p) => ({ ...p, [projectId]: "" }));
    setProjects(await getProjects(token));
  };

  const handleRemoveMember = async (projectId, userId) => {
    await removeMember(projectId, userId, token);
    setProjects(await getProjects(token));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">My Projects</h1>
          <button
            onClick={() => setShowCreate((p) => !p)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium
                       hover:bg-indigo-700 transition shadow-sm"
          >
            + New Project
          </button>
        </div>

        {/* Create Project Card */}
        {showCreate && (
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Create Project
            </h2>
            <CreateProject
              onCreated={(p) => {
                setProjects([p, ...projects]);
                setShowCreate(false);
              }}
            />
          </div>
        )}

        {/* Project Cards */}
        <div className="grid gap-6">
          {projects.length === 0 && (
            <p className="text-gray-500 text-center">No projects yet.</p>
          )}

          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              {/* Project Info */}
              <div className="space-y-3">
                <input
                  value={editData[p.id]?.name ?? p.name}
                  onChange={(e) =>
                    setEditData((x) => ({
                      ...x,
                      [p.id]: { ...x[p.id], name: e.target.value },
                    }))
                  }
                  className="w-full text-lg font-semibold rounded-lg border px-3 py-2
                             focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                <textarea
                  value={editData[p.id]?.description ?? p.description}
                  onChange={(e) =>
                    setEditData((x) => ({
                      ...x,
                      [p.id]: { ...x[p.id], description: e.target.value },
                    }))
                  }
                  rows={2}
                  className="w-full rounded-lg border px-3 py-2 text-sm
                             focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => handleUpdate(p.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg
                             bg-amber-100 text-amber-700 hover:bg-amber-200"
                >
                  <FaSave /> 
                </button>

                <button
                  onClick={() => handleDelete(p.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg
                             bg-red-100 text-red-700 hover:bg-red-200"
                >
                  <FaTrash />
                </button>

                <button
                  onClick={() => toggleMembers(p.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg
                             bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  <FaUsers />
                  {membersVisible[p.id] ? "Hide Members" : "Members"}
                </button>

            
                <Link
                  to={`/projects/${p.id}`}
                  state={{ projectName: p.name }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg
                             bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                >
                  <FaTicketAlt /> Tickets
                </Link>
              </div>

              {/* Members */}
              {membersVisible[p.id] && (
                <div className="mt-6 border-t pt-4 space-y-3">
                  <div className="flex gap-2">
                    <select
                      value={memberInput[p.id] || ""}
                      onChange={(e) =>
                        setMemberInput((x) => ({
                          ...x,
                          [p.id]: e.target.value,
                        }))
                      }
                      className="flex-1 rounded-lg border px-3 py-2 text-sm"
                    >
                      <option value="">Select user</option>
                      {users
                        .filter(
                          (u) =>
                            !p.members?.some((m) => m.user_id === u.id)
                        )
                        .map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name || u.email}
                          </option>
                        ))}
                    </select>

                    <button
                      onClick={() => handleAddMember(p.id)}
                      className="px-3 py-2 rounded-lg bg-green-100 text-green-700
                                 hover:bg-green-200 flex items-center gap-2"
                    >
                      <FaUserPlus /> Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {p.members?.length ? (
                      p.members.map((m) => (
                        <span
                          key={m.user_id}
                          className="flex items-center gap-2 px-3 py-1 rounded-full
                                     bg-indigo-50 text-indigo-700 text-sm"
                        >
                          {m.users?.name || m.users?.email}
                          <button
                            onClick={() =>
                              handleRemoveMember(p.id, m.users.id)
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">
                        No members yet.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
