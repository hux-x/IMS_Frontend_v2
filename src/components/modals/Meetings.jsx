import React from 'react';
import { X } from 'lucide-react';
import MeetingForm from '@/components/modals/MeetingForm';

const MeetingModals = ({
  showCreateModal,
  showEditModal,
  showViewModal,
  currentMeeting,
  employees,
  onCreateSubmit,
  onEditSubmit,
  onCloseCreate,
  onCloseEdit,
  onCloseView,
  loading = false
}) => {
  const getStatusBadge = (status) => {
    const statusStyles = {
      planned: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      scheduled: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-purple-100 text-purple-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status ? status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ') : 'Unknown'}
      </span>
    );
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'Not set';
    try {
      return new Date(dateTime).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getEmployeeInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getClientInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  // Safe data extraction helpers
  const getMeetingEmployees = (meeting) => {
    if (!meeting) return [];
    
    // Handle different API response formats
    if (Array.isArray(meeting.employees)) {
      return meeting.employees;
    }
    if (Array.isArray(meeting.participants)) {
      return meeting.participants;
    }
    if (Array.isArray(meeting.attendees)) {
      return meeting.attendees;
    }
    return [];
  };

  const getMeetingClients = (meeting) => {
    if (!meeting) return [];
    
    if (Array.isArray(meeting.clients)) {
      return meeting.clients.filter(client => client && (client.name || client.email));
    }
    return [];
  };

  const getCreatedBy = (meeting) => {
    if (!meeting) return null;
    
    // Handle different API response formats
    if (meeting.createdBy) {
      return meeting.createdBy;
    }
    if (meeting.creator) {
      return meeting.creator;
    }
    if (meeting.organizer) {
      return meeting.organizer;
    }
    return null;
  };

  return (
    <>
      {/* Create Meeting Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{background: 'rgba(0, 0, 0, 0.5)'}}>
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Create New Meeting</h2>
                <button
                  onClick={onCloseCreate}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  disabled={loading}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <MeetingForm
                employees={employees || []}
                onSubmit={onCreateSubmit}
                onCancel={onCloseCreate}
                loading={loading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Meeting Modal */}
      {showEditModal && currentMeeting && (
        <div className="fixed inset-0  flex items-center justify-center z-50 p-4" style={{background: 'rgba(0, 0, 0, 0.5)'}}>
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Edit Meeting</h2>
                <button
                  onClick={onCloseEdit}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  disabled={loading}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <MeetingForm
                meeting={currentMeeting}
                employees={employees || []}
                onSubmit={onEditSubmit}
                onCancel={onCloseEdit}
                loading={loading}
              />
            </div>
          </div>
        </div>
      )}

      {/* View Meeting Modal */}
      {showViewModal && currentMeeting && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{background: 'rgba(0, 0, 0, 0.5)'}}>
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Meeting Details</h2>
                <button
                  onClick={onCloseView}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Title</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                    {currentMeeting.title || 'Untitled Meeting'}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Status</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    {getStatusBadge(currentMeeting.status)}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md min-h-[60px]">
                  {currentMeeting.description || 'No description provided'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Start Time</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                    {formatDateTime(currentMeeting.startTime)}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">End Time</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                    {formatDateTime(currentMeeting.endTime)}
                  </p>
                </div>
              </div>
              
              {/* Created By Section */}
              {getCreatedBy(currentMeeting) && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Created By</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-700">
                      {getCreatedBy(currentMeeting).name || 'Unknown User'}
                    </p>
                    {getCreatedBy(currentMeeting).email && (
                      <p className="text-sm text-gray-500">
                        {getCreatedBy(currentMeeting).email}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Participants Section */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Participants ({getMeetingEmployees(currentMeeting).length})
                </h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  {getMeetingEmployees(currentMeeting).length > 0 ? (
                    <div className="space-y-2">
                      {getMeetingEmployees(currentMeeting).map((emp, index) => (
                        <div key={emp._id || emp.id || index} className="flex items-center gap-3">
                          <div className="relative w-8 h-8">
                            {emp.profile_picture_url ? (
                              <>
                                <img
                                  src={emp.profile_picture_url}
                                  alt={emp.name || 'Employee'}
                                  className="w-8 h-8 rounded-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextElementSibling.style.display = 'flex';
                                  }}
                                />
                                <div className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center hidden">
                                  <span className="text-blue-600 font-medium text-sm">
                                    {getEmployeeInitials(emp.name)}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-medium text-sm">
                                  {getEmployeeInitials(emp.name)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium">
                              {emp.name || 'Unknown Employee'}
                            </p>
                            {emp.email && (
                              <p className="text-sm text-gray-500">{emp.email}</p>
                            )}
                            {emp.department && (
                              <p className="text-xs text-gray-400">{emp.department}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No participants assigned</p>
                  )}
                </div>
              </div>
              
              {/* Clients Section */}
              {getMeetingClients(currentMeeting).length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Clients ({getMeetingClients(currentMeeting).length})
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-md space-y-2">
                    {getMeetingClients(currentMeeting).map((client, index) => (
                      <div key={client._id || client.id || index} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-medium text-sm">
                            {getClientInitials(client.name)}
                          </span>
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">
                            {client.name || 'Unknown Client'}
                          </p>
                          {client.email && (
                            <p className="text-sm text-gray-500">{client.email}</p>
                          )}
                          {client.company && (
                            <p className="text-xs text-gray-400">{client.company}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Meeting Info */}
              {(currentMeeting.location || currentMeeting.meetingLink) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentMeeting.location && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Location</h3>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                        {currentMeeting.location}
                      </p>
                    </div>
                  )}
                  {currentMeeting.meetingLink && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Meeting Link</h3>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <a 
                          href={currentMeeting.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline break-all"
                        >
                          {currentMeeting.meetingLink}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Meeting Metadata */}
              <div className="pt-4 border-t border-gray-200 text-sm text-gray-500">
                <div className="grid grid-cols-2 gap-4">
                  {currentMeeting.createdAt && (
                    <div>
                      <span className="font-medium">Created: </span>
                      {formatDateTime(currentMeeting.createdAt)}
                    </div>
                  )}
                  {currentMeeting.updatedAt && (
                    <div>
                      <span className="font-medium">Last Updated: </span>
                      {formatDateTime(currentMeeting.updatedAt)}
                    </div>
                  )}
                </div>
                {currentMeeting._id && (
                  <div className="mt-2">
                    <span className="font-medium">Meeting ID: </span>
                    <code className="bg-gray-100 px-1 rounded">{currentMeeting._id}</code>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MeetingModals;