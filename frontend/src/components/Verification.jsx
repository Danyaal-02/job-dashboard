'use client'

import React, { useState, useEffect } from 'react'
import AuthForm from './AuthForm'
import axiosInstance from '../config/AxiosConfig'

export default function Verification({ onVerificationComplete, registrationData }) {
  const [emailVerified, setEmailVerified] = useState(false)
  const [mobileVerified, setMobileVerified] = useState(false)
  const [emailOtp, setEmailOtp] = useState('')
  const [mobileOtp, setMobileOtp] = useState('')
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [isEmailVerifying, setIsEmailVerifying] = useState(false);
  const [isMobileVerifying, setIsMobileVerifying] = useState(false);

  const handleEmailVerify = async () => {
    setEmailError('');
    setIsEmailVerifying(true);
    try {
      await axiosInstance.post('auth/verify-email', {
        companyEmail: registrationData.companyEmail,
        otp: emailOtp
      });
      setEmailVerified(true);
    } catch (error) {
      console.error('Email verification failed:', error);
      setEmailError('Email verification failed. Please try again.');
    } finally {
      setIsEmailVerifying(false);
    }
  }

  const handleMobileVerify = async () => {
    setMobileError('');
    setIsMobileVerifying(true);
    try {
      await axiosInstance.post('auth/verify-mobile', {
        mobile: registrationData.mobile,
        otp: mobileOtp
      });
      setMobileVerified(true);
    } catch (error) {
      console.error('Mobile verification failed:', error);
      setMobileError('Mobile verification failed. Please try again.');
    } finally {
      setIsMobileVerifying(false);
    }
  }

  useEffect(() => {
    if (emailVerified && mobileVerified) {
      const completeRegistration = async () => {
        try {
          setShowLogin(true);
          onVerificationComplete();
          window.location.reload();
        } catch (error) {
          console.error('Registration completion failed:', error)
        }
      }
      completeRegistration()
    }
  }, [emailVerified, mobileVerified, registrationData, onVerificationComplete])

  if (showLogin) {
    return <AuthForm isLogin={true} />;
  }

  return (
    <>
      <h2 className="text-2xl font-semibold mb-1 text-center">Verify</h2>
      <p className="text-gray-500 text-sm mb-6 text-center">Lorem Ipsum is simply dummy text</p>
      <form className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Email OTP"
            value={emailOtp}
            onChange={(e) => setEmailOtp(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-md bg-gray-50"
            disabled={emailVerified || isEmailVerifying}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          {emailVerified && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white border rounded-full bg-green-500 absolute right-3 top-1/2 transform -translate-y-1/2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        {!emailVerified && (
          <>
            <button
              type="button"
              onClick={handleEmailVerify}
              className="w-full bg-blue-600 text-white rounded-md py-3 font-medium hover:bg-blue-700 transition duration-300 flex justify-center items-center"
              disabled={isEmailVerifying}
            >
              {isEmailVerifying ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </button>
            {!emailVerified && emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </>
        )}

        <div className="relative mt-4">
          <input
            type="text"
            placeholder="Mobile OTP"
            value={mobileOtp}
            onChange={(e) => setMobileOtp(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-md bg-gray-50"
            disabled={mobileVerified || isMobileVerifying}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          {mobileVerified && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white border rounded-full bg-green-500 absolute right-3 top-1/2 transform -translate-y-1/2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        {!mobileVerified && (
          <>
            <button
              type="button"
              onClick={handleMobileVerify}
              className="w-full bg-blue-600 text-white rounded-md py-3 font-medium hover:bg-blue-700 transition duration-300 flex justify-center items-center"
              disabled={isMobileVerifying}
            >
              {isMobileVerifying ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                'Verify Mobile'
              )}
            </button>
            {!mobileVerified && mobileError && (
              <p className="text-red-500 text-xs mt-1">{mobileError}</p>
            )}
          </>
        )}
      </form>
    </>
  )
}