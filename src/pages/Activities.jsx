// src/pages/Activities.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { viewActivities, deleteActivity, updateActivityStatus } from '../api/healthApi';
import ActivityList from '../components/ActivityList';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); 
  const navigate = useNavigate();

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await viewActivities();
      setActivities(data); 
    } catch (err) {
      setError(err.message || 'Failed to fetch activities. Check your token or network.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [refreshKey]); 

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateActivityStatus(id, newStatus);
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) return;
    try {
      await deleteActivity(id);
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      alert(`Error deleting activity: ${err.message}`);
    }
  };
  
  // Handler for the 'View / Edit' button in the list
  const handleView = (id) => {
    navigate(`/activities/${id}`); // Navigates to the edit/view page
  }

  // Handler for the top 'Log New Activity' button
  const handleLogNew = () => {
    navigate('/activities/new');
  }

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-4xl font-extrabold text-gray-800">My Fitness Dashboard 🏃‍♀️</h1>
        <button
          onClick={handleLogNew}
          className="py-2 px-4 bg-indigo-600 text-white font-medium rounded-md shadow-md hover:bg-indigo-700 transition duration-150"
        >
          + Log New Activity
        </button>
      </div>
      
      {/* Activity List */}
      <div>
        {loading && <p className="text-center text-lg text-indigo-600">Loading activities...</p>}
        {error && <p className="p-3 text-lg text-red-600 border bg-red-50 rounded">{error}</p>}
        
        {!loading && !error && (
          <ActivityList 
            activities={activities} 
            onDelete={handleDelete}
            onUpdateStatus={handleUpdateStatus}
            onView={handleView}
          />
        )}
      </div>
    </div>
  );
};

export default Activities;