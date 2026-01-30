import { useEffect, useState } from "react";
import { createTicket, updateTicket } from "../api/ticket";

export default function TicketForm({
  projectId,
  token,
  members = [],
  existingTicket,
  onCreated,
  onClose
}) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignee, setAssignee] = useState("");
  const [status, setStatus] = useState("todo"); // ✅ NEW

  // ✅ PREFILL WHEN EDITING
  useEffect(() => {
    if (existingTicket) {
      setTitle(existingTicket.title);
      setPriority(existingTicket.priority);
      setAssignee(existingTicket.assignee_id || "");
      setStatus(existingTicket.status || "todo"); // important!
    }
  }, [existingTicket]);
  

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      title: title.trim(),
      priority,
      status,                    // ✅ SEND STATUS
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
      alert("Failed to update ticket. Check console for details.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Ticket title"
        className="border p-2 w-full"
        required
      />

      {/* ✅ STATUS DROPDOWN */}
      <select
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  className="border p-2 w-full"
>
  <option value="todo">To Do</option>
  <option value="in_progress">In Progress</option>
  <option value="done">Done</option>
</select>

      {/* ASSIGNEE */}
      <select
        value={assignee}
        onChange={(e) => setAssignee(e.target.value)}
        className="border p-2 w-full"
      >
        <option value="">Unassigned</option>
        {members.map((m) => (
          <option key={m.user_id} value={m.user_id}>
            {m.users?.name || m.users?.email || "Unknown"}
          </option>
        ))}
      </select>

      {/* PRIORITY */}
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="border p-2 w-full"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <div className="flex gap-2">
        <button className="bg-black text-white px-4 py-2">
          {existingTicket ? "Update Ticket" : "Create Ticket"}
        </button>

        {existingTicket && (
          <button
            type="button"
            onClick={onClose}
            className="border px-4 py-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
