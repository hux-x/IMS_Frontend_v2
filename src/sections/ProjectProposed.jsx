import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useProject from '@/hooks/useProject';
import ProjectList from '@/components/cards/ProjectList';
import ProjectForm from '@/components/cards/PorjectForm';
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
  const [isModalEdit, setIsModalEdit] = useState(false);

  useEffect(() => {
    getAllProjects();
  }, [getAllProjects]);

  const handleAddProject = useCallback(
    async (projectData) => {
      if (!projectData.projectTitle || !projectData.clientName || !projectData.clientEmail) {
        toast.error('Please fill in all required fields: Project Title, Client Name, Client Email', {
          position: 'top-right',
          autoClose: 3000,
        });
        return;
      }
      try {
        const newProject = await createProject(projectData);
        toast.success('Project created successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
        await getAllProjects();
        await getProjectById(newProject._id);
        setIsModalOpen(true);
        setIsModalEdit(false);
      } catch (err) {
        toast.error(err.message || 'Failed to create project', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    },
    [createProject, getAllProjects, getProjectById]
  );

  const handleViewProject = useCallback(async (project) => {
    try {
      await getProjectById(project._id);
      setIsModalOpen(true);
      setIsModalEdit(false);
    } catch (err) {
      toast.error('Failed to fetch project details');
    }
  }, [getProjectById]);

  const handleEditProject = useCallback(async (project) => {
    try {
      await getProjectById(project._id);
      setIsModalOpen(true);
      setIsModalEdit(true);
    } catch (err) {
      toast.error('Failed to fetch project for editing');
    }
  }, [getProjectById]);

  const handleDeleteProject = useCallback(async (projectId) => {
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
  }, [deleteProject, getAllProjects]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setIsModalEdit(false);
  }, []);

  const handleSwitchToEdit = useCallback((edit) => {
    setIsModalEdit(edit);
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
          <ProjectForm onSubmit={handleAddProject} />
        </div>

        {!loading && !error && (
          <ProjectList
            projects={projects}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            onView={handleViewProject}
          />
        )}

        {isModalOpen && selectedProject && (
          <ProjectModal
            project={selectedProject}
            isEdit={isModalEdit}
            onClose={handleCloseModal}
            onSwitchToEdit={handleSwitchToEdit}
            onDelete={handleDeleteProject}
            addChecklistTask={addChecklistTask}
            toggleChecklistTask={toggleChecklistTask}
            deleteChecklistTask={deleteChecklistTask}
            deleteProjectFiles={deleteProjectFiles}
            updateProject={updateProject}
          />
        )}
      </div>
    </div>
  );
}