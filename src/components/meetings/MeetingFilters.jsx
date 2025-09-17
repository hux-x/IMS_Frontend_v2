import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Calendar, Loader2 } from 'lucide-react';

const MeetingFilters = ({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterDate,
  setFilterDate,
  onClearFilters,
  loading = false
}) => {
  const [isSearching, setIsSearching] = useState(false);
  
  const statusOptions = [
    { value: 'all', label: 'All Status', count: null },
    { value: 'planned', label: 'Planned', count: null },
    { value: 'completed', label: 'Completed', count: null },
    { value: 'cancelled', label: 'Cancelled', count: null }
  ];

  const hasActiveFilters = searchQuery || filterStatus !== 'all' || filterDate;

  // Show loading indicator while search is being debounced
  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 500); // Match the debounce delay

      return () => {
        clearTimeout(timer);
        setIsSearching(false);
      };
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleDateChange = (e) => {
    setFilterDate(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setFilterDate('');
    onClearFilters();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search meetings by title, description, or attendees..."
              value={searchQuery}
              onChange={handleSearchChange}
              disabled={loading}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
            {/* Search loading indicator */}
            {isSearching && searchQuery && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 size={16} className="animate-spin text-gray-400" />
              </div>
            )}
          </div>
          {/* Search hint */}
          {searchQuery && (
            <p className="text-xs text-gray-500 mt-1 ml-1">
              {isSearching ? 'Searching...' : `Showing results for "${searchQuery}"`}
            </p>
          )}
        </div>

        {/* Status Filter */}
        <div className="w-full lg:w-48">
          <div className="relative">
            <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
            <select
              value={filterStatus}
              onChange={handleStatusChange}
              disabled={loading}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white disabled:bg-gray-50 disabled:text-gray-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Date Filter */}
        <div className="w-full lg:w-48">
          <div className="relative">
            <Calendar size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
            <input
              type="date"
              value={filterDate}
              onChange={handleDateChange}
              disabled={loading}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Clear all filters"
          >
            <X size={20} />
            <span className="hidden lg:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 font-medium">Active filters:</span>
          
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Search: "{searchQuery}"
              {isSearching && <Loader2 size={12} className="animate-spin" />}
              <button
                onClick={() => setSearchQuery('')}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </span>
          )}
          
          {filterStatus !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Status: {statusOptions.find(opt => opt.value === filterStatus)?.label}
              <button
                onClick={() => setFilterStatus('all')}
                className="hover:bg-green-200 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </span>
          )}
          
          {filterDate && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              Date: {new Date(filterDate).toLocaleDateString()}
              <button
                onClick={() => setFilterDate('')}
                className="hover:bg-purple-200 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MeetingFilters;