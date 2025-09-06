import React, { useState, useCallback } from 'react';
import ImageUploader from './ImageUploader';
import FileUploader from './FileUploader';
import ChecklistManager from './ChecklistManager';

export default function ProjectForm({ onSubmit, onCancel, initialData = {} }) {
  const [formData, setFormData] = useState({
    projectTitle: initialData.projectTitle || '',
    clientName: initialData.clientName || '',
    clientEmail: initialData.clientEmail || '',
    clientPhone: initialData.clientPhone || '',
    description: initialData.description || '',
    status: initialData.status || 'Proposed',
    priority: initialData.priority || 'Medium',
    startDate: initialData.startDate || '',
    endDate: initialData.endDate || '',
    projectImages: initialData.projectImages || [],
    attachments: initialData.attachments || [],
    designChecklist: initialData.designChecklist || [],
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSubmit(formData);
    },
    [formData, onSubmit]
  );

  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
    >
      <h2 className="text-2xl font-semibold text-gray-900">
        {initialData.projectTitle ? 'Edit Project' : 'New Project'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Project Title <span className="text-red-500">*</span>
          </label>
          <input
            name="projectTitle"
            value={formData.projectTitle}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Enter project title"
          />
        </div>

        {/* Client Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Client Name</label>
          <input
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Enter client name"
          />
        </div>

        {/* Client Email */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Client Email</label>
          <input
            type="email"
            name="clientEmail"
            value={formData.clientEmail}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Enter client email"
          />
        </div>

        {/* Client Phone */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Client Phone</label>
          <input
            type="tel"
            name="clientPhone"
            value={formData.clientPhone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Enter client phone"
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="Proposed">Proposed</option>
            <option value="mature">Mature</option>
            <option value="In-Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          placeholder="Enter project description"
        />
      </div>

      {/* Upload Components */}
      <div className="space-y-6">
        <ImageUploader
          images={formData.projectImages}
          onChange={(images) => updateField('projectImages', images)}
        />
        <FileUploader
          files={formData.attachments}
          onChange={(attachments) => updateField('attachments', attachments)}
        />
        <ChecklistManager
          checklist={formData.designChecklist}
          onChange={(designChecklist) => updateField('designChecklist', designChecklist)}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
        >
          {initialData.projectTitle ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}