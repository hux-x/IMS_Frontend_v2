// src/pages/TeamManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import TeamCard from '../components/team/TeamCard';
import CreateTeamModal from '../components/team/CreateTeamModal';
import TeamDetailsModal from '../components/team/TeamDetailsModal';
import { FaPlus } from 'react-icons/fa';

// Mock Data for Users and Teams
const MOCK_USERS = [
    { id: 'user-1', name: 'John Admin', email: 'admin@company.com' },
    { id: 'user-2', name: 'Alice Johnson', email: 'alice@company.com' },
    { id: 'user-3', name: 'Bob Smith', email: 'bob@company.com' },
    { id: 'user-4', name: 'Charlie Brown', email: 'charlie@company.com' },
    { id: 'user-5', name: 'Diana Prince', email: 'diana@company.com' },
];

const MOCK_TEAMS = [
    {
        id: 'team-1',
        name: 'Development Team',
        description: 'Frontend and backend developers',
        lead: MOCK_USERS[1], // Alice Johnson
        members: [MOCK_USERS[0], MOCK_USERS[1], MOCK_USERS[2]],
        color: '#4A90E2',
        createdAt: '2024-01-20',
        status: 'Active'
    },
    {
        id: 'team-2',
        name: 'Marketing Team',
        description: 'Marketing and content creation',
        lead: MOCK_USERS[2], // Bob Smith
        members: [MOCK_USERS[0], MOCK_USERS[2], MOCK_USERS[3]],
        color: '#7ED321',
        createdAt: '2024-01-25',
        status: 'Active'
    },
    {
        id: 'team-3',
        name: 'Design Team',
        description: 'UI/UX and graphic designers',
        lead: MOCK_USERS[4], // Diana Prince
        members: [MOCK_USERS[0], MOCK_USERS[4]],
        color: '#9013FE',
        createdAt: '2024-02-10',
        status: 'Active'
    }
];

const Teams = () => {
    const [teams, setTeams] = useState(MOCK_TEAMS);
    const [filteredTeams, setFilteredTeams] = useState(MOCK_TEAMS);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);

    // Apply search filter
    useEffect(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const results = teams.filter(team =>
            team.name.toLowerCase().includes(lowercasedSearchTerm) ||
            team.description.toLowerCase().includes(lowercasedSearchTerm) ||
            team.lead.name.toLowerCase().includes(lowercasedSearchTerm)
        );
        setFilteredTeams(results);
    }, [searchTerm, teams]);

    const handleCreateTeam = (newTeam) => {
        setTeams(prevTeams => [...prevTeams, newTeam]);
    };

    const handleUpdateTeam = (updatedTeam) => {
        setTeams(prevTeams =>
            prevTeams.map(team => (team.id === updatedTeam.id ? updatedTeam : team))
        );
        setSelectedTeam(updatedTeam); // Update selected team in modal if it's the current one
    };

    const handleDeleteTeam = (teamId) => {
        setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
        setIsDetailsModalOpen(false); // Close modal after deletion
        setSelectedTeam(null);
    };

    const openDetailsModal = (team) => {
        setSelectedTeam(team);
        setIsDetailsModalOpen(true);
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-100">
            {/* Header Section */}
            <div className="bg-white shadow-sm p-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">Team Management</h2>
                        <p className="text-sm text-gray-500">Create and manage teams, assign team leads, and organize your workforce</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center space-x-2 px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out"
                    >
                        <FaPlus />
                        <span>Create Team</span>
                    </button>
                </div>
                <div className="relative w-full max-w-lg">
                    <input
                        type="text"
                        placeholder="Search teams..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> {/* Reusing Plus icon for search */}
                </div>
            </div>

            {/* Main Content Area - Team Cards */}
            <main className="flex-1 p-6 overflow-y-auto">
                {filteredTeams.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">No teams found.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredTeams.map(team => (
                            <TeamCard key={team.id} team={team} onClick={openDetailsModal} />
                        ))}
                    </div>
                )}
            </main>

            {/* Modals */}
            <CreateTeamModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreateTeam={handleCreateTeam}
                allUsers={MOCK_USERS} // Pass all available users for selection
            />
            <TeamDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                team={selectedTeam}
                allUsers={MOCK_USERS} // Pass all available users for selection in edit mode
                onUpdateTeam={handleUpdateTeam}
                onDeleteTeam={handleDeleteTeam}
            />
        </div>
    );
};

export default Teams;