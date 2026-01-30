import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";

// Columns definition
const columnsOrder = ["todo", "in_progress", "done"];
const columnsNames = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

export default function KanbanBoard({ projectId }) {
  const [tickets, setTickets] = useState({
    todo: [],
    in_progress: [],
    done: [],
  });

  // Fetch tickets for project
  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await axios.get(`/api/projects/${projectId}/tickets`);
        const grouped = { todo: [], in_progress: [], done: [] };
        res.data.forEach((t) => grouped[t.status].push(t));
        setTickets(grouped);
      } catch (err) {
        console.error(err);
      }
    }
    fetchTickets();
  }, [projectId]);

  // Handle drag end
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return; // dropped outside a list
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return; // same place

    const sourceCol = [...tickets[source.droppableId]];
    const [movedTicket] = sourceCol.splice(source.index, 1);

    const destCol = [...tickets[destination.droppableId]];
    destCol.splice(destination.index, 0, movedTicket);

    const newTickets = {
      ...tickets,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol,
    };

    // Update status locally
    movedTicket.status = destination.droppableId;
    setTickets(newTickets);

    // Update API
    try {
      await axios.put(`/api/tickets/${draggableId}`, {
        status: destination.droppableId,
      });
    } catch (err) {
      console.error("Failed to update ticket:", err);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 p-4">
        {columnsOrder.map((colId) => (
          <Droppable droppableId={colId} key={colId}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-1 p-3 rounded border min-h-[300px] ${
                  snapshot.isDraggingOver ? "bg-gray-100" : "bg-white"
                }`}
              >
                <h2 className="font-bold mb-2">{columnsNames[colId]}</h2>
                {tickets[colId].map((ticket, index) => (
                  <Draggable
                    key={ticket.id}
                    draggableId={ticket.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-3 mb-2 rounded border bg-white shadow-sm ${
                          snapshot.isDragging ? "bg-blue-50" : ""
                        }`}
                      >
                        <h3 className="font-semibold">{ticket.title}</h3>
                        <p>Priority: {ticket.priority}</p>
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
  );
}
