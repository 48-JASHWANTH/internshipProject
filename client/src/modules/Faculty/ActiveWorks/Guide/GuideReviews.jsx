import React, { useState, useMemo } from 'react';
import { 
  CheckCircle, 
  Plus,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import AddReviewModal from './components/AddReviewModal';
import { useStore } from '@/store/useStore';

const ReviewCard = ({ review }) => {
  const satisfactionColors = {
    'Excellent': 'bg-purple-100 text-purple-800',
    'Very Good': 'bg-blue-100 text-blue-800', 
    'Good': 'bg-yellow-100 text-yellow-800',
    'Fair': 'bg-orange-100 text-orange-800',
    'Poor': 'bg-red-100 text-red-800'
  };

  const reviewDate = review.dateOfReview ? new Date(review.dateOfReview) : null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{review.reviewName}</h3>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {reviewDate ? format(reviewDate, 'MMMM d, yyyy') : 'Date not specified'}
          </span>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          satisfactionColors[review.satisfactionLevel] || 'bg-gray-100 text-gray-800'
        }`}>
          {review.satisfactionLevel || 'Not rated'}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700">Remarks</h4>
          <p className="mt-1 text-sm text-gray-600">{review.remarks || 'No remarks provided'}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700">Detailed Feedback</h4>
          <p className="mt-1 text-sm text-gray-600">{review.feedback || 'No detailed feedback provided'}</p>
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
            <div className="mt-1 flex flex-wrap gap-2">
              {review.presentees.map(studentId => (
                <span key={studentId} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  {studentId}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t flex items-center gap-2 text-green-600">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm font-medium">
          {review.reviewStatus === 'reviewed' ? 'Reviewed' : 'Pending'}
        </span>
      </div>
    </div>
  );
};

const GuideReviews = ({ projectId, project }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { user, addGuidedProjectReview } = useStore();

  const reviews = useMemo(() => {
    if (!project || !project.reviews) return [];
    
    // Sort reviews by date (newest first)
    return [...project.reviews].sort((a, b) => {
      const dateA = a.dateOfReview ? new Date(a.dateOfReview) : new Date(0);
      const dateB = b.dateOfReview ? new Date(b.dateOfReview) : new Date(0);
      return dateB - dateA;
    });
  }, [project]);

  const handleAddReview = (newReview) => {
    // Add faculty information to the review
    const reviewWithFaculty = {
      ...newReview,
      assignedBy: {
        name: user?.name || 'Faculty',
        type: 'Guide',
        facultyID: user?.facultyID || ''
      },
      reviewStatus: 'reviewed'
    };
    
    // Add to store
    addGuidedProjectReview(projectId, reviewWithFaculty);
    
    // Close modal
    setIsAddModalOpen(false);
  };

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

      {reviews.length === 0 ? (
        <div className="bg-white rounded-xl p-8 shadow-sm text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            This project doesn't have any reviews yet. Add a review to provide feedback to the team.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-[#9b1a31] text-white rounded-lg hover:bg-[#82001A] transition-colors"
          >
            Add First Review
          </button>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          {reviews.map(review => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      )}

      {isAddModalOpen && (
        <AddReviewModal 
          onClose={() => setIsAddModalOpen(false)} 
          onAddReview={handleAddReview}
          teamMembers={project?.listOfStudents || []}
          projectId={projectId}
        />
      )}
    </div>
  );
};

export default GuideReviews; 