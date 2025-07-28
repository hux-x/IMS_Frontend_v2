import { Users, MessageSquare } from "lucide-react";

const TeamCard = ({ team }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold">{team.name}</h3>
      </div>

      {/* <p className="text-gray-600 mb-4">{team.description}</p> */}

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
          <Users className="w-4 h-4 text-gray-500" /> {team.members} Members
        </p>
        <MessageSquare
          className="w-5 h-5 text-gray-500 cursor-pointer hover:text-blue-600"
        />
      </div>
    </div>
  );
};

export default TeamCard;