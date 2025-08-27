import { useState, useEffect } from 'react';

// Custom hook for managing meetings data and operations
export const useMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Initialize mock data
  useEffect(() => {
    // Mock employees data
    const mockEmployees = [
      { _id: '1', name: 'John Doe', email: 'john@company.com' },
      { _id: '2', name: 'Jane Smith', email: 'jane@company.com' },
      { _id: '3', name: 'Mike Johnson', email: 'mike@company.com' },
      { _id: '4', name: 'Sarah Wilson', email: 'sarah@company.com' }
    ];
    setEmployees(mockEmployees);

    // Mock meetings data
    const mockMeetings = [
      {
        _id: '1',
        title: 'Weekly Team Standup',
        description: 'Weekly sync for development team',
        startTime: '2025-08-29T09:00:00Z',
        endTime: '2025-08-29T10:00:00Z',
        status: 'planned',
        employees: [mockEmployees[0], mockEmployees[1]],
        createdBy: mockEmployees[0],
        clients: [{ name: 'ABC Corp', email: 'contact@abc.com' }]
      },
      {
        _id: '2',
        title: 'Project Review',
        description: 'Review Q3 project deliverables',
        startTime: '2025-08-30T14:00:00Z',
        endTime: '2025-08-30T15:30:00Z',
        status: 'completed',
        employees: [mockEmployees[0], mockEmployees[2], mockEmployees[3]],
        createdBy: mockEmployees[0],
        clients: []
      },
      {
        _id: '3',
        title: 'Client Presentation',
        description: 'Present final designs to client',
        startTime: '2025-08-28T16:00:00Z',
        endTime: '2025-08-28T17:00:00Z',
        status: 'cancelled',
        employees: [mockEmployees[1], mockEmployees[3]],
        createdBy: mockEmployees[1],
        clients: [{ name: 'XYZ Inc', email: 'info@xyz.com' }]
      }
    ];
    setMeetings(mockMeetings);
  }, []);

  const createMeeting = (formData) => {
    const newMeeting = {
      _id: Date.now().toString(),
      ...formData,
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
      employees: employees.filter(emp => formData.employees.includes(emp._id)),
      createdBy: employees[0] // Mock current user
    };
    setMeetings(prev => [...prev, newMeeting]);
    return newMeeting;
  };

  const updateMeeting = (meetingId, formData) => {
    setMeetings(prev => prev.map(meeting =>
      meeting._id === meetingId
        ? {
            ...meeting,
            ...formData,
            startTime: new Date(formData.startTime).toISOString(),
            endTime: new Date(formData.endTime).toISOString(),
            employees: employees.filter(emp => formData.employees.includes(emp._id))
          }
        : meeting
    ));
  };

  const deleteMeeting = (meetingId) => {
    setMeetings(prev => prev.filter(meeting => meeting._id !== meetingId));
  };

  return {
    meetings,
    employees,
    createMeeting,
    updateMeeting,
    deleteMeeting
  };
};

// Custom hook for filtering meetings
export const useFilteredMeetings = (meetings, filters) => {
  const [filteredMeetings, setFilteredMeetings] = useState([]);

  useEffect(() => {
    let filtered = meetings;
    const { searchQuery, filterStatus, filterDate } = filters;

    // Apply search filter
    if (searchQuery && searchQuery.trim()) {
      filtered = filtered.filter(meeting =>
        meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meeting.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meeting.employees.some(emp => emp.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    if (filterStatus && filterStatus !== 'all') {
      filtered = filtered.filter(meeting => meeting.status === filterStatus);
    }

    // Apply date filter
    if (filterDate) {
      filtered = filtered.filter(meeting => {
        const meetingDate = new Date(meeting.startTime).toISOString().split('T')[0];
        return meetingDate === filterDate;
      });
    }

    setFilteredMeetings(filtered);
  }, [meetings, filters]);

  return filteredMeetings;
};