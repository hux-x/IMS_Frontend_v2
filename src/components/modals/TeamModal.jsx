import { X, Users, Mail, User, Shield, Briefcase, Calendar, MessageSquare } from 'lucide-react';

const TeamModal = ({ team, onClose }) => {
  if (!team) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#acc6aa] text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">{team.name}</h2>
                <p className="text-indigo-100 text-sm mt-1">
                  {team.members?.length || 0} Team Members
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          {team.description && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-gray-600" />
                Description
              </h3>
              <p className="text-gray-700">{team.description}</p>
            </div>
          )}

          {/* Team Lead Section */}
          {team.teamLead && (
            <div className="border-l-4 border-indigo-600 bg-indigo-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-600" />
                Team Lead
              </h3>
              <div className="bg-white rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-3">
                  {/* Lead avatar */}
                  <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                    {team.teamLead.profile_picture_url ? (
                      <img
                        src={team.teamLead.profile_picture_url}
                        alt={team.teamLead.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-indigo-200 flex items-center justify-center text-sm font-semibold text-indigo-800">
                        {team.teamLead.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{team.teamLead.name}</span>
                      {team.teamLead.position && (
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                          {team.teamLead.position}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {team.teamLead.email}
                    </div>
                    {team.teamLead.contact && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="h-4 w-4 text-gray-400">📞</span>
                        {team.teamLead.contact}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Team Members Section */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-600" />
              Team Members ({team.members?.length || 0})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {team.members?.map((member) => (
                <div
                  key={member._id}
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {/* Member avatar */}
                      <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 mt-0.5">
                        {member.profile_picture_url ? (
                          <img
                            src={member.profile_picture_url}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700">
                            {member.name?.charAt(0) || '?'}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-gray-900">{member.name}</span>
                        <div className="space-y-1 text-sm text-gray-600">
                          {member.position && (
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-3 w-3 text-gray-400" />
                              <span>{member.position}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span className="truncate">{member.email}</span>
                          </div>
                          {member.contact && (
                            <div className="flex items-center gap-2">
                              <span className="h-3 w-3 text-gray-400">📞</span>
                              <span>{member.contact}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                      member.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {member.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Stats */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              Team Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-indigo-600">{team.teamTasks?.length || 0}</p>
                <p className="text-sm text-gray-600">Total Tasks</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-purple-600">{team.members?.length || 0}</p>
                <p className="text-sm text-gray-600">Team Size</p>
              </div>
            </div>
          </div>

          {/* Created Info */}
          {team.createdAt && (
            <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
              Team created on {new Date(team.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamModal;