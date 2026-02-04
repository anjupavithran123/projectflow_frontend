import CommentBox from "./CommentBox";

export default function TicketList({
  tickets,
  onEdit,
  onDelete,
  userId,
  token,
}) {
  return (
    <div className="mt-4 space-y-4">
      {tickets.map((t) => (
        <div
          key={t.id}
          className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-gray-800">
                {t.title}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Created {new Date(t.created_at).toLocaleString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(t)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(t.id)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Info Columns */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            {/* Status */}
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Status
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                {t.status}
              </span>
            </div>

            {/* Priority */}
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Priority
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-xs font-medium">
                {t.priority}
              </span>
            </div>

            {/* Assignee */}
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Assignee
              </p>
              <p className="mt-1 text-gray-700 font-medium truncate">
                {t.assignee_user?.name ||
                  t.assignee_user?.email ||
                  "Unassigned"}
              </p>
            </div>
          </div>

          {/* Comments */}
          {userId && token && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <CommentBox
                ticketId={t.id}
                userId={userId}
                token={token}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
