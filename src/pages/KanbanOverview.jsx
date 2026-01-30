import { useEffect, useState } from "react";
import { getProjects } from "../api/project";
import { getTickets } from "../api/ticket";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function KanbanOverview() {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [progressData, setProgressData] = useState({}); // { projectId: { todo, in_progress, done } }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Fetch all projects
        const projList = await getProjects(token);
        setProjects(projList);

        // 2️⃣ Fetch tickets for all projects in parallel
        const progress = {};
        await Promise.all(
          projList.map(async (proj) => {
            const tickets = await getTickets(proj.id, token);

            // 3️⃣ Count tickets per status
            progress[proj.id] = {
              todo: tickets.filter((t) => t.status === "todo").length,
              in_progress: tickets.filter((t) => t.status === "in_progress").length,
              done: tickets.filter((t) => t.status === "done").length,
            };
          })
        );

        setProgressData(progress);
      } catch (err) {
        console.error("Error fetching projects/tickets:", err);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Projects Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => {
          const progress = progressData[proj.id] || { todo: 0, in_progress: 0, done: 0 };

          return (
            <Link to={`/projects/${proj.id}`} key={proj.id}>
              <div className="bg-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer">
                <h2 className="font-bold text-lg mb-2">{proj.name}</h2>
                <p className="text-sm text-gray-500 mb-2">{proj.description}</p>

                {/* Mini Kanban Columns */}
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-100 rounded p-2 text-center">
                    <div className="font-semibold">{progress.todo}</div>
                    <div className="text-xs text-gray-600">To Do</div>
                  </div>
                  <div className="flex-1 bg-yellow-100 rounded p-2 text-center">
                    <div className="font-semibold">{progress.in_progress}</div>
                    <div className="text-xs text-gray-600">In Progress</div>
                  </div>
                  <div className="flex-1 bg-green-100 rounded p-2 text-center">
                    <div className="font-semibold">{progress.done}</div>
                    <div className="text-xs text-gray-600">Done</div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
