import React, { useState } from 'react';
import { Plus, AlertTriangle, RefreshCw } from 'lucide-react';
import useMeetings from '@/hooks/useMeetings';
import MeetingStats from '@/components/meetings/Meetingstats';
import MeetingFilters from '@/components/meetings/MeetingFilters';
import MeetingList from '@/components/meetings/MeetingList';
import MeetingModals from '@/components/modals/Meetings';

const MeetingDashboard = () => {
  const {
    meetings,
    employees,
    loading,
    error,
    filters,
    pagination,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    applyFilters,
    clearFilters,
    refreshMeetings,
    getMeetingStats,
    loadMore
  } = useMeetings();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleCreateMeeting = async (formData) => {
    setActionLoading(true);
    try {
      console.log('Creating meeting with data:', formData);
      const result = await createMeeting(formData);
      if (result.success) {
        setShowCreateModal(false);
        // Success notification would go here
        alert('Meeting created successfully!');
      } else {
        // Error notification would go here
        console.error('Create meeting error:', result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error('Create meeting exception:', err);
      alert('Failed to create meeting');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateMeeting = async (formData) => {
    if (!currentMeeting) return;
    
    setActionLoading(true);
    try {
      console.log('Updating meeting with data:', formData);
      const result = await updateMeeting(currentMeeting._id || currentMeeting.id, formData);
      if (result.success) {
        setShowEditModal(false);
        setCurrentMeeting(null);
        alert('Meeting updated successfully!');
      } else {
        console.error('Update meeting error:', result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error('Update meeting exception:', err);
      alert('Failed to update meeting');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    if (!window.confirm('Are you sure you want to delete this meeting?')) {
      return;
    }

    setActionLoading(true);
    try {
      const result = await deleteMeeting(meetingId);
      if (result.success) {
        alert('Meeting deleted successfully!');
      } else {
        console.error('Delete meeting error:', result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error('Delete meeting exception:', err);
      alert('Failed to delete meeting');
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewMeeting = (meeting) => {
    console.log('Viewing meeting:', meeting);
    setCurrentMeeting(meeting);
    setShowViewModal(true);
  };

  const handleEditMeeting = (meeting) => {
    console.log('Editing meeting:', meeting);
    setCurrentMeeting(meeting);
    setShowEditModal(true);
  };

  const handleFilterChange = (filterType, value) => {
    console.log('Filter change:', filterType, value);
    applyFilters({ [filterType]: value });
  };

  const handleClearFilters = () => {
    console.log('Clearing filters');
    clearFilters();
  };

  const handleCreateModalClose = () => {
    setShowCreateModal(false);
    setCurrentMeeting(null);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setCurrentMeeting(null);
  };

  const handleViewModalClose = () => {
    setShowViewModal(false);
    setCurrentMeeting(null);
  };

  const stats = getMeetingStats();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full mx-4">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertTriangle size={24} />
            <h2 className="text-lg font-semibold">Error Loading Meetings</h2>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refreshMeetings}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center gap-3">
              <button
                onClick={refreshMeetings}
                disabled={loading}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                title="Refresh meetings"
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                disabled={loading || actionLoading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2 font-medium"
              >
                <Plus size={20} />
                New Meeting
              </button>
            </div>
          </div>

          {/* Filters */}
          <MeetingFilters
            searchQuery={filters.searchQuery}
            setSearchQuery={(value) => handleFilterChange('searchQuery', value)}
            filterStatus={filters.status}
            setFilterStatus={(value) => handleFilterChange('status', value)}
            filterDate={filters.date}
            setFilterDate={(value) => handleFilterChange('date', value)}
            onClearFilters={handleClearFilters}
            loading={loading}
          />
        </div>

        {/* Meeting Stats */}
        <MeetingStats 
          meetings={meetings} 
          stats={stats}
          loading={loading}
        />

        {/* Meetings List */}
        <MeetingList
          meetings={meetings}
          totalMeetings={stats.total}
          loading={loading}
          pagination={pagination}
          onView={handleViewMeeting}
          onEdit={handleEditMeeting}
          onDelete={handleDeleteMeeting}
          onLoadMore={loadMore}
          actionLoading={actionLoading}
        />

        {/* Load More Button */}
        {pagination.hasMore && !loading && (
          <div className="flex justify-center mt-6">
            <button
              onClick={loadMore}
              disabled={actionLoading}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2"
            >
              {actionLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More Meetings'
              )}
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && meetings.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center gap-3 text-gray-600">
              <RefreshCw size={20} className="animate-spin" />
              <span>Loading meetings...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && meetings.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Plus size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings found</h3>
            <p className="text-gray-600 mb-4">
              {Object.values(filters).some(f => f && f !== 'all') 
                ? 'No meetings match your current filters. Try adjusting your search criteria.'
                : 'Get started by creating your first meeting.'
              }
            </p>
            {Object.values(filters).some(f => f && f !== 'all') ? (
              <button
                onClick={handleClearFilters}
                className="text-blue-600 hover:text-blue-700 font-medium"
                disabled={loading}
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={loading || actionLoading}
              >
                Create First Meeting
              </button>
            )}
          </div>
        )}

        {/* Modals */}
        <MeetingModals
          showCreateModal={showCreateModal}
          showEditModal={showEditModal}
          showViewModal={showViewModal}
          currentMeeting={currentMeeting}
          employees={employees}
          onCreateSubmit={handleCreateMeeting}
          onEditSubmit={handleUpdateMeeting}
          onCloseCreate={handleCreateModalClose}
          onCloseEdit={handleEditModalClose}
          onCloseView={handleViewModalClose}
          loading={actionLoading}
        />
      </div>
    </div>
  );
};

export default MeetingDashboard;