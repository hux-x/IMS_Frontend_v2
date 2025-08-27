import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import MeetingStats from '@/components/meetings/Meetingstats';
import MeetingFilters from '@/components/meetings/MeetingFilters';
import MeetingList from '@/components/meetings/MeetingList';
import MeetingModals from '@/components/modals/Meetings';

const MeetingDashboard = () => {
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data initialization
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

  // Filter meetings based on search and filter criteria
  useEffect(() => {
    let filtered = meetings;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(meeting =>
        meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meeting.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meeting.employees.some(emp => emp.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
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
  }, [meetings, filterStatus, filterDate, searchQuery]);

  // Meeting CRUD operations
  const handleCreateMeeting = (formData) => {
    const newMeeting = {
      _id: Date.now().toString(),
      ...formData,
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
      employees: employees.filter(emp => formData.employees.includes(emp._id)),
      createdBy: employees[0] // Mock current user
    };
    setMeetings([...meetings, newMeeting]);
    setShowCreateModal(false);
    alert('Meeting created successfully!');
  };

  const handleUpdateMeeting = (formData) => {
    const updatedMeetings = meetings.map(meeting =>
      meeting._id === currentMeeting._id
        ? {
            ...meeting,
            ...formData,
            startTime: new Date(formData.startTime).toISOString(),
            endTime: new Date(formData.endTime).toISOString(),
            employees: employees.filter(emp => formData.employees.includes(emp._id))
          }
        : meeting
    );
    setMeetings(updatedMeetings);
    setShowEditModal(false);
    setCurrentMeeting(null);
    alert('Meeting updated successfully!');
  };

  const handleDeleteMeeting = (meetingId) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      setMeetings(meetings.filter(meeting => meeting._id !== meetingId));
      alert('Meeting deleted successfully!');
    }
  };

  // Modal handlers
  const handleViewMeeting = (meeting) => {
    setCurrentMeeting(meeting);
    setShowViewModal(true);
  };

  const handleEditMeeting = (meeting) => {
    setCurrentMeeting(meeting);
    setShowEditModal(true);
  };

  const handleClearFilters = () => {
    setFilterStatus('all');
    setFilterDate('');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meeting Management</h1>
              <p className="text-gray-600 mt-1">Create, manage, and track all your meetings</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
            >
              <Plus size={20} />
              New Meeting
            </button>
          </div>

          {/* Filters */}
          <MeetingFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterDate={filterDate}
            setFilterDate={setFilterDate}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Meeting Stats */}
        <MeetingStats meetings={meetings} />

        {/* Meetings List */}
        <MeetingList
          meetings={filteredMeetings}
          totalMeetings={meetings.length}
          onView={handleViewMeeting}
          onEdit={handleEditMeeting}
          onDelete={handleDeleteMeeting}
        />

        {/* Modals */}
        <MeetingModals
          showCreateModal={showCreateModal}
          showEditModal={showEditModal}
          showViewModal={showViewModal}
          currentMeeting={currentMeeting}
          employees={employees}
          onCreateSubmit={handleCreateMeeting}
          onEditSubmit={handleUpdateMeeting}
          onCloseCreate={() => setShowCreateModal(false)}
          onCloseEdit={() => {
            setShowEditModal(false);
            setCurrentMeeting(null);
          }}
          onCloseView={() => setShowViewModal(false)}
        />
      </div>
    </div>
  );
};

export default MeetingDashboard;