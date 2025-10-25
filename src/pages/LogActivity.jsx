// src/pages/LogActivity.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOneActivity, saveActivity, updateActivity } from '../api/healthApi'; 
import ActivityForm from '../components/ActivityForm';

// Helper function to format an ISO date string (from the backend)
// into the 'YYYY-MM-DDThh:mm' format required by HTML datetime-local input.
const formatForDatetimeLocal = (isoString) => {
    if (!isoString) {
        // Return current time in correct format if no string is provided (e.g., for creation mode fallback)
        return new Date(Date.now() - (new Date().getTimezoneOffset() * 60000)).toISOString().substring(0, 16);
    }
    
    // Create a Date object from the ISO string
    const date = new Date(isoString);

    // Get date and time parts adjusted for the client's local timezone offset
    // This is the cleanest way to prevent React/browser timezone misinterpretation
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const LogActivity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      setError(null);
      getOneActivity(id)
        .then(data => {
          // **FIXED DATE FORMATTING:** Use the helper function
          const formattedDate = formatForDatetimeLocal(data.date_time);
          
          // Use the data's ID as it is the key for the component to re-render
          setInitialData({ ...data, date_time: formattedDate });
        })
        .catch(err => {
          const errorText = err.detail || 'Failed to fetch activity details.';
          setError(errorText);
        })
        .finally(() => { 
          setLoading(false);
        });
    } else {
      // Default data for creation mode
      setInitialData({
        activity_type: 'Running',
        date_time: formatForDatetimeLocal(), // Use helper for creation default as well
        duration: '00:30:00',
        status: 'Completed',
        remarks: ''
      });
    }
  }, [id, isEditMode]);

  const handleSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      // Convert the 'YYYY-MM-DDThh:mm' string back to an ISO 8601 UTC string for the backend
      // Note: new Date() handles the conversion to UTC based on client timezone
      const isoDateTime = new Date(data.date_time).toISOString();
      const payload = { ...data, date_time: isoDateTime };

      if (isEditMode) {
        await updateActivity(id, payload);
      } else {
        await saveActivity(payload);
      }
      
      navigate('/activities');
    } catch (err) {
      const errorText = err.detail || Object.values(err).flat().join(', ') || `Failed to ${isEditMode ? 'update' : 'log'} activity.`;
      setError(errorText);
    } finally {
      setLoading(false);
    }
  };

  // Display 'Loading activity details...' only when fetching data in edit mode
  if (loading && isEditMode) return <p className="text-center text-lg text-indigo-600">Loading activity details...</p>;
  if (error) return <p className="p-3 text-lg text-red-600 border bg-red-50 rounded">Error: {error}</p>;
  if (!initialData) return null; 

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-4xl font-extrabold text-gray-800 border-b pb-4">
        {isEditMode ? `Edit Activity #${id}` : 'Log New Activity'}
      </h1>
      <ActivityForm 
        initialData={initialData} 
        onSubmit={handleSubmit} 
        loading={loading}
      />
    </div>
  );
};

export default LogActivity;