const API = `${import.meta.env.VITE_API_URL}/api/tickets`;
export const getTickets = async (projectId, token, filters = {}) => {
  // Clean filters: remove any keys that are empty strings or null
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== "" && value !== null && value !== undefined)
  );

  const params = new URLSearchParams(cleanFilters).toString();
  const url = `${API}/project/${projectId}${params ? `?${params}` : ""}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch tickets");
  return res.json();
};

export const createTicket = async (data, token) => {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create ticket");
  return res.json();
};


/* ✅ ADD THIS */
export const deleteTicket = async (ticketId, token) => {
  const res = await fetch(`${API}/${ticketId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete ticket");
};


export const updateTicket = async (id, data, token) => {
  // Only include fields that are defined
  const payload = {};
  if (data.title !== undefined) payload.title = data.title;
  if (data.priority !== undefined) payload.priority = data.priority;
  if (data.assignee !== undefined) payload.assignee = data.assignee;
  if (data.status !== undefined) payload.status = data.status;

  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("Update error response:", err);
    throw new Error("Failed to update ticket");
  }

  return res.json();
};
