// src/components/team/TeamDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes, FaEdit, FaTrash, FaCrown, FaUsers, FaEnvelope, FaInfoCircle, FaLink, FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const teamColors = ['#4A90E2', '#7ED321', '#9013FE', '#F5A623', '#D0021B', '#50E3C2'];

const TeamDetailsModal = ({ isOpen, onClose, team, allUsers, onUpdateTeam, onDeleteTeam }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTeam, setEditedTeam] = useState(team);

    useEffect(() => {
        setEditedTeam(team); // Reset editedTeam when the 'team' prop changes
        setIsEditing(false); // Go back to view mode when a new team is selected
    }, [team]);

    if (!isOpen || !team) return null;

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedTeam(prev => ({ ...prev, [name]: value }));
    };

    const handleMemberChange = (userId) => {
        setEditedTeam(prev => {
            const currentMembers = prev.members.map(m => m.id);
            const newMembers = currentMembers.includes(userId)
                ? currentMembers.filter(id => id !== userId)
                : [...currentMembers, userId];
            
            // Map back to full user objects
            const updatedMembers = allUsers.filter(user => newMembers.includes(user.id));
            return { ...prev, members: updatedMembers };
        });
    };

    const handleSave = () => {
        if (!editedTeam.name || !editedTeam.lead || editedTeam.members.length === 0) {
            alert('Please ensure team name, lead, and at least one member are selected.');
            return;
        }
        onUpdateTeam(editedTeam);
        setIsEditing(false);
    };

    const handleTeamColorChange = (color) => {
        setEditedTeam(prev => ({ ...prev, color }));
    };

    const renderViewMode = () => (
        <>
            <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-6 shadow-lg"
                style={{ backgroundColor: team.color || '#4A90E2' }}
            >
                {getInitials(team.name)}
            </div>

            <p className="text-center text-gray-600 mb-6">{team.description}</p>

            <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center"><FaCrown className="mr-2 text-yellow-500" /> Team Lead</h4>
                    <div className="flex items-center p-3 bg-blue-50 rounded-md">
                        <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-sm font-semibold mr-3">
                            {getInitials(team.lead.name)}
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">{team.lead.name}</p>
                            <p className="text-sm text-gray-600">{team.lead.email}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center"><FaInfoCircle className="mr-2 text-blue-500" /> Team Statistics</h4>
                    <ul className="text-gray-700 space-y-1">
                        <li><strong>Total Members:</strong> {team.members.length}</li>
                        <li><strong>Created:</strong> {team.createdAt}</li>
                        <li><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs font-medium ${team.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{team.status}</span></li>
                    </ul>
                </div>
            </div>

            <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center"><FaUsers className="mr-2 text-purple-500" /> Team Members</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {team.members.map(member => (
                        <div key={member.id} className="flex items-center p-2 bg-gray-50 rounded-md">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold mr-3">
                                {getInitials(member.name)}
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">{member.name}</p>
                                <p className="text-sm text-gray-600">{member.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );

    const renderEditMode = () => (
        <form className="space-y-5">
            <div>
                <label htmlFor="editTeamName" className="block text-sm font-medium text-gray-700 mb-1">Team Name <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    id="editTeamName"
                    name="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editedTeam.name}
                    onChange={handleEditChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="editDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    id="editDescription"
                    name="description"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    value={editedTeam.description}
                    onChange={handleEditChange}
                ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="editTeamLead" className="block text-sm font-medium text-gray-700 mb-1">Team Lead <span className="text-red-500">*</span></label>
                    <select
                        id="editTeamLead"
                        name="lead"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editedTeam.lead.id}
                        onChange={(e) => setEditedTeam(prev => ({ ...prev, lead: allUsers.find(u => u.id === e.target.value) }))}
                        required
                    >
                        {allUsers.map(user => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team Color</label>
                    <div className="flex items-center space-x-2 h-10">
                        {teamColors.map((color) => (
                            <button
                                key={color}
                                type="button"
                                className={`w-8 h-8 rounded-full border-2 ${editedTeam.color === color ? 'border-blue-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition duration-150 ease-in-out`}
                                style={{ backgroundColor: color }}
                                onClick={() => handleTeamColorChange(color)}
                            ></button>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Members <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {allUsers.map(user => (
                        <div key={user.id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`edit-member-${user.id}`}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                checked={editedTeam.members.some(member => member.id === user.id)}
                                onChange={() => handleMemberChange(user.id)}
                            />
                            <label htmlFor={`edit-member-${user.id}`} className="ml-2 flex items-center text-sm text-gray-700">
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold mr-2">
                                    {getInitials(user.name)}
                                </div>
                                {user.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            
            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                    id="status"
                    name="status"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    value={editedTeam.status}
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
                            <p className="text-sm text-gray-500">{team.description}</p>
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
                             <Link to={`/teamdashboard/${team.id}`}
                                
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200 ease-in-out"
                            >
                                <FaExternalLinkAlt />
                                <span>Dashboard</span>
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
                            onClick={() => { if (window.confirm('Are you sure you want to delete this team?')) onDeleteTeam(team.id); }}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 ease-in-out"
                        >
                            <FaTrash />
                            <span>Delete</span>
                        </button>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition duration-150">
                            <FaTimes size={20} />
                        </button>
                    </div>
                </div>

                {isEditing ? renderEditMode() : renderViewMode()}

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                    {!isEditing && ( // Only show close button in view mode, save/cancel in edit mode
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