import React, { useState } from 'react'
import Verification from '../components/Verification'
import AuthForm from '../components/AuthForm'
import logo from '../assets/logo.png'

export default function Signup() {
  const [step, setStep] = useState('registration')
  const [registrationData, setRegistrationData] = useState(null)

  const handleProceed = (data) => {
    setRegistrationData(data)
    setStep('verification')
  }

  const handleVerificationComplete = () => {
    setStep('login')
  }

  return (
    <div className="flex min-h-screen pr-5 bg-white">
      <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
        <header className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <img src={logo} alt="" />
          </div>
          <nav>
            <a href="#" className="text-gray-600 text-lg hover:text-gray-900">Contact</a>
          </nav>
        </header>
        
        <main className="flex flex-grow items-center justify-between space-y-6">
          <div className="w-1/2 pr-8">
            <p className="text-gray-600 text-base p-10">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
            </p>
          </div>
          
          <div className="w-1/2 max-w-lg mr-5">
            <div className="bg-white p-8 rounded-lg shadow-sm border-blue-500 border">
              {step === 'registration' && (
                <AuthForm onProceed={handleProceed} isLogin={false} />
              )}
              {step === 'verification' && (
                <Verification onVerificationComplete={handleVerificationComplete} registrationData={registrationData} />
              )}
              {step === 'login' && (
                <AuthForm isLogin={true} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}