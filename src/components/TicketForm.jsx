import { useEffect, useState } from "react";
import { createTicket, updateTicket } from "../api/ticket";

export default function TicketForm({
  projectId,
  token,
  members = [],
  existingTicket,
  onCreated,
  onClose,
}) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignee, setAssignee] = useState("");
  const [status, setStatus] = useState("todo");

  // Prefill when editing
  useEffect(() => {
    if (existingTicket) {
      setTitle(existingTicket.title);
      setPriority(existingTicket.priority);
      setAssignee(existingTicket.assignee_id || "");
      setStatus(existingTicket.status || "todo");
    }
  }, [existingTicket]);

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      title: title.trim(),
      priority,
      status,
      assignee: assignee || null,
      projectId,
    };

    try {
      let ticket;

      if (existingTicket) {
        ticket = await updateTicket(existingTicket.id, payload, token);
        onClose();
      } else {
        ticket = await createTicket(payload, token);
      }

      onCreated(ticket);

      // reset
      setTitle("");
      setPriority("medium");
      setStatus("todo");
      setAssignee("");
    } catch (err) {
      console.error("Failed to submit ticket", err);
      alert("Failed to update ticket.");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6"
    >
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ticket title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Fix login issue"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      {/* Grid: Status / Priority / Assignee */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                       bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                       bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Assignee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assignee
          </label>
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                       bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m.user_id} value={m.user_id}>
                {m.users?.name || m.users?.email || "Unknown"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        {existingTicket && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300
                       text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          className="px-5 py-2 text-sm font-medium rounded-lg
                     bg-indigo-600 text-white hover:bg-indigo-700
                     transition shadow-sm"
        >
          {existingTicket ? "Update Ticket" : "Create Ticket"}
        </button>
      </div>
    </form>
  );
}
