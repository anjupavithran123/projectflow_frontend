import { useEffect, useState } from "react";
import { getUsers } from "../api/user";
import { useAuth } from "../context/AuthContext";

export default function Members() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers(token);
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load members");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [token]);

  if (loading) {
    return <p className="mt-4 text-sm text-gray-500 animate-pulse">Loading members...</p>;
  }

  if (error) {
    return <p className="mt-4 text-sm text-red-500">{error}</p>;
  }

  return (
    <div className="mt-6 space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          Members
        </h1>
        <p className="text-sm text-gray-500">
          Workspace team
        </p>
      </div>

      {/* Compact Spotlight */}
      {users.length > 0 ? (
        <div className="space-y-3">
          {users.map((user, index) => (
            <section
              key={user.id}
              className="relative bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4"
            >
              {/* Index */}
              <span className="absolute -top-2 left-5 text-[10px] font-semibold text-gray-400 bg-white px-2">
                #{index + 1}
              </span>

              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-base font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                {/* Name + email */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold text-gray-800 truncate">
                    {user.name}
                  </h2>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>

                
                {/* <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">
                  Active
                </span> */}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          No members found
        </div>
      )}
    </div>
  );
}
