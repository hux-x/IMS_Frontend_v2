import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  MessageCircle, 
  Calendar, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut,
  Shield,
  UserCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import  useSection  from '@/hooks/useSection';


const Sidebar = ({ isOpen }) => {
 
  const location = useLocation();
  const {toggleSection} = useSection();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: 'dashboard' },
    { name: 'Tasks', icon: CheckSquare, path: 'tasks' },
    { name: 'Chat', icon: MessageCircle, path: 'chat' },
    { name: 'Attendance', icon: Calendar, path: 'attendance' },
    { name: 'Admin Panel', icon: Shield, path: 'admin' },
    { name: 'Reports', icon: BarChart3, path: 'reports' },
    { name: 'Teams', icon: Users, path: 'teams' },
    { name: 'Employees', icon: UserCircle, path: 'employees' }
     
  ];

  const sidebarVariants = {
    closed: { x: '-100%' },
    open: { x: 0 }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <>
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-[#acc6aa] to-[#71a0a5]">
            <h1 className="text-xl font-bold text-white">CompanyMS</h1>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#acc6aa] rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                 H
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Hasnain</p>
                <p className="text-xs text-gray-500 capitalize">Admin</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <div
                  key={item.name}
                  variants={itemVariants}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={()=>toggleSection(item.path)}
                    className={`
                      flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive 
                        ? 'bg-[#acc6aa] text-white shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-[#acc6aa]'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </button>
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;