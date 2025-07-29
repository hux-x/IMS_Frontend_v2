// src/components/Header.jsx
import React from 'react';
import { FaCalendarAlt, FaDownload } from 'react-icons/fa';

const attendence_header = ({ title, subtitle, date, onExport }) => {
    return (
        <div className="bg-white shadow-sm p-6 flex items-center justify-between border-b border-gray-200">
            <div>
                <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
                <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-600 text-sm">
                    <FaCalendarAlt />
                    <span>{date}</span>
                </div>
                <button
                    onClick={onExport} // Added onExport prop
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200 ease-in-out"
                >
                    <FaDownload />
                    <span>Export</span>
                </button>
            </div>
        </div>
    );
};

export default attendence_header;

