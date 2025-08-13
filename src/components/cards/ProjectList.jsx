import React from "react";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function ProjectList({ projects, onEdit, onDelete }) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No projects found. Create one to get started!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <div key={project.id} className="bg-white rounded-lg shadow overflow-hidden">
          {/* Image Slider */}
          {project.images.length > 0 && (
            <div className="h-48">
              <Carousel showThumbs={false} showStatus={false} showIndicators={false}>
                {project.images.map((img, i) => (
                  <div key={i} className="h-48">
                    <img src={URL.createObjectURL(img)} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </Carousel>
            </div>
          )}

          {/* Project Info */}
          <div className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg">{project.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                project.priority === 'High' ? 'bg-red-100 text-red-800' :
                project.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {project.priority}
              </span>
            </div>

            <p className="text-gray-600 mt-1 line-clamp-2">{project.description}</p>

            {project.clientName && (
              <p className="text-sm text-gray-500 mt-2">
                <span className="font-medium">Client:</span> {project.clientName}
              </p>
            )}

            <div className="flex justify-between items-center mt-4">
              <span className={`px-2 py-1 text-xs rounded ${
                project.status === 'Proposed' ? 'bg-blue-100 text-blue-800' :
                project.status === 'Mature' ? 'bg-purple-100 text-purple-800' :
                project.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {project.status}
              </span>

              <div className="flex space-x-2">
                <button onClick={() => onEdit(project)} className="text-blue-600">
                  Edit
                </button>
                <button onClick={() => onDelete(project.id)} className="text-red-600">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}