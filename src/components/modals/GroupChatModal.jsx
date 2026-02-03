import React, { useState, useEffect } from 'react';
import { 
  X, 
  Edit2, 
  Check, 
  UserPlus, 
  UserMinus, 
  Users,
  Search,
  Loader2,
  Crown,
  AlertCircle
} from 'lucide-react';

const GroupInfoModal = ({ 
  isOpen, 
  onClose, 
  chat, 
  currentUserId, 
  allUsers,
  onUpdateGroup,
  onAddMember,
  onRemoveMember 
}) => {
  const [editingName, setEditingName] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && chat) {
      setNewGroupName(chat.chatName || '');
      setEditingName(false);
      setShowAddMember(false);
      setSearchQuery('');
      setError('');
    }
  }, [isOpen, chat]);

  if (!isOpen || !chat || !chat.isGroupChat) return null;

  const isAdmin = chat.groupAdmin?._id === currentUserId;
  const groupMembers = chat.users || [];

  // Filter users that can be added (not already in the group)
  const availableUsers = allUsers.filter(user => 
    user._id !== currentUserId && 
    !groupMembers.some(member => member._id === user._id) &&
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveGroupName = async () => {
    if (!newGroupName.trim()) {
      setError('Group name cannot be empty');
      return;
    }

    if (newGroupName.trim() === chat.chatName) {
      setEditingName(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onUpdateGroup(chat._id, newGroupName.trim());
      setEditingName(false);
    } catch (err) {
      setError('Failed to update group name');
      console.error('Error updating group name:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (userId) => {
    setLoading(true);
    setError('');

    try {
      await onAddMember(chat._id, userId);
      setSearchQuery('');
      // Don't close the add member panel to allow adding multiple users
    } catch (err) {
      setError('Failed to add member');
      console.error('Error adding member:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member from the group?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onRemoveMember(chat._id, userId);
    } catch (err) {
      setError('Failed to remove member');
      console.error('Error removing member:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Group Info</h2>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Group Icon and Name */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-purple-500 flex items-center justify-center text-white mb-3">
              <Users className="w-10 h-10" />
            </div>

            {editingName ? (
              <div className="w-full flex items-center gap-2">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Group name"
                  autoFocus
                  disabled={loading}
                />
                <button
                  onClick={handleSaveGroupName}
                  disabled={loading || !newGroupName.trim()}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setEditingName(false);
                    setNewGroupName(chat.chatName || '');
                    setError('');
                  }}
                  disabled={loading}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  {chat.chatName || 'Unnamed Group'}
                </h3>
                {isAdmin && (
                  <button
                    onClick={() => setEditingName(true)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit group name"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>
            )}

            <p className="text-sm text-gray-500 mt-1">
              {groupMembers.length} member{groupMembers.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Add Member Section */}
        {isAdmin && (
          <div className="px-4 py-3 border-b border-gray-200">
            <button
              onClick={() => setShowAddMember(!showAddMember)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>{showAddMember ? 'Cancel' : 'Add Member'}</span>
            </button>

            {showAddMember && (
              <div className="mt-3">
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1">
                  {availableUsers.length === 0 ? (
                    <p className="text-center text-gray-500 py-4 text-sm">
                      {searchQuery ? 'No users found' : 'All users are already members'}
                    </p>
                  ) : (
                    availableUsers.map(user => (
                      <button
                        key={user._id}
                        onClick={() => handleAddMember(user._id)}
                        disabled={loading}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <UserPlus className="w-4 h-4 text-gray-400" />
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Members List */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Members</h4>
          <div className="space-y-2">
            {groupMembers.map(member => {
              const isMemberAdmin = member._id === chat.groupAdmin?._id;
              const isCurrentUser = member._id === currentUserId;
              const canRemove = isAdmin && !isMemberAdmin && !isCurrentUser;

              return (
                <div
                  key={member._id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {member.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {member.name}
                        {isCurrentUser && ' (You)'}
                      </p>
                      {isMemberAdmin && (
                        <Crown className="w-4 h-4 text-yellow-500" title="Group Admin" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{member.email}</p>
                  </div>
                  {canRemove && (
                    <button
                      onClick={() => handleRemoveMember(member._id)}
                      disabled={loading}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Remove member"
                    >
                      <UserMinus className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupInfoModal;

// CSS for scrollbar styling (add to your global styles or component)
const styles = `
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;