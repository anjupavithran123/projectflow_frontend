const API_URL = import.meta.env.VITE_API_URL;

export const getUsers = async (token) => {
  const res = await fetch(`${API_URL}/api/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
};
