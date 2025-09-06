import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useProject from '@/hooks/useProject';
import ProjectList from '@/components/cards/ProjectList';
import ProjectForm from '@/components/cards/PorjectForm';
import ProjectModal from '@/components/modals/ProjectModal';
import PropTypes from 'prop-types';

const ProjectProposed = React.memo(() => {
  const { projects, loading, error, getAllProjects, createProject, clearError } = useProject();
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all projects on mount
  useEffect(() => {
    getAllProjects();
  }, [getAllProjects]);

  // Handle adding a new project
  const handleAddProject = useCallback(
    async (projectData) => {
      // Validate required fields
      if (!projectData.projectTitle || !projectData.clientName || !projectData.clientEmail) {
        toast.error('Please fill in all required fields: Project Title, Client Name, Client Email', {
          position: 'top-right',
          autoClose: 3000,
        });
        return;
      }

      try {
        setIsSubmitting(true);
        const newProject = await createProject(projectData);
        toast.success('Project created successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
        setEditingProject(null);
        return newProject;
      } catch (err) {
        toast.error(err.message || 'Failed to create project', {
          position: 'top-right',
          autoClose: 3000,
        });
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [createProject]
  );

  // Handle updating an existing project (placeholder)
  const handleUpdateProject = useCallback((updatedData) => {
    console.log('Update project:', updatedData);
    setEditingProject(null);
  }, []);

  // Handle deleting a project (placeholder)
  const handleDeleteProject = useCallback((projectId) => {
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
          <div className="text-center py-4 text-gray-600">
            <p className="text-lg font-medium">Loading projects...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-4 text-red-600">
            <p className="text-lg font-medium">Error: {error}</p>
            <button
              onClick={clearError}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transition-all hover:shadow-xl">
          {editingProject ? (
            <ProjectForm
              initialData={editingProject}
              onSubmit={handleUpdateProject}
              onCancel={() => setEditingProject(null)}
              isSubmitting={isSubmitting}
            />
          ) : (
            <ProjectForm
              onSubmit={handleAddProject}
              onCancel={() => setEditingProject(null)}
              isSubmitting={isSubmitting}
            />
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

ProjectProposed.propTypes = {};

export default ProjectProposed;