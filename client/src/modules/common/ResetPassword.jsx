import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaKey } from 'react-icons/fa';

function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // Here you would implement the actual password reset logic
      // For now, we'll just show a success message
      setTimeout(() => {
        setMessage('Password reset instructions have been sent to your email.');
        setIsSubmitting(false);
      }, 1500);
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
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
          Reset Your Password
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className={`p-3 rounded ${message.includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-gray-800 text-white p-3 rounded-md hover:bg-gray-900 transition-colors disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Reset Password"}
          </button>
        </form>
        
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
