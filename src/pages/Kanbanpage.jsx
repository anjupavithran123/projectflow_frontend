import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getTickets, updateTicket } from "../api/ticket";
import { useAuth } from "../context/AuthContext";

const COLUMNS = [
  { id: "todo", title: "To Do" },
  { id: "inProgress", title: "In Progress" },
  { id: "done", title: "Done" },
];

// DB → UI column
const DB_TO_COLUMN = {
  todo: "todo",
  in_progress: "inProgress",
  done: "done",
};

// UI column → DB
const COLUMN_TO_DB = {
  todo: "todo",
  inProgress: "in_progress",
  done: "done",
};

export default function KanbanPage() {
  const { projectId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch tickets
  useEffect(() => {
    if (!projectId || !token) return;

    async function fetchTickets() {
      try {
        const data = await getTickets(projectId, token);
        const list = Array.isArray(data) ? data : data.tickets || [];

        const grouped = { todo: [], inProgress: [], done: [] };

        list.forEach((t) => {
          const column = DB_TO_COLUMN[t.status] || "todo";
          grouped[column].push(t);
        });

        setTickets(grouped);
      } catch (err) {
        console.error(err);
        setError("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, [projectId, token]);

  // Drag handler
  const onDragEnd = ({ source, destination, draggableId }) => {
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    const sourceItems = Array.from(tickets[sourceCol]);
    const [moved] = sourceItems.splice(source.index, 1);

    const destItems =
      sourceCol === destCol
        ? sourceItems
        : Array.from(tickets[destCol]);

    destItems.splice(destination.index, 0, moved);

    setTickets((prev) => ({
      ...prev,
      [sourceCol]: sourceCol === destCol ? destItems : sourceItems,
      [destCol]: destItems,
    }));

    // Persist DB-safe status
    updateTicket(
      draggableId.toString(),
      { status: COLUMN_TO_DB[destCol] },
      token
    ).catch((err) =>
      console.error("Failed to update ticket", err)
    );
  };

  if (loading) return <p className="p-6">Loading tickets…</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="h-11 w-11 flex items-center justify-center
            rounded-xl bg-white shadow-md
            text-gray-700 text-xl font-bold
            hover:shadow-lg hover:bg-gray-50
            active:scale-95 transition"
          title="Go back"
        >
          ←
        </button>

        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Kanban Board
          </h1>
          <p className="text-sm text-gray-500">
            Drag & drop tickets to update status
          </p>
        </div>
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white rounded-2xl shadow-md p-4 min-h-[420px]"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-800">
                      {column.title}
                    </h2>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {tickets[column.id].length}
                    </span>
                  </div>

                  {tickets[column.id].map((ticket, index) => (
                    <Draggable
                      key={ticket.id}
                      draggableId={ticket.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-3 rounded-xl bg-gray-50
                            border border-gray-200
                            p-3 shadow-sm
                            hover:shadow-md hover:bg-white
                            transition cursor-grab"
                        >
                          <p className="text-sm font-medium text-gray-800">
                            {ticket.title}
                          </p>

                          {ticket.priority && (
                            <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                              {ticket.priority}
                            </span>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
