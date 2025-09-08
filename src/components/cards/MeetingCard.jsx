import { Users, Calendar, Eye } from "lucide-react";
const MeetingCard = ({ meeting }) => (
  <div
    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
    
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 mb-1 truncate">
          {meeting.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2">
          {meeting.description}
        </p>
      </div>
      <div className="flex items-center gap-2 ml-3">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            meeting.status === "planned"
              ? "bg-blue-100 text-blue-700"
              : meeting.status === "completed"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {meeting.status}
        </span>
        <Eye className="h-4 w-4 text-gray-400" />
      </div>
    </div>

    <div className="flex items-center justify-between text-sm text-gray-600">
      <div className="flex items-center">
        <Calendar className="h-4 w-4 mr-1" />
        <span>{new Date(meeting.startTime).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center">
        <Users className="h-4 w-4 mr-1" />
        <span>{meeting.employees?.length || 0} attendees</span>
      </div>
    </div>
  </div>
);

export default MeetingCard;
