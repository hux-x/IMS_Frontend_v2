// src/components/ui/Toast.jsx
import React, { useEffect } from 'react';
import { X, MessageCircle, AtSign } from 'lucide-react';

const Toast = ({ message, sender, onClose, onClick, isMention = false, autoClose = 12000 }) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  return (
    <div 
      className="animate-slide-in cursor-pointer"
      onClick={() => {
        onClick();
        onClose();
      }}
    >
      <div className={`bg-white rounded-lg shadow-lg border ${
        isMention ? 'border-yellow-400 ring-2 ring-yellow-200' : 'border-gray-200'
      } p-4 min-w-[320px] max-w-md hover:shadow-xl transition-shadow`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-full ${
              isMention ? 'bg-yellow-500' : 'bg-blue-500'
            } flex items-center justify-center text-white`}>
              {isMention ? (
                <AtSign className="w-5 h-5" />
              ) : (
                <MessageCircle className="w-5 h-5" />
              )}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
              {isMention && (
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                  Mentioned you
                </span>
              )}
              <span>{sender}</span>
            </p>
            <p className="text-sm text-gray-600 line-clamp-2">
              {message}
            </p>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

// Toast Container to manage multiple toasts
export const ToastContainer = ({ toasts, removeToast, onToastClick }) => {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          sender={toast.sender}
          isMention={toast.isMention}
          onClick={() => onToastClick(toast.chatId)}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast;