import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getProjects } from "../api/project";

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { currentUser, logout, token } = useAuth();

  const [projectName, setProjectName] = useState("");

  const pathnames = location.pathname.split("/").filter(Boolean);

  // 🔹 Fetch project name when projectId exists
  useEffect(() => {
    if (!projectId || !token) return;

    const fetchProjectName = async () => {
      try {
        const projects = await getProjects(token);
        const project = projects.find((p) => p.id === projectId);
        if (project) setProjectName(project.name);
      } catch (err) {
        console.error("Failed to fetch project name", err);
      }
    };

    fetchProjectName();
  }, [projectId, token]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="
      fixed top-0 left-0 right-0
      h-16 md:h-20
      bg-white border-b border-gray-200 shadow-sm
      z-50
      flex items-center justify-between
      px-6 md:px-8
      md:ml-64 md:w-[calc(100%-16rem)]
    ">
      {/* Breadcrumbs */}
      <nav className="text-sm md:text-base text-gray-600 flex-1">
        <ol className="flex items-center space-x-3 md:space-x-4">
          <li>
            <Link to="/" className="font-semibold hover:text-gray-900">
              HOME
            </Link>
          </li>

          {pathnames.map((name, index) => {
            const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
            const isLast = index === pathnames.length - 1;

            let displayName = name;

            // 🔹 Replace projectId with project name
            if (name === projectId && projectName) {
              displayName = projectName;
            }

            return (
              <li key={routeTo} className="flex items-center space-x-2">
                <span className="text-gray-400">/</span>

                {isLast ? (
                  <span className="font-semibold text-gray-900">
                    {displayName.toUpperCase()}
                  </span>
                ) : (
                  <Link
                    to={routeTo}
                    className="hover:text-gray-900 font-medium"
                  >
                    {displayName.toUpperCase()}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Right side */}
      <div className="flex items-center space-x-4 shrink-0">
        <span className="text-gray-700 font-medium">
          {currentUser?.email}
        </span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
