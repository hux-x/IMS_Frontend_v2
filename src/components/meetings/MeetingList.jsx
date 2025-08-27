import React from 'react';
import { Calendar } from 'lucide-react';
import MeetingCard from '@/components/cards/Meetingcard';

const MeetingList = ({ meetings, totalMeetings, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Meetings ({meetings.length})
          </h2>
          <div className="text-sm text-gray-500">
            Showing {meetings.length} of {totalMeetings} meetings
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {meetings.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium">No meetings found</p>
            <p className="text-sm">Try adjusting your filters or create a new meeting.</p>
          </div>
        ) : (
          meetings.map((meeting) => (
            <MeetingCard
              key={meeting._id}
              meeting={meeting}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MeetingList;