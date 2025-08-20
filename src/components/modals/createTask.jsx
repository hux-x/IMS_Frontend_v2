// File: src/components/CreateTask.jsx
import React, { useEffect, useState } from 'react';
import { X, Check, Plus, Paperclip } from 'lucide-react';
import taskService from '@/apis/services/taskService';

const CreateTask = ({ onClose, onCreate,isOpen }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'High',
    deadline: '',
    status: 'Todo',
    checklist: [''],
    files: []
  });


  const [fileInput, setFileInput] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
  };

  const handleChecklistChange = (index, value) => {
    const newChecklist = [...taskData.checklist];
    newChecklist[index] = value;
    setTaskData(prev => ({ ...prev, checklist: newChecklist }));
  };

  const addChecklistItem = () => {
    setTaskData(prev => ({ ...prev, checklist: [...prev.checklist, ''] }));
  };

  const removeChecklistItem = (index) => {
    const newChecklist = taskData.checklist.filter((_, i) => i !== index);
    setTaskData(prev => ({ ...prev, checklist: newChecklist }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileInput(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalTask = {
      ...taskData,
      files: fileInput ? [fileInput.name] : [],
      progress: taskData.status === 'Completed' ? 100 : 0,
      items: taskData.checklist.filter(item => item.trim() !== '').length
    };
    onCreate(finalTask);
    onClose();
  };


  useEffect(()=>{
    taskService.getAssignees();
  })

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50"style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl transition-all duration-300 border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Create New Task</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Task Description</label>
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Create login and registration system with JWT tokens"
              rows={3}
              required
            />
          </div>

          {/* Checklist */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Checklist</label>
            <div className="space-y-2">
              {taskData.checklist.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleChecklistChange(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-xl p-2 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="Add checklist item"
                  />
                  <button
                    type="button"
                    onClick={() => removeChecklistItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addChecklistItem}
                className="text-sm text-black hover:underline flex items-center mt-1"
              >
                <Plus size={16} className="mr-1" />
                Add new checklist item
              </button>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attachment</label>
            <div className="border border-gray-300 rounded-xl p-3 bg-gray-50 flex justify-between items-center">
              {fileInput ? (
                <>
                  <span className="text-sm text-gray-700">{fileInput.name}</span>
                  <button
                    type="button"
                    onClick={() => setFileInput(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <label className="flex items-center cursor-pointer text-sm text-gray-600">
                  <Paperclip size={16} className="mr-2" />
                  Choose File
                  <input type="file" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Task Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
              <input
                type="text"
                name="assignee"
                value={taskData.assignee}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g. Alice Johnson"
                required
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={taskData.deadline}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex space-x-4">
                {['Todo', 'In Progress', 'Completed'].map((status) => (
                  <label key={status} className="flex items-center text-sm text-gray-700">
                    <input
                      type="radio"
                      name="status"
                      checked={taskData.status === status}
                      onChange={() => setTaskData(prev => ({ ...prev, status }))}
                      className="mr-2 accent-black"
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
              className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-xl hover:opacity-90 flex items-center"
            >
              <Check size={16} className="mr-2" />
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
