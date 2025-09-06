import React, { memo } from 'react';

// Utility to get badge styles based on status/priority
export const getBadgeStyles = (type, value) => {
  const styles = {
    status: {
      Proposed: 'bg-blue-100 text-blue-700 ring-blue-200',
      mature: 'bg-purple-100 text-purple-700 ring-purple-200',
      'In-Progress': 'bg-amber-100 text-amber-700 ring-amber-200',
      Completed: 'bg-green-100 text-green-700 ring-green-200',
      Cancelled: 'bg-red-100 text-red-700 ring-red-200',
    },
    priority: {
      High: 'bg-red-100 text-red-700 ring-red-200',
      Medium: 'bg-yellow-100 text-yellow-700 ring-yellow-200',
      Low: 'bg-green-100 text-green-700 ring-green-200',
    },
  };
  return styles[type][value] || 'bg-gray-100 text-gray-700 ring-gray-200';
};

// Individual project card component
const ProjectCard = memo(({ project, onEdit, onDelete, onView }) => {
  const imageSrc = project.projectImages?.[0]
    ? project.projectImages[0] instanceof File
      ? URL.createObjectURL(project.projectImages[0])
      : project.projectImages[0]
    : null;

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
      onClick={() => onView(project)}
    >
      {/* Image Section */}
      {project.projectImages?.length > 0 && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageSrc}
            alt={project.projectTitle}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
            }}
            loading="lazy"
          />
          {project.projectImages.length > 1 && (
            <span className="absolute bottom-3 right-3 bg-gradient-to-r from-black/70 to-black/50 text-white px-3 py-1 rounded-full text-xs font-medium">
              +{project.projectImages.length - 1} more
            </span>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {project.projectTitle}
          </h3>
          <span
            className={`px-2.5 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${getBadgeStyles(
              'priority',
              project.priority
            )}`}
          >
            {project.priority}
          </span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>

        {/* Display number of images and attachments */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {project.projectImages?.length || 0} Images
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            {project.attachments?.length || 0} Attachments
          </span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span
            className={`px-2.5 py-1 text-xs font-medium rounded ring-1 ring-inset ${getBadgeStyles(
              'status',
              project.status
            )}`}
          >
            {project.status}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project._id);
              }}
              className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// Main ProjectList component
export default function ProjectList({ projects, onEdit, onDelete, onView }) {
  if (!projects?.length) {
    return (
      <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
        <p className="text-lg font-medium">No projects found.</p>
        <p className="text-sm">Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-gradient-to-b from-gray-50 to-white rounded-lg">
      {projects.map((project) => (
        <ProjectCard
          key={project._id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
}