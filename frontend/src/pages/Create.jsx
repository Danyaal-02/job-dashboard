import React, { useState } from 'react';
import { Home, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import JobPostingForm from '../components/JobPostingForm';
import JobsList from '../components/JobsList';
import logo from '../assets/logo.png'

const CuvetteDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const toggleForm = () => setShowForm(!showForm);

  const handleJobCreated = () => {
    setShowForm(false);
  };

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
   
    
    // Navigate to signup page
    navigate('/signup');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white py-6 px-6 flex justify-between items-center shadow-lg z-10">
        <div className="flex items-center">
            <img src={logo} alt="Logo" />
        </div>
        <div className="flex items-center space-x-4">
          <a href="#" className="text-gray-600 text-lg hover:text-gray-900">Contact</a>
          <div className="relative">
            <select className="appearance-none bg-gray-200 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
              <option>Your Name</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>
      
      <main className="flex flex-grow">
        <aside className="w-16 bg-white shadow-lg">
          <nav className="flex flex-col items-center py-4">
            <a href="#" className="p-2 hover:bg-gray-100 rounded-lg mb-2">
              <Home className="text-gray-600" size={24} />
            </a>
          </nav>
        </aside>
        
        <div className="flex-grow p-6">
          {!showForm && (
            <button 
              onClick={toggleForm}
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
            >
              Create Interview
            </button>
          )}
          <div className="max-w-6xl mx-auto">
            {showForm ? (
              <div className="bg-white rounded-lg shadow-sm relative">
                <button 
                  onClick={toggleForm}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
                <JobPostingForm onJobCreated={handleJobCreated} />
              </div>
            ) : (
              <JobsList />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CuvetteDashboard;