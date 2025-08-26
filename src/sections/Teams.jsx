// src/pages/TeamManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import TeamCard from '../components/cards/TeamCard';
import CreateTeamModal from '@/components/modals/CreateTeamModal';
import TeamDetailsModal from '@/components/modals/TeamDetailsModal';
import { FaPlus, FaSearch } from 'react-icons/fa';
import teamService from '@/apis/services/teamService';

const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Transform API response to match component structure
    const transformTeamData = (apiTeams) => {
        return apiTeams.map(team => ({
            id: team._id,
            name: team.name,
            description: team.description, 
            lead: {
                id: team.teamLead._id,
                name: team.teamLead.name,
                email: team.teamLead.username, // Using username as email placeholder
                role: team.teamLead.role,
                position: team.teamLead.position
            },
            members: team.members.map(member => ({
                id: member._id,
                name: member.name,
                email: member.username, // Using username as email placeholder
                role: member.role,
                position: member.position
            })),
            createdBy: {
                id: team.createdBy._id,
                name: team.createdBy.name,
                email: team.createdBy.username,
                role: team.createdBy.role,
                position: team.createdBy.position
            },
            color: generateTeamColor(team._id), // Generate a color based on team ID
            createdAt: new Date(team.createdAt).toLocaleDateString(),
            status: 'Active', // Default status - you might want to add this to your API
            teamTasks: team.teamTasks,
            teamGroupChat: team.teamGroupChat,
            updatedAt: team.updatedAt
        }));
    };

    // Generate a consistent color for each team based on ID
    const generateTeamColor = (teamId) => {
        const colors = [
            '#4A90E2', '#7ED321', '#9013FE', '#F5A623', 
            '#BD10E0', '#50E3C2', '#B8E986', '#4A4A4A'
        ];
        // Use a simple hash function to get consistent color
        const hash = teamId.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        return colors[Math.abs(hash) % colors.length];
    };

    // Fetch teams from API
    useEffect(() => {
        const getTeams = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await teamService.getAllTeams();
                console.log('API Response:', res?.data.teams);
                
                if (res?.data.teams) {
                    const transformedTeams = transformTeamData(res.data.teams);
                    setTeams(transformedTeams);
                    setFilteredTeams(transformedTeams);
                } else {
                    setTeams([]);
                    setFilteredTeams([]);
                }
            } catch (err) {
                console.error('Error fetching teams:', err);
                setError('Failed to load teams. Please try again.');
                setTeams([]);
                setFilteredTeams([]);
            } finally {
                setLoading(false);
            }
        };
        
        getTeams();
    }, []);

    // Apply search filter
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredTeams(teams);
            return;
        }

        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const results = teams.filter(team =>
            team.name.toLowerCase().includes(lowercasedSearchTerm) ||
            team.description.toLowerCase().includes(lowercasedSearchTerm) ||
            team.lead.name.toLowerCase().includes(lowercasedSearchTerm) ||
            team.members.some(member => 
                member.name.toLowerCase().includes(lowercasedSearchTerm)
            )
        );
        setFilteredTeams(results);
    }, [searchTerm, teams]);

    const handleCreateTeam = async (newTeamData) => {
        try {
            setError(null);
            // Extract required parameters for createTeam API
            const { name, members, teamLeadId } = newTeamData;
            
            await teamService.createTeam({ 
                name, 
                members: members || [], 
                teamLeadId 
            });
            
            // Refresh the teams list after successful creation
            const res = await teamService.getAllTeams();
            if (res?.data.teams) {
                const transformedTeams = transformTeamData(res.data.teams);
                setTeams(transformedTeams);
            }
            
            setIsCreateModalOpen(false);
        } catch (err) {
            console.error('Error creating team:', err);
            setError('Failed to create team. Please try again.');
        }
    };

    const handleUpdateTeam = async (updatedTeamData) => {
        try {
            setError(null);
            // Extract required parameters for updateTeam API
            const { id: teamId, name, lead } = updatedTeamData;
            
            await teamService.updateTeam({ 
                teamId, 
                name, 
                teamLead: lead.id 
            });
            
            // Refresh the teams list after successful update
            const res = await teamService.getAllTeams();
            if (res?.data.teams) {
                const transformedTeams = transformTeamData(res.data.teams);
                setTeams(transformedTeams);
                // Update selected team if modal is open
                const updatedTeam = transformedTeams.find(team => team.id === teamId);
                setSelectedTeam(updatedTeam);
            }
        } catch (err) {
            console.error('Error updating team:', err);
            setError('Failed to update team. Please try again.');
        }
    };

    const handleDeleteTeam = async (teamId) => {
        try {
            setError(null);
            await teamService.deleteTeam({ teamId });
            
            // Remove team from state after successful deletion
            setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
            setIsDetailsModalOpen(false);
            setSelectedTeam(null);
        } catch (err) {
            console.error('Error deleting team:', err);
            setError('Failed to delete team. Please try again.');
        }
    };

    // Additional helper functions for team member management
    const handleAddTeamMember = async (teamId, employeeId) => {
        try {
            setError(null);
            await teamService.addTeamMember({ teamId, employeeId });
            
            // Refresh the teams list after adding member
            const res = await teamService.getAllTeams();
            if (res?.data.teams) {
                const transformedTeams = transformTeamData(res.data.teams);
                setTeams(transformedTeams);
                // Update selected team if modal is open
                const updatedTeam = transformedTeams.find(team => team.id === teamId);
                setSelectedTeam(updatedTeam);
            }
        } catch (err) {
            console.error('Error adding team member:', err);
            setError('Failed to add team member. Please try again.');
        }
    };

    const handleRemoveTeamMember = async (teamId, employeeId) => {
        try {
            setError(null);
            await teamService.removeTeamMember({ teamId, employeeId });
            
            // Refresh the teams list after removing member
            const res = await teamService.getAllTeams();
            if (res?.data.teams) {
                const transformedTeams = transformTeamData(res.data.teams);
                setTeams(transformedTeams);
                // Update selected team if modal is open
                const updatedTeam = transformedTeams.find(team => team.id === teamId);
                setSelectedTeam(updatedTeam);
            }
        } catch (err) {
            console.error('Error removing team member:', err);
            setError('Failed to remove team member. Please try again.');
        }
    };

    const handleUpdateMemberRole = async (teamId, memberId, role) => {
        try {
            setError(null);
            await teamService.updateMemberRole({ teamId, memberId, role });
            
            // Refresh the teams list after updating member role
            const res = await teamService.getAllTeams();
            if (res?.data.teams) {
                const transformedTeams = transformTeamData(res.data.teams);
                setTeams(transformedTeams);
                // Update selected team if modal is open
                const updatedTeam = transformedTeams.find(team => team.id === teamId);
                setSelectedTeam(updatedTeam);
            }
        } catch (err) {
            console.error('Error updating member role:', err);
            setError('Failed to update member role. Please try again.');
        }
    };

    const openDetailsModal = (team) => {
        setSelectedTeam(team);
        setIsDetailsModalOpen(true);
    };

    // Get all unique users from teams for modals
    const getAllUsers = useCallback(() => {
        const usersMap = new Map();
        
        teams.forEach(team => {
            // Add team lead
            usersMap.set(team.lead.id, team.lead);
            
            // Add team members
            team.members.forEach(member => {
                usersMap.set(member.id, member);
            });
            
            // Add created by user
            usersMap.set(team.createdBy.id, team.createdBy);
        });
        
        return Array.from(usersMap.values());
    }, [teams]);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading teams...</p>
                </div>
            </div>
        );
    }

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
                        placeholder="Search teams, members, or leads..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mx-6 mt-4 rounded">
                    {error}
                </div>
            )}

            {/* Main Content Area - Team Cards */}
            <main className="flex-1 p-6 overflow-y-auto">
                {filteredTeams.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        {searchTerm ? 'No teams found matching your search.' : 'No teams available.'}
                    </div>
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
                allUsers={getAllUsers()} // Pass all available users from API data
            />
            <TeamDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                team={selectedTeam}
                allUsers={getAllUsers()} // Pass all available users from API data
                onUpdateTeam={handleUpdateTeam}
                onDeleteTeam={handleDeleteTeam}
                onAddMember={handleAddTeamMember}
                onRemoveMember={handleRemoveTeamMember}
                onUpdateMemberRole={handleUpdateMemberRole}
            />
        </div>
    );
};

export default Teams;