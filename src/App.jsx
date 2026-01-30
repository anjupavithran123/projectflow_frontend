import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/home";
import Ticketpage from "./pages/Ticketpage";
import Projects from "./pages/Projects";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/protectedroute";
import KanbanOverview from "./pages/KanbanOverview";
import KanbanPage from "./pages/Kanbanpage"; // ✅ fixed import
import ForgotPassword from "./pages/ForgotPassword";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Protected routes with layout */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<Ticketpage />} />
          <Route path="/kanban-overview" element={<KanbanOverview />} />
          <Route
            path="/projects/:projectId/kanban"
            element={<KanbanPage />} // ✅ fixed component
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
