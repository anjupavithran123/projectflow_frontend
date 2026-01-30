import { Outlet, useParams } from "react-router-dom";
import Sidebar from "./sidebar";
import Topbar from "./topbar";

export default function MainLayout() {
  // ✅ Get projectId from the route if it exists
  const { projectId } = useParams();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar projectId={projectId} />

      <div className="flex-1 md:ml-64">
        <Topbar />
        <main className="pt-14 px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
