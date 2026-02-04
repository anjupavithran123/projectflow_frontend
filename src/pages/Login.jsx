import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, form);
      login(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Email */}
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        {/* Password with Eye Icon inside input */}
        <div className="relative">
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="********"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          {/* Eye icon truly inside the input */}
          <span
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.473-6.326M9.88 9.88a3 3 0 104.243 4.243M15 15l6 6m0 0l-6-6m6 6L3 3"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </span>
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white font-semibold ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>


        {/* Register link */}
<p className="text-center text-sm text-gray-600">
  Don&apos;t have an account?{" "}
  <Link to="/register" className="text-blue-600 hover:underline font-medium">
    Register
  </Link>
</p>

      </form>
    </div>
  );
}
