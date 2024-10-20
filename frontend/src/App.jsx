import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import CuvetteDashboard from './pages/Create';
import { setAuthToken } from './config/AxiosConfig';

// Check for token on app load
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/signup" replace />;
};

const PublicRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <CuvetteDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Navigate to="/dashboard" replace />
            </PrivateRoute>
          } 
        />
        <Route 
          path="*" 
          element={
            <PrivateRoute>
              <Navigate to="/dashboard" replace />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;