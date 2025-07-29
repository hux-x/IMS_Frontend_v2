// File: src/components/TaskCard.jsx
import React from "react";
import { Clock, CalendarDays } from "lucide-react";

const statusStyles = {
  "Progress": { text: "Progress", bg: "bg-blue-100", textColor: "text-blue-800" },
  "Completed": { text: "Completed", bg: "bg-green-100", textColor: "text-green-800" },
  "Todo": { text: "Todo", bg: "bg-gray-100", textColor: "text-gray-800" }
};

const priorityStyles = {
  "High": { text: "High", bg: "bg-red-100", textColor: "text-red-800" },
  "Medium": { text: "Medium", bg: "bg-yellow-100", textColor: "text-yellow-800" },
  "Low": { text: "Low", bg: "bg-gray-100", textColor: "text-gray-800" }
};

const TaskCard = ({ task }) => {
  const status = statusStyles[task.status] || statusStyles["Todo"];
  const priority = priorityStyles[task.priority] || priorityStyles["Low"];

  return (
    <div className="bg-white rounded-lg border p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <span className={`text-xs ${status.bg} ${status.textColor} px-2 py-1 rounded-full`}>
          {status.text}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4">{task.description}</p>

      <div className="flex items-center text-sm text-gray-500 mb-3">
        <span className="font-medium">👤 {task.assignee}</span>
        <span className="flex items-center gap-1 ml-4">
          <CalendarDays size={14} /> {task.dueDate}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{task.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${task.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
            style={{ width: `${task.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>{task.items || 0} items</span>
        <span>{task.files || 0} files</span>
      </div>
    </div>
  );
};

export default TaskCard;