import React, { useEffect, useState } from "react";
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
import teamService from "@/apis/services/teamService";
import { useParams } from "react-router-dom";
import dashboardService from "@/apis/services/dashboardService";
import useTasks from "@/hooks/useTask";

const TeamDashboard = () => {
  const [teamData, setTeamData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const { teamId } = useParams();
  
  // Use the hook methods with proper destructuring
  const { handleDeleteTask, handleUpdateTask, addTask } = useTasks();

  useEffect(() => {
    const getTeamDashboard = async () => {
      try {
        const res = await dashboardService.getTeamDashboard(teamId);
        console.log(res.data.team);
        if (res?.data?.team) {
          setTeamData(res.data.team);
        }
      } catch (error) {
        console.error("Error fetching team:", error);
      }
    };
    getTeamDashboard();
  }, [teamId]);

  if (!teamData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading team data...</p>
      </div>
    );
  }

  const { team } = { team: teamData };

  // Filter and sort tasks (newest first)
  const filteredTasks = team.teamTasks
    .filter((task) => {
      const matchesSearch =
        task?.title?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      // Sort by creation date in descending order (newest first)
      const dateA = new Date(a.createdAt || a.updatedAt || 0);
      const dateB = new Date(b.createdAt || b.updatedAt || 0);
      return dateB - dateA;
    });

  // Stats
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

  // Create wrapper functions that update local state after hook operations
  const handleTaskUpdateWrapper = async (updatedTaskOrId, updatedTaskData = null) => {
    try {
      let taskId, updatedTask;
      
      // Handle both calling patterns: (updatedTask) or (taskId, updatedTask)
      if (updatedTaskData === null) {
        // Called with just (updatedTask)
        updatedTask = updatedTaskOrId;
        taskId = updatedTask._id;
        console.log("TeamDashboard: Task update received (single param) - Task:", updatedTask);
      } else {
        // Called with (taskId, updatedTask)
        taskId = updatedTaskOrId;
        updatedTask = updatedTaskData;
        console.log("TeamDashboard: Task update received (two params) - ID:", taskId, "Data:", updatedTask);
      }
      
      if (!taskId) {
        console.error("TeamDashboard: No task ID found in update request");
        return;
      }
      
      // Call the hook's update method
      await handleUpdateTask(taskId, updatedTask);
      
      // Update local state to reflect the changes immediately
      setTeamData((prevTeamData) => {
        const updatedTasks = prevTeamData.teamTasks.map((task) =>
          task._id === taskId ? { ...task, ...updatedTask } : task
        );
        
        console.log("TeamDashboard: Local state updated for task ID:", taskId);
        
        return {
          ...prevTeamData,
          teamTasks: updatedTasks,
        };
      });
    } catch (error) {
      console.error("TeamDashboard: Error updating task:", error);
      alert("Failed to update task. Please try again.");
    }
  };

  const handleTaskDeleteWrapper = async (taskId) => {
    try {
      console.log("TeamDashboard: Task delete requested for ID:", taskId);
      
      // Call the hook's delete method (same as Tasks.jsx)
      await handleDeleteTask(taskId);
      
      // Update local state to remove the deleted task
      setTeamData((prevTeamData) => {
        const updatedTasks = prevTeamData.teamTasks.filter(
          (task) => task._id !== taskId
        );
        
        console.log("TeamDashboard: Task deleted from local state");
        
        return {
          ...prevTeamData,
          teamTasks: updatedTasks,
        };
      });
    } catch (error) {
      console.error("TeamDashboard: Error deleting task:", error);
      alert("Failed to delete task. Please try again.");
    }
  };

  const handleCreateTask = async (newTaskData) => {
    try {
      console.log("TeamDashboard: Creating new task:", newTaskData);
      
      // Use the same pattern as the working Tasks.jsx component
      await addTask(newTaskData);
      
      // Close the modal on success
      setIsCreateTaskOpen(false);
      
      // Refresh team data to show the new task
      const refreshTeamDashboard = async () => {
        try {
          const res = await dashboardService.getTeamDashboard(teamId);
          if (res?.data?.team) {
            setTeamData(res.data.team);
            console.log("TeamDashboard: Team data refreshed after task creation");
          }
        } catch (error) {
          console.error("TeamDashboard: Error refreshing team data:", error);
        }
      };
      
      await refreshTeamDashboard();
      
    } catch (error) {
      console.error("TeamDashboard: Error creating task:", error);
      alert(error.message || "Failed to create task. Please try again.");
    }
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
                      onUpdate={handleTaskUpdateWrapper}
                      onDelete={handleTaskDeleteWrapper}
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