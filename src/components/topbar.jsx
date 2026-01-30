import { Link, useLocation } from "react-router-dom";

export default function Topbar({ userEmail, onLogout }) {
  const location = useLocation();
  const { projectName } = location.state || {};
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <header
      className="
        fixed top-0 left-0 right-0
        md:left-64
        h-14 bg-white border-b z-40
        flex items-center justify-between px-6
      "
    >
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-600">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="hover:text-gray-900 font-medium">
              HOME
            </Link>
          </li>

          {pathnames.map((name, index) => {
            const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
            const isLast = index === pathnames.length - 1;

            // ✅ Replace projectId with project name
            let displayName = name;
            if (pathnames[index - 1] === "projects" && projectName) {
              displayName = projectName;
            }

            return (
              <li key={routeTo} className="flex items-center space-x-2">
                <span className="text-gray-400">/</span>

                {isLast ? (
                  <span className="font-medium text-gray-900">
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
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">{userEmail}</span>
        <button
          onClick={onLogout}
          className="text-sm text-red-500 hover:text-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
