// src/components/layout/Navbar.jsx
import { useState, useContext } from 'react';
import { Bell, Menu, Search, User } from 'lucide-react';
import Notifications from '@/components/ui/Notifications';
import NavProfile from '@/components/ui/NavProfile';
import { AuthContext } from '@/context/AuthContext';

const Header = ({ onMenuClick = () => {} }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { userId, userRole } = useContext(AuthContext); // Assuming userId or userRole can help fetch user data

  // Dummy user data (replace with dynamic fetch if needed)
  const user = {
    name: userRole === 'admin' ? 'Admin User' : 'Employee User', // Placeholder, update with actual user data
    email: 'user@example.com', // Placeholder, update with actual user data
  };

  const totalUnread = 5;

  const dummyNotifications = [
    {
      type: 'New Message',
      message: 'You have received a new message from John.',
      createdAt: '2025-07-27 14:30',
    },
    {
      type: 'System Alert',
      message: 'Scheduled maintenance will occur at midnight.',
      createdAt: '2025-07-27 09:15',
    },
  ];

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

            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#acc6aa] focus:border-transparent"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg relative"
              >
                <Bell className="w-5 h-5" />
                {totalUnread > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {totalUnread}
                  </span>
                )}
              </button>

              {showNotifications && (
                <Notifications notifications={dummyNotifications} />
              )}
            </div>

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

              {showProfile && <NavProfile user={user} />}
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to retain layout flow */}
      <div className="h-[72px]"></div> {/* Adjust height as per your actual header height */}
    </>
  );
};

export default Header;