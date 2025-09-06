import React, { useState, useCallback } from 'react';
import ProjectList from '@/components/cards/ProjectList';
import ProjectForm from '@/components/cards/PorjectForm'; // Fixed typo in import (PorjectForm -> ProjectForm)
import ProjectModal from '@/components/modals/ProjectModal';
import PropTypes from 'prop-types';

const ProjectProposed = React.memo(({ projects: initialProjects = [], onProjectChange }) => {
  const [projects, setProjects] = useState(initialProjects);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);

  // Handle adding a new project
  const handleAddProject = useCallback((projectData) => {
    const newProject = {
      ...projectData,
      _id: `project-${Date.now()}-${Math.random().toString(36).slice(2)}`, // Temporary ID for client-side
      createdAt: new Date().toISOString(),
    };
    setProjects((prev) => [...prev, newProject]);
    if (onProjectChange) {
      onProjectChange([...projects, newProject]);
    }
  }, [onProjectChange, projects]);

  // Handle updating an existing project
  const handleUpdateProject = useCallback((updatedData) => {
    setProjects((prev) =>
      prev.map((project) =>
        project._id === editingProject._id ? { ...project, ...updatedData } : project
      )
    );
    if (onProjectChange) {
      onProjectChange(
        projects.map((project) =>
          project._id === editingProject._id ? { ...project, ...updatedData } : project
        )
      );
    }
    setEditingProject(null);
  }, [editingProject, onProjectChange, projects]);

  // Handle deleting a project
  const handleDeleteProject = useCallback((projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects((prev) => prev.filter((project) => project._id !== projectId));
      if (onProjectChange) {
        onProjectChange(projects.filter((project) => project._id !== projectId));
      }
    }
  }, [onProjectChange, projects]);

  // Handle editing a project
  const handleEditProject = useCallback((project) => {
    setEditingProject(project);
  }, []);

  // Handle viewing a project
  const handleViewProject = useCallback((project) => {
    setViewingProject(project);
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Proposed Projects
        </h1>

        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transition-all hover:shadow-xl">
          {editingProject ? (
            <ProjectForm
              initialData={editingProject}
              onSubmit={handleUpdateProject}
              onCancel={() => setEditingProject(null)}
            />
          ) : (
            <ProjectForm onSubmit={handleAddProject} />
          )}
        </div>

        <ProjectList
          projects={projects}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
          onView={handleViewProject}
        />

        {viewingProject && (
          <ProjectModal
            project={viewingProject}
            onClose={() => setViewingProject(null)}
          />
        )}
      </div>
    </div>
  );
});

ProjectProposed.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      projectTitle: PropTypes.string.isRequired,
      description: PropTypes.string,
      status: PropTypes.string,
      priority: PropTypes.string,
      clientName: PropTypes.string,
      clientEmail: PropTypes.string,
      clientPhone: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      projectImages: PropTypes.arrayOf(PropTypes.string),
      attachments: PropTypes.arrayOf(PropTypes.any),
      designChecklist: PropTypes.arrayOf(
        PropTypes.shape({
          task: PropTypes.string,
          isCompleted: PropTypes.bool,
        })
      ),
    })
  ),
  onProjectChange: PropTypes.func,
};

export default ProjectProposed;