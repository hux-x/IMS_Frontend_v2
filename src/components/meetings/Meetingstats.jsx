import React from 'react';
import { Calendar, Clock, Users, X } from 'lucide-react';

const MeetingStats = ({ meetings }) => {
  const stats = [
    { 
      label: 'Total Meetings', 
      count: meetings.length, 
      color: 'blue', 
      icon: Calendar 
    },
    { 
      label: 'Planned', 
      count: meetings.filter(m => m.status === 'planned').length, 
      color: 'yellow', 
      icon: Clock 
    },
    { 
      label: 'Completed', 
      count: meetings.filter(m => m.status === 'completed').length, 
      color: 'green', 
      icon: Users 
    },
    { 
      label: 'Cancelled', 
      count: meetings.filter(m => m.status === 'cancelled').length, 
      color: 'red', 
      icon: X 
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600' },
      red: { bg: 'bg-red-100', text: 'text-red-600' }
    };
    return colorMap[color] || { bg: 'bg-gray-100', text: 'text-gray-600' };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => {
        const colors = getColorClasses(stat.color);
        return (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${colors.bg}`}>
                <stat.icon className={`h-6 w-6 ${colors.text}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MeetingStats;