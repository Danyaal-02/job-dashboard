import React, { useState, useEffect } from 'react';
import { Calendar, Users, ChevronRight, Briefcase, PackageSearch } from 'lucide-react';
import axios from 'axios';
import axiosInstance from '../config/AxiosConfig';

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/jobs'); // Added await here
      
      if (!response.data) {
        setJobs([]);
        setError('No data received from server');
        return;
      }
  
      if (Array.isArray(response.data) && response.data.length === 0) {
        setJobs([]);
      } else if (Array.isArray(response.data)) {
        setJobs(response.data);
        console.log('Jobs loaded:', response.data);
      } else {
        setJobs([]);
        setError('Invalid data format received');
      }
      
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
      setError('Failed to fetch jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (jobId) => {
    console.log('View details for job:', jobId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="p-4 bg-blue-50 rounded-full mb-4">
          <PackageSearch className="text-blue-600 w-12 h-12" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
        <p className="text-gray-600 text-center max-w-sm">
          Create your first job posting to start interviewing candidates
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-5">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Posted Jobs</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div 
            key={job._id} 
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border overflow-hidden group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <Briefcase className="text-blue-600" size={20} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    new Date(job.endDate) > new Date() 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {new Date(job.endDate) > new Date() ? 'Active' : 'Closed'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 h-10">
                  {job.description}
                </p>
                
                <div className="pt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {job.candidates.length} {job.candidates.length === 1 ? 'Candidate' : 'Candidates'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {new Date(job.endDate) < new Date() 
                        ? 'Ended ' 
                        : 'Ends '} 
                      {new Date(job.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

           
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsList;