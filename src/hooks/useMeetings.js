import { useState, useEffect, useCallback } from 'react';
import meetingService from '@/apis/services/meetingService';

const useMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    limit: 50,
    offset: 0,
    totalCount: 0,
    hasMore: false
  });

  const [filters, setFilters] = useState({
    status: 'all',
    date: '',
    searchQuery: '',
    employeeId: '',
    startDate: '',
    endDate: ''
  });

  const fetchMeetings = useCallback(async (customFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const finalFilters = { ...filters, ...customFilters };
      const { status, date, searchQuery, employeeId, startDate, endDate } = finalFilters;

      let response;

      if (status === 'all' && !date && !searchQuery && !employeeId && !startDate && !endDate) {
        response = await meetingService.getAllMeetings(pagination.limit, pagination.offset);
      } else {
        const filterParams = {
          limit: pagination.limit,
          offset: pagination.offset,
          ...(status !== 'all' && { status }),
          ...(date && { date }),
          ...(searchQuery && { title: searchQuery }),
          ...(employeeId && { employeeId }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate })
        };

        response = await meetingService.getFilteredMeetings(filterParams);
      }

      if (response?.data) {
        const meetingsData = response.data.meetings || response.data;
        setMeetings(meetingsData);
        setFilteredMeetings(meetingsData);

        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (err) {
      console.error('Error fetching meetings:', err);
      setError(err.response?.data?.message || 'Failed to fetch meetings');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit, pagination.offset]);

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await meetingService.getEmployeesForMeeting();
      if (response?.data) {
        setEmployees(response.data);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const createMeeting = async (meetingData) => {
    try {
      setLoading(true);
      setError(null);

      const validation = meetingService.validateMeetingTime(
        meetingData.startTime,
        meetingData.endTime
      );

      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const response = await meetingService.createMeeting(meetingData);
      
      if (response?.data) {
        await fetchMeetings();
        return { success: true, data: response.data };
      }
    } catch (err) {
      console.error('Error creating meeting:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create meeting';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateMeeting = async (meetingId, updateData) => {
    try {
      setLoading(true);
      setError(null);

      if (updateData.startTime && updateData.endTime) {
        const validation = meetingService.validateMeetingTime(
          updateData.startTime,
          updateData.endTime
        );

        if (!validation.isValid) {
          throw new Error(validation.error);
        }
      }

      const response = await meetingService.updateMeeting(meetingId, updateData);
      
      if (response?.data) {
        await fetchMeetings();
        return { success: true, data: response.data };
      }
    } catch (err) {
      console.error('Error updating meeting:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update meeting';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteMeeting = async (meetingId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await meetingService.deleteMeeting(meetingId);
      
      if (response?.data) {
        await fetchMeetings();
        return { success: true };
      }
    } catch (err) {
      console.error('Error deleting meeting:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete meeting';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getMeetingById = async (meetingId) => {
    try {
      setLoading(true);
      const response = await meetingService.getMeetingById(meetingId);
      return response?.data || null;
    } catch (err) {
      console.error('Error fetching meeting:', err);
      setError(err.response?.data?.message || 'Failed to fetch meeting');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, offset: 0 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      status: 'all',
      date: '',
      searchQuery: '',
      employeeId: '',
      startDate: '',
      endDate: ''
    });
    setPagination(prev => ({ ...prev, offset: 0 }));
  }, []);

  const loadMore = useCallback(() => {
    if (pagination.hasMore && !loading) {
      setPagination(prev => ({
        ...prev,
        offset: prev.offset + prev.limit
      }));
    }
  }, [pagination.hasMore, loading]);

  const refreshMeetings = useCallback(() => {
    setPagination(prev => ({ ...prev, offset: 0 }));
    fetchMeetings();
  }, [fetchMeetings]);

  const getMeetingStats = useCallback(() => {
    const stats = {
      total: meetings.length,
      planned: meetings.filter(m => m.status === 'planned').length,
      completed: meetings.filter(m => m.status === 'completed').length,
      cancelled: meetings.filter(m => m.status === 'cancelled').length,
      today: meetings.filter(m => {
        const today = new Date().toDateString();
        const meetingDate = new Date(m.startTime).toDateString();
        return meetingDate === today;
      }).length,
      upcoming: meetings.filter(m => {
        const now = new Date();
        const meetingStart = new Date(m.startTime);
        return meetingStart > now && m.status === 'planned';
      }).length
    };
    return stats;
  }, [meetings]);

  return {
    // State
    meetings: filteredMeetings,
    employees,
    loading,
    error,
    filters,
    pagination,

    // Actions
    createMeeting,
    updateMeeting,
    deleteMeeting,
    getMeetingById,
    
    // Filter actions
    applyFilters,
    clearFilters,
    
    // Pagination
    loadMore,
    
    // Utility
    refreshMeetings,
    getMeetingStats,
    
    // Helper methods
    validateMeetingTime: meetingService.validateMeetingTime,
    formatMeetingForCalendar: meetingService.formatMeetingForCalendar
  };
};

export default useMeetings;