import { useEffect, useState } from "react";
import {
  getComments,
  createComment,
  deleteComment
} from "../api/comment";

export default function CommentBox({ ticketId, userId, token }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const fetchComments = async () => {
    try {
      const data = await getComments(ticketId, token);
      setComments(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await createComment({ ticketId, userId, text }, token);
      setText("");
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await deleteComment(id, token);
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-2 space-y-4">
      {/* Comments */}
      {comments.length > 0 ? (
        comments.map((comment) => {
          const isOwner = comment.user_id === userId;

          return (
            <div
              key={comment.id}
              className={`flex gap-3 ${
                isOwner ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar (only for others) */}
              {!isOwner && (
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                  {(comment.users?.name ||
                    comment.users?.email ||
                    "U")[0].toUpperCase()}
                </div>
              )}

              {/* Comment Bubble */}
              <div
                className={`group max-w-[75%] rounded-xl px-3 py-2 text-sm shadow-sm ${
                  isOwner
                    ? "bg-gray-200 text-gray-800"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {/* User */}
                <p className="text-xs font-semibold text-gray-600 mb-0.5">
                  {comment.users?.name ||
                    comment.users?.email ||
                    "Unknown"}
                </p>

                {/* Text */}
                <p>{comment.text}</p>

                {/* Meta */}
                <div className="mt-1 flex items-center justify-between gap-2 text-[10px] text-gray-500">
                  <span>
                    {new Date(comment.created_at).toLocaleString()}
                  </span>

                  {/* Delete icon (owner only) */}
                  {isOwner && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="opacity-0 group-hover:opacity-100 transition text-blue-400 hover:text-red-500"
                      title="Delete comment"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m3-3h4a1 1 0 011 1v1H9V5a1 1 0 011-1z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-xs text-gray-400">No comments yet</p>
      )}

      {/* Add Comment */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 pt-3 border-t border-gray-100"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment…"
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-700 text-white hover:bg-indigo-800 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
