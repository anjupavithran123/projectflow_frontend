import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TicketForm from "../components/TicketForm";
import TicketList from "../components/TicketList";
import { getTickets, deleteTicket, updateTicket } from "../api/ticket";
import { useAuth } from "../context/AuthContext";

export default function Ticketpage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { token, currentUser } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [members, setMembers] = useState([]);
  const [editingTicket, setEditingTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    assignee: "",
  });

  const loadTickets = useCallback(async () => {
    try {
      const data = await getTickets(projectId, token, filters);
      setTickets(data || []);
    } catch (err) {
      console.error("Failed to load tickets", err);
    } finally {
      setLoading(false);
    }
  }, [projectId, token, filters]);

  useEffect(() => {
    if (token && projectId) {
      const delay = setTimeout(loadTickets, 300);
      return () => clearTimeout(delay);
    }
  }, [loadTickets]);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/projects/${projectId}/members`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setMembers(data || []);
      } catch (err) {
        console.error("Failed to load members", err);
      }
    };
    if (token && projectId) loadMembers();
  }, [projectId, token]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleTicketSave = (ticket) => {
    setTickets((prev) => {
      const exists = prev.find((t) => t.id === ticket.id);
      return exists
        ? prev.map((t) => (t.id === ticket.id ? ticket : t))
        : [ticket, ...prev];
    });
    setEditingTicket(null);
    setIsFormOpen(false);
  };

  const handleDelete = async (ticketId) => {
    if (!window.confirm("Delete this ticket?")) return;
    try {
      await deleteTicket(ticketId, token);
      setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    } catch {
      alert("Failed to delete ticket");
    }
  };

  const handleEdit = (ticket) => {
    setEditingTicket(ticket);
    setIsFormOpen(true);
  };

  const handleStatusChange = async (ticketId, status) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
    try {
      await updateTicket(ticketId, { status }, token);
    } catch {
      alert("Status update failed");
      loadTickets();
    }
  };

  if (!token || (loading && tickets.length === 0)) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading tickets...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-sm">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* 🔙 Back Button */}
            <button
  onClick={() => navigate(-1)}
  className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-300
             text-gray-800 text-xl font-bold hover:bg-gray-100 transition"
  title="Go back"
>
  ←
</button>

            <h1 className="text-2xl font-semibold text-gray-800">
              Project Tickets
            </h1>
          </div>

          <button
            onClick={() => {
              setEditingTicket(null);
              setIsFormOpen(!isFormOpen);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition"
          >
            {isFormOpen ? "Close Form" : "+ New Ticket"}
          </button>
        </div>

        {/* Ticket Form */}
        {isFormOpen && (
          <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
            <TicketForm
              projectId={projectId}
              token={token}
              members={members}
              existingTicket={editingTicket}
              onClose={() => {
                setEditingTicket(null);
                setIsFormOpen(false);
              }}
              onCreated={handleTicketSave}
            />
          </div>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 bg-gray-50 p-4 rounded-xl border">
          <input
            type="text"
            name="search"
            placeholder="Search tickets..."
            className="border p-2 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            value={filters.search}
            onChange={handleFilterChange}
          />
          <select
            name="status"
            className="border p-2 rounded-md bg-white"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Status</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select
            name="priority"
            className="border p-2 rounded-md bg-white"
            value={filters.priority}
            onChange={handleFilterChange}
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            name="assignee"
            className="border p-2 rounded-md bg-white"
            value={filters.assignee}
            onChange={handleFilterChange}
          >
            <option value="">All Assignees</option>
            {members.map((m) => (
              <option key={m.user_id} value={m.user_id}>
                {m.users?.name || m.users?.email}
              </option>
            ))}
          </select>
        </div>

        {/* Ticket List */}
        <TicketList
          tickets={tickets}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          userId={currentUser?.id}
          token={token}
        />

        {tickets.length === 0 && !loading && (
          <p className="text-center text-gray-400 py-10 italic">
            No tickets found.
          </p>
        )}
      </div>
    </div>
  );
}
