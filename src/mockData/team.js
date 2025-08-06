export const mockTeamData = {
  team: {
    _id: "team123",
    name: "Frontend Development Team",
    teamLead: {
      _id: "lead1",
      name: "Sarah Johnson",
      position: "Senior Developer"
    },
    members: [
      { _id: "1", name: "Sarah Johnson", position: "Senior Developer", available: true, isOnline: true },
      { _id: "2", name: "Mike Chen", position: "UI/UX Designer", available: true, isOnline: false },
      { _id: "3", name: "Alex Rodriguez", position: "Frontend Developer", available: false, isOnline: true },
      { _id: "4", name: "Emma Wilson", position: "Junior Developer", available: true, isOnline: true }
    ],
    teamTasks: [
      {
        _id: "task1",
        title: "Implement User Authentication",
        description: "Create login and registration functionality with JWT authentication",
        status: "inProgress",
        priority: "high",
        assignedTo: { name: "Mike Chen" },
        deadline: "2025-08-15T00:00:00Z",
        todoChecklist: [
          { text: "Design login form", completed: true },
          { text: "Implement JWT tokens", completed: true },
          { text: "Add password validation", completed: false },
          { text: "Create registration flow", completed: false }
        ],
        attachments: ["mockup.png", "requirements.pdf"]
      },
      {
        _id: "task2",
        title: "Dashboard Redesign",
        description: "Modernize the dashboard interface with new components",
        status: "started",
        priority: "medium",
        assignedTo: { name: "Alex Rodriguez" },
        deadline: "2025-08-20T00:00:00Z",
        todoChecklist: [
          { text: "Create wireframes", completed: false },
          { text: "Design new components", completed: false },
          { text: "Implement responsive layout", completed: false }
        ],
        attachments: ["design-system.fig"]
      },
      {
        _id: "task3",
        title: "API Integration",
        description: "Connect frontend with backend REST API endpoints",
        status: "completed",
        priority: "high",
        assignedTo: { name: "Sarah Johnson" },
        deadline: "2025-08-10T00:00:00Z",
        todoChecklist: [
          { text: "Set up axios configuration", completed: true },
          { text: "Create API service layer", completed: true },
          { text: "Handle error responses", completed: true },
          { text: "Add loading states", completed: true }
        ],
        attachments: []
      }
    ]
  }
};