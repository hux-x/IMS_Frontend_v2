import React, { useState } from "react";
import ImageUploader from "./ImageUploader";
import FileUploader from "./FileUploader";
import ChecklistManager from "./ChecklistManager";

export default function ProjectForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    clientName: initialData?.clientName || "",
    clientEmail: initialData?.clientEmail || "",
    clientPhone: initialData?.clientPhone || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    status: initialData?.status || "Proposed",
    priority: initialData?.priority || "Medium",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    images: initialData?.images || [],
    files: initialData?.files || [],
    checklist: initialData?.checklist || []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold">{initialData ? "Edit Project" : "New Project"}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Info */}
        <div className="space-y-2">
          <label className="block font-medium">Project Title*</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Client Info */}
        <div className="space-y-2">
          <label className="block font-medium">Client Name</label>
          <input
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Client Email</label>
          <input
            type="email"
            name="clientEmail"
            value={formData.clientEmail}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Client Phone</label>
          <input
            type="tel"
            name="clientPhone"
            value={formData.clientPhone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Status & Priority */}
        <div className="space-y-2">
          <label className="block font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Proposed">Proposed</option>
            <option value="Mature">Mature</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Dates */}
        <div className="space-y-2">
          <label className="block font-medium">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Components */}
      <ImageUploader images={formData.images} onChange={(imgs) => setFormData({...formData, images: imgs})} />
      <FileUploader files={formData.files} onChange={(files) => setFormData({...formData, files})} />
      <ChecklistManager checklist={formData.checklist} onChange={(checklist) => setFormData({...formData, checklist})} />

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {initialData ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}