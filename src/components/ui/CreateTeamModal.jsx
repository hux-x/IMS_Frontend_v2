// src/components/team/CreateTeamModal.jsx
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const teamColors = ['#4A90E2', '#7ED321', '#9013FE', '#F5A623', '#D0021B', '#50E3C2']; // Example colors

const CreateTeamModal = ({ isOpen, onClose, onCreateTeam, allUsers }) => {
    const [teamName, setTeamName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedLead, setSelectedLead] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [selectedColor, setSelectedColor] = useState(teamColors[0]);

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!teamName || !selectedLead || selectedMembers.length === 0) {
            alert('Please fill all required fields: Team Name, Team Lead, and Team Members.');
            return;
        }

        const newTeam = {
            id: Date.now(), // Simple unique ID for now
            name: teamName,
            description: description,
            lead: allUsers.find(u => u.id === selectedLead),
            members: allUsers.filter(u => selectedMembers.includes(u.id)),
            color: selectedColor,
            createdAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            status: 'Active' // Default status
        };
        onCreateTeam(newTeam);
        // Reset form
        setTeamName('');
        setDescription('');
        setSelectedLead('');
        setSelectedMembers([]);
        setSelectedColor(teamColors[0]);
        onClose();
    };

    const handleMemberChange = (userId) => {
        setSelectedMembers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-8 transform transition-all duration-300 scale-100 opacity-100">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800">Create New Team</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition duration-150">
                        <FaTimes size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div>
                        <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">Team Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="teamName"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                            placeholder="Enter team name"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            id="description"
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y transition duration-200 ease-in-out"
                            placeholder="Enter team description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="teamLead" className="block text-sm font-medium text-gray-700 mb-1">Team Lead <span className="text-red-500">*</span></label>
                            <select
                                id="teamLead"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                                value={selectedLead}
                                onChange={(e) => setSelectedLead(e.target.value)}
                                required
                            >
                                <option value="">Select team lead</option>
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
                                        className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-blue-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition duration-150 ease-in-out`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setSelectedColor(color)}
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
                                        id={`member-${user.id}`}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        checked={selectedMembers.includes(user.id)}
                                        onChange={() => handleMemberChange(user.id)}
                                    />
                                    <label htmlFor={`member-${user.id}`} className="ml-2 flex items-center text-sm text-gray-700">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold mr-2">
                                            {getInitials(user.name)}
                                        </div>
                                        {user.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200 ease-in-out"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out"
                        >
                            Create Team
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTeamModal;