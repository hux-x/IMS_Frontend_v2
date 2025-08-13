import React from "react";

export default function ProjectList({ projects, onEdit, onDelete }) {
  if (projects.length === 0) {
    return <p className="text-gray-500 mt-6">No proposed projects yet.</p>;
  }

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map(project => (
        <div key={project.id} className="bg-white shadow p-4 rounded-lg">
          <h2 className="font-bold text-lg">{project.title}</h2>
          <p className="text-sm text-gray-600">{project.description}</p>
          <p className="text-xs text-gray-500 mt-2">Status: {project.status}</p>
          <div className="flex gap-2 mt-3">
            {project.images.map((img, idx) => (
              <img key={idx} src={URL.createObjectURL(img)} alt="" className="w-16 h-16 object-cover rounded" />
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onEdit(project)}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
