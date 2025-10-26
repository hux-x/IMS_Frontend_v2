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
  Trash2,
  Download,
  Eye,
  Image,
  File
} from "lucide-react";
import { Link } from "react-router-dom";

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

// File preview component
const FilePreview = ({ url, fileName, onClose }) => {
  const fileExtension = fileName?.split('.').pop()?.toLowerCase() || url.split('.').pop()?.toLowerCase();
  
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension);
  const isPDF = fileExtension === 'pdf';
  
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[60]" style={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold truncate">{fileName || 'File Preview'}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 h-[calc(90vh-80px)] overflow-auto">
          {isImage ? (
            <div className="flex justify-center">
              <img 
                src={url} 
                alt={fileName}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="hidden text-center text-gray-500">
                <File size={48} className="mx-auto mb-2" />
                <p>Unable to preview image</p>
              </div>
            </div>
          ) : isPDF ? (
            <iframe 
              src={`${url}#toolbar=1`}
              className="w-full h-full border-0"
              title={fileName}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <File size={48} className="mb-4" />
              <p className="text-lg mb-2">Preview not available</p>
              <p className="text-sm mb-4">This file type cannot be previewed in the browser</p>
              <a
                href={url}
                download={fileName}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Download size={16} />
                Download File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Attachment item component
const AttachmentItem = ({ url, index }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  
  // Extract filename from URL
  const getFileName = (url) => {
    try {
      const urlPath = new URL(url).pathname;
      const fileName = urlPath.split('/').pop();
      return fileName || `attachment-${index + 1}`;
    } catch {
      return `attachment-${index + 1}`;
    }
  };
  
  const fileName = getFileName(url);
  const fileExtension = fileName.split('.').pop()?.toLowerCase();
  
  // Get file type icon and info
  const getFileInfo = (extension) => {
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const documentTypes = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
    
    if (imageTypes.includes(extension)) {
      return { icon: Image, type: 'Image', color: 'text-green-600' };
    } else if (documentTypes.includes(extension)) {
      return { icon: FileText, type: 'Document', color: 'text-blue-600' };
    } else {
      return { icon: File, type: 'File', color: 'text-gray-600' };
    }
  };
  
  const fileInfo = getFileInfo(fileExtension);
  const IconComponent = fileInfo.icon;
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const canPreview = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf'].includes(fileExtension);
  
  return (
    <>
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <IconComponent size={20} className={fileInfo.color} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
            <p className="text-xs text-gray-500">{fileInfo.type}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          {canPreview && (
            <button
              onClick={() => setPreviewOpen(true)}
              className="flex items-center gap-1 bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-300 transition-colors"
              title="Preview file"
            >
              <Eye size={14} />
              Preview
            </button>
          )}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
            title="Download file"
          >
            <Download size={14} />
            Download
          </button>
        </div>
      </div>
      
      {previewOpen && (
        <FilePreview 
          url={url}
          fileName={fileName}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  );
};

const TaskDetailModal = ({ task, onClose, onUpdateClick, onDelete }) => {
  const [showChecklist, setShowChecklist] = useState(true);
  const [showAttachments, setShowAttachments] = useState(true);
  console.log(task);

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

  // Helper to get assignees display
  const getAssigneesDisplay = () => {
    if (!task.assignedTo) return "Unassigned";
    
    // Handle array of assignees
    if (Array.isArray(task.assignedTo)) {
      if (task.assignedTo.length === 0) return "Unassigned";
      if (task.assignedTo.length === 1) {
        const assignee = task.assignedTo[0];
        return assignee.name || assignee.email || "Unknown";
      }
      return `${task.assignedTo.length} assignees`;
    }
    
    // Handle single assignee (backward compatibility)
    if (typeof task.assignedTo === 'object') {
      return task.assignedTo.name || task.assignedTo.email || "Unassigned";
    }
    
    return "Unassigned";
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{backgroundColor: 'rgba(0, 0, 0, 0.6)'}}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-black p-4">
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
            
            {/* Assigned To - Handle both single and multiple assignees */}
            {Array.isArray(task.assignedTo) && task.assignedTo.length > 0 ? (
              <div className="flex flex-col gap-2 md:col-span-2">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-500" />
                  <span>Assigned to: {task.assignedTo.length} {task.assignedTo.length === 1 ? 'person' : 'people'}</span>
                </div>
                <div className="ml-6 space-y-1">
                  {task.assignedTo.map((assignee, index) => (
                    <div key={index} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded w-fit">
                      {assignee.name || assignee.email}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-500" />
                <span>Assigned to: {getAssigneesDisplay()}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-500" />
              <span>Assigned by: {task.assignedBy?.name || "Unknown"}</span>
            </div>
            
            {task.teamId && (
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-500" />
                <Link to={`/teamdashboard/${task?.teamId?._id}`}>Team: {task?.teamId?.name || "No team"}</Link>
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
              <div className="p-3 space-y-3">
                {task.attachments?.length > 0 ? (
                  task.attachments.map((attachment, index) => (
                    <AttachmentItem
                      key={index}
                      url={attachment}
                      index={index}
                    />
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