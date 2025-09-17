// src/components/ui/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'blue' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    gray: 'text-gray-600'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-current ${sizeClasses[size]} ${colorClasses[color]}`}>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// src/components/ui/ErrorMessage.jsx
const ErrorMessage = ({ message, onRetry, onDismiss, type = 'error' }) => {
  const typeStyles = {
    error: {
      container: 'bg-red-50 border-red-200',
      icon: 'text-red-400',
      title: 'text-red-800',
      message: 'text-red-700',
      button: 'bg-red-100 hover:bg-red-200 text-red-800'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-400',
      title: 'text-yellow-800',
      message: 'text-yellow-700',
      button: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
    },
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-400',
      title: 'text-blue-800',
      message: 'text-blue-700',
      button: 'bg-blue-100 hover:bg-blue-200 text-blue-800'
    }
  };

  const styles = typeStyles[type] || typeStyles.error;

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return (
          <svg className={`w-5 h-5 ${styles.icon}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className={`w-5 h-5 ${styles.icon}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className={`w-5 h-5 ${styles.icon}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className={`rounded-md p-4 border ${styles.container}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${styles.title}`}>
            {type === 'error' && 'Error'}
            {type === 'warning' && 'Warning'}
            {type === 'info' && 'Information'}
          </h3>
          <div className={`mt-2 text-sm ${styles.message}`}>
            <p>{message}</p>
          </div>
          {(onRetry || onDismiss) && (
            <div className="mt-4 flex space-x-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${styles.button}`}
                >
                  Try Again
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className={`-mx-1.5 -my-1.5 rounded-md p-1.5 inline-flex items-center justify-center ${styles.icon} hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
            >
              <span className="sr-only">Dismiss</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// src/components/ui/StatCard.jsx
const StatCard = ({ title, value, icon, trend, color = 'blue' }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      value: 'text-blue-900',
      trend: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      value: 'text-green-900',
      trend: 'text-green-600'
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      value: 'text-red-900',
      trend: 'text-red-600'
    },
    yellow: {
      bg: 'bg-yellow-50',
      icon: 'text-yellow-600',
      value: 'text-yellow-900',
      trend: 'text-yellow-600'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      value: 'text-purple-900',
      trend: 'text-purple-600'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          <div className={`w-8 h-8 ${colors.icon}`}>
            {icon}
          </div>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-baseline">
            <p className={`text-2xl font-semibold ${colors.value}`}>{value}</p>
            {trend && (
              <p className={`ml-2 text-sm font-medium ${colors.trend}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// src/components/ui/EmptyState.jsx
const EmptyState = ({ 
  title, 
  description, 
  icon, 
  action, 
  actionText = 'Get Started' 
}) => {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
        {icon || (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      {action && (
        <button
          onClick={action}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export { LoadingSpinner, ErrorMessage, StatCard, EmptyState };
export default LoadingSpinner;