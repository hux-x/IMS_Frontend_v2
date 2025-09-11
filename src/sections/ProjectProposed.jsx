import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useProject from '@/hooks/useProject';
import ProjectList from '@/components/cards/ProjectList';
import ProjectModal from '@/components/modals/ProjectModal';

export default function ProjectProposed() {
  const {
    projects,
    selectedProject,
    loading,
    error,
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProjectFiles,
    addChecklistTask,
    toggleChecklistTask,
    deleteChecklistTask,
    deleteProject,
    clearError,
  } = useProject();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view' | 'edit' | 'create'

  useEffect(() => {
    getAllProjects();
  }, [getAllProjects]);

  const handleOpenCreateModal = useCallback(() => {
    setModalMode('create');
    setIsModalOpen(true);
  }, []);

  const handleCreateProject = useCallback(
    async (projectData) => {
      if (!projectData.projectTitle || !projectData.clientName || !projectData.clientEmail) {
        toast.error('Please fill in all required fields: Project Title, Client Name, Client Email', {
          position: 'top-right',
          autoClose: 3000,
        });
        return;
      }
      try {
        await createProject(projectData);
        toast.success('Project created successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
        await getAllProjects();
        setIsModalOpen(false);
      } catch (err) {
        toast.error(err.message || 'Failed to create project', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    },
    [createProject, getAllProjects]
  );

  const handleViewProject = useCallback(
    async (project) => {
      try {
        await getProjectById(project._id);
        setModalMode('view');
        setIsModalOpen(true);
      } catch {
        toast.error('Failed to fetch project details');
      }
    },
    [getProjectById]
  );

  const handleEditProject = useCallback(
    async (project) => {
      try {
        await getProjectById(project._id);
        setModalMode('edit');
        setIsModalOpen(true);
      } catch {
        toast.error('Failed to fetch project for editing');
      }
    },
    [getProjectById]
  );

  const handleDeleteProject = useCallback(
    async (projectId) => {
      if (!window.confirm('Are you sure you want to delete this project?')) return;
      try {
        await deleteProject(projectId);
        toast.success('Project deleted successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
        await getAllProjects();
      } catch (err) {
        toast.error(err.message || 'Failed to delete project', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    },
    [deleteProject, getAllProjects]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSwitchMode = useCallback((newMode) => {
    setModalMode(newMode);
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-black">Proposed Projects</h1>
          <button
            onClick={handleOpenCreateModal}
            className="px-6 py-3 bg-black text-white rounded-full shadow-md hover:bg-gray-800 transition-all duration-300"
          >
            + Add New Project
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-8 text-gray-600">
            <p className="text-xl font-medium">Loading projects...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-8">
            <p className="text-xl font-medium text-red-600">Error: {error}</p>
            <button
              onClick={clearError}
              className="mt-3 text-sm text-black underline hover:text-gray-700"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Project List */}
        {!loading && !error && (
          <ProjectList
            projects={projects}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            onView={handleViewProject}
          />
        )}

        {/* Modal */}
        {isModalOpen && (
          <ProjectModal
            project={modalMode === 'create' ? {} : selectedProject}
            mode={modalMode}
            onClose={handleCloseModal}
            onSwitchMode={handleSwitchMode}
            onCreate={handleCreateProject}
            onUpdate={updateProject}
            onDelete={handleDeleteProject}
            addChecklistTask={addChecklistTask}
            toggleChecklistTask={toggleChecklistTask}
            deleteChecklistTask={deleteChecklistTask}
            deleteProjectFiles={deleteProjectFiles}
          />
        )}
      </div>
    </div>
  );
}
