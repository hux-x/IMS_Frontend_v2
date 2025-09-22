import React from 'react';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  Users, 
  UserPlus,
  MapPin,
  AlertCircle 
} from 'lucide-react';

const MeetingList = ({
  meetings = [],
  totalMeetings = 0,
  loading = false,
  pagination = {},
  onView,
  onEdit,
  onDelete,
  onLoadMore,
  actionLoading = false
}) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      planned: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock
      },
      completed: {
        color: 'bg-green-100 text-green-800',
        icon: Calendar
      },
      cancelled: {
        color: 'bg-red-100 text-red-800',
        icon: AlertCircle
      }
    };

    const config = statusConfig[status] || statusConfig.planned;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
    
    let dateLabel = date.toLocaleDateString();
    if (isToday) dateLabel = 'Today';
    else if (isTomorrow) dateLabel = 'Tomorrow';

    const timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return { dateLabel, timeLabel };
  };

  const getMeetingDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end - start;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading && meetings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Meetings</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
              <div className="flex items-center gap-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-28"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Meetings</h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing {meetings.length} of {totalMeetings} meetings
            </p>
          </div>
        </div>
      </div>

      {meetings.length === 0 ? (
        <div className="p-12 text-center">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings found</h3>
          <p className="text-gray-600">There are no meetings matching your current criteria.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {meetings.map((meeting) => {
            const { dateLabel, timeLabel } = formatDateTime(meeting.startTime);
            const endTime = formatDateTime(meeting.endTime);
            const duration = getMeetingDuration(meeting.startTime, meeting.endTime);

            return (
              <div key={meeting._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {meeting.title}
                      </h3>
                      {getStatusBadge(meeting.status)}
                    </div>
                    
                    {meeting.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {meeting.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{dateLabel}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{timeLabel} - {endTime.timeLabel} ({duration})</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span>{meeting.employees?.length || 0} attendees</span>
                      </div>

                      {meeting.clients && meeting.clients.length > 0 && (
                        <div className="flex items-center gap-1">
                          <UserPlus size={16} />
                          <span>{meeting.clients.length} clients</span>
                        </div>
                      )}

                      {meeting.createdBy && (
                        <div className="flex items-center gap-1">
                          <span>Created by {meeting.createdBy.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => onView(meeting)}
                      disabled={actionLoading}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                      title="View meeting details"
                    >
                      <Eye size={18} />
                    </button>
                    
                    <button
                      onClick={() => onEdit(meeting)}
                      disabled={actionLoading}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Edit meeting"
                    >
                      <Edit size={18} />
                    </button>
                    
                    <button
                      onClick={() => onDelete(meeting._id)}
                      disabled={actionLoading}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete meeting"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Meeting Attendees Preview */}
                {meeting.employees && meeting.employees.length > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-gray-500">Attendees:</span>
                    <div className="flex -space-x-2">
                      {meeting.employees.slice(0, 5).map((employee, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white"
                          title={employee.name}
                        >
                          {employee.name?.charAt(0).toUpperCase()}
                        </div>
                      ))}
                      {meeting.employees.length > 5 && (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-500 border-2 border-white">
                          +{meeting.employees.length - 5}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {loading && meetings.length > 0 && (
        <div className="p-4 text-center border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Loading more meetings...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingList;