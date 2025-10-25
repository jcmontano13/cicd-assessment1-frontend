// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getAuthToken } from './api/healthApi';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Activities from './pages/Activities';
import LogActivity from './pages/LogActivity'; // NEW Import
import Header from './components/Header';

// RootRedirect and ProtectedRoute components remain the same

// Component to handle redirection from the root path (/)
const RootRedirect = () => {
  const isAuthenticated = !!getAuthToken();
  if (isAuthenticated) {
    return <Navigate to="/activities" replace />;
  }
  return <Navigate to="/login" replace />;
};

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = !!getAuthToken();
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Header />
      <div className="container mx-auto p-4 max-w-7xl">
        <Routes>
          {/* Default Redirect */}
          <Route path="/" element={<RootRedirect />} /> 
          
          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Dashboard/List View */}
          <Route 
            path="/activities" 
            element={<ProtectedRoute element={<Activities />} />} 
          />
          
          {/* Log New Activity Page */}
          <Route 
            path="/activities/new" 
            element={<ProtectedRoute element={<LogActivity />} />} 
          />

          {/* View/Edit Activity Detail Page */}
          <Route 
            path="/activities/:id" 
            element={<ProtectedRoute element={<LogActivity />} />} 
          />
          
          <Route path="*" element={<h1 className="text-3xl font-bold text-red-600">404 - Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;