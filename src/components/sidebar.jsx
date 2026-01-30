import { Link, useParams } from "react-router-dom";

export default function Sidebar() {
  const { projectId } = useParams();

  return (
    <aside className="w-64 bg-white border-r h-screen fixed hidden md:block">
      <div className="p-4 text-xl font-bold border-b">
        Project_Flow
      </div>

      <nav className="p-4 space-y-2">
        <Link
          to="/dashboard"
          className="block p-2 rounded hover:bg-gray-100"
        >
          Dashboard
        </Link>

        <Link
          to="/projects"
          className="block p-2 rounded hover:bg-gray-100"
        >
          Projects
        </Link>

        <Link
          to="/tickets"
          className="block p-2 rounded hover:bg-gray-100"
        >
          Tickets
        </Link>

        <Link
          to="/kanban-overview"
          className="block p-2 rounded hover:bg-gray-100"
        >
          Kanban Overview
        </Link>

        {/* Project-specific links */}
        {projectId && (
          <>
            <div className="pt-3 mt-3 border-t text-xs text-gray-500 uppercase">
              Project
            </div>

            <Link
              to={`/projects/${projectId}`}
              className="block p-2 rounded hover:bg-gray-100"
            >
              Project Details
            </Link>

            <Link
              to={`/projects/${projectId}/kanban`}
              className="block p-2 rounded hover:bg-gray-100 font-medium"
            >
              Kanban Board
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
