import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  MessageSquare, 
  PlayCircle,
  Clock
} from 'lucide-react';

const GuideReviews = () => {
  const [reviews] = useState([
    {
      id: 1,
      reviewNumber: 'Review 1',
      date: '2024-02-15',
      status: 'completed',
      qualitativeRating: 'Excellent',
      feedback: 'Excellent progress on the initial implementation. The team has shown great understanding of the technical concepts and implemented them effectively. Documentation could be more detailed in certain areas.',
      criteria: [
        { name: 'Technical Implementation', rating: 'Excellent', feedback: 'Strong technical foundation and clean code implementation.' },
        { name: 'Documentation', rating: 'Satisfactory', feedback: 'Basic documentation present, needs more detailed explanations.' },
        { name: 'Team Collaboration', rating: 'Excellent', feedback: 'Great teamwork and communication demonstrated.' }
      ],
      hasSubmission: true
    },
    {
      id: 2,
      reviewNumber: 'Review 2',
      date: '2024-03-15',
      status: 'pending',
      criteria: [
        { name: 'Technical Implementation', rating: '', feedback: '' },
        { name: 'Documentation', rating: '', feedback: '' },
        { name: 'Team Collaboration', rating: '', feedback: '' }
      ],
      hasSubmission: true
    },
    {
      id: 3,
      reviewNumber: 'Final Review',
      date: '2024-04-15',
      status: 'upcoming',
      criteria: [
        { name: 'Technical Implementation', rating: '', feedback: '' },
        { name: 'Documentation', rating: '', feedback: '' },
        { name: 'Team Collaboration', rating: '', feedback: '' }
      ],
      hasSubmission: false
    }
  ]);

  const [expandedReviews, setExpandedReviews] = useState(new Set());

  const toggleExpand = (reviewId) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const getStatusDetails = (status) => {
    switch (status) {
      case 'completed':
        return {
          icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
          label: 'Completed',
          bgColor: 'bg-emerald-50',
          textColor: 'text-emerald-700'
        };
      case 'pending':
        return {
          icon: <Clock className="w-5 h-5 text-amber-500" />,
          label: 'Pending',
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-700'
        };
      case 'upcoming':
        return {
          icon: <AlertCircle className="w-5 h-5 text-gray-400" />,
          label: 'Not Started',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-600'
        };
      default:
        return {
          icon: <XCircle className="w-5 h-5 text-red-500" />,
          label: 'Error',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700'
        };
    }
  };

  const getRatingColor = (rating) => {
    switch (rating?.toLowerCase()) {
      case 'excellent':
        return 'text-emerald-600';
      case 'satisfactory':
        return 'text-blue-600';
      case 'needs improvement':
        return 'text-amber-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleStartReview = (reviewId) => {
    // Implement review start logic
    console.log('Starting review:', reviewId);
  };

  const handleDownload = (reviewId) => {
    // Implement download logic
    console.log('Downloading submission:', reviewId);
  };

  const handleAddFeedback = (reviewId) => {
    // Implement feedback addition logic
    console.log('Adding feedback:', reviewId);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Project Reviews</h2>

      <div className="space-y-6">
        {reviews.map((review) => {
          const statusDetails = getStatusDetails(review.status);
          const isExpanded = expandedReviews.has(review.id);

          return (
            <div 
              key={review.id} 
              className={`bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md
                ${isExpanded ? 'shadow-md' : ''}`}
            >
              {/* Header Section */}
              <div 
                className="p-6 cursor-pointer"
                onClick={() => toggleExpand(review.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {statusDetails.icon}
                    <h3 className="text-lg font-semibold text-gray-800">{review.reviewNumber}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusDetails.bgColor} ${statusDetails.textColor}`}>
                      {statusDetails.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Due: {review.date}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Quick Summary for Completed Reviews */}
                {review.status === 'completed' && !isExpanded && (
                  <div className="mt-4">
                    <span className={`text-sm font-medium ${getRatingColor(review.qualitativeRating)}`}>
                      Overall: {review.qualitativeRating}
                    </span>
                  </div>
                )}
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-gray-100 p-6">
                  {review.status === 'completed' ? (
                    <>
                      {/* Criteria Section */}
                      <div className="space-y-6 mb-6">
                        {review.criteria.map((criterion, index) => (
                          <div key={index} className="space-y-2">
                            <h4 className="font-medium text-gray-800">{criterion.name}</h4>
                            <div className={`text-sm font-medium ${getRatingColor(criterion.rating)}`}>
                              Rating: {criterion.rating}
                            </div>
                            <p className="text-sm text-gray-600">{criterion.feedback}</p>
                          </div>
                        ))}
                      </div>

                      {/* Overall Feedback */}
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2">Overall Feedback</h4>
                        <p className="text-sm text-gray-600">{review.feedback}</p>
                      </div>
                    </>
                  ) : review.status === 'pending' ? (
                    <div className="space-y-4">
                      <p className="text-gray-600">Student submission is ready for review.</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleStartReview(review.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#9b1a31] text-white rounded-lg hover:bg-[#82001A] transition-colors"
                        >
                          <PlayCircle className="w-4 h-4" />
                          Start Review
                        </button>
                        {review.hasSubmission && (
                          <button
                            onClick={() => handleDownload(review.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download Submission
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500">Review period has not started yet</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {review.status === 'completed' && (
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => handleAddFeedback(review.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Update Feedback
                      </button>
                      {review.hasSubmission && (
                        <button
                          onClick={() => handleDownload(review.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download Submission
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GuideReviews; 