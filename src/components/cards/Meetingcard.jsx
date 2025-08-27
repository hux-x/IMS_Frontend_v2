import React from 'react';
import { Calendar, Clock, Users, User, Edit, Trash2, Eye } from 'lucide-react';

const MeetingCard = ({ meeting, onView, onEdit, onDelete }) => {
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      planned: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const startDateTime = formatDateTime(meeting.startTime);
  const endDateTime = formatDateTime(meeting.endTime);

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <h3 className="text-lg font-semibold text-gray-900">{meeting.title}</h3>
            {getStatusBadge(meeting.status)}
          </div>
          
          {meeting.description && (
            <p className="text-gray-600 mb-3">{meeting.description}</p>
          )}
          
          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{startDateTime.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{startDateTime.time} - {endDateTime.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>{meeting.employees.length} participants</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>Created by {meeting.createdBy.name}</span>
            </div>
          </div>

          {meeting.clients && meeting.clients.length > 0 && meeting.clients.some(c => c.name) && (
            <div className="mt-3 text-sm text-gray-500">
              <span className="font-medium">Clients:</span> {meeting.clients.filter(c => c.name).map(c => c.name).join(', ')}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-6">
          <button
            onClick={() => onView(meeting)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => onEdit(meeting)}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit Meeting"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(meeting._id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Meeting"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingCard;