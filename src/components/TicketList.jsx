import CommentBox from "./CommentBox"; // make sure the path is correct

export default function TicketList({
  tickets,
  onEdit,
  onDelete,
  userId,
  token,
}) {
  return (
    <div className="space-y-6 mt-4">
      {tickets.map((t) => (
        <div
          key={t.id}
          className="border p-4 rounded flex flex-col bg-gray-50"
        >
          {/* Ticket Info */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{t.title}</h3>

              <p className="text-sm">
                <span className="font-semibold">Status:</span> {t.status}
              </p>

              <p className="text-sm">
                <span className="font-semibold">Priority:</span> {t.priority}
              </p>

              <p className="text-sm">
                <span className="font-semibold">Assignee:</span>{" "}
                {t.assignee_user?.name || t.assignee_user?.email || "Unassigned"}
              </p>

              <small className="text-gray-500">
                Created: {new Date(t.created_at).toLocaleString()}
              </small>
            </div>

            {/* Edit / Delete Buttons */}
            <div className="space-x-2 flex items-center">
              <button
                onClick={() => onEdit(t)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(t.id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Comment Section */}
          {userId && token && (
  <div className="mt-4">
    <CommentBox ticketId={t.id} userId={userId} token={token} />
  </div>
)}
        </div>
      ))}
    </div>
  );
}
