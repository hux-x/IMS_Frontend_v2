import { User } from "lucide-react";
import { motion } from "framer-motion";
const NavProfile = ({ user,logout }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      <div className="p-4 border-b border-gray-200">
        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
        <p className="text-xs text-gray-500">{user?.email}</p>
      </div>
      <div className="py-2">
        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>
        <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
          <span>Logout</span>
        </button>
      </div>
    </motion.div>
  );
};

export default NavProfile;
