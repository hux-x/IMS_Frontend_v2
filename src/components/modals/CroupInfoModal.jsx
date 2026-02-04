import React, { useState, useEffect } from 'react';

import { 
  Users, 
  X, 
  Check, 
  UserPlus,
  Edit2,
  UserMinus,
} from 'lucide-react';

const GroupInfoModal = ({ isOpen, onClose, chat, currentUserId, allUsers, onUpdateGroup, onRemoveMember, onAddMember }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [groupName, setGroupName] = useState(chat?.chatName || '');
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => { 
    if (chat) {
      setGroupName(chat.chatName || '');
    }
  }, [chat]);

  if (!isOpen || !chat) return null;

  const isAdmin = chat.groupAdmin?._id === currentUserId;
  const availableUsers = allUsers.filter(u => 
    !chat.users.find(cu => cu._id === u._id) && u._id !== currentUserId
  ).filter(u => u.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleUpdateName = async () => {
    if (!groupName.trim() || groupName === chat.chatName) {
      setIsEditing(false);7
      return;
    }

    setUpdating(true);
    try {
      await onUpdateGroup(chat._id, groupName);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating group name:', error);
      alert('Failed to update group name');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddMember = async (userId) => {
    setUpdating(true);
    try {
      await onAddMember(chat._id, userId);
      setShowAddMember(false);
      setSearchQuery('');
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Failed to add member');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm('Remove this member from the group?')) return;
    
    setUpdating(true);
    try {
      await onRemoveMember(chat._id, userId);
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Failed to remove member');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Group Info</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-purple-500 flex items-center justify-center text-white mb-3">
            <Users className="w-10 h-10" />
          </div>
          
          {isEditing ? (
            <div className="flex items-center gap-2 w-full max-w-xs">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={handleUpdateName}
                disabled={updating}
                className="p-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setGroupName(chat.chatName);
                }}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold text-gray-900">{chat.chatName}</h3>
              {isAdmin && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
          )}
          
          <p className="text-sm text-gray-500 mt-1">
            {chat.users?.length || 0} members
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700">Members</h4>
              {isAdmin && (
                <button
                  onClick={() => setShowAddMember(!showAddMember)}
                  className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Member
                </button>
              )}
            </div>

            {showAddMember && isAdmin && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                />
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {availableUsers.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-2">No users found</p>
                  ) : (
                    availableUsers.map(user => (
                      <button
                        key={user._id}
                        onClick={() => handleAddMember(user._id)}
                        disabled={updating}
                        className="w-full flex items-center gap-2 p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-900">{user.name}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              {chat.users?.map(member => {
                const isMemberAdmin = member._id === chat.groupAdmin?._id;
                const isCurrentUser = member._id === currentUserId;
                
                return (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                        {member.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {member.name} {isCurrentUser && '(You)'}
                        </p>
                        {isMemberAdmin && (
                          <p className="text-xs text-blue-600">Group Admin</p>
                        )}
                      </div>
                    </div>
                    
                    {isAdmin && !isCurrentUser && !isMemberAdmin && (
                      <button
                        onClick={() => handleRemoveMember(member._id)}
                        disabled={updating}
                        className="p-1 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <UserMinus className="w-4 h-4 text-red-600" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupInfoModal;