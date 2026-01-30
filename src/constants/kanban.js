const columns = {
  todo: {
    name: "To Do",
    items: tickets.filter(t => t.status === "To Do"),
  },
  inprogress: {
    name: "In Progress",
    items: tickets.filter(t => t.status === "In Progress"),
  },
  done: {
    name: "Done",
    items: tickets.filter(t => t.status === "Done"),
  },
};
