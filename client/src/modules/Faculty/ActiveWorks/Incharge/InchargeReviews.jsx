import React, { useState, useMemo } from 'react';
import { 
  CheckCircle, 
  Plus,
  Calendar,
  AlertCircle
} from 'lucide-react';
import AddReviewModal from './components/AddReviewModal';
import { useStore } from '@/store/useStore';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ReviewCard = ({ review }) => {
  const satisfactionColors = {
    'Excellent': 'bg-purple-100 text-purple-800',
    'Very Good': 'bg-blue-100 text-blue-800', 
    'Good': 'bg-yellow-100 text-yellow-800',
    'Fair': 'bg-orange-100 text-orange-800',
    'Poor': 'bg-red-100 text-red-800'
  };

  // Format date or provide a default
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{review.reviewName}</h3>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {formatDate(review.dateOfReview || review.dueDate)}
          </span>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${satisfactionColors[review.satisfactionLevel] || 'bg-gray-100 text-gray-800'}`}>
          {review.satisfactionLevel || 'Not Rated'}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700">Remarks</h4>
          <p className="mt-1 text-sm text-gray-600">{review.remarks || 'No remarks provided'}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700">Detailed Feedback</h4>
          <p className="mt-1 text-sm text-gray-600">{review.feedback || 'No feedback provided'}</p>
        </div>
        
        {review.changesToBeMade && (
          <div>
            <h4 className="text-sm font-medium text-gray-700">Changes To Be Made</h4>
            <p className="mt-1 text-sm text-gray-600">{review.changesToBeMade}</p>
          </div>
        )}
        
        {review.presentees && review.presentees.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700">Presentees</h4>
            <p className="mt-1 text-sm text-gray-600">{review.presentees.join(', ')}</p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t flex items-center gap-2 text-green-600">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Reviewed</span>
      </div>
    </div>
  );
};

const InchargeReviews = ({ projectId }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { activeProjects, user, fetchLeadedProjects } = useStore();
  
  // Find the team data
  const team = useMemo(() => {
    if (!activeProjects?.teams) return null;
    return activeProjects.teams.find(t => t.teamId === projectId);
  }, [activeProjects, projectId]);
  
  // Get reviews directly from the team object
  const reviews = useMemo(() => {
    return team?.reviews || [];
  }, [team]);
  
  const handleAddReview = async (newReview) => {
    try {
      setIsLoading(true);
      const reviewData = {
        ...newReview,
        assignedBy: {
          name: user?.name || 'Faculty',
          type: 'Incharge',
          facultyID: user?.facultyID
        }
      };
      
      const response = await apiClient.post(`/faculty/team/${projectId}/review`, 
        reviewData, 
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // Refresh the team data to get the updated reviews
        if (user?.facultyID) {
          await useStore.getState().fetchLeadedProjects(user.facultyID);
        }
        toast.success('Review added successfully');
      } else {
        toast.error('Failed to add review');
      }
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('Error adding review');
    } finally {
      setIsLoading(false);
      setIsAddModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b1a31]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Reviews</h2>
          <p className="text-gray-500 mt-1">Manage and track reviews</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#9b1a31] text-white rounded-lg hover:bg-[#82001A] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Review
        </button>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No reviews have been conducted yet.</p>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 text-[#9b1a31] hover:underline"
            >
              Schedule the first review
            </button>
          </div>
        ) : (
          reviews.map(review => (
            <ReviewCard key={review._id} review={review} />
          ))
        )}
      </div>

      {isAddModalOpen && (
        <AddReviewModal 
          onClose={() => setIsAddModalOpen(false)} 
          onAddReview={handleAddReview}
          teamMembers={team?.listOfStudents || []}
        />
      )}
    </div>
  );
};

export default InchargeReviews; 