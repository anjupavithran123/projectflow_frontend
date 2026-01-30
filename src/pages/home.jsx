import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      
      {/* Topbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-indigo-600">
            ProjectFlow
          </h1>

          <Link
            to="/login"
            className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 hover:shadow-lg transition"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-28 grid md:grid-cols-2 gap-14 items-center">
        {/* Left */}
        <div>
          <span className="inline-block mb-4 rounded-full bg-indigo-100 px-4 py-1 text-sm font-medium text-indigo-600">
            Simple Project Management
          </span>

          <h2 className="text-5xl font-extrabold leading-tight text-gray-900 mb-6">
            Manage work <br />
            without the chaos
          </h2>

          <p className="text-gray-600 text-lg mb-8 max-w-xl">
            Plan projects, track tickets, and collaborate with your team using
            a clean and intuitive workflow built for speed.
          </p>

          <div className="flex gap-4">
            <Link
              to="/login"
              className="rounded-xl bg-indigo-600 px-8 py-4 text-white font-semibold shadow-lg hover:bg-indigo-700 transition"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="rounded-xl border border-gray-300 px-8 py-4 text-gray-700 font-semibold hover:bg-gray-100 transition"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Right Visual */}
        <div className="relative">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-indigo-300 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-purple-300 rounded-full blur-3xl opacity-30"></div>

          <div className="relative bg-white rounded-3xl shadow-xl border p-6">
            <div className="flex gap-4 mb-6">
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

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-8">
        <Feature
          title="Fast & Simple"
          text="No clutter, just what your team needs to ship faster."
        />
        <Feature
          title="Ticket Focused"
          text="Track bugs and tasks with clear ownership."
        />
        <Feature
          title="Built for Teams"
          text="Collaborate effortlessly across projects."
        />
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 pb-8">
        © {new Date().getFullYear()} ProjectFlow
      </footer>
    </div>
  );
}

function Card({ title, status }) {
  const colors = {
    Open: "bg-blue-100 text-blue-700",
    "In Progress": "bg-yellow-100 text-yellow-700",
    Completed: "bg-green-100 text-green-700",
  };

  return (
    <div className="flex justify-between items-center rounded-xl border p-4">
      <span className="font-medium text-gray-800">{title}</span>
      <span className={`text-xs px-3 py-1 rounded-full ${colors[status]}`}>
        {status}
      </span>
    </div>
  );
}

function Feature({ title, text }) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-md border hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  );
}
