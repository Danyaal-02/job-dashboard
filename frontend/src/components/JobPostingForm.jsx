import React, { useState, useRef, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from '../config/AxiosConfig';

const JobPostingForm = ({ onJobCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    experienceLevel: '',
    candidates: [],
    endDate: null
  });
  const [newCandidate, setNewCandidate] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const datePickerRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prevData => ({ ...prevData, endDate: date }));
  };

  const addCandidate = () => {
    if (newCandidate && !formData.candidates.includes(newCandidate)) {
      setFormData(prevData => ({
        ...prevData,
        candidates: [...prevData.candidates, newCandidate]
      }));
      setNewCandidate('');
      setShowSuggestion(false);
    }
  };

  const removeCandidate = (candidate) => {
    setFormData(prevData => ({
      ...prevData,
      candidates: prevData.candidates.filter(c => c !== candidate)
    }));
  };

  const handleCandidateInputChange = (e) => {
    setNewCandidate(e.target.value);
    setShowSuggestion(e.target.value.includes('@') && e.target.value.split('@')[1].includes('.'));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && showSuggestion) {
      e.preventDefault();
      addCandidate();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/jobs', formData);
      if (response.status === 201) {
        console.log('Job Created Successfully');
        onJobCreated && onJobCreated();
      }
    } catch (error) {
      console.error('Error creating job:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalendarClick = () => {
    datePickerRef.current.setOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestion(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex-grow p-6">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="space-y-4">
          <div className="flex items-center">
            <label className="w-1/3 text-right pr-4 text-lg">Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter Job Title"
              className="w-2/3 border rounded-md p-2"
              required
            />
          </div>
          <div className="flex items-start">
            <label className="w-1/3 text-right pr-4 pt-2 text-lg">Job Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter Job Description"
              className="w-2/3 border rounded-md p-2 h-32"
              required
            />
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-right pr-4 text-lg">Experience Level</label>
            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleInputChange}
              className="w-2/3 border rounded-md p-2 bg-white"
              required
            >
              <option value="">Select Experience Level</option>
              <option value="Entry Level">Entry Level</option>
              <option value="1-3 years">1-3 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5+ years">5+ years</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-right pr-4 text-lg">Add Candidate</label>
            <div className="w-2/3 border rounded-md p-2 py-5 flex items-center relative" ref={inputRef}>
              {formData.candidates.map((candidate, index) => (
                <div key={index} className="border gap-1 rounded-full px-2 py-1 flex items-center mr-2">
                  <div className='border rounded-full w-5 h-5 bg-gray-100'></div>
                  <span className="text-sm text-gray-600">{candidate}</span>
                  <X
                    size={14}
                    className="ml-1 text-gray-600 cursor-pointer"
                    onClick={() => removeCandidate(candidate)}
                  />
                </div>
              ))}
              <input
                type="email"
                placeholder="Enter candidate email"
                value={newCandidate}
                onChange={handleCandidateInputChange}
                onKeyDown={handleKeyDown}
                className="flex-grow focus:outline-none"
              />
              {showSuggestion && (
                <button
                  type="button"
                  onClick={addCandidate}
                  className="text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                  <div className="absolute left-0 right-0 bottom-full mb-1 bg-white border rounded-md shadow-lg p-2">
                    <div className="flex items-center justify-between">
                      <span>{newCandidate}</span>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <label className="w-1/3 text-right pr-4 text-lg">End Date</label>
            <div className="w-2/3 relative">
              <div className="flex items-center border rounded-md overflow-hidden">
                <DatePicker
                  ref={datePickerRef}
                  selected={formData.endDate}
                  onChange={handleDateChange}
                  className="w-full p-2 pl-3 pr-10 focus:outline-none"
                  placeholderText="Select a Date"
                  dateFormat="MM/dd/yyyy"
                  required
                  customInput={
                    <input
                      className="w-full p-2 pl-3 pr-10 focus:outline-none"
                    />
                  }
                />
                <Calendar 
                  size={20} 
                  className="absolute right-3 text-gray-400 cursor-pointer" 
                  onClick={handleCalendarClick}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <button 
              type="submit" 
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default JobPostingForm;