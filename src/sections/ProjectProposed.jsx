import React, { useState } from 'react';
import ProjectModal from './ProjectModal';
import GalleryModal from './GalleryModal';
import ProjectList from './ProjectList';

export default function ProjectProposed() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);

  const handleAddProject = (project) => {
    setProjects([...projects, { ...project, id: Date.now() }]);
  };

  const handleUpdateProject = (updated) => {
    setProjects(projects.map(p => p.id === updated.id ? updated : p));
    setEditingProject(null);
  };

  const handleDeleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Proposed Projects</h1>

      {editingProject ? (
        <ProjectModal
          initialData={editingProject}
          onSave={handleUpdateProject}
          onClose={() => setEditingProject(null)}
        />
      ) : (
        <ProjectModal
          onSave={handleAddProject}
          onClose={() => setEditingProject(null)}
        />
      )}

      {viewingProject && (
        <GalleryModal
          project={viewingProject}
          onClose={() => setViewingProject(null)}
        />
      )}

      <ProjectList
        projects={projects}
        onEdit={setEditingProject}
        onDelete={handleDeleteProject}
        onView={setViewingProject}
      />
    </div>
  );
}