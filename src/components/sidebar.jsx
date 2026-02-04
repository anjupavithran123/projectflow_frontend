import { Link, useParams, useLocation } from "react-router-dom";
import { FaProjectDiagram } from "react-icons/fa"; // Font Awesome icon

export default function Sidebar() {
  const { projectId } = useParams();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r h-screen fixed hidden md:block shadow-md">
      {/* Header with icon */}
      <div className="flex items-center gap-2 px-6 py-6.5 border-b border-gray-200 text-xl font-bold text-gray-800">
        <FaProjectDiagram className="text-blue-500 w-6 h-6" />
        <span>Project_Flow</span>
      </div>

      {/* Navigation links */}
      <nav className="p-4 flex flex-col space-y-1">
        <Link
          to="/dashboard"
          className={`block px-4 py-2 rounded-lg transition-colors ${
            isActive("/dashboard") ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"
          }`}
        >
          Dashboard
        </Link>

        <Link
          to="/projects"
          className={`block px-4 py-2 rounded-lg transition-colors ${
            isActive("/projects") ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"
          }`}
        >
          Projects
        </Link>

        <Link
          to="/members"
          className={`block px-4 py-2 rounded-lg transition-colors ${
            isActive("/members") ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"
          }`}
        >
          Members
        </Link>

        <Link
          to="/kanban-overview"
          className={`block px-4 py-2 rounded-lg transition-colors ${
            isActive("/kanban-overview") ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"
          }`}
        >
          Overview
        </Link>

        {/* Project-specific links */}
        {projectId && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col space-y-1">
            <span className="text-xs text-gray-500 uppercase px-4">Project</span>

            <Link
              to={`/projects/${projectId}`}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive(`/projects/${projectId}`) ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"
              }`}
            >
              Project Details
            </Link>

            <Link
              to={`/projects/${projectId}/kanban`}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive(`/projects/${projectId}/kanban`) ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"
              }`}
            >
              Kanban Board
            </Link>
          </div>
        )}
      </nav>
    </aside>
  );
}
