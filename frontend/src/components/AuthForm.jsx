import { useState, useCallback, useEffect } from 'react'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'
import axiosInstance, { setAuthToken } from '../config/AxiosConfig'

export default function AuthForm({ onProceed = () => {} }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    companyEmail: '',
    password: '',
    mobile: '+91',
    employeeSize: ''
  })
  const navigate=useNavigate()
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = useCallback(() => {
    const newErrors = {}
    
    if (isLogin) {
      if (!formData.companyEmail.trim()) {
        newErrors.companyEmail = 'Company email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)) {
        newErrors.companyEmail = 'Please enter a valid email address'
      }
      if (!formData.password) {
        newErrors.password = 'Password is required'
      }
    } else {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required'
      }
      if (!formData.mobile.trim()) {
        newErrors.mobile = 'Mobile number is required'
      } else if (!/^\+?[\d\s-]{10,}$/.test(formData.mobile.trim())) {
        newErrors.mobile = 'Please enter a valid mobile number'
      }
      if (!formData.companyName.trim()) {
        newErrors.companyName = 'Company name is required'
      }
      if (!formData.companyEmail.trim()) {
        newErrors.companyEmail = 'Company email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)) {
        newErrors.companyEmail = 'Please enter a valid email address'
      }
      if (!formData.password.trim()) {
        newErrors.password = 'Password is required'
      }
      const employeeSizeNum = parseInt(formData.employeeSize)
      if (isNaN(employeeSizeNum) || employeeSizeNum <= 0) {
        newErrors.employeeSize = 'Please enter a valid employee size'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, isLogin])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }, [errors])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)
      try {
        if (isLogin) {
          const response = await axiosInstance.post('/auth/login', {
            companyEmail: formData.companyEmail,
            password: formData.password
          })
          
          const { token } = response.data
          setAuthToken(token)
          navigate('/dashboard', { replace: true })
          
        } else {
          const response = await axiosInstance.post('/auth/register', {
            name: formData.name,
            companyName: formData.companyName,
            companyEmail: formData.companyEmail,
            password: formData.password,
            mobile: formData.mobile,
            employeeSize: parseInt(formData.employeeSize)
          });
          
          // If registration returns a token
          if (response.data.token) {
            setAuthToken(response.data.token)
            navigate('/dashboard', { replace: true })
          }
          
          onProceed(formData);
        }
      } catch (error) {
        console.error('Submission error:', error)
        setErrors(prev => ({
          ...prev,
          submit: error.response?.data?.message || `${isLogin ? 'Login' : 'Registration'} failed. Please try again.`
        }))
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const renderInput = (name, placeholder, type = "text", icon) => (
    <div className="space-y-1">
      <div className="relative">
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full px-10 py-3 border rounded-md bg-gray-50 transition-colors duration-200 
            ${errors[name] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
        />
        <span className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2">
          {icon}
        </span>
      </div>
      {errors[name] && (
        <p className="text-red-500 text-xs">{errors[name]}</p>
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold mb-1 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        <p className="text-gray-500 text-sm mb-6 text-center">Lorem Ipsum is simply dummy text</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            {renderInput("name", "Name", "text", 
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            )}
            {renderInput("mobile", "Mobile no.", "tel", 
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            )}
            {renderInput("companyName", "Company Name", "text", 
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
              </svg>
            )}
            {renderInput("employeeSize", "Employee Size", "number", 
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            )}
          </>
        )}

        {renderInput("companyEmail", "Company Email", "email", 
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        )}
        {renderInput("password", "Password", "password", 
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        )}

        {isLogin && (
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>
        )}

        {errors.submit && (
          <p className="text-red-500 text-sm text-center">{errors.submit}</p>
        )}

        {!isLogin && (
          <p className="text-xs text-center mt-4 text-gray-500">
            <div>By clicking on proceed you will accept our</div>
            <a href="#" className="text-blue-600 hover:underline"> Terms & Conditions</a>
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full text-white rounded-lg py-3 font-medium transition duration-300
            ${isSubmitting 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-800'
            }`}
        >
          {isSubmitting 
            ? 'Processing...' 
            : isLogin ? 'Login' : 'Proceed'
          }
        </button>
      </form>

      <p className="text-center text-sm text-gray-600">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="ml-1 text-blue-600 hover:underline focus:outline-none"
        >
          {isLogin ? "Sign up" : "Login"}
        </button>
      </p>
    </div>
  )
}