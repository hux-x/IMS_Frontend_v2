// src/components/AttendanceControls.jsx
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const AttendanceControls = ({ onSearch, onFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('All Status');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);
    };

    const handleFilterClick = (filter) => {
        setSelectedFilter(filter);
        onFilterChange(filter);
    };

    const filters = ['All Status', 'Present', 'Absent', 'Late'];

    return (
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <div className="relative w-1/3">
                <input
                    type="text"
                    placeholder="Search employees..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex space-x-2">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => handleFilterClick(filter)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ease-in-out ${
                            selectedFilter === filter
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AttendanceControls;