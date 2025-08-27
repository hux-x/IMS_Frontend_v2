// Utility functions for meeting management

// Format date and time
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    fullDateTime: date.toLocaleString()
  };
};

// Get status badge styling
export const getStatusBadge = (status) => {
  const statusStyles = {
    planned: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  
  return {
    className: `px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`,
    text: status.charAt(0).toUpperCase() + status.slice(1)
  };
};

// Validate meeting form data
export const validateMeetingForm = (formData) => {
  const errors = [];

  if (!formData.title || !formData.title.trim()) {
    errors.push('Title is required');
  }

  if (!formData.startTime) {
    errors.push('Start time is required');
  }

  if (!formData.endTime) {
    errors.push('End time is required');
  }

  if (formData.startTime && formData.endTime) {
    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      errors.push('End time must be after start time');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Generate meeting statistics
export const generateMeetingStats = (meetings) => {
  return {
    total: meetings.length,
    planned: meetings.filter(m => m.status === 'planned').length,
    completed: meetings.filter(m => m.status === 'completed').length,
    cancelled: meetings.filter(m => m.status === 'cancelled').length
  };
};

// Sort meetings by date
export const sortMeetingsByDate = (meetings, ascending = true) => {
  return [...meetings].sort((a, b) => {
    const dateA = new Date(a.startTime);
    const dateB = new Date(b.startTime);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

// Filter meetings by date range
export const filterMeetingsByDateRange = (meetings, startDate, endDate) => {
  if (!startDate && !endDate) return meetings;
  
  return meetings.filter(meeting => {
    const meetingDate = new Date(meeting.startTime);
    
    if (startDate && endDate) {
      return meetingDate >= new Date(startDate) && meetingDate <= new Date(endDate);
    } else if (startDate) {
      return meetingDate >= new Date(startDate);
    } else {
      return meetingDate <= new Date(endDate);
    }
  });
};

// Get upcoming meetings
export const getUpcomingMeetings = (meetings, days = 7) => {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + days);
  
  return meetings.filter(meeting => {
    const meetingDate = new Date(meeting.startTime);
    return meetingDate >= now && meetingDate <= futureDate && meeting.status === 'planned';
  });
};

// Calculate meeting duration
export const calculateMeetingDuration = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs = end - start;
  
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// Export meeting data to CSV
export const exportMeetingsToCSV = (meetings) => {
  const headers = ['Title', 'Description', 'Start Time', 'End Time', 'Status', 'Participants', 'Clients'];
  
  const csvData = meetings.map(meeting => [
    meeting.title,
    meeting.description || '',
    new Date(meeting.startTime).toLocaleString(),
    new Date(meeting.endTime).toLocaleString(),
    meeting.status,
    meeting.employees.map(emp => emp.name).join('; '),
    meeting.clients?.filter(c => c.name).map(c => c.name).join('; ') || ''
  ]);
  
  const csvContent = [headers, ...csvData]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
  
  return csvContent;
};

// Search meetings by multiple criteria
export const searchMeetings = (meetings, searchQuery) => {
  if (!searchQuery || !searchQuery.trim()) {
    return meetings;
  }
  
  const query = searchQuery.toLowerCase();
  
  return meetings.filter(meeting => 
    meeting.title.toLowerCase().includes(query) ||
    meeting.description?.toLowerCase().includes(query) ||
    meeting.employees.some(emp => emp.name.toLowerCase().includes(query)) ||
    meeting.clients?.some(client => client.name?.toLowerCase().includes(query)) ||
    meeting.status.toLowerCase().includes(query)
  );
};