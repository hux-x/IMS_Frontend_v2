// ============================================
// FILE: src/sections/TeamRepositories/index.jsx
// ============================================
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FolderPlus, Search, Trash2, Users } from "lucide-react";
import reposService from "@/apis/services/reposService";
import taskService from "@/apis/services/taskService";
import CreateRepositoryModal from "@/components/modals/CreateRepositoryModal";

export default function TeamRepositories() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);
  const [team, setTeam] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [teamId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reposRes, teamsRes] = await Promise.all([
        reposService.getTeamRepositories(teamId),
        taskService.getAssignees()
      ]);
      
      setRepos(reposRes.data.repositories || []);
      setTeams(teamsRes?.data?.teams || []);
      
      const currentTeam = teamsRes?.data?.teams?.find(t => t._id === teamId);
      setTeam(currentTeam);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load team repositories");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRepo = async (repoData) => {
    try {
      // Force the team ID for repos created from team page
      const payload = {
        ...repoData,
        team: teamId,
        repoType: "team"
      };
      
      const res = await reposService.createRepository(payload);
      setRepos([...repos, res.data.repository]);
      setShowCreateModal(false);
      alert("Repository created successfully!");
    } catch (error) {
      console.error("Error creating repository:", error);
      alert("Failed to create repository");
    }
  };

  const handleDeleteRepo = async (repoId, e) => {
    e.stopPropagation();
    try {
      if (!confirm("Are you sure you want to delete this repository?")) return;
      await reposService.deleteRepository(repoId);
      setRepos(repos.filter(r => r._id !== repoId));
      alert("Repository deleted successfully!");
    } catch (error) {
      console.error("Error deleting repository:", error);
      alert("Failed to delete repository");
    }
  };

  const filteredRepos = repos.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Team not found</p>
          <button
            onClick={() => navigate("/teams")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Teams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/teams")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Teams
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Team Repositories
                </span>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{team.members?.length || 0} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <FolderPlus className="w-4 h-4" />
                  <span>{repos.length} repositories</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FolderPlus className="w-5 h-5" />
              New Repository
            </button>
          </div>
        </div>

        {/* Repositories Grid */}
        {filteredRepos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FolderPlus className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-4">
              {searchTerm ? "No repositories match your search" : "No repositories in this team yet"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create First Repository
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRepos.map((repo) => (
              <div
                key={repo._id}
                onClick={() => navigate(`/files/${repo._id}`)}
                className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-all border-2 border-transparent hover:border-blue-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate text-lg mb-2">
                      {repo.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">
                        {repo.repoType}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteRepo(repo._id, e)}
                    className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete Repository"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Files:</span>
                    <span className="font-medium">{repo.stats?.totalFiles || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Members:</span>
                    <span className="font-medium">{repo.members?.length || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Repository Modal */}
      {showCreateModal && (
        <CreateRepositoryModal
          teams={teams}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateRepo}
          defaultTeam={teamId}
        />
      )}
    </div>
  );
}

