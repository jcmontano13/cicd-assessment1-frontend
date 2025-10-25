// src/components/ActivityForm.jsx
import React, { useState, useEffect } from 'react';

const activityTypes = ['Running', 'Cycling', 'Swimming', 'Weightlifting', 'Yoga', 'Hiking', 'Walking'];
const activityStatuses = ['Completed', 'Pending', 'Cancelled'];

const ActivityForm = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState(initialData);

  // Sync internal state with initialData props (crucial for edit mode fetching)
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);
  
  const isEditMode = !!initialData.id;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!formData) return null; 

  return (
    <div className="p-6 bg-white shadow-2xl rounded-xl border border-indigo-100">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Activity Type */}
        <div>
          <label htmlFor="activity_type" className="block text-sm font-medium text-gray-700">Activity Type</label>
          <select
            name="activity_type"
            value={formData.activity_type || ''}
            onChange={handleChange}
            disabled={loading}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
            required
          >
            {activityTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>

        {/* Date/Time */}
        <div>
          <label htmlFor="date_time" className="block text-sm font-medium text-gray-700">Date and Time</label>
          <input
            type="datetime-local"
            name="date_time"
            value={formData.date_time || ''}
            onChange={handleChange}
            disabled={loading}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
            required
          />
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (HH:MM:SS)</label>
          <input
            type="text"
            name="duration"
            value={formData.duration || ''}
            onChange={handleChange}
            disabled={loading}
            pattern="\d{2}:\d{2}:\d{2}"
            title="Format: HH:MM:SS (e.g., 00:30:00)"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
            required
          />
        </div>
        
        {/* Status */}
        <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
                name="status"
                value={formData.status || ''}
                onChange={handleChange}
                disabled={loading}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                required
            >
                {activityStatuses.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
        </div>

        {/* Remarks */}
        <div>
          <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">Remarks</label>
          <textarea
            name="remarks"
            value={formData.remarks || ''}
            onChange={handleChange}
            rows="3"
            disabled={loading}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
        >
          {loading ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Activity' : 'Save Activity')}
        </button>
      </form>
    </div>
  );
};

export default ActivityForm;