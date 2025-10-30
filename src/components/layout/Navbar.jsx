import { useState, useContext, useEffect } from 'react';
import { Bell, Menu, Search, User, X } from 'lucide-react';
import { AuthContext } from '@/context/authContext';
import authService from '@/apis/services/authService';

const EditProfileModal = ({ isOpen, onClose, userInfo, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    age: '',
    CNIC: '',
    emergencyContact: '',
    contact: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || '',
        username: userInfo.username || '',
        email: userInfo.email || '',
        age: userInfo.age || '',
        CNIC: userInfo.CNIC || '',
        emergencyContact: userInfo.emergencyContact || '',
        contact: userInfo.contact || '',
        address: userInfo.address || ''
      });
    }
  }, [userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updates = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== userInfo[key]) {
          updates[key] = formData[key];
        }
      });

      if (Object.keys(updates).length === 0) {
        setError('No changes detected');
        setLoading(false);
        return;
      }

      await authService.updateEmployeeInfo(userInfo._id, updates);
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        onUpdate();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#acc6aa] focus:border-transparent"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#acc6aa] focus:border-transparent"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#acc6aa] focus:border-transparent"
                required
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="18"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#acc6aa] focus:border-transparent"
                required
              />
            </div>

            {/* CNIC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CNIC
              </label>
              <input
                type="text"
                name="CNIC"
                value={formData.CNIC}
                onChange={handleChange}
                placeholder="12345-1234567-1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#acc6aa] focus:border-transparent"
                required
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="+92 300 1234567"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#acc6aa] focus:border-transparent"
                required
              />
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Contact
              </label>
              <input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                placeholder="+92 300 1234567"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#acc6aa] focus:border-transparent"
                required
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#acc6aa] focus:border-transparent resize-none"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 text-white bg-[#acc6aa] hover:bg-[#9bb599] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavProfile = ({ logout, user, onEditClick }) => {
  return (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
        <p className="text-xs text-gray-500">{user?.email}</p>
      </div>
      <button
        onClick={onEditClick}
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        Edit Profile
      </button>
      <button
        onClick={logout}
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        Logout
      </button>
    </div>
  );
};

const Header = ({ onMenuClick = () => {} }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { name, email, logout } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);

  const getUserInfo = async () => {
    try {
      const res = await authService.getUserInfo();
      if (res && res.data) {
        setUserInfo(res.data.employee);
        console.log(res.data.employee, "USER INFO");
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const user = {
    name,
    email,
  };

  const handleEditClick = () => {
    setShowProfile(false);
    setShowEditModal(true);
  };

  const handleUpdateSuccess = () => {
    getUserInfo(); // Refresh user info after update
  };

  return (
    <>
      {/* Fixed Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-64 right-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-8 h-8 bg-[#acc6aa] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="hidden md:block text-sm font-medium">
                  {user?.name}
                </span>
              </button>

              {showProfile && (
                <NavProfile 
                  logout={logout} 
                  user={user} 
                  onEditClick={handleEditClick}
                />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        userInfo={userInfo}
        onUpdate={handleUpdateSuccess}
      />

      {/* Spacer to retain layout flow */}
      <div className="h-[72px]"></div>
    </>
  );
};

export default Header;