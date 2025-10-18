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
    assignedTo: "",
    priority: "high",
    deadline: "",
    status: "Todo",
    checklist: [""],
    files: [], // Changed to store actual File objects
  });

  const [teams, setTeams] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageMarker, setShowImageMarker] = useState(false);
  const [currentImageFile, setCurrentImageFile] = useState(null);
  const [imageIndex, setImageIndex] = useState(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));

    // reset assignee if team changes
    if (name === "teamId") {
      setTaskData((prev) => ({ ...prev, assignedTo: "" }));
    }
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
      // Allow multiple files
      setTaskData((prev) => ({ 
        ...prev, 
        files: [...prev.files, ...selectedFiles] 
      }));
    }
  };

  const removeFile = (index) => {
    setTaskData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const openImageMarker = (file, index) => {
    setCurrentImageFile(file);
    setImageIndex(index);
    setShowImageMarker(true);
  };

  const handleImageMarkerSave = (markedImageFile, formattedChecklist) => {
    // Replace the original image file with the marked version
    setTaskData((prev) => {
      const newFiles = [...prev.files];
      newFiles[imageIndex] = markedImageFile;
      return {
        ...prev,
        files: newFiles,
        checklist: formattedChecklist // Replace checklist with image markers
      };
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
        startTime: new Date().toISOString(), // Add current time
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

  // get members of selected team
  const selectedTeam = teams.find((t) => t._id === taskData.teamId);

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      >
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl transition-all duration-300 border border-gray-200">
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              Create New Task
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-black" disabled={isSubmitting}>
              <X size={22} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title
              </label>
              <textarea
                name="title"
                value={taskData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Create login and registration system with JWT tokens"
                rows={1}
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
              
              {/* File Input */}
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

              {/* Selected Files Display */}
              {taskData.files.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                  {taskData.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
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

            {/* Checklist - Only show if no images with markers */}
            {!taskData.files.some(file => isImageFile(file)) && (
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
                        onChange={(e) =>
                          handleChecklistChange(index, e.target.value)
                        }
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

            {/* Show image-generated checklist preview */}
            {taskData.checklist.some(item => item.includes('-')) && taskData.files.some(file => isImageFile(file)) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Checklist
                </label>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <p className="text-sm text-blue-800 mb-2">Generated from image markers:</p>
                  <ul className="space-y-1">
                    {taskData.checklist.filter(item => item.trim() !== '').map((item, index) => (
                      <li key={index} className="text-sm text-blue-700">
                        {item}
                      </li>
                    ))}
                  </ul>
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

              {/* Assignee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignee
                </label>
                <select
                  name="assignedTo"
                  value={taskData.assignedTo}
                  onChange={handleChange}
                  disabled={!taskData.teamId || isSubmitting}
                  className="w-full border border-gray-300 rounded-xl p-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
                  required
                >
                  <option value="">Select Assignee</option>
                  {selectedTeam?.members?.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name}
                    </option>
                  ))}
                </select>
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
                  min={new Date().toISOString().split('T')[0]} // Prevent past dates
                />
              </div>

              {/* Status */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex space-x-4">
                  {["Todo", "started", "inProgress", "completed"].map((status) => (
                    <label
                      key={status}
                      className="flex items-center text-sm text-gray-700"
                    >
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
                disabled={isSubmitting}
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

      {/* Image Marker Modal */}
      {showImageMarker && currentImageFile && (
        <ImageMarker
          imageFile={currentImageFile}
          existingChecklist={taskData.checklist}
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