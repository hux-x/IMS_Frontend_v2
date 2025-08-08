import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomMarker = ({
  item,
  onComplete,
  onToggleBox,
}) => {
  const handleComplete = () => {
    if (!item?.completed) {
      onComplete(item?.id);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ transform: 'translate(-50%, -50%)' }}
    >
      {/* Marker Number Badge */}
      {item?.persistentIndex && (
        <div className="absolute -top-5 -right-2 bg-blue-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold select-none pointer-events-none">
          {item.persistentIndex}
        </div>
      )}

      {/* Marker Dot */}
      <div
        className={`w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-pointer transition-all duration-200 ${
          item?.completed ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'
        }`}
        onClick={() => onToggleBox(item?.id)}
      />

      {/* Info Box */}
      <AnimatePresence>
        {item?.showBox && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-6 left-1/2 z-10 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-3 transform -translate-x-1/2"
          >
            {/* Description */}
            <div className="mb-3">
              <p className="text-sm text-gray-700 leading-relaxed">
                {item?.description || 'No description provided.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleComplete}
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  item?.completed
                    ? 'bg-green-100 text-green-700 cursor-default'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                disabled={item?.completed}
              >
                {item?.completed ? '✓ Completed' : 'Complete Task'}
              </button>
            </div>

            {/* Arrow */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomMarker;