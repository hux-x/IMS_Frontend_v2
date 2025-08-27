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
  onCloseView
}) => {
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

  return (
    <>
      {/* Create Meeting Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Create New Meeting</h2>
                <button
                  onClick={onCloseCreate}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <MeetingForm
                employees={employees}
                onSubmit={onCreateSubmit}
                onCancel={onCloseCreate}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Meeting Modal */}
      {showEditModal && currentMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Edit Meeting</h2>
                <button
                  onClick={onCloseEdit}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <MeetingForm
                meeting={currentMeeting}
                employees={employees}
                onSubmit={onEditSubmit}
                onCancel={onCloseEdit}
              />
            </div>
          </div>
        </div>
      )}

      {/* View Meeting Modal */}
      {showViewModal && currentMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{currentMeeting.title}</p>
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
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {currentMeeting.description || 'No description provided'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Start Time</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                    {new Date(currentMeeting.startTime).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">End Time</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                    {new Date(currentMeeting.endTime).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Created By</h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-gray-700">{currentMeeting.createdBy.name}</p>
                  <p className="text-sm text-gray-500">{currentMeeting.createdBy.email}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Participants ({currentMeeting.employees.length})</h3>
                <div className="bg-gray-50 p-3 rounded-md space-y-2">
                  {currentMeeting.employees.map(emp => (
                    <div key={emp._id} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">{emp.name}</p>
                        <p className="text-sm text-gray-500">{emp.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {currentMeeting.clients && currentMeeting.clients.length > 0 && currentMeeting.clients.some(c => c.name) && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Clients ({currentMeeting.clients.filter(c => c.name).length})</h3>
                  <div className="bg-gray-50 p-3 rounded-md space-y-2">
                    {currentMeeting.clients.filter(c => c.name).map((client, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-medium text-sm">
                            {client.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">{client.name}</p>
                          {client.email && <p className="text-sm text-gray-500">{client.email}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MeetingModals;