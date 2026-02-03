// src/components/team/TeamDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes, FaEdit, FaTrash, FaCrown, FaUsers, FaInfoCircle, FaExternalLinkAlt, FaFolder } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TeamDetailsModal = ({ isOpen, onClose, team, allUsers, onUpdateTeam, onDeleteTeam }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTeam, setEditedTeam] = useState(team);

    useEffect(() => {
        if (team) {
            setEditedTeam({
                ...team,
                lead: {
                    id: team.lead?.id || team.lead?._id,
                    name: team.lead?.name,
                    email: team.lead?.email,
                    role: team.lead?.role,
                    position: team.lead?.position,
                    profile_picture_url: team.lead?.profile_picture_url
                },
                members: team.members || []
            });
        }
        setIsEditing(false);
    }, [team]);

    if (!isOpen || !team) return null;

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    // Reusable avatar component
    const Avatar = ({ person, size = 'sm', bgColor = 'bg-gray-200' }) => {
        const sizeClasses = {
            xs: 'w-6 h-6 text-xs',
            sm: 'w-8 h-8 text-sm',
            md: 'w-12 h-12 text-xl',
            lg: 'w-20 h-20 text-4xl'
        };
        return (
            <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center overflow-hidden`}>
                {person?.profile_picture_url ? (
                    <img
                        src={person.profile_picture_url}
                        alt={person.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className={`w-full h-full ${bgColor} flex items-center justify-center text-gray-700 font-semibold`}>
                        {getInitials(person?.name)}
                    </div>
                )}
            </div>
        );
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedTeam(prev => ({ ...prev, [name]: value }));
    };

    const handleMemberChange = (userId) => {
        setEditedTeam(prev => {
            const currentMembers = prev.members || [];
            const currentMemberIds = currentMembers.map(m => m.id || m._id);
            
            const newMemberIds = currentMemberIds.includes(userId)
                ? currentMemberIds.filter(id => id !== userId)
                : [...currentMemberIds, userId];
            
            const updatedMembers = allUsers.filter(user => 
                newMemberIds.includes(user.id || user._id)
            );
            
            return { ...prev, members: updatedMembers };
        });
    };

    const handleSave = () => {
        if (!editedTeam.name?.trim()) {
            alert('Please ensure team name is provided.');
            return;
        }
        
        if (!editedTeam.lead?.id) {
            alert('Please select a team lead.');
            return;
        }
        
        if (!editedTeam.members || editedTeam.members.length === 0) {
            alert('Please select at least one team member.');
            return;
        }

        const updateData = {
            id: editedTeam.id,
            name: editedTeam.name.trim(),
            description: editedTeam.description?.trim() || '',
            teamLead: editedTeam.lead.id,
            members: editedTeam.members.map(member => member.id || member._id)
        };

        onUpdateTeam(updateData);
        setIsEditing(false);
    };

    const handleLeadChange = (e) => {
        const selectedUserId = e.target.value;
        const selectedUser = allUsers.find(u => (u.id || u._id) === selectedUserId);
        
        if (selectedUser) {
            setEditedTeam(prev => ({ 
                ...prev, 
                lead: {
                    id: selectedUser.id || selectedUser._id,
                    name: selectedUser.name,
                    email: selectedUser.email || selectedUser.username,
                    role: selectedUser.role,
                    position: selectedUser.position,
                    profile_picture_url: selectedUser.profile_picture_url
                }
            }));
        }
    };

    const renderViewMode = () => (
        <>
            <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-6 shadow-lg"
                style={{ backgroundColor: team.color || '#4A90E2' }}
            >
                {getInitials(team.name)}
            </div>

            <p className="text-center text-gray-600 mb-6">{team.description || 'No description provided'}</p>

            <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                        <FaCrown className="mr-2 text-yellow-500" /> Team Lead
                    </h4>
                    {team.lead ? (
                        <div className="flex items-center p-3 bg-blue-50 rounded-md">
                            <div className="mr-3">
                                <Avatar person={team.lead} size="sm" bgColor="bg-blue-200" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">{team.lead.name}</p>
                                <p className="text-sm text-gray-600">{team.lead.email}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No team lead assigned</p>
                    )}
                </div>
                <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                        <FaInfoCircle className="mr-2 text-blue-500" /> Team Statistics
                    </h4>
                    <ul className="text-gray-700 space-y-1">
                        <li><strong>Total Members:</strong> {team.members?.length || 0}</li>
                        <li><strong>Created:</strong> {team.createdAt}</li>
                        <li><strong>Status:</strong> 
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                team.status === 'Active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {team.status}
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                    <FaUsers className="mr-2 text-purple-500" /> Team Members
                </h4>
                {team.members && team.members.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {team.members.map(member => (
                            <div key={member.id || member._id} className="flex items-center p-2 bg-gray-50 rounded-md">
                                <div className="mr-3">
                                    <Avatar person={member} size="sm" bgColor="bg-gray-200" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">{member.name}</p>
                                    <p className="text-sm text-gray-600">{member.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No team members assigned</p>
                )}
            </div>
        </>
    );

    const renderEditMode = () => (
        <form className="space-y-5">
            <div>
                <label htmlFor="editTeamName" className="block text-sm font-medium text-gray-700 mb-1">
                    Team Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="editTeamName"
                    name="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editedTeam.name || ''}
                    onChange={handleEditChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="editDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    id="editDescription"
                    name="description"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    value={editedTeam.description || ''}
                    onChange={handleEditChange}
                />
            </div>

            <div>
                <label htmlFor="editTeamLead" className="block text-sm font-medium text-gray-700 mb-1">
                    Team Lead <span className="text-red-500">*</span>
                </label>
                <select
                    id="editTeamLead"
                    name="lead"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editedTeam.lead?.id || ''}
                    onChange={handleLeadChange}
                    required
                >
                    <option value="">Select Team Lead</option>
                    {allUsers.map(user => (
                        <option key={user.id || user._id} value={user.id || user._id}>
                            {user.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Members <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {allUsers.map(user => (
                        <div key={user.id || user._id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`edit-member-${user.id || user._id}`}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                checked={editedTeam.members?.some(member => 
                                    (member.id || member._id) === (user.id || user._id)
                                ) || false}
                                onChange={() => handleMemberChange(user.id || user._id)}
                            />
                            <label 
                                htmlFor={`edit-member-${user.id || user._id}`} 
                                className="ml-2 flex items-center text-sm text-gray-700"
                            >
                                <div className="mr-2">
                                    <Avatar person={user} size="xs" bgColor="bg-gray-200" />
                                </div>
                                {user.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            
            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                </label>
                <select
                    id="status"
                    name="status"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    value={editedTeam.status || 'Active'}
                    onChange={handleEditChange}
                >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>
        </form>
    );

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8 transform transition-all duration-300 scale-100 opacity-100 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-6">
                    <div className="flex items-center space-x-3">
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold"
                            style={{ backgroundColor: team.color || '#4A90E2' }}
                        >
                            {getInitials(team.name)}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">{team.name}</h2>
                            <p className="text-sm text-gray-500">{team.description || 'No description'}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        {!isEditing ? (
                           <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200 ease-in-out"
                            >
                                <FaEdit />
                                <span>Edit</span>
                            </button>
                            <Link 
                                to={`/teamdashboard/${team.id}`}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition duration-200 ease-in-out"
                            >
                                <FaExternalLinkAlt />
                                <span>Dashboard</span>
                            </Link>
                            <Link 
                                to={`/repos/${team.id}`}
                                className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition duration-200 ease-in-out"
                            >
                                <FaFolder />
                                <span>Repositories</span>
                            </Link>
                           </>
                        ) : (
                            <button
                                onClick={handleSave}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 ease-in-out"
                            >
                                Save
                            </button>
                        )}
                        <button
                            onClick={() => { 
                                if (window.confirm('Are you sure you want to delete this team?')) {
                                    onDeleteTeam(team.id);
                                }
                            }}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 ease-in-out"
                        >
                            <FaTrash />
                            <span>Delete</span>
                        </button>
                        <button 
                            onClick={onClose} 
                            className="text-gray-500 hover:text-gray-700 transition duration-150"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>
                </div>

                {isEditing ? renderEditMode() : renderViewMode()}

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                    {!isEditing && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200 ease-in-out"
                        >
                            Close
                        </button>
                    )}
                    {isEditing && (
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200 ease-in-out"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamDetailsModal;