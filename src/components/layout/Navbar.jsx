// src/components/layout/Navbar.jsx
import { useState, useContext } from 'react';
import { Bell, Menu, Search, User } from 'lucide-react';
import Notifications from '@/components/ui/Notifications';
import NavProfile from '@/components/ui/NavProfile';
import { AuthContext } from '@/context/authContext';

const Header = ({ onMenuClick = () => {} }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const {name,email, logout } = useContext(AuthContext); // Assuming userId or userRole can help fetch user data

  // Dummy user data (replace with dynamic fetch if needed)
  const user = {
   name, // Placeholder, update with actual user data
    email, // Placeholder, update with actual user data
  };
  console.log(user.name,user.email)


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

              {showProfile && <NavProfile logout={logout} user={user} />}
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