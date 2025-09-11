import React, { useCallback, useState } from 'react';
import ImageUploader from '@/components/cards/ImageUploader';
import FileUploader from '@/components/cards/FileUploader';
import ChecklistManager from '@/components/managers/checklistManagers';

export default function ProjectForm({ onSubmit, onCancel, initialData = {}, isSubmitting = false }) {
  const [formData, setFormData] = useState({
    projectTitle: initialData.projectTitle || '',
    clientName: initialData.clientName || '',
    clientEmail: initialData.clientEmail || '',
    clientPhone: initialData.clientPhone || '',
    description: initialData.description || '',
    status: initialData.status || 'Proposed',
    priority: initialData.priority || 'Medium',
    startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
    endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
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
      className="space-y-6 bg-white p-6 rounded-lg shadow-lg border border-gray-200"
    >
      <h2 className="text-2xl font-semibold text-gray-800">New Project</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Project Title <span className="text-red-500">*</span>
          </label>
          <input
            name="projectTitle"
            value={formData.projectTitle}
            onChange={handleChange}
            required
            className="w-full p-4 border border-blue-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
            placeholder="Enter project title"
          />
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Client Name</label>
          <input
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            required
            className="w-full p-4 border border-blue-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
            placeholder="Enter client name"
          />
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Client Email</label>
          <input
            type="email"
            name="clientEmail"
            value={formData.clientEmail}
            onChange={handleChange}
            required
            className="w-full p-4 border border-blue-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
            placeholder="Enter client email"
          />
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Client Phone</label>
          <input
            type="tel"
            name="clientPhone"
            value={formData.clientPhone}
            onChange={handleChange}
            className="w-full p-4 border border-blue-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
            placeholder="Enter client phone"
          />
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-4 border border-blue-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
          >
            <option value="Proposed">Proposed</option>
            <option value="Mature">Mature</option>
            <option value="In-Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-4 border border-blue-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full p-4 border border-blue-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
          />
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full p-4 border border-blue-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
          />
        </div>
      </div>
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
          className="w-full p-4 border border-blue-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
          placeholder="Enter project description"
        />
      </div>
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
      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors duration-200 shadow-sm"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className={`px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200 shadow-sm ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}