import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CreateRepositoryModal({ teams, onClose, onCreate, defaultTeam = null }) {
  const [formData, setFormData] = useState({
    name: "",
    repoType: defaultTeam ? "team" : "team",
    team: defaultTeam || "",
    members: []
  });

  // If defaultTeam is provided, lock the team selection
  const isTeamLocked = !!defaultTeam;

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("Repository name is required");
      return;
    }
    
    if (formData.repoType === "team" && !formData.team) {
      alert("Please select a team");
      return;
    }

    const payload = {
      name: formData.name,
      repoType: formData.repoType,
      members: formData.members,
      team: formData.repoType === "team" ? formData.team : null
    };

    onCreate(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Create New Repository</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Repository Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter repository name"
            />
          </div>
          
          {!isTeamLocked && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.repoType}
                onChange={(e) => setFormData({ ...formData, repoType: e.target.value, team: "" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="personal">Personal</option>
                <option value="team">Team</option>
                <option value="chat">Chat</option>
              </select>
            </div>
          )}
          
          {formData.repoType === "team" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Team
              </label>
              <select
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isTeamLocked}
              >
                <option value="">Choose a team...</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>{team.name}</option>
                ))}
              </select>
              {isTeamLocked && (
                <p className="mt-1 text-xs text-gray-500">
                  Repository will be created for this team
                </p>
              )}
            </div>
          )}
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Repository
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}