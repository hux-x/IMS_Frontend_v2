import { useState, useEffect, useCallback, useRef } from 'react';
import meetingService from '@/apis/services/meetingService';

const useMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    limit: 100,
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

  // Use refs to avoid stale closures
  const filtersRef = useRef(filters);
  const paginationRef = useRef(pagination);

  // Update refs when state changes
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);

  const fetchMeetings = useCallback(async (isLoadMore = false, customFilters = null) => {
    try {
      setLoading(true);
      setError(null);

      const currentFilters = customFilters || filtersRef.current;
      const currentPagination = paginationRef.current;
      
      const { status, date, searchQuery, employeeId, startDate, endDate } = currentFilters;

      let response;
      const offset = isLoadMore ? currentPagination.offset : 0;

      if (status === 'all' && !date && !searchQuery && !employeeId && !startDate && !endDate) {
        response = await meetingService.getAllMeetings(currentPagination.limit, offset);
      } else {
        const filterParams = {
          limit: currentPagination.limit,
          offset: offset,
          ...(status !== 'all' && { status }),
          ...(date && { startDate: date, endDate: date }), // Send date as both startDate and endDate for exact date match
          ...(searchQuery && { title: searchQuery }),
          ...(employeeId && { employeeId }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate })
        };

        response = await meetingService.getFilteredMeetings(filterParams);
      }

      if (response?.data) {
        const meetingsData = response.data.meetings || response.data;
        
        if (isLoadMore) {
          // Append new meetings to existing ones
          setMeetings(prev => [...prev, ...meetingsData]);
          setFilteredMeetings(prev => [...prev, ...meetingsData]);
        } else {
          // Replace meetings for new search/filter
          setMeetings(meetingsData);
          setFilteredMeetings(meetingsData);
        }

        // Update pagination
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        } else {
          // Fallback pagination calculation
          setPagination(prev => ({
            ...prev,
            offset: offset + meetingsData.length,
            totalCount: isLoadMore ? prev.totalCount : meetingsData.length,
            hasMore: meetingsData.length === currentPagination.limit
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching meetings:', err);
      setError(err.response?.data?.message || 'Failed to fetch meetings');
    } finally {
      setLoading(false);
    }
  }, []); // Remove dependencies to prevent infinite loops

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

  // Initial data loading
  useEffect(() => {
    fetchEmployees();
    fetchMeetings();
  }, [fetchEmployees, fetchMeetings]);

  // Refetch when filters change
  useEffect(() => {
    fetchMeetings(false, filters);
  }, [filters, fetchMeetings]);

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
        // Reset to first page and refresh
        setPagination(prev => ({ ...prev, offset: 0 }));
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
    setPagination(prev => ({ ...prev, offset: 0 })); // Reset pagination
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
      const newOffset = pagination.offset + pagination.limit;
      setPagination(prev => ({
        ...prev,
        offset: newOffset
      }));
      
      // Fetch more meetings and append them
      fetchMeetings(true);
    }
  }, [pagination.hasMore, pagination.offset, pagination.limit, loading, fetchMeetings]);

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