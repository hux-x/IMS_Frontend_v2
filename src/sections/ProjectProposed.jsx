import React, { useState } from "react";
import ProjectList from "@/components/cards/ProjectList";
import ProjectForm from "@/components/cards/PorjectForm";

export default function ProjectProposed() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);

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
      <h1 className="text-xl font-bold mb-4">Proposed Projects</h1>

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
      />
    </div>
  );
}
