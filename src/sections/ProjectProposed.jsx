import React, { useEffect, useState, useCallback } from 'react';
import useProject from '@/hooks/useProject';
import ProjectList from '@/components/cards/ProjectList';
import ProjectForm from '@/components/cards/PorjectForm';
import ProjectModal from '@/components/modals/ProjectModal';
import PropTypes from 'prop-types';

const ProjectProposed = React.memo(() => {
  const { projects, loading, error, getAllProjects } = useProject();
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);

  // Fetch all projects on mount
  useEffect(() => {
    getAllProjects();
  }, [getAllProjects]);

  // Handle adding a new project (placeholder for next API integration)
  const handleAddProject = useCallback((projectData) => {
    // To be implemented with createProject API
    console.log('Add project:', projectData);
  }, []);

  // Handle updating an existing project (placeholder for next API integration)
  const handleUpdateProject = useCallback((updatedData) => {
    // To be implemented with updateProject API
    console.log('Update project:', updatedData);
    setEditingProject(null);
  }, []);

  // Handle deleting a project (placeholder for next API integration)
  const handleDeleteProject = useCallback((projectId) => {
    // To be implemented with deleteProject API
    if (window.confirm('Are you sure you want to delete this project?')) {
      console.log('Delete project:', projectId);
    }
  }, []);

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

        {loading && (
          <div className="text-center py-12 text-gray-600">
            <p className="text-lg font-medium">Loading projects...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-red-600">
            <p className="text-lg font-medium">Error: {error}</p>
          </div>
        )}

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

        {!loading && !error && (
          <ProjectList
            projects={projects}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            onView={handleViewProject}
          />
        )}

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
  // Removed initialProjects and onProjectChange as they're not needed with API
};

export default ProjectProposed;