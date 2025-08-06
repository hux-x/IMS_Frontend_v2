import React from 'react';

const Badge = ({ className = '', children, ...props }) => (
  <div
    className={`inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Badge;