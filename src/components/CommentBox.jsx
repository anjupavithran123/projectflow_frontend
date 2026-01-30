// src/components/CommentBox.jsx
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
    <div className="border-t pt-2 mt-2">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="mb-3 border-b pb-2 flex justify-between gap-3"
        >
          <div>
            {/* User */}
            <p className="text-sm font-semibold">
              {comment.users?.name ||
                comment.users?.email ||
                "Unknown user"}
            </p>

            {/* Comment text */}
            <p className="text-sm">{comment.text}</p>

            {/* Time */}
            <p className="text-xs text-gray-500 mt-1">
              {new Date(comment.created_at).toLocaleString()}
            </p>
          </div>

          {/* Delete button (only owner) */}
          {comment.user_id === userId && (
            <button
              onClick={() => handleDelete(comment.id)}
              className="text-xs text-red-500 hover:underline"
            >
              Delete
            </button>
          )}
        </div>
      ))}

      {/* Add Comment */}
      <form onSubmit={handleSubmit} className="flex mt-2 gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 border rounded px-2 py-1"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Add
        </button>
      </form>
    </div>
  );
}
