import React, { useState } from "react";
import ImageUploader from "@/components/cards/ImageUploader";
import FileUploader from "@/components/cards/FileUploader";
import ChecklistManager from "@/components/cards/ChecklistManager";

export default function ProjectForm({ onSubmit, onCancel, initialData }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [status, setStatus] = useState(initialData?.status || "In Concept");
  const [startDate, setStartDate] = useState(initialData?.startDate || "");
  const [endDate, setEndDate] = useState(initialData?.endDate || "");
  const [images, setImages] = useState(initialData?.images || []);
  const [files, setFiles] = useState(initialData?.files || []);
  const [checklist, setChecklist] = useState(initialData?.checklist || []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const project = {
      id: initialData?.id,
      title,
      description,
      location,
      status,
      startDate,
      endDate,
      images,
      files,
      checklist,
      lastUpdated: new Date().toISOString()
    };
    onSubmit(project);
    setTitle(""); setDescription(""); setLocation(""); setImages([]); setFiles([]); setChecklist([]);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Project Title" className="border p-2 rounded" required />
        <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" className="border p-2 rounded" />
        <select value={status} onChange={e => setStatus(e.target.value)} className="border p-2 rounded">
          <option>In Concept</option>
          <option>Client Review</option>
          <option>In Material Selection</option>
        </select>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border p-2 rounded" />
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border p-2 rounded" />
      </div>

      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="border p-2 rounded w-full mt-3" />

      <div className="mt-4">
        <ImageUploader images={images} onChange={setImages} />
      </div>
      <div className="mt-4">
        <FileUploader files={files} onChange={setFiles} />
      </div>
      <div className="mt-4">
        <ChecklistManager checklist={checklist} onChange={setChecklist} />
      </div>

      <div className="flex gap-3 mt-4">
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          {initialData ? "Update Project" : "Add Project"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
