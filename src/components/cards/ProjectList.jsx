import React from 'react';

export default function ProjectList({ projects, onEdit, onDelete, onView }) {
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
        <div 
          key={project.id} 
          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onView(project)}
        >
          {project.images?.length > 0 && (
            <div className="h-48 relative">
              <img 
                src={URL.createObjectURL(project.images[0])} 
                alt="" 
                className="h-full w-full object-cover"
              />
              {project.images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                  +{project.images.length - 1} more
                </div>
              )}
            </div>
          )}
          
          <div className="p-5">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-gray-800">{project.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                project.priority === 'High' ? 'bg-red-100 text-red-800' :
                project.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {project.priority}
              </span>
            </div>
            
            <p className="text-gray-600 mt-1 line-clamp-2">{project.description}</p>
            
            <div className="mt-4 flex justify-between items-center">
              <span className={`px-2 py-1 text-xs rounded ${
                project.status === 'Proposed' ? 'bg-blue-100 text-blue-800' :
                project.status === 'Mature' ? 'bg-purple-100 text-purple-800' :
                project.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {project.status}
              </span>
              
              <div className="flex space-x-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(project);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(project.id);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
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