// File: src/components/CreateTask.jsx
import React, { useEffect, useState } from "react";
import { X, Check, Plus, Paperclip, Upload, FileText, Image as ImageIcon, Edit } from "lucide-react";
import { useParams } from "react-router-dom";
import taskService from "@/apis/services/taskService";
import ImageMarker from "./ImageMarker";

const CreateTask = ({ onClose, onCreate, isOpen }) => {
  const { teamId } = useParams();
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    teamId: teamId || "",
    assignedTo: [],
    priority: "high",
    deadline: "",
    status: "Todo",
    checklist: [""],
    files: [],
  });

  // Parallel array: originalFiles[i] holds the pristine (unmarked) source for files[i].
  // null means the file hasn't been marked yet (files[i] IS the original).
  const [originalFiles, setOriginalFiles] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageMarker, setShowImageMarker] = useState(false);
  const [currentImageFile, setCurrentImageFile] = useState(null);
  const [imageIndex, setImageIndex] = useState(null);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

  // Fetch teams + members
  useEffect(() => {
    const getAssignees = async () => {
      try {
        const res = await taskService.getAssignees();
        setTeams(res?.data?.teams || []);
      } catch (error) {
        alert("error fetching teams");
        console.log(error);
      }
    };
    getAssignees();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAssigneeDropdown && !event.target.closest('.assignee-dropdown-container')) {
        setShowAssigneeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAssigneeDropdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
    if (name === "teamId") {
      setTaskData((prev) => ({ ...prev, assignedTo: [] }));
    }
  };

  const handleAssigneeToggle = (memberId) => {
    setTaskData((prev) => {
      const isSelected = prev.assignedTo.includes(memberId);
      return {
        ...prev,
        assignedTo: isSelected
          ? prev.assignedTo.filter((id) => id !== memberId)
          : [...prev.assignedTo, memberId],
      };
    });
  };

  const removeAssignee = (memberId) => {
    setTaskData((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.filter((id) => id !== memberId),
    }));
  };

  const handleChecklistChange = (index, value) => {
    const newChecklist = [...taskData.checklist];
    newChecklist[index] = value;
    setTaskData((prev) => ({ ...prev, checklist: newChecklist }));
  };

  const addChecklistItem = () => {
    setTaskData((prev) => ({ ...prev, checklist: [...prev.checklist, ""] }));
  };

  const removeChecklistItem = (index) => {
    const newChecklist = taskData.checklist.filter((_, i) => i !== index);
    setTaskData((prev) => ({ ...prev, checklist: newChecklist }));
  };

  const isImageFile = (file) => {
    return file.type.startsWith('image/');
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setTaskData((prev) => ({
        ...prev,
        files: [...prev.files, ...selectedFiles],
      }));
      // New files have no separate original — they ARE the original
      setOriginalFiles((prev) => [...prev, ...selectedFiles.map(() => null)]);
    }
  };

  const removeFile = (index) => {
    setTaskData((prev) => {
      const prefix = `[Image ${index + 1}] `;
      const keptChecklist = prev.checklist.filter(item => !item.startsWith(prefix));
      const newFiles = prev.files.filter((_, i) => i !== index);

      const reindexedChecklist = keptChecklist.map(item => {
        const match = item.match(/^\[Image (\d+)\] (.*)$/);
        if (match) {
          const imgIdx = parseInt(match[1], 10);
          const rest = match[2];
          const newIdx = imgIdx > index + 1 ? imgIdx - 1 : imgIdx;
          return `[Image ${newIdx}] ${rest}`;
        }
        return item;
      });

      return {
        ...prev,
        files: newFiles,
        checklist: reindexedChecklist.length > 0 ? reindexedChecklist : [""],
      };
    });

    // Keep originalFiles in sync
    setOriginalFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const openImageMarker = (file, index) => {
    setCurrentImageFile(file);
    setImageIndex(index);
    setShowImageMarker(true);
  };

  const handleImageMarkerSave = (markedImageFile, formattedChecklist, originalFile) => {
    setTaskData((prev) => {
      const newFiles = [...prev.files];
      newFiles[imageIndex] = markedImageFile;

      const prefix = `[Image ${imageIndex + 1}] `;
      const kept = prev.checklist.filter(item => !item.startsWith(prefix));
      const tagged = formattedChecklist.map(item => `${prefix}${item}`);

      return {
        ...prev,
        files: newFiles,
        checklist: [...kept, ...tagged],
      };
    });

    // Store the original (unmarked) file so re-opening the marker always draws from clean source
    setOriginalFiles((prev) => {
      const updated = [...prev];
      updated[imageIndex] = originalFile;
      return updated;
    });

    setShowImageMarker(false);
    setCurrentImageFile(null);
    setImageIndex(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const finalTask = {
        ...taskData,
        todoChecklist: taskData.checklist.filter((item) => item.trim() !== ""),
        startTime: new Date().toISOString(),
      };
      await onCreate(finalTask);
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creating task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTeam = teams.find((t) => t._id === taskData.teamId);
  const selectedMembers = selectedTeam?.members?.filter((m) =>
    taskData.assignedTo.includes(m._id)
  ) || [];

  const hasImageMarkers = taskData.checklist.some(item => /^\[Image \d+\]/.test(item));

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl z-10">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-black p-2 rounded-lg hover:bg-gray-100"
                disabled={isSubmitting}
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title
              </label>
              <input
                type="text"
                name="title"
                value={taskData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter task title"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Description
              </label>
              <textarea
                name="description"
                value={taskData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Detailed description of the task requirements"
                rows={3}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments
              </label>
              <div className="border border-gray-300 rounded-xl p-3 bg-gray-50">
                <label className="flex items-center cursor-pointer text-sm text-gray-600 hover:text-black transition-colors">
                  <Upload size={16} className="mr-2" />
                  Choose Files
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isSubmitting}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
                  />
                </label>
              </div>

              {taskData.files.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                  {taskData.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex items-center space-x-3">
                        {isImageFile(file) ? (
                          <ImageIcon size={16} className="text-blue-500" />
                        ) : (
                          <FileText size={16} className="text-gray-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isImageFile(file) && (
                          <button
                            type="button"
                            onClick={() => openImageMarker(file, index)}
                            className="text-blue-500 hover:text-blue-700 p-1 rounded-lg hover:bg-blue-50"
                            title="Add markers to image"
                            disabled={isSubmitting}
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50"
                          disabled={isSubmitting}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Manual checklist — only when no image markers exist */}
            {!hasImageMarkers && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Checklist
                </label>
                <div className="space-y-2">
                  {taskData.checklist.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleChecklistChange(index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-xl p-2 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-black"
                        placeholder="Add checklist item"
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => removeChecklistItem(index)}
                        className="text-red-500 hover:text-red-700"
                        disabled={isSubmitting}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addChecklistItem}
                    className="text-sm text-black hover:underline flex items-center mt-1"
                    disabled={isSubmitting}
                  >
                    <Plus size={16} className="mr-1" />
                    Add new checklist item
                  </button>
                </div>
              </div>
            )}

            {/* Image-generated checklist preview, grouped by image */}
            {hasImageMarkers && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Checklists
                </label>
                <div className="space-y-3">
                  {(() => {
                    const groups = {};
                    taskData.checklist.forEach(item => {
                      const match = item.match(/^\[Image (\d+)\] (.*)$/);
                      if (match) {
                        const imgNum = match[1];
                        if (!groups[imgNum]) groups[imgNum] = [];
                        groups[imgNum].push(match[2]);
                      }
                    });
                    return Object.entries(groups)
                      .sort(([a], [b]) => Number(a) - Number(b))
                      .map(([imgNum, items]) => (
                        <div key={imgNum} className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                          <p className="text-sm text-blue-800 font-medium mb-2">Image {imgNum} markers:</p>
                          <ul className="space-y-1">
                            {items.map((item, i) => (
                              <li key={i} className="text-sm text-blue-700">{item}</li>
                            ))}
                          </ul>
                        </div>
                      ));
                  })()}
                </div>
              </div>
            )}

            {/* Task Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Team */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team
                </label>
                <select
                  name="teamId"
                  value={taskData.teamId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                  required
                  disabled={isSubmitting || !!teamId}
                >
                  <option value="">Select Team</option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assignees */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignees
                </label>
                <div className="relative assignee-dropdown-container">
                  <button
                    type="button"
                    onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                    disabled={!taskData.teamId || isSubmitting}
                    className="w-full border border-gray-300 rounded-xl p-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50 text-left text-sm"
                  >
                    {taskData.assignedTo.length === 0
                      ? "Select Assignees"
                      : `${taskData.assignedTo.length} selected`}
                  </button>
                  {showAssigneeDropdown && taskData.teamId && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                      {selectedTeam?.members?.map((member) => (
                        <label
                          key={member._id}
                          className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            checked={taskData.assignedTo.includes(member._id)}
                            onChange={() => handleAssigneeToggle(member._id)}
                            className="mr-2 accent-black"
                            disabled={isSubmitting}
                          />
                          <span className="text-sm text-gray-700">{member.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={taskData.priority}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                  disabled={isSubmitting}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={taskData.deadline}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                  required
                  disabled={isSubmitting}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Status */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex space-x-4">
                  {["Todo", "started", "inProgress", "completed"].map((status) => (
                    <label key={status} className="flex items-center text-sm text-gray-700">
                      <input
                        type="radio"
                        name="status"
                        checked={taskData.status === status}
                        onChange={() =>
                          setTaskData((prev) => ({ ...prev, status }))
                        }
                        className="mr-2 accent-black"
                        disabled={isSubmitting}
                      />
                      {status}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Assignees Display */}
            {selectedMembers.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                <p className="text-xs font-medium text-gray-600 mb-2">ASSIGNED TO:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedMembers.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-1.5"
                    >
                      <span className="text-sm text-gray-700">{member.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAssignee(member._id)}
                        className="text-gray-400 hover:text-red-500 ml-1"
                        disabled={isSubmitting}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-xl hover:opacity-90 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || taskData.assignedTo.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Check size={16} className="mr-2" />
                    Create Task
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Marker Modal — passes the pristine original + existing checklist + imageIndex */}
      {showImageMarker && currentImageFile && (
        <ImageMarker
          imageFile={currentImageFile}
          originalImageFile={imageIndex !== null ? originalFiles[imageIndex] : null}
          existingChecklist={taskData.checklist}
          imageIndex={imageIndex}
          onSave={handleImageMarkerSave}
          onClose={() => {
            setShowImageMarker(false);
            setCurrentImageFile(null);
            setImageIndex(null);
          }}
        />
      )}
    </>
  );
};

export default CreateTask;