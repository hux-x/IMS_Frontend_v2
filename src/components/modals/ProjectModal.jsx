import React, { useState } from "react";

export default function ProjectModal({ onClose, onSave, initialData }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [clientName, setClientName] = useState(initialData?.clientName || "");
  const [clientContact, setClientContact] = useState(initialData?.clientContact || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [startDate, setStartDate] = useState(initialData?.startDate || "");
  const [endDate, setEndDate] = useState(initialData?.endDate || "");
  const [images, setImages] = useState(initialData?.images || []);
  const [projectType, setProjectType] = useState(initialData?.projectType || "");
  const [status, setStatus] = useState(initialData?.status || "Proposed");
  const [features, setFeatures] = useState(initialData?.features || []);

  const toggleFeature = (f) => {
    if (features.includes(f)) {
      setFeatures(features.filter(x => x !== f));
    } else {
      setFeatures([...features, f]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title, clientName, clientContact, description,
      startDate, endDate, images, projectType, status, features
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-lg font-bold mb-4">{initialData ? "Edit Project" : "New Project"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Project Info */}
          <div className="grid grid-cols-2 gap-4">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Project Title" className="border p-2 rounded" required />
            <select value={projectType} onChange={e => setProjectType(e.target.value)} className="border p-2 rounded">
              <option value="">Select Type</option>
              <option>Residential</option>
              <option>Commercial</option>
              <option>Office</option>
            </select>
          </div>

          {/* Client Info */}
          <div className="grid grid-cols-2 gap-4">
            <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Client Name" className="border p-2 rounded" />
            <input value={clientContact} onChange={e => setClientContact(e.target.value)} placeholder="Client Contact" className="border p-2 rounded" />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border p-2 rounded" />
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border p-2 rounded" />
          </div>

          {/* Description */}
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="border p-2 rounded w-full" />

          {/* Status Checkboxes */}
          <div>
            <p className="font-medium mb-1">Status</p>
            <label className="mr-4"><input type="radio" value="Proposed" checked={status === "Proposed"} onChange={e => setStatus(e.target.value)} /> Proposed</label>
            <label><input type="radio" value="Mature" checked={status === "Mature"} onChange={e => setStatus(e.target.value)} /> Mature</label>
          </div>

          {/* Feature Checkboxes */}
          <div>
            <p className="font-medium mb-1">Key Features</p>
            {["Eco-Friendly", "Luxury Finish", "Smart Home", "Minimalist", "Custom Furniture"].map(f => (
              <label key={f} className="block">
                <input type="checkbox" checked={features.includes(f)} onChange={() => toggleFeature(f)} /> {f}
              </label>
            ))}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-medium mb-1">Project Images</label>
            <input type="file" multiple onChange={(e) => setImages([...images, ...Array.from(e.target.files)])} />
            <div className="flex gap-2 mt-2 flex-wrap">
              {images.map((img, i) => (
                <img key={i} src={URL.createObjectURL(img)} alt="" className="w-20 h-20 object-cover rounded" />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
