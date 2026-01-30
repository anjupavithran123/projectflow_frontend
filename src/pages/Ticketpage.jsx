import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import TicketForm from "../components/TicketForm";
import TicketList from "../components/TicketList";
import { getTickets, deleteTicket, updateTicket } from "../api/ticket";
import { useAuth } from "../context/AuthContext";

export default function Ticketpage() {
  const { projectId } = useParams();
  const { token, currentUser } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [members, setMembers] = useState([]);
  const [editingTicket, setEditingTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 🔹 State to show/hide the form
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
      const delayDebounceFn = setTimeout(() => {
        loadTickets();
      }, 300);
      return () => clearTimeout(delayDebounceFn);
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
    setIsFormOpen(false); // Hide form after saving
  };

  const handleDelete = async (ticketId) => {
    if (!window.confirm("Delete this ticket?")) return;
    try {
      await deleteTicket(ticketId, token);
      setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    } catch (err) {
      alert("Failed to delete ticket");
    }
  };

  const handleEdit = (ticket) => {
    setEditingTicket(ticket);
    setIsFormOpen(true); // Open form for editing
  };

  const handleStatusChange = async (ticketId, status) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
    try {
      await updateTicket(ticketId, { status }, token);
    } catch (err) {
      alert("Status update failed");
      loadTickets();
    }
  };

  if (!token || (loading && tickets.length === 0)) {
    return <div className="p-6 text-center text-gray-500">Loading tickets...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">
        
        {/* Header with New Ticket Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Project Tickets</h1>
          <button
            onClick={() => {
              setEditingTicket(null);
              setIsFormOpen(!isFormOpen);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm"
          >
            {isFormOpen ? "Close Form" : "+ New Ticket"}
          </button>
        </div>

        {/* 🔹 Conditional Ticket Form */}
        {isFormOpen && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
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

        {/* 🔍 Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <input
            type="text"
            name="search"
            placeholder="Search by title..."
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            value={filters.search}
            onChange={handleFilterChange}
          />
          <select 
            name="status" 
            className="border p-2 rounded-md bg-white" 
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
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
            <option value="">All Priorities</option>
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

        <div className="mt-8">
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
              No tickets found matching your criteria.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}