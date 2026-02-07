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

  /* Load users */
  useEffect(() => {
    if (!token) return;
    getUsers(token).then(setUsers).catch(console.error);
  }, [token]);

  /* Load projects */
  useEffect(() => {
    if (!token) return;
  
    getProjects(token)
      .then((data) => {
        if (!Array.isArray(data)) return setProjects([]);
  
        // ✅ SHOW ONLY SELECTED PROJECT
        if (selectedProjectId) {
          const selected = data.find(
            (p) => String(p.id) === String(selectedProjectId)
          );
          setProjects(selected ? [selected] : []);
        } else {
          // ✅ No selection → show all projects
          setProjects(data);
        }
      })
      .catch(console.error);
  }, [token, selectedProjectId]);
  
  /* Actions */
  const handleUpdate = async (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    const edited = editData[projectId];
  
    if (!edited) return;
  
    const payload = {
      name: edited.name ?? project.name,
      description: edited.description ?? project.description,
    };
  
    const updated = await updateProject(projectId, payload, token);
  
    setProjects((p) =>
      p.map((x) => (x.id === projectId ? updated : x))
    );
  
    setEditData((p) => {
      const copy = { ...p };
      delete copy[projectId];
      return copy;
    });
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">My Projects</h1>
          <button
            onClick={() => setShowCreate((p) => !p)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium
                       hover:bg-indigo-700 transition shadow"
          >
            + New Project
          </button>
        </div>

        {/* Create Project */}
        {showCreate && (
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <CreateProject
              onCreated={(p) => {
                setProjects([p, ...projects]);
                setShowCreate(false);
              }}
            />
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No projects yet.
            </p>
          )}

          {projects.map((p) => (
            <div
              key={p.id}
              className="group bg-white rounded-2xl border shadow-sm
                         hover:shadow-xl transition-all duration-300"
            >
              {/* Header */}
              <div className="p-5 border-b bg-gradient-to-r from-indigo-50 to-transparent rounded-t-2xl">
                <input
                  value={editData[p.id]?.name ?? p.name}
                  onChange={(e) =>
                    setEditData((x) => ({
                      ...x,
                      [p.id]: { ...x[p.id], name: e.target.value },
                    }))
                  }
                  className="w-full bg-transparent text-lg font-semibold text-gray-800
                             focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-2"
                />
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <textarea
                  value={editData[p.id]?.description ?? p.description}
                  onChange={(e) =>
                    setEditData((x) => ({
                      ...x,
                      [p.id]: {
                        ...x[p.id],
                        description: e.target.value,
                      },
                    }))
                  }
                  rows={3}
                  placeholder="Project description..."
                  className="w-full resize-none rounded-lg border bg-gray-50 p-3 text-sm
                             focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                {/* Members preview */}
                <div className="flex flex-wrap gap-2">
                  {p.members?.slice(0, 4).map((m) => (
                    <span
                      key={m.user_id}
                      className="px-3 py-1 rounded-full text-xs font-medium
                                 bg-indigo-100 text-indigo-700"
                    >
                      {m.users?.name || m.users?.email}
                    </span>
                  ))}
                  {p.members?.length > 4 && (
                    <span className="text-xs text-gray-400">
                      +{p.members.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(p.id)}
                    className="p-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200"
                  >
                    <FaSave />
                  </button>

                  <button
                    onClick={() => toggleMembers(p.id)}
                    className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    <FaUsers />
                  </button>

                  <Link
                    to={`/projects/${p.id}`}
                    state={{ projectName: p.name }}
                    className="p-2 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                  >
                    <FaTicketAlt />Ticket
                  </Link>
                </div>

                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                >
                  <FaTrash />
                </button>
              </div>

              {/* Members Panel */}
              {membersVisible[p.id] && (
                <div className="p-5 border-t bg-gray-50 space-y-4">
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
                            !p.members?.some(
                              (m) => m.user_id === u.id
                            )
                        )
                        .map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name || u.email}
                          </option>
                        ))}
                    </select>

                    <button
                      onClick={() => handleAddMember(p.id)}
                      className="px-3 py-2 rounded-lg bg-green-600 text-white
                                 hover:bg-green-700 flex items-center gap-2"
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
                                     bg-white border text-sm"
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
