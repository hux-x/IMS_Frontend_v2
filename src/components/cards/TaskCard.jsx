import React, { useState } from "react";
import { Clock, CalendarDays } from "lucide-react";
import TaskDetailModal from "@/components/modals/TaskDetailModal";
import UpdateTaskModal from "@/components/modals/UpdateTaskModal";

const statusStyles = {
  "started": { text: "Not Started", bg: "bg-gray-100", textColor: "text-gray-800" },
  "inProgress": { text: "In Progress", bg: "bg-blue-100", textColor: "text-blue-800" },
  "completed": { text: "Completed", bg: "bg-green-100", textColor: "text-green-800" }
};

const priorityStyles = {
  "high": { text: "High", bg: "bg-red-100", textColor: "text-red-800" },
  "medium": { text: "Medium", bg: "bg-yellow-100", textColor: "text-yellow-800" },
  "low": { text: "Low", bg: "bg-gray-100", textColor: "text-gray-800" }
};

const TaskCard = ({ task,onUpdate,onDelete }) => {
  console.log('task')

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  
  const status = statusStyles[task.status] || statusStyles["started"];
  const priority = priorityStyles[task.priority] || priorityStyles["medium"];

  const calculateProgress = () => {
    if (!task.todoChecklist || task.todoChecklist.length === 0) return 0;
    const completed = task.todoChecklist.filter(item => item.completed).length;
    return Math.round((completed / task.todoChecklist.length) * 100);
  };

  const progress = calculateProgress();

  const handleUpdate = (updatedTask) => {
    onUpdate(updatedTask._id,updatedTask);
    setIsUpdateModalOpen(false);
    // setIsDetailModalOpen(false);
  };

  const handleDelete = () => {
    onDelete(task._id);
    setIsDetailModalOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg border p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setIsDetailModalOpen(true)}
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold line-clamp-1">{task.title}</h3>
          <span className={`text-xs ${status.bg} ${status.textColor} px-2 py-1 rounded-full`}>
            {status.text}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description || "No description"}</p>

        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span className="font-medium">👤 {task.assignedTo?.name || "Unassigned"}</span>
          {task.deadline && (
            <span className="flex items-center gap-1 ml-4">
              <CalendarDays size={14} /> {formatDate(task.deadline)}
            </span>
          )}
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          <span>{task.todoChecklist?.length || 0} items</span>
          <span>{task.attachments?.length || 0} files</span>
        </div>
      </div>

      {isDetailModalOpen && (
        <TaskDetailModal 
          task={task} 
          onClose={() => setIsDetailModalOpen(false)}
          onUpdateClick={() => {
            setIsDetailModalOpen(false);
            setIsUpdateModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      )}

      {isUpdateModalOpen && (
        <UpdateTaskModal 
          task={task} 
          onClose={() => {
            setIsUpdateModalOpen(false);
            setIsDetailModalOpen(true);
          }}
          onSave={handleUpdate}
        />
      )}
    </>
  );
};

export default React.memo(TaskCard, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.task) === JSON.stringify(nextProps.task);
});
