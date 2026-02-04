import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProjects } from "../api/project";
import { getTickets } from "../api/ticket";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { currentUser, token } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState({});

  useEffect(() => {
    if (!token) return;

    async function load() {
      try {
        const data = await getProjects(token);
        setProjects(data);

        const progress = {};
        await Promise.all(
          data.map(async (proj) => {
            const tickets = await getTickets(proj.id, token);
            progress[proj.id] = {
              todo: tickets.filter((t) => t.status === "todo").length,
              in_progress: tickets.filter((t) => t.status === "in_progress").length,
              done: tickets.filter((t) => t.status === "done").length,
            };
          })
        );
        setProgressData(progress);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  const handleProjectChange = (projectId) => {
    if (!projectId) return;
    navigate("/projects", { state: { selectedProjectId: projectId } });
  };

  const chartData = {
    labels: projects.map((p) => p.name),
    datasets: [
      {
        label: "To Do",
        data: projects.map((p) => progressData[p.id]?.todo || 0),
        backgroundColor: "#CBD5E1",
        borderRadius: 6,
      },
      {
        label: "In Progress",
        data: projects.map((p) => progressData[p.id]?.in_progress || 0),
        backgroundColor: "#FACC15",
        borderRadius: 6,
      },
      {
        label: "Done",
        data: projects.map((p) => progressData[p.id]?.done || 0),
        backgroundColor: "#34D399",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Project Progress Overview",
        font: { size: 16, weight: "600" },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 space-y-8">

      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back{currentUser?.email && ","}
        </h1>
        <p className="mt-1 text-gray-600">
          Here’s a quick snapshot of what’s happening.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">

        {/* Modern Select */}
        <div className="relative w-full md:w-72">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Jump to project
          </label>

          <select
            onChange={(e) => handleProjectChange(e.target.value)}
            disabled={loading}
            className="
              w-full appearance-none rounded-xl
              border border-gray-200 bg-white
              px-4 py-2.5 pr-10 text-sm
              shadow-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition
            "
          >
            <option value="">
              {loading ? "Loading projects..." : "Select a project"}
            </option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Chevron */}
          <div className="pointer-events-none absolute right-3 top-[38px] text-gray-400">
            ▼
          </div>
        </div>

        {/* Total Projects Card */}
        <div className="flex-1">
          <div className="
            rounded-2xl bg-white
            p-5 shadow-md
            hover:shadow-lg transition
          ">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Total Projects
            </p>
            <p className="mt-1 text-3xl font-bold text-gray-900">
              {loading ? "—" : projects.length}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Select a project to view details and tickets.
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="
        rounded-2xl bg-white
        p-6 shadow-md
        h-[320px]
      ">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
