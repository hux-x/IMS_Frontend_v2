import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

const MeetingForm = ({ meeting = null, employees = [], onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: meeting?.title || '',
    description: meeting?.description || '',
    startTime: meeting?.startTime ? new Date(meeting.startTime).toISOString().slice(0, 16) : '',
    endTime: meeting?.endTime ? new Date(meeting.endTime).toISOString().slice(0, 16) : '',
    employees: meeting?.employees?.map(emp => emp._id) || [],
    status: meeting?.status || 'planned',
    clients: meeting?.clients?.length > 0 ? meeting.clients : [{ name: '', email: '' }]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }
    if (!formData.startTime || !formData.endTime) {
      alert('Start time and end time are required');
      return;
    }
    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      alert('End time must be after start time');
      return;
    }
    
    onSubmit(formData);
  };

  const addClient = () => {
    setFormData({
      ...formData,
      clients: [...formData.clients, { name: '', email: '' }]
    });
  };

  const removeClient = (index) => {
    setFormData({
      ...formData,
      clients: formData.clients.filter((_, i) => i !== index)
    });
  };

  const updateClient = (index, field, value) => {
    const updatedClients = [...formData.clients];
    updatedClients[index][field] = value;
    setFormData({ ...formData, clients: updatedClients });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter meeting title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="3"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Meeting description (optional)"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
          <input
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
          <input
            type="datetime-local"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Employees</label>
        <div className="border border-gray-300 rounded-md p-3 max-h-32 overflow-y-auto">
          {employees.map(emp => (
            <label key={emp._id} className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                checked={formData.employees.includes(emp._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({
                      ...formData,
                      employees: [...formData.employees, emp._id]
                    });
                  } else {
                    setFormData({
                      ...formData,
                      employees: formData.employees.filter(id => id !== emp._id)
                    });
                  }
                }}
                className="rounded"
              />
              <span className="text-sm">{emp.name} ({emp.email})</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="planned">Planned</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

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
            />
            <input
              type="email"
              placeholder="Client email (optional)"
              value={client.email}
              onChange={(e) => updateClient(index, 'email', e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {formData.clients.length > 1 && (
              <button
                type="button"
                onClick={() => removeClient(index)}
                className="px-3 py-3 text-red-600 hover:bg-red-50 rounded-md border border-gray-300"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addClient}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          + Add Client
        </button>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md font-medium"
        >
          {meeting ? 'Update Meeting' : 'Create Meeting'}
        </button>
      </div>
    </div>
  );
};

export default MeetingForm;