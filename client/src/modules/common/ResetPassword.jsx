import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  // For password reset form
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  
  // For password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check if there's a token in the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    const userTypeParam = params.get('userType');
    
    if (tokenParam) {
      setToken(tokenParam);
      if (userTypeParam) setUserType(userTypeParam);
      setShowResetForm(true);
      
      // Verify token validity
      verifyToken(tokenParam, userTypeParam);
    }
  }, [location]);

  const verifyToken = async (tokenValue, userTypeValue) => {
    try {
      const response = await axios.get(`http://localhost:1544/auth/verify-token?token=${tokenValue}&userType=${userTypeValue || userType}`);
      if (response.data.success) {
        setMessage('Please enter your new password');
        setMessageType('success');
      } else {
        setMessage('Invalid or expired token. Please request a new password reset link.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Invalid or expired token. Please request a new password reset link.');
      setMessageType('error');
    }
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:1544/auth/request-reset', {
        email,
        userType
      });
      
      if (response.data.success) {
        setMessage('Password reset instructions have been sent to your email.');
        setMessageType('success');
        
        // For development, show the preview URL
        if (response.data.previewUrl) {
          console.log('Email preview URL:', response.data.previewUrl);
        }
      } else {
        setMessage(response.data.message || 'An error occurred. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setMessageType('error');
      return;
    }
    
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:1544/auth/reset-password', {
        token,
        userType,
        password
      });
      
      if (response.data.success) {
        setMessage('Your password has been reset successfully. You can now login with your new password.');
        setMessageType('success');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setMessage(response.data.message || 'An error occurred. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-800 to-gray-600 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-gray-100 p-3 rounded-full">
            <FaKey className="text-gray-700 text-2xl" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          {showResetForm ? "Set New Password" : "Reset Your Password"}
        </h2>
        <p className="text-center text-gray-600 mb-6">
          {showResetForm 
            ? "Enter your new password below." 
            : "Enter your email address and we'll send you instructions to reset your password."}
        </p>
        
        {showResetForm ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-gray-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your new password"
                  minLength="6"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block mb-2 font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-gray-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm your new password"
                  minLength="6"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            
            {message && (
              <div className={`p-3 rounded ${messageType === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-gray-800 text-white p-3 rounded-md hover:bg-gray-900 transition-colors disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Reset Password"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="userType" className="block mb-2 font-medium text-gray-700">
                User Type
              </label>
              <select
                id="userType"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-gray-500"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            {message && (
              <div className={`p-3 rounded ${messageType === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-gray-800 text-white p-3 rounded-md hover:bg-gray-900 transition-colors disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Request Password Reset"}
            </button>
          </form>
        )}
        
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-gray-700 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
