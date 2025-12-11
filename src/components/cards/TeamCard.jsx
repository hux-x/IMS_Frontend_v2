// src/components/team/TeamCard.jsx
import React from 'react';
import { FaCrown, FaUsers, FaEllipsisV, FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TeamCard = ({ team, onClick }) => {
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };
    console.log(team, "TEAM DATA IN CARDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDd");
    const membersArray = Array.isArray(team.members) ? team.members : [];
    const membersToShow = membersArray.slice(0, 3);
    const remainingMembers = membersArray.length - membersToShow.length;

    return (
        <div 
            className="bg-white rounded-lg shadow-md p-6 flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out"
            onClick={() => onClick(team)}
        >
            <div className="flex justify-between items-start mb-4 w-full">
                <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl font-bold"
                    style={{ backgroundColor: team.color || '#4A90E2' }}
                >
                    {team?.name?.charAt(0)}
                </div>

                <div className="flex items-center gap-2">
                    <div className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                        {membersArray.length} members
                    </div>

                    {/* External link icon */}
                    <Link 
                        to={`/teamdashboard/${team._id || team.id}`} 
                        onClick={(e) => e.stopPropagation()} // prevent card click
                        className="text-gray-500 hover:text-gray-700"
                        title="View team details"
                    >
                        <FaExternalLinkAlt size={18} />
                    </Link>
                </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">{team.name}</h3>
            <p className="text-sm text-gray-500 mb-4 flex-grow">{team.description}</p>

            <div className="flex items-center text-gray-700 text-sm mb-2">
                <FaCrown className="mr-2 text-yellow-500" />
                <span>Lead: {team.lead.name ? team.lead.name : "N/A"}</span>
            </div>

            <div className="flex items-center text-gray-700 text-sm mb-4">
                <FaUsers className="mr-2" />
                <span>Members: {membersArray.length}</span>
                <div className="flex -space-x-2 ml-3">
                    {membersToShow.map((member) => (
                        <div
                            key={member.id}
                            className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-700 border-2 border-white"
                            title={member.name}
                        >
                            {member?.name?.charAt(0)}
                        </div>
                    ))}
                    {remainingMembers > 0 && (
                        <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-xs text-white border-2 border-white">
                            +{remainingMembers}
                        </div>
                    )}
                </div>
            </div>

            <div className="text-xs text-gray-500 mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                <span>Created: {team.createdAt}</span>
            </div>
        </div>
    );
};

export default TeamCard;