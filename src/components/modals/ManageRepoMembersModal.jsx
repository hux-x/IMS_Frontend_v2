import React, { useState } from "react";
import { X, UserPlus, UserMinus } from "lucide-react";
import reposService from "@/apis/services/reposService";

export default function ManageMembersModal({ repoId, teams, currentMembers, onClose, onUpdate }) {
  const [action, setAction] = useState("add");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [processing, setProcessing] = useState(false);

  const getAllMembers = () => {
    const allMembers = [];
    teams.forEach(team => {
      team.members?.forEach(member => {
        if (!allMembers.find(m => m._id === member._id)) {
          allMembers.push(member);
        }
      });
    });
    return allMembers;
  };

  const handleSubmit = async () => {
    try {
      if (selectedMembers.length === 0) {
        alert("Please select members");
        return;
      }

      setProcessing(true);

      if (action === "add") {
        await reposService.addMembers(repoId, { members: selectedMembers });
      } else {
        await reposService.removeMembers(repoId, { members: selectedMembers });
      }

      onUpdate();
    } catch (error) {
      console.error("Error managing members:", error);
      alert("Failed to manage members");
    } finally {
      setProcessing(false);
    }
  };

  const toggleMember = (memberId) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Manage Members</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" disabled={processing}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setAction("add");
                  setSelectedMembers([]);
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  action === "add"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                disabled={processing}
              >
                <UserPlus className="w-4 h-4" />
                Add Members
              </button>
              <button
                onClick={() => {
                  setAction("remove");
                  setSelectedMembers([]);
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  action === "remove"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                disabled={processing}
              >
                <UserMinus className="w-4 h-4" />
                Remove Members
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Members ({selectedMembers.length} selected)
            </label>
            <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
              {getAllMembers().length === 0 ? (
                <div className="p-4 text-center text-gray-500">No members available</div>
              ) : (
                getAllMembers().map((member) => {
                  const isCurrentMember = currentMembers.includes(member._id);
                  const isDisabled = action === "remove" && !isCurrentMember;
                  
                  return (
                    <label
                      key={member._id}
                      className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${
                        isDisabled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member._id)}
                        onChange={() => !isDisabled && toggleMember(member._id)}
                        disabled={isDisabled || processing}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <span className="text-sm text-gray-900">{member.name}</span>
                        {isCurrentMember && (
                          <span className="ml-2 text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded">
                            Current Member
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={selectedMembers.length === 0 || processing}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${
                action === "add"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {processing ? "Processing..." : action === "add" ? "Add Members" : "Remove Members"}
            </button>
            <button
              onClick={onClose}
              disabled={processing}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}