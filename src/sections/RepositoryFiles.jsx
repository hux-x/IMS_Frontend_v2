import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Users, Download, Trash2, Search } from "lucide-react";
import reposService from "@/apis/services/reposService";
import taskService from "@/apis/services/taskService";
import UploadFilesModal from "@/components/modals/UploadFileModal";
import ManageMembersModal from "@/components/modals/ManageRepoMembersModal";
import FileCard from "@/components/cards/FileCard";
import UploadProgressToast from "@/components/ui/UploadProgress";

export default function RepositoryFiles() {
  const { repoId } = useParams();
  const navigate = useNavigate();
  const [repository, setRepository] = useState(null);
  const [files, setFiles] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [repoId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch files for this specific repository
      const filesRes = await reposService.getRepositoryFiles(repoId);
      console.log("Fetched files response:", filesRes);
      
      const filesData = filesRes.data.files || [];
      setFiles(filesData);
      
      // Create repository object from the files data
      // Since all files have the same repositoryId, we can extract repo info
      if (filesData.length > 0) {
        const firstFile = filesData[0];
        // Create a minimal repository object
        // You might want to add a proper endpoint to get repository details
        setRepository({
          _id: firstFile.repositoryId,
          name: "Repository", // Default name - ideally fetch from backend
          repoType: firstFile.chatId ? "chat" : "team",
          members: [],
          files: filesData.map(f => f._id)
        });
      } else {
        // If no files, we still need repository info
        // This is a fallback - ideally you'd have a getRepository(repoId) endpoint
        setRepository({
          _id: repoId,
          name: "Repository",
          repoType: "unknown",
          members: [],
          files: []
        });
      }
      
      // Only fetch teams if needed (for member management)
      try {
        const teamsRes = await taskService.getAssignees();
        setTeams(teamsRes?.data?.teams || []);
      } catch (error) {
        console.warn("Could not fetch teams:", error);
        setTeams([]);
      }
      
    } catch (error) {
      console.error("Error fetching data:", error);
      
      // Check if it's a 404 - repository not found
      if (error.response?.status === 404) {
        setRepository(null);
      } else {
        alert("Failed to load repository data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = async () => {
    await fetchData();
    setShowUploadModal(false);
  };

  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const res = await reposService.downloadFile(repoId, fileId);
      window.open(res.data.downloadUrl, "_blank");
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file");
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      if (!confirm("Are you sure you want to delete this file?")) return;
      await reposService.deleteFiles(repoId, { fileIds: [fileId] });
      await fetchData();
      alert("File deleted successfully!");
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file");
    }
  };

  const handleMembersUpdate = async () => {
    await fetchData();
    setShowMembersModal(false);
  };

  const filteredFiles = files.filter(file =>
    file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!repository) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Repository not found</p>
          <button
            onClick={() => navigate("/companyFiles")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Repositories
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <UploadProgressToast />

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => navigate("/companyFiles")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Repositories
            </button>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{repository.name}</h1>
                <div className="flex items-center gap-3">
                  <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                    {repository.repoType}
                  </span>
                  <span className="text-gray-600">
                    {files.length} {files.length === 1 ? 'file' : 'files'}
                  </span>
                  <span className="text-gray-600">
                    {repository.members?.length || 0} {repository.members?.length === 1 ? 'member' : 'members'}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                {repository.repoType !== 'chat' && (
                  <button
                    onClick={() => setShowMembersModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Users className="w-5 h-5" />
                    Manage Members
                  </button>
                )}
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  Upload Files
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {filteredFiles.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-4">
                {searchTerm ? "No files match your search" : "No files in this repository"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Upload First File
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFiles.map((file) => (
                <FileCard
                  key={file._id}
                  file={file}
                  onDownload={() => handleDownloadFile(file._id, file.fileName)}
                  onDelete={() => handleDeleteFile(file._id)}
                />
              ))}
            </div>
          )}
        </div>

        {showUploadModal && (
          <UploadFilesModal
            repoId={repoId}
            onClose={() => setShowUploadModal(false)}
            onUploadComplete={handleUploadComplete}
          />
        )}

        {showMembersModal && repository.repoType !== 'chat' && (
          <ManageMembersModal
            repoId={repoId}
            teams={teams}
            currentMembers={repository.members || []}
            onClose={() => setShowMembersModal(false)}
            onUpdate={handleMembersUpdate}
          />
        )}
      </div>
    </>
  );
}