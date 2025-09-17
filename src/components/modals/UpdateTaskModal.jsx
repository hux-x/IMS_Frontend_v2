import React, { useState } from "react";
import { 
  X, 
  Save,
  ChevronDown, 
  ChevronUp,
  Trash2
} from "lucide-react";

const statusOptions = [
  { value: "started", label: "Not Started" },
  { value: "inProgress", label: "In Progress" },
  { value: "completed", label: "Completed" }
];

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" }
];

const UpdateTaskModal = ({ task, onClose, onSave }) => {
  const [editedTask, setEditedTask] = useState({ 
    ...task,
    todoChecklist: task.todoChecklist || [],
    attachments: task.attachments || []
  });
  const [showChecklist, setShowChecklist] = useState(true);
  const [showAttachments, setShowAttachments] = useState(true);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [newAttachment, setNewAttachment] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({ ...prev, [name]: value }));
  };

  const handleChecklistChange = (index, checked) => {
    const updatedChecklist = [...editedTask.todoChecklist];
    updatedChecklist[index].completed = checked;
    setEditedTask(prev => ({ ...prev, todoChecklist: updatedChecklist }));
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const newItem = {
        text: newChecklistItem,
        completed: false
      };
      setEditedTask(prev => ({
        ...prev,
        todoChecklist: [...prev.todoChecklist, newItem]
      }));
      setNewChecklistItem("");
    }
  };

  const removeChecklistItem = (index) => {
    const updatedChecklist = [...editedTask.todoChecklist];
    updatedChecklist.splice(index, 1);
    setEditedTask(prev => ({ ...prev, todoChecklist: updatedChecklist }));
  };

  const addAttachment = () => {
    if (newAttachment.trim()) {
      setEditedTask(prev => ({
        ...prev,
        attachments: [...prev.attachments, newAttachment]
      }));
      setNewAttachment("");
    }
  };

  const removeAttachment = (index) => {
    const updatedAttachments = [...editedTask.attachments];
    updatedAttachments.splice(index, 1);
    setEditedTask(prev => ({ ...prev, attachments: updatedAttachments }));
  };

  const handleAssignedToChange = (e) => {
    const newName = e.target.value;
    setEditedTask(prev => ({
      ...prev,
      assignedTo: prev.assignedTo ? {
        ...prev.assignedTo,
        name: newName
      } : {
        name: newName
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare the task data for saving
    const taskToSave = {
      ...editedTask,
      // Convert deadline string back to Date object if needed
      deadline: editedTask.deadline ? new Date(editedTask.deadline) : null
    };
    console.log("Saving task:", taskToSave);
    onSave(taskToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50"style={{backgroundColor: 'rgba(0, 0, 0, 0.6)'}}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-black p-4" >
        <form onSubmit={handleSubmit}>
          {/* Modal Header */}
          <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white z-10">
            <h3 className="text-lg font-semibold">Update Task</h3>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-1 bg-black text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600 transition-colors"

              >
                <Save size={16} />
                Save Changes
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-4 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={editedTask.title}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={editedTask.description}
                onChange={handleChange}
                className="w-full border rounded p-2 min-h-[100px]"
              />
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={editedTask.status}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  name="priority"
                  value={editedTask.priority}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={editedTask.deadline ? new Date(editedTask.deadline).toISOString().split('T')[0] : ""}
                onChange={handleChange}
                className="border rounded p-2"
              />
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
              <input
                type="text"
                name="assignedTo"
                value={editedTask.assignedTo?.name || ""}
                onChange={handleAssignedToChange}
                className="w-full border rounded p-2"
                placeholder="Assignee name"
              />
            </div>

            {/* Checklist */}
            <div className="border rounded-lg overflow-hidden">
              <button 
                type="button"
                className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100"
                onClick={() => setShowChecklist(!showChecklist)}
              >
                <div className="flex items-center gap-2">
                  <span>Checklist ({editedTask.todoChecklist?.length || 0})</span>
                </div>
                {showChecklist ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {showChecklist && (
                <div className="p-3 space-y-2">
                  {editedTask.todoChecklist?.length > 0 ? (
                    editedTask.todoChecklist.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2 flex-grow">
                          <input 
                            type="checkbox" 
                            checked={item.completed} 
                            onChange={(e) => handleChecklistChange(index, e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e) => {
                              const updatedChecklist = [...editedTask.todoChecklist];
                              updatedChecklist[index].text = e.target.value;
                              setEditedTask(prev => ({ ...prev, todoChecklist: updatedChecklist }));
                            }}
                            className="border-b border-gray-300 focus:border-blue-500 outline-none w-full"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeChecklistItem(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No checklist items</p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <input
                      type="text"
                      value={newChecklistItem}
                      onChange={(e) => setNewChecklistItem(e.target.value)}
                      placeholder="New checklist item"
                      className="border rounded p-2 flex-grow"
                      onKeyPress={(e) => e.key === 'Enter' && addChecklistItem()}
                    />
                    <button
                      type="button"
                      onClick={addChecklistItem}
                      className="bg-black text-white px-3 py-1 rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Attachments */}
            <div className="border rounded-lg overflow-hidden">
              <button 
                type="button"
                className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100"
                onClick={() => setShowAttachments(!showAttachments)}
              >
                <div className="flex items-center gap-2">
                  <span>Attachments ({editedTask.attachments?.length || 0})</span>
                </div>
                {showAttachments ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              {showAttachments && (
                <div className="p-3 space-y-2">
                  {editedTask.attachments?.length > 0 ? (
                    editedTask.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2 flex-grow">
                          <input
                            type="text"
                            value={attachment}
                            onChange={(e) => {
                              const updatedAttachments = [...editedTask.attachments];
                              updatedAttachments[index] = e.target.value;
                              setEditedTask(prev => ({ ...prev, attachments: updatedAttachments }));
                            }}
                            className="border-b border-gray-300 focus:border-blue-500 outline-none w-full"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No attachments</p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <input
                      type="text"
                      value={newAttachment}
                      onChange={(e) => setNewAttachment(e.target.value)}
                      placeholder="New attachment URL"
                      className="border rounded p-2 flex-grow"
                      onKeyPress={(e) => e.key === 'Enter' && addAttachment()}
                    />
                    <button
                      type="button"
                      onClick={addAttachment}
                      className="bg-black text-white px-3 py-1 rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTaskModal;