const MeetingModal = ({ meeting, onClose }) => {
  if (!meeting) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {meeting.title}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  meeting.status === "planned"
                    ? "bg-blue-100 text-blue-700"
                    : meeting.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {meeting.status}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 bg-gray-50 rounded-lg p-4">
              {meeting.description || "No description provided"}
            </p>
          </div>

          {/* Meeting Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Start Time</p>
                  <p className="text-gray-600">
                    {new Date(meeting.startTime).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">End Time</p>
                  <p className="text-gray-600">
                    {new Date(meeting.endTime).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Attendees</p>
                  <p className="text-gray-600">
                    {meeting.employees?.length || 0} employees
                  </p>
                </div>
              </div>

              {meeting.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">{meeting.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Clients */}
          {meeting.clients && meeting.clients.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Clients</h3>
              <div className="space-y-2">
                {meeting.clients.map((client, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{client.name}</p>
                      <p className="text-sm text-gray-600">{client.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Employees */}
          {meeting.employees && meeting.employees.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Employees</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {meeting.employees.map((employee, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-medium text-xs">
                        {employee.name?.charAt(0).toUpperCase() || "E"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900">
                      {employee.name || "Employee"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingModal;
