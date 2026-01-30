// src/api/comment.js
const API = `${import.meta.env.VITE_API_URL}/api/comments`;

export const getComments = async (ticketId, token) => {
  const res = await fetch(`${API}/${ticketId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
};

export const createComment = async ({ ticketId, userId, text, parentId }, token) => {
  const payload = { ticket_id: ticketId, user_id: userId, text };
  if (parentId) payload.parent_id = parentId;
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create comment");
  return res.json();
};

export const updateComment = async (id, text, token) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Failed to update comment");
  return res.json();
};

export const deleteComment = async (id, token) => {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete comment");
};
