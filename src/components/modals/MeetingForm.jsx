import React, { useState, useEffect } from 'react';
import { Trash2, Plus, AlertCircle } from 'lucide-react';
import authService from '@/apis/services/authService';

const MeetingForm = ({ meeting = null, employeesx = [], onSubmit, onCancel, loading = false }) => {
  // Helper function to format datetime for input
  const formatDateTimeForInput = (dateTime) => {
    if (!dateTime) return '';
    try {
      const date = new Date(dateTime);
      return date.toISOString().slice(0, 16);
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const getEmployeesForMeeting = async () => {
      try{
        const res = await authService.getAllEmployees();
        if(res?.data){
          setEmployees(res.data.employees || []);
        }
      }catch(err){
        alert('Failed to fetch employees. Please try again later.');
        console.error('Error fetching employees:', err);
      }
    }
    getEmployeesForMeeting();

  }, [employees]);

  // Helper function to get employee IDs from meeting data
  const getEmployeeIds = (meetingData) => {
    if (!meetingData) return [];
    
    // Handle different API response formats
    if (Array.isArray(meetingData.employees)) {
      return meetingData.employees.map(emp => emp._id || emp.id || emp);
    }
    if (Array.isArray(meetingData.participants)) {
      return meetingData.participants.map(emp => emp._id || emp.id || emp);
    }
    if (Array.isArray(meetingData.attendees)) {
      return meetingData.attendees.map(emp => emp._id || emp.id || emp);
    }
    return [];
  };

  // Helper function to get clients from meeting data
  const getClients = (meetingData) => {
    if (!meetingData) return [{ name: '', email: '' }];
    
    if (Array.isArray(meetingData.clients) && meetingData.clients.length > 0) {
      const validClients = meetingData.clients.filter(client => 
        client && (client.name || client.email)
      );
      return validClients.length > 0 ? validClients : [{ name: '', email: '' }];
    }
    
    return [{ name: '', email: '' }];
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    employees: [],
    status: 'planned',
    clients: [{ name: '', email: '' }],
    location: '',
    meetingLink: ''
  });

  const [errors, setErrors] = useState({});

  // Initialize form data when meeting prop changes
  useEffect(() => {
    if (meeting) {
      setFormData({
        title: meeting.title || '',
        description: meeting.description || '',
        startTime: formatDateTimeForInput(meeting.startTime),
        endTime: formatDateTimeForInput(meeting.endTime),
        employees: getEmployeeIds(meeting),
        status: meeting.status || 'planned',
        clients: getClients(meeting),
        location: meeting.location || '',
        meetingLink: meeting.meetingLink || meeting.link || ''
      });
    } else {
      // Reset form for new meeting
      setFormData({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        employees: [],
        status: 'planned',
        clients: [{ name: '', email: '' }],
        location: '',
        meetingLink: ''
      });
    }
    setErrors({});
  }, [meeting]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.startTime && formData.endTime) {
      const startDate = new Date(formData.startTime);
      const endDate = new Date(formData.endTime);
      
      if (endDate <= startDate) {
        newErrors.endTime = 'End time must be after start time';
      }

      // Check if start time is in the past (only for new meetings)
      if (!meeting && startDate < new Date()) {
        newErrors.startTime = 'Start time cannot be in the past';
      }
    }

    // if (formData.employees.length === 0) {
    //   newErrors.employees = 'At least one participant is required';
    // }

    // Validate clients
    const validClients = formData.clients.filter(client => client.name.trim());
    if (validClients.length === 0 && formData.clients.some(client => client.email.trim())) {
      newErrors.clients = 'Client name is required when email is provided';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Clean up clients data - remove empty clients
    const cleanedClients = formData.clients.filter(client => 
      client.name.trim() || client.email.trim()
    );

    const submitData = {
      ...formData,
      clients: cleanedClients.length > 0 ? cleanedClients : undefined,
      // Ensure we're sending ISO strings for dates
      startTime: formData.startTime ? new Date(formData.startTime).toISOString() : null,
      endTime: formData.endTime ? new Date(formData.endTime).toISOString() : null
    };
    console.log(submitData)
    
    onSubmit(submitData);
  };

  const addClient = () => {
    setFormData({
      ...formData,
      clients: [...formData.clients, { name: '', email: '' }]
    });
  };

  const removeClient = (index) => {
    if (formData.clients.length > 1) {
      setFormData({
        ...formData,
        clients: formData.clients.filter((_, i) => i !== index)
      });
    }
  };

  const updateClient = (index, field, value) => {
    const updatedClients = [...formData.clients];
    updatedClients[index][field] = value;
    setFormData({ ...formData, clients: updatedClients });
    
    // Clear client errors when user starts typing
    if (errors.clients) {
      setErrors({ ...errors, clients: undefined });
    }
  };

  const handleEmployeeChange = (employeeId, checked) => {
    if (checked) {
      setFormData({
        ...formData,
        employees: [...formData.employees, employeeId]
      });
    } else {
      setFormData({
        ...formData,
        employees: formData.employees.filter(id => id !== employeeId)
      });
    }
    
    // Clear employee errors when user makes a selection
    if (errors.employees) {
      setErrors({ ...errors, employees: undefined });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.title ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter meeting title"
          disabled={loading}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.title}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows="3"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Meeting description (optional)"
          disabled={loading}
        />
      </div>

      {/* Start and End Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => handleInputChange('startTime', e.target.value)}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.startTime ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.startTime && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.startTime}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={formData.endTime}
            onChange={(e) => handleInputChange('endTime', e.target.value)}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.endTime ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.endTime && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.endTime}
            </p>
          )}
        </div>
      </div>

      {/* Location and Meeting Link */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Meeting location (optional)"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link</label>
          <input
            type="url"
            value={formData.meetingLink}
            onChange={(e) => handleInputChange('meetingLink', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/meeting"
            disabled={loading}
          />
        </div>
      </div>

      {/* Employees */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Participants <span className="text-red-500">*</span>
        </label>
        <div className={`border rounded-md p-3 max-h-40 overflow-y-auto ${
          errors.employees ? 'border-red-300' : 'border-gray-300'
        }`}>
          {employees.length > 0 ? (
            employees.map(emp => (
              <label key={emp._id} className="flex items-center space-x-2 mb-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={formData.employees.includes(emp._id || emp.id)}
                  onChange={(e) => handleEmployeeChange(emp._id || emp.id, e.target.checked)}
                  className="rounded"
                  disabled={loading}
                />
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-xs">
                      {(emp.name || '').split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">{emp.name || 'Unknown Employee'}</span>
                    {emp.email && <span className="text-xs text-gray-500 ml-1">({emp.email})</span>}
                  </div>
                </div>
              </label>
            ))
          ) : (
            <p className="text-gray-500 text-sm italic">No employees available</p>
          )}
        </div>
        {errors.employees && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.employees}
          </p>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={formData.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        >
          <option value="planned">Planned</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Clients */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Clients</label>
        {formData.clients.map((client, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Client name"
              value={client.name}
              onChange={(e) => updateClient(index, 'name', e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
            <input
              type="email"
              placeholder="Client email (optional)"
              value={client.email}
              onChange={(e) => updateClient(index, 'email', e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
            {formData.clients.length > 1 && (
              <button
                type="button"
                onClick={() => removeClient(index)}
                className="px-3 py-3 text-red-600 hover:bg-red-50 rounded-md border border-gray-300 disabled:opacity-50"
                disabled={loading}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addClient}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 disabled:opacity-50"
          disabled={loading}
        >
          <Plus size={16} />
          Add Client
        </button>
        {errors.clients && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.clients}
          </p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium disabled:opacity-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md font-medium disabled:opacity-50 flex items-center gap-2"
          disabled={loading}
        >
          {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
          {meeting ? 'Update Meeting' : 'Create Meeting'}
        </button>
      </div>
    </form>
  );
};

export default MeetingForm;