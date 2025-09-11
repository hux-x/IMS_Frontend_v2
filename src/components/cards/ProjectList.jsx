import React, { memo, useEffect, useState } from "react";

// Utility to get badge styles based on status/priority
export const getBadgeStyles = (type, value) => {
  const styles = {
    status: {
      Proposed: "text-gray-600 ring-gray-300",
      Mature: "text-red-600 ring-red-300",
      "In-Progress": "text-blue-600 ring-blue-300",
      Completed: "text-green-600 ring-green-300",
      Cancelled: "text-gray-600 ring-gray-300",
    },
    priority: {
      High: "text-red-600 ring-red-300",
      Medium: "text-blue-600 ring-blue-300",
      Low: "text-gray-600 ring-gray-300",
    },
  };
  return styles[type][value] || "text-gray-600 ring-gray-300";
};

// Individual project card component
const ProjectCard = memo(({ project, onEdit, onDelete, onView }) => {
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    let url = null;
    if (project.projectImages?.[0]) {
      if (project.projectImages[0] instanceof File) {
        url = URL.createObjectURL(project.projectImages[0]);
        setImageSrc(url);
      } else {
        const imagePath = project.projectImages[0].startsWith("/uploads")
          ? `http://localhost:5000${project.projectImages[0]}`
          : project.projectImages[0];
        setImageSrc(imagePath);
      }
    } else {
      // fallback placeholder if no image
      setImageSrc("https://placehold.co/400x200?text=No+Image");
    }
    return () => {
      if (url && url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    };
  }, [project.projectImages]);

  return (
    <div
      className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200"
      onClick={() => onView(project)}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageSrc}
          alt={project.projectTitle}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "https://placehold.co/400x200?text=No+Image";
          }}
          loading="lazy"
        />

        {/* Overlay Info (slides up on hover) */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 space-y-1">
          <h3 className="text-lg font-bold text-white line-clamp-1">
            {project.projectTitle}
          </h3>
          <p className="text-sm text-gray-200">
            Client: {project.clientName || "Unknown"}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded-full ring-1 ring-inset ${getBadgeStyles(
                "priority",
                project.priority
              )} bg-white/20 backdrop-blur-sm`}
            >
              {project.priority}
            </span>
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded-full ring-1 ring-inset ${getBadgeStyles(
                "status",
                project.status
              )} bg-white/20 backdrop-blur-sm`}
            >
              {project.status}
            </span>
          </div>
        </div>

        {/* Extra images indicator */}
        {project.projectImages?.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-gray-800 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">
            +{project.projectImages.length - 1} more
          </span>
        )}
      </div>

      {/* Content Section (always visible) */}
      <div className="p-4 space-y-3">
        <p className="text-gray-600 text-sm line-clamp-2">
          {project.description}
        </p>

        {/* Display number of images and attachments */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {project.projectImages?.length || 0} Images
          </span>
          <span className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
            {project.attachments?.length || 0} Attachments
          </span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              className="text-black hover:text-gray-800 text-sm font-medium transition-colors duration-200"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project._id);
              }}
              className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors duration-200"
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
      <div className="text-center py-12 text-gray-600 bg-white rounded-lg shadow-md border border-gray-200">
        <p className="text-xl font-medium">No projects found.</p>
        <p className="text-sm mt-1">Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
