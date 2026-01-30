import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getTickets, updateTicket } from "../api/ticket";
import { useAuth } from "../context/AuthContext";

const COLUMNS = [
  { id: "todo", title: "To Do" },
  { id: "inProgress", title: "In Progress" },
  { id: "done", title: "Done" },
];

// Convert DB status -> column ID
const normalizeStatus = (status) => {
  if (!status) return "todo";
  const s = status.toLowerCase();
  if (s.includes("progress")) return "inProgress";
  if (s.includes("done")) return "done";
  return "todo";
};

// Column ID -> DB status (must match your Supabase check constraint exactly!)
const STATUS_MAP = {
  todo: "To Do",
  inProgress: "In Progress",
  done: "Done",
};

export default function KanbanPage() {
  const { projectId } = useParams();
  const { token } = useAuth();

  const [tickets, setTickets] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch tickets for this project
  useEffect(() => {
    if (!projectId || !token) return;

    async function fetchData() {
      try {
        const data = await getTickets(projectId, token);
        const arr = Array.isArray(data) ? data : data.tickets || [];

        const grouped = { todo: [], inProgress: [], done: [] };
        arr.forEach((t) => grouped[normalizeStatus(t.status)].push(t));

        setTickets(grouped);
      } catch (e) {
        console.error(e);
        setError("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [projectId, token]);

  // Handle drag-and-drop
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
      sourceCol === destCol ? sourceItems : Array.from(tickets[destCol]);

    destItems.splice(destination.index, 0, moved);

    // Update UI immediately
    setTickets((prev) => ({
      ...prev,
      [sourceCol]: sourceCol === destCol ? destItems : sourceItems,
      [destCol]: destItems,
    }));

    // Persist status in backend with exact DB value
    const newStatus = STATUS_MAP[destCol];
    updateTicket(draggableId.toString(), { status: newStatus }, token)
      .then((res) => console.log("Ticket updated:", res))
      .catch((err) => console.error("Failed to update ticket:", err));
  };

  if (loading) return <p className="p-4">Loading tickets...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-3 gap-4 p-4">
        {COLUMNS.map((column) => (
          <Droppable
            droppableId={column.id}
            key={column.id}
            isDropDisabled={false} // ✅ must be boolean
          >
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-100 p-3 rounded min-h-[300px]"
              >
                <h2 className="font-bold mb-3">{column.title}</h2>

                {(tickets[column.id] || []).map((ticket, index) => (
                  <Draggable
                    draggableId={ticket.id.toString()}
                    index={index}
                    key={ticket.id}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white p-2 mb-2 rounded shadow"
                      >
                        {ticket.title}
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder} {/* ✅ required */}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
