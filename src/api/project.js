// src/api/project.js
const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/projects`;

const authHeader = (token) => ({
  Authorization: `Bearer ${token}`,
});

const jsonAuthHeader = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

const handleResponse = async (res, errorMessage) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || errorMessage);
  }
  return res.json();
};

export const getProjects = async (token) => {
  const res = await fetch(API_URL, {
    headers: authHeader(token),
  });
  return handleResponse(res, "Failed to load projects");
};

export const createProject = async (data, token) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: jsonAuthHeader(token),
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Create project failed");
};

export const updateProject = async (id, data, token) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: jsonAuthHeader(token),
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Update project failed");
};

export const deleteProject = async (id, token) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: authHeader(token),
  });
  return handleResponse(res, "Delete project failed");
};

export const addMember = async (projectId, data, token) => {
  const res = await fetch(`${API_URL}/${projectId}/members`, {
    method: "POST",
    headers: jsonAuthHeader(token),
    body: JSON.stringify(data), // { email }
  });
  return handleResponse(res, "Add member failed");
};

export const removeMember = async (projectId, userId, token) => {
  const res = await fetch(`${API_URL}/${projectId}/members/${userId}`, {
    method: "DELETE",
    headers: authHeader(token),
  });
  return handleResponse(res, "Remove member failed");
};
