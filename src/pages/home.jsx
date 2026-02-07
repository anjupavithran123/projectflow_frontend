import { Link } from "react-router-dom";
import { FaProjectDiagram } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">

      {/* ================= TOPBAR ================= */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white shadow-lg">
              <FaProjectDiagram className="w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900">
              Project<span className="text-indigo-600">Flow</span>
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              to="/adminlogin"
              className="rounded-full border border-indigo-600 px-6 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition"
            >
              Admin
            </Link>

            <Link
              to="/login"
              className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 hover:shadow-lg transition"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-32 grid md:grid-cols-2 gap-16 items-center">

        {/* Left Content */}
        <div>
          <span className="inline-block mb-5 rounded-full bg-indigo-100 px-5 py-1.5 text-sm font-semibold text-indigo-600">
            Simple • Fast • Powerful
          </span>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
            Manage projects <br />
            <span className="text-indigo-600">without the chaos</span>
          </h1>

          <p className="text-gray-600 text-lg mb-10 max-w-xl">
            Plan projects, assign tickets, and collaborate effortlessly
            with a clean workflow designed for modern teams.
          </p>

          <div className="flex gap-4">
            <Link
              to="/login"
              className="rounded-xl bg-indigo-600 px-10 py-4 text-white font-semibold shadow-lg hover:bg-indigo-700 hover:shadow-xl transition"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="rounded-xl border border-gray-300 px-10 py-4 text-gray-700 font-semibold hover:bg-gray-100 transition"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Right Visual */}
        <div className="relative">
          <div className="absolute -top-12 -left-12 w-80 h-80 bg-indigo-300 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-purple-300 rounded-full blur-3xl opacity-30"></div>

          <div className="relative bg-white/90 backdrop-blur rounded-3xl shadow-2xl border p-6">
            <div className="flex gap-3 mb-6">
              <div className="h-3 w-3 rounded-full bg-red-400"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
              <div className="h-3 w-3 rounded-full bg-green-400"></div>
            </div>

            <div className="space-y-4">
              <Card title="Website Redesign" status="In Progress" />
              <Card title="Fix Login Bug" status="Open" />
              <Card title="Release v1.0" status="Completed" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-8">
        <Feature
          title="Fast & Simple"
          text="No clutter. Only what your team needs to deliver faster."
        />
        <Feature
          title="Ticket Driven"
          text="Track tasks, bugs, and progress with total clarity."
        />
        <Feature
          title="Built for Teams"
          text="Collaborate across projects without friction."
        />
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="text-center text-sm text-gray-500 pb-10">
        © {new Date().getFullYear()} ProjectFlow. All rights reserved.
      </footer>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Card({ title, status }) {
  const colors = {
    Open: "bg-blue-100 text-blue-700",
    "In Progress": "bg-yellow-100 text-yellow-700",
    Completed: "bg-green-100 text-green-700",
  };

  return (
    <div className="flex justify-between items-center rounded-xl border p-4 hover:shadow-md transition">
      <span className="font-medium text-gray-800">{title}</span>
      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colors[status]}`}>
        {status}
      </span>
    </div>
  );
}

function Feature({ title, text }) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-md border hover:shadow-xl hover:-translate-y-1 transition-all">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        {title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        {text}
      </p>
    </div>
  );
}
