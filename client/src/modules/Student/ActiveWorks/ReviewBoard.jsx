import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Pencil, CheckCircle, XCircle, Info } from 'lucide-react';
import useActiveWorksStore from '../../../store/activeWorksStore';
const ReviewPage = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const { activeWorks, updateProjectReview } = useActiveWorksStore();
  const project = activeWorks.find(work => work.id === projectId);
  const reviews = project?.reviews || [];
  const isGuide = project.facultyEmail === user?.email;

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editForm, setEditForm] = useState({ score: '', remarks: '' });

  const handleEditClick = (review) => {
    setEditingReviewId(review.id);
    setEditForm({ score: review.score, remarks: review.feedback });
  };

  const handleSaveClick = (reviewId) => {
    if (editForm.score < 0 || editForm.score > 10) {
      alert('Score must be between 0 and 10');
      return;
    }
    updateProjectReview(projectId, reviewId, {
      ...reviews.find(r => r.id === reviewId),
      score: editForm.score,
      feedback: editForm.remarks,
      status: 'Completed'
    });
    setEditingReviewId(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Review Table */}
      <div className="overflow-hidden bg-white shadow-sm rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Review Number
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Review Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Criteria
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guide Remarks
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              {isGuide && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map((review, index) => (
              <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Review {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {review.date}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span>Innovation, Execution, Documentation</span>
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingReviewId === review.id ? (
                    <input
                      type="number"
                      value={editForm.score}
                      onChange={(e) => setEditForm({ ...editForm, score: e.target.value })}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                      min="0"
                      max="10"
                    />
                  ) : (
                    <span className="font-medium">{review.score}/10</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {editingReviewId === review.id ? (
                    <textarea
                      value={editForm.remarks}
                      onChange={(e) => setEditForm({ ...editForm, remarks: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
                      rows="2"
                      maxLength="250"
                    />
                  ) : (
                    review.feedback
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    review.status === 'Completed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {review.status === 'Completed' ? (
                      <CheckCircle className="w-4 h-4 mr-1" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-1" />
                    )}
                    {review.status}
                  </span>
                </td>
                {isGuide && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editingReviewId === review.id ? (
                      <button
                        onClick={() => handleSaveClick(review.id)}
                        className="text-[#9b1a31] hover:text-[#7d1527] font-medium transition-colors"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditClick(review)}
                        className="text-[#9b1a31] hover:text-[#7d1527] font-medium transition-colors inline-flex items-center gap-1"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewPage; 