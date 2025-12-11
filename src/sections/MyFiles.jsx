import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderPlus, Search, Trash2 } from "lucide-react";
import reposService from "@/apis/services/reposService";
import taskService from "@/apis/services/taskService";
import CreateRepositoryModal from "@/components/modals/CreateRepositoryModal";

export default function CompanyFiles() {
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [reposRes, teamsRes] = await Promise.all([
        reposService.getMyRepositories(),
        taskService.getAssignees()
      ]);
      setRepos(reposRes.data.repositories || []);
      setTeams(teamsRes?.data?.teams || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRepo = async (repoData) => {
    try {
      const res = await reposService.createRepository(repoData);
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

  const filteredRepos = repos.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || repo.repoType === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTeamName = (teamId) => {
    const team = teams.find(t => t._id === teamId);
    return team?.name || "Unknown Team";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Files</h1>
          <p className="text-gray-600">Manage repositories and files across your organization</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-3 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search repositories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="personal">Personal</option>
                <option value="team">Team</option>
                <option value="chat">Chat</option>
              </select>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12 text-gray-500">Loading...</div>
          ) : filteredRepos.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              <FolderPlus className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No repositories found</p>
            </div>
          ) : (
            filteredRepos.map((repo) => (
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
                      {repo.team && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded truncate">
                          {getTeamName(repo.team)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteRepo(repo._id, e)}
                    className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
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
            ))
          )}
        </div>
      </div>

      {/* Create Repository Modal */}
      {showCreateModal && (
        <CreateRepositoryModal
          teams={teams}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateRepo}
        />
      )}
    </div>
  );
}