import React, { useState } from "react";
import {
  Users,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle,
  User,
  Target,
  Activity,
} from "lucide-react";
import TaskCard from "@/components/cards/TaskCard";
import CreateTask from "@/components/modals/createTask";
import { mockTeamData } from "@/mockData/team";

const TeamDashboard = () => {
  const [teamData, setTeamData] = useState(mockTeamData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const { team } = teamData;

  // Filter tasks based on search and filters
  const filteredTasks = team.teamTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Calculate team statistics
  const totalTasks = team.teamTasks.length;
  const completedTasks = team.teamTasks.filter(
    (task) => task.status === "completed"
  ).length;
  const inProgressTasks = team.teamTasks.filter(
    (task) => task.status === "inProgress"
  ).length;
  const notStartedTasks = team.teamTasks.filter(
    (task) => task.status === "started"
  ).length;
  const onlineMembers = team.members.filter((member) => member.isOnline).length;
  const availableMembers = team.members.filter(
    (member) => member.available
  ).length;

  const handleTaskUpdate = (updatedTask) => {
    console.log("Task updated:", updatedTask);
  };

  const handleTaskDelete = (taskId) => {
    console.log("Task deleted:", taskId);
  };

  const handleCreateTask = (newTaskData) => {
    // Convert the CreateTask form data to match our task schema
    const newTask = {
      _id: `task${Date.now()}`, // Generate a temporary ID
      title: newTaskData.description, // Using description as title since form doesn't have title
      description: newTaskData.description,
      status: newTaskData.status.toLowerCase().replace(' ', ''), // Convert "In Progress" to "inProgress"
      priority: newTaskData.priority.toLowerCase(),
      assignedTo: { name: newTaskData.assignee },
      deadline: newTaskData.deadline ? `${newTaskData.deadline}T00:00:00Z` : null,
      todoChecklist: newTaskData.checklist
        .filter(item => item.trim() !== '')
        .map(item => ({ text: item, completed: false })),
      attachments: newTaskData.files || []
    };

    // Add the new task to the team data
    setTeamData(prev => ({
      ...prev,
      team: {
        ...prev.team,
        teamTasks: [...prev.team.teamTasks, newTask]
      }
    }));

    console.log("Task created:", newTask);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
            <p className="text-gray-600">Led by {team.teamLead.name}</p>
          </div>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => setIsCreateTaskOpen(true)}
          >
            <Plus size={16} />
            New Task
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{totalTasks}</p>
              </div>
              <Target className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">
                  {completedTasks}
                </p>
              </div>
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">
                  {inProgressTasks}
                </p>
              </div>
              <Activity className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Team Members
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {team.members.length}
                </p>
              </div>
              <Users className="h-12 w-12 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Team Tasks</h2>
                  <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="started">Not Started</option>
                      <option value="inProgress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="all">All Priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="p-6">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onUpdate={handleTaskUpdate}
                      onDelete={handleTaskDelete}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">
                      No tasks found matching your criteria
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Team Members Sidebar */}
          <div className="space-y-6">
            {/* Team Overview */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Team Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Online Members</span>
                  <span className="text-sm font-medium">
                    {onlineMembers}/{team.members.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Available</span>
                  <span className="text-sm font-medium">
                    {availableMembers}/{team.members.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="text-sm font-medium">
                    {Math.round((completedTasks / totalTasks) * 100) || 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Team Members</h3>
              <div className="space-y-4">
                {team.members.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User size={20} className="text-gray-600" />
                        </div>
                        {member.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-gray-600">
                          {member.position}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {member.available ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Available
                        </span>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          Busy
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {isCreateTaskOpen && (
        <CreateTask 
          isOpen={isCreateTaskOpen}
          onClose={() => setIsCreateTaskOpen(false)}
          onCreate={handleCreateTask}
        />
      )}
    </div>
  );
};

export default TeamDashboard;