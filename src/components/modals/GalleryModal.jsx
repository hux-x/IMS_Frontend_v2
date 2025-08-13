import React from "react";

export default function GalleryModal({ project, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{project.title}</h2>
          <button onClick={onClose} className="text-red-500 font-bold text-lg">X</button>
        </div>

        <p className="mb-2"><strong>Client:</strong> {project.clientName} ({project.clientContact})</p>
        <p className="mb-2"><strong>Type:</strong> {project.projectType}</p>
        <p className="mb-2"><strong>Status:</strong> {project.status}</p>
        <p className="mb-4">{project.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {project.images.map((img, i) => (
            <img key={i} src={URL.createObjectURL(img)} alt="" className="w-full h-48 object-cover rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
