import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../api/project";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    loadProjects(token);
  }, []);

  const loadProjects = async (token) => {
    try {
      const data = await getProjects(token);
      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectChange = (projectId) => {
    if (!projectId) return;
    navigate(`/projects/${projectId}`);
  };

  return (
    <div>
      {/* Header + Project Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 mt-2">
  <h1 className="text-2xl font-bold">Dashboard</h1>

  <select
    onChange={(e) => handleProjectChange(e.target.value)}
    disabled={loading}
    className="
      border rounded px-3 py-2 text-sm bg-white
      focus:outline-none focus:ring-2 focus:ring-blue-500
      w-full md:w-64 disabled:bg-gray-100
    "
  >
    <option value="">
      {loading ? "Loading projects..." : "Select Project"}
    </option>

    {projects.map((p) => (
      <option key={p.id} value={p.id}>
        {p.name}
      </option>
    ))}
  </select>
</div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-sm text-gray-500">Total Projects</h2>
          <p className="text-2xl font-bold">{projects.length}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-sm text-gray-500">Open Tickets</h2>
          <p className="text-2xl font-bold">—</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-sm text-gray-500">Completed</h2>
          <p className="text-2xl font-bold">—</p>
        </div>
      </div>
    </div>
  );
}
