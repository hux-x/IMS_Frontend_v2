import React, { useState } from "react";
import { 
  X, 
  Clock, 
  CalendarDays, 
  FileText, 
  CheckCircle, 
  User, 
  Users, 
  ChevronDown, 
  ChevronUp,
  Edit,
  Trash2
} from "lucide-react";

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

const TaskDetailModal = ({ task, onClose, onUpdateClick, onDelete }) => {
  const [showChecklist, setShowChecklist] = useState(true);
  const [showAttachments, setShowAttachments] = useState(true);

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateProgress = () => {
    if (!task.todoChecklist || task.todoChecklist.length === 0) return 0;
    const completed = task.todoChecklist.filter(item => item.completed).length;
    return Math.round((completed / task.todoChecklist.length) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50"style={{backgroundColor: 'rgba(0, 0, 0, 0.6)'}}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-black p-4" >
        {/* Modal Header */}
        <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-lg font-semibold">Task Details</h3>
          <div className="flex gap-2">
            <button
              onClick={onUpdateClick}
              className="flex items-center gap-1 bg-black text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600 transition-colors"
            >
              <Edit size={16} />
              Update Task
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors"
            >
              <Trash2 size={16} />
              Delete
            </button>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold">{task.title}</h2>
            <div className="flex gap-2">
              <span className={`text-xs ${statusStyles[task.status]?.bg} ${statusStyles[task.status]?.textColor} px-2 py-1 rounded-full`}>
                {statusStyles[task.status]?.text}
              </span>
              <span className={`text-xs ${priorityStyles[task.priority]?.bg} ${priorityStyles[task.priority]?.textColor} px-2 py-1 rounded-full`}>
                {priorityStyles[task.priority]?.text}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-700">{task.description || "No description provided"}</p>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
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

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-gray-500" />
              <span>Deadline: {formatDate(task.deadline)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-500" />
              <span>Created: {formatDate(task.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-500" />
              <span>Assigned to: {task.assignedTo?.name || "Unassigned"}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-500" />
              <span>Assigned by: {task.assignedBy?.name || "Unknown"}</span>
            </div>
            {task.teamId && (
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-500" />
                <span>Team: {task.teamId?.name || "No team"}</span>
              </div>
            )}
          </div>

          {/* Checklist */}
          <div className="border rounded-lg overflow-hidden">
            <button 
              className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100"
              onClick={() => setShowChecklist(!showChecklist)}
            >
              <div className="flex items-center gap-2">
                <CheckCircle size={16} />
                <span>Checklist ({task.todoChecklist?.length || 0})</span>
              </div>
              {showChecklist ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {showChecklist && (
              <div className="p-3 space-y-2">
                {task.todoChecklist?.length > 0 ? (
                  task.todoChecklist.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={item.completed} 
                        readOnly
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={item.completed ? "line-through text-gray-400" : ""}>
                        {item.text}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No checklist items</p>
                )}
              </div>
            )}
          </div>

          {/* Attachments */}
          <div className="border rounded-lg overflow-hidden">
            <button 
              className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100"
              onClick={() => setShowAttachments(!showAttachments)}
            >
              <div className="flex items-center gap-2">
                <FileText size={16} />
                <span>Attachments ({task.attachments?.length || 0})</span>
              </div>
              {showAttachments ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {showAttachments && (
              <div className="p-3 space-y-2">
                {task.attachments?.length > 0 ? (
                  task.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                      <FileText size={14} />
                      <a href={attachment} target="_blank" rel="noopener noreferrer">
                        Attachment {index + 1}
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No attachments</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;