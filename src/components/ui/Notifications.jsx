import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const Notifications = ({notifications}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification, i) => (
          <div
            key={i}
            className="p-4 border-b border-gray-100 hover:bg-gray-50"
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-[#acc6aa] rounded-full flex items-center justify-center">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {notification.type}
                </p>
                <p className="text-xs text-gray-500">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">{notification.createdAt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-2 border-t border-gray-200">
        <button className="w-full text-center text-sm text-[#acc6aa] hover:bg-gray-50 py-2 rounded">
          View all notifications
        </button>
      </div>
    </motion.div>
  );
};

export default Notifications;
