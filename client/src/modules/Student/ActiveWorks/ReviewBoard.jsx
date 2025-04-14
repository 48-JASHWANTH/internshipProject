import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useStore } from '@/store/useStore';
import { toast } from 'react-hot-toast';

const ReviewBoard = ({ projectId }) => {
  const [reviews, setReviews] = useState({ guideReviews: [], inchargeReviews: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useStore();
  
  useEffect(() => {
    const fetchReviews = async () => {
      if (!projectId) return;
      
      try {
        setLoading(true);
        
        const response = await apiClient.get(`/student/team/${projectId}/reviews`, {
          withCredentials: true
        });
        
        if (response.data.success) {
          setReviews({
            guideReviews: response.data.reviews.guideReviews || [],
            inchargeReviews: response.data.reviews.inchargeReviews || []
          });
          setError(null);
        } else {
          setError(response.data.message || 'Failed to fetch reviews');
          toast.error('Failed to load reviews');
        }
      } catch (err) {
        setError('Error loading reviews. Please try again later.');
        toast.error('Error loading reviews');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [projectId]);

  const satisfactionColors = {
    'Excellent': 'bg-green-100 text-green-800',
    'Very Good': 'bg-blue-100 text-blue-800',
    'Good': 'bg-yellow-100 text-yellow-800',
    'Fair': 'bg-orange-100 text-orange-800',
    'Poor': 'bg-red-100 text-red-800'
  };

  const ReviewTable = ({ reviews, title }) => {
    if (!reviews) {
      return null;
    }
    
    return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      {!reviews || reviews.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
          <p className="mt-1 text-sm text-gray-500">Reviews will appear here once conducted.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Review Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Satisfaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feedback
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reviews.map((review, index) => (
                <tr key={review._id || index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {review.reviewName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(review.dateOfReview).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${satisfactionColors[review.satisfactionLevel]}`}>
                      {review.satisfactionLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {review.progress}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                    <div className="truncate">
                      {review.feedback}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9b1a31]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-red-600">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-[#9b1a31] text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Project Reviews</h1>
        <p className="text-gray-600">Track all reviews and feedback for your project</p>
      </div>

      <ReviewTable reviews={reviews.guideReviews} title="Guide Reviews" />
      <ReviewTable reviews={reviews.inchargeReviews} title="Incharge Reviews" />
    </div>
  );
};

export default ReviewBoard; 