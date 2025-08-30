// components/ProjectProposed.js
import React, { useState, useEffect } from "react";
import ProjectList from "@/components/cards/ProjectList";
import ProjectForm from "@/components/cards/PorjectForm";
import ProjectModal from "@/components/modals/ProjectModal";
import useProject from "@/hooks/project";

export default function ProjectProposed() {
  const { 
    projects, 
    loading, 
    error, 
    getAllProjects, 
    createProject, 
    updateProject: updateProjectApi, // Renamed to avoid conflict
    deleteProject: deleteProjectApi, // Renamed to avoid conflict
    clearError 
  } = useProject();
  
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      await getAllProjects();
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  const handleAddProject = async (projectData) => {
    try {
      console.log("Creating project:", projectData);
      await createProject(projectData);
      // The hook automatically updates the projects state
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  const handleUpdateProject = async (updatedData) => {
    try {
      console.log("Updating project:", editingProject._id, updatedData);
      await updateProjectApi(editingProject._id, updatedData);
      setEditingProject(null);
    } catch (err) {
      console.error('Failed to update project:', err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      console.log("Deleting project:", projectId);
      if (window.confirm("Are you sure you want to delete this project?")) {
        await deleteProjectApi(projectId);
        // The hook automatically updates the projects state
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  if (loading) return <div className="loading">Loading projects...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Proposed Projects</h1>

      {editingProject ? (
        <ProjectForm
          initialData={editingProject}
          onSubmit={handleUpdateProject}
          onCancel={() => setEditingProject(null)}
        />
      ) : (
        <ProjectForm onSubmit={handleAddProject} />
      )}

      <ProjectList
        projects={projects}
        onEdit={setEditingProject}
        onDelete={handleDeleteProject}
        onView={setViewingProject}
      />

      {viewingProject && (
        <ProjectModal 
          project={viewingProject} 
          onClose={() => setViewingProject(null)} 
        />
      )}
    </div>
  );
}