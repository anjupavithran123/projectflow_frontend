// src/api/project.js
const API_URL = "http://localhost:4000/api/projects";

export const getProjects = async (token) => {
  const res = await fetch(API_URL, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("Failed to load projects");
  return res.json();
};

export const createProject = async (data, token) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Create project failed");
  return res.json();
};

export const updateProject = async (id, data, token) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Update project failed");
  return res.json();
};

export const deleteProject = async (id, token) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Delete project failed");
  return res.json();
};

export const addMember = async (projectId, data, token) => {
  const res = await fetch(`${API_URL}/${projectId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data), // { email }
  });

  if (!res.ok) throw new Error("Add member failed");
  return res.json();
};

export const removeMember = async (projectId, userId, token) => {
  const res = await fetch(`${API_URL}/${projectId}/members/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Remove member failed");
  return res.json();
};
