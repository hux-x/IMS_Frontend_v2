import React, { useState, useEffect, useContext } from 'react';
import systemService from '@/apis/services/systemService';
import { toast } from 'react-toastify';
import { Trash2, Plus, Edit2, X } from 'lucide-react';

const SystemManagement = () => {
  const [activeTab, setActiveTab] = useState('departments');
  const [loading, setLoading] = useState(false);
  
  // State for departments
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState('');
  
  // State for roles
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState({});
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  
  // State for announcements
  const [announcement, setAnnouncement] = useState(null);
  const [announcementForm, setAnnouncementForm] = useState({
    message: '',
    imageURL: '',
    link: ''
  });
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchDepartments();
    fetchRoles();
    fetchAnnouncement();
  }, []);

  // Department Functions
  const fetchDepartments = async () => {
    try {
      const response = await systemService.getDepartments();
      setDepartments(response.data.departments || []);
    } catch (err) {
      toast.error('Failed to fetch departments');
    }
  };

  const handleAddDepartment = async () => {
    if (!newDepartment.trim()) {
      toast.error('Department name is required');
      return;
    }
    setLoading(true);
    try {
      await systemService.addDepartment(newDepartment);
      toast.success('Department added successfully');
      setNewDepartment('');
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add department');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDepartment = async (dept) => {
    if (window.confirm(`Remove department: ${dept}?`)) {
      try {
        await systemService.removeDepartment(dept);
        toast.success('Department removed successfully');
        fetchDepartments();
      } catch (err) {
        toast.error('Failed to remove department');
      }
    }
  };

  // Role Functions
  const fetchRoles = async () => {
    try {
      const response = await systemService.getRoles();
      setRoles(response.data.roles || []);
    } catch (err) {
      toast.error('Failed to fetch roles');
    }
  };

  const handleAddRole = async () => {
    if (!newRole.trim()) {
      toast.error('Role name is required');
      return;
    }
    setLoading(true);
    try {
      await systemService.addRole(newRole);
      toast.success('Role added successfully');
      setNewRole('');
      fetchRoles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add role');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRole = async (role) => {
    if (window.confirm(`Remove role: ${role}?`)) {
      try {
        await systemService.removeRole(role);
        toast.success('Role removed successfully');
        fetchRoles();
      } catch (err) {
        toast.error('Failed to remove role');
      }
    }
  };

  const handleEditPermissions = (role) => {
    setSelectedRole(role);
    setRolePermissions(role.permission || {});
    setShowPermissionModal(true);
  };

  const handlePermissionChange = (permission) => {
    setRolePermissions(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }));
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    setLoading(true);
    try {
      await systemService.updateRolePermissions(selectedRole.type, rolePermissions);
      toast.success('Permissions updated successfully');
      setShowPermissionModal(false);
      fetchRoles();
    } catch (err) {
      toast.error('Failed to update permissions');
    } finally {
      setLoading(false);
    }
  };

  // Announcement Functions
  const fetchAnnouncement = async () => {
    try {
      const response = await systemService.getAnnouncement();
      setAnnouncement(response.data);
    } catch (err) {
      setAnnouncement(null);
    }
  };

  const handlePostAnnouncement = async () => {
    if (!announcementForm.message.trim()) {
      toast.error('Announcement message is required');
      return;
    }
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      await systemService.postAnnouncement(
        userId,
        announcementForm.message,
        announcementForm.imageURL,
        announcementForm.link
      );
      toast.success('Announcement posted successfully');
      setAnnouncementForm({ message: '', imageURL: '', link: '' });
      setShowAnnouncementModal(false);
      fetchAnnouncement();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAnnouncement = async () => {
    setLoading(true);
    try {
      await systemService.updateAnnouncement(
        announcementForm.message,
        announcementForm.imageURL,
        announcementForm.link
      );
      toast.success('Announcement updated successfully');
      setAnnouncementForm({ message: '', imageURL: '', link: '' });
      setShowAnnouncementModal(false);
      fetchAnnouncement();
    } catch (err) {
      toast.error('Failed to update announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnnouncement = async () => {
    if (window.confirm('Delete this announcement?')) {
      try {
        await systemService.deleteAnnouncement();
        toast.success('Announcement deleted successfully');
        setAnnouncement(null);
      } catch (err) {
        toast.error('Failed to delete announcement');
      }
    }
  };

  const permissionsList = [
    'canCreateTasks',
    'canDeleteTasks',
    'canUpdateTasks',
    'canViewReports',
    'canManageTeams',
    'canManageEmployees',
    'canManageMeetings',
    'canManageAnnouncements',
    'canManagePermissions',
    'canManageAttendance',
    'canCreateGroupChats'
  ];

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">System Management</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {['departments', 'roles', 'announcements'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-green-500'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Departments Tab */}
        {activeTab === 'departments' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Departments</h2>
            
            <div className="mb-6 flex gap-3">
              <input
                type="text"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                placeholder="Enter department name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleAddDepartment}
                disabled={loading}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
              >
                <Plus size={20} /> Add
              </button>
            </div>

            <div className="space-y-2">
              {departments.map(dept => (
                <div key={dept} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">{dept}</span>
                  <button
                    onClick={() => handleRemoveDepartment(dept)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              {departments.length === 0 && (
                <p className="text-gray-500 text-center py-8">No departments added yet</p>
              )}
            </div>
          </div>
        )}

        {/* Roles Tab */}
        {activeTab === 'roles' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Roles</h2>
            
            <div className="mb-6 flex gap-3">
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="Enter role name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleAddRole}
                disabled={loading}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
              >
                <Plus size={20} /> Add
              </button>
            </div>

            <div className="space-y-2">
              {roles.map(role => (
                <div key={role.type} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">{role.type}</span>
                  <div className="flex gap-2">
                  
                    <button
                      onClick={() => handleRemoveRole(role.type)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
              {roles.length === 0 && (
                <p className="text-gray-500 text-center py-8">No roles added yet</p>
              )}
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Announcements</h2>
            
            <button
              onClick={() => {
                setShowAnnouncementModal(true);
                setAnnouncementForm({ message: '', imageURL: '', link: '' });
              }}
              className="mb-6 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
            >
              <Plus size={20} /> {announcement ? 'Edit' : 'Post'} Announcement
            </button>

            {announcement && (
              <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-l-4 border-green-500">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Current Announcement</h3>
                  <button
                    onClick={handleDeleteAnnouncement}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <p className="text-gray-700 mb-3">{announcement.message}</p>
                {announcement.imageURL && (
                  <img src={announcement.imageURL} alt="announcement" className="max-w-xs rounded-lg mb-3" />
                )}
                {announcement.link && (
                  <p className="text-blue-600 underline mb-2"><a href={announcement.link} target="_blank" rel="noopener noreferrer">{announcement.link}</a></p>
                )}
                <p className="text-sm text-gray-500">Expires: {new Date(announcement.duration).toLocaleString()}</p>
              </div>
            )}

            {!announcement && (
              <p className="text-gray-500 text-center py-8">No active announcement</p>
            )}
          </div>
        )}
      </div>

      {/* Permission Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Edit Permissions - {selectedRole?.type}</h3>
              <button
                onClick={() => setShowPermissionModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {permissionsList.map(perm => (
                <label key={perm} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={rolePermissions[perm] || false}
                    onChange={() => handlePermissionChange(perm)}
                    className="w-4 h-4 text-green-500 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">{perm}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSavePermissions}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setShowPermissionModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">{announcement ? 'Edit' : 'Post'} Announcement</h3>
              <button
                onClick={() => setShowAnnouncementModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={announcementForm.message}
                  onChange={(e) => setAnnouncementForm({...announcementForm, message: e.target.value})}
                  placeholder="Enter announcement message"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={announcementForm.imageURL}
                  onChange={(e) => setAnnouncementForm({...announcementForm, imageURL: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                <input
                  type="text"
                  value={announcementForm.link}
                  onChange={(e) => setAnnouncementForm({...announcementForm, link: e.target.value})}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={announcement ? handleUpdateAnnouncement : handlePostAnnouncement}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => setShowAnnouncementModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemManagement;