// src/components/layout/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  MessageCircle,
  Calendar,
  BarChart3,
  Users,
  UserCircle,
  LogOut,
  Group,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContext } from 'react';
import { AuthContext } from '@/context/authContext';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const { userRole, logout, unread } = useContext(AuthContext);

  // Define menu items with role-based access
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['admin', 'employee'] },
    { name: 'Tasks', icon: CheckSquare, path: '/tasks', roles: ['admin'] },
    { name: 'Chat', icon: MessageCircle, path: '/chat', roles: ['admin', 'employee'], showBadge: true },
    { name: 'Attendance', icon: Calendar, path: '/attendance', roles: ['admin'] },
    { name: 'Reports', icon: BarChart3, path: '/reports', roles: ['admin'] },
    { name: 'Teams', icon: Users, path: '/teams', roles: ['admin'] },
    { name: 'Employees', icon: UserCircle, path: '/employees', roles: ['admin'] },
    { name: 'Project Proposed', icon: UserCircle, path: '/projectproposed', roles: ['admin'] },
    { name: 'Meetings', icon: Group, path: '/meetings', roles: ['admin'] },
    { name: 'Admin Panel', icon: Group, path: '/admin', roles: ['admin'] },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={isOpen ? { x: 0 } : { x: '-100%' }}
      className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-[#acc6aa] to-[#71a0a5]">
          <h1 className="text-xl font-bold text-white">CompanyMS</h1>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const showUnreadBadge = item.showBadge && unread > 0;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#acc6aa] text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-[#acc6aa]'
                }`}
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </div>
                
                {showUnreadBadge && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="relative"
                    >
                      <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
                        {unread > 99 ? '99+' : unread}
                      </span>
                      <span className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></span>
                    </motion.div>
                  </AnimatePresence>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;