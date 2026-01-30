// src/components/KanbanBoard.jsx
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { COLUMNS } from "../constants/kanban";
import { updateTicket } from "../api/ticket";

export default function KanbanBoard({ tickets, setTickets }) {
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    // No change
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newStatus = destination.droppableId;

    // Optimistic UI update
    setTickets((prev) =>
      prev.map((t) =>
        t.id === draggableId ? { ...t, status: newStatus } : t
      )
    );

    try {
      await updateTicket(draggableId, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {Object.values(COLUMNS).map((col) => (
          <KanbanColumn
            key={col.status}
            column={col}
            tickets={tickets.filter((t) => t.status === col.status)}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
