import React, { useState } from 'react';
import { 
  CheckCircle, 
  Plus,
  X,
  Calendar
} from 'lucide-react';
import AddReviewModal from './components/AddReviewModal';

// Mock Data
const reviewsData = [
    {
      id: 1,
    reviewName: "Abstract Review",
    dueDate: "2024-04-01",
    satisfactionLevel: "Excellent",
    remarks: "Well structured abstract",
    feedback: "The team has demonstrated excellent understanding of the project scope. The abstract clearly outlines the problem statement, methodology, and expected outcomes.",
    status: "reviewed"
    },
    {
      id: 2,
    reviewName: "Literature Review",
    dueDate: "2024-04-15",
    satisfactionLevel: "Very Good",
    remarks: "Comprehensive coverage of existing solutions",
    feedback: "Good analysis of existing solutions. The team has covered most of the relevant papers and technologies. Some recent papers could be added to strengthen the review.",
    status: "reviewed"
  }
];

const ReviewCard = ({ review }) => {
  const satisfactionColors = {
    'Excellent': 'bg-purple-100 text-purple-800',
    'Very Good': 'bg-blue-100 text-blue-800', 
    'Good': 'bg-yellow-100 text-yellow-800',
    'Fair': 'bg-orange-100 text-orange-800',
    'Poor': 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{review.reviewName}</h3>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {new Date(review.dueDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${satisfactionColors[review.satisfactionLevel]}`}>
          {review.satisfactionLevel}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700">Remarks</h4>
          <p className="mt-1 text-sm text-gray-600">{review.remarks}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700">Detailed Feedback</h4>
          <p className="mt-1 text-sm text-gray-600">{review.feedback}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t flex items-center gap-2 text-green-600">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Reviewed</span>
      </div>
    </div>
  );
};

const InchargeReviews = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
        {reviewsData.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {isAddModalOpen && (
        <AddReviewModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
};

export default InchargeReviews; 