import React from "react";

const TaskCard = ({task}) => {
  return (
    <div className="bg-gray-50 rounded-lg shadow-sm flex justify-between items-start p-6 mt-4 w-[70vw]">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="h-3 w-3 bg-red-500 rounded-full inline-block"></span>
          <h3 className="font-semibold">{task.title}</h3>
          <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
            {task.status}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          {task.description}
        </p>
        <div className="text-xs text-gray-500 flex gap-4">
          <span>📅 {task.dueDate}</span>
        </div>
      </div>
      <button className="text-sm  px-3 py-1 rounded bg-white border-1">
        View
      </button>
    </div>
  );
};

export default TaskCard;
