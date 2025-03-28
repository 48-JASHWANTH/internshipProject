import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {Calendar } from 'lucide-react';
import { useStore } from '@/store/useStore';

const ReviewPage = () => {
  const { projectId } = useParams();
  const { projects, updateProject } = useStore();
  const project = projects.find(work => work.id === projectId);
  
  // Map satisfaction levels to their color schemes
  const satisfactionColors = {
    'Excellent': 'bg-purple-100 text-purple-800',
    'Very Good': 'bg-blue-100 text-blue-800', 
    'Good': 'bg-yellow-100 text-yellow-800',
    'Fair': 'bg-orange-100 text-orange-800',
    'Poor': 'bg-red-100 text-red-800'
  };

  // Static data for guide reviews
  const guideReviews = [
    {
      id: "g1",
      reviewName: "Initial Design Review",
      date: "2024-05-10",
      remarks: "Good initial design approach, need to improve documentation",
      feedback: "The project concept is strong but you need to elaborate more on the technical implementation details. Consider adding sequence diagrams to explain the workflow better.",
      satisfactionLevel: "Good",
      status: "Completed",
      type: "faculty"
    },
    {
      id: "g2",
      reviewName: "Prototype Evaluation",
      date: "2024-06-05",
      remarks: "Prototype meets basic requirements",
      feedback: "The prototype demonstrates core functionality but lacks error handling. Focus on edge cases and user feedback in your next iteration. UI needs more polishing.",
      satisfactionLevel: "Very Good",
      status: "Completed",
      type: "faculty"
    },
    {
      id: "g3",
      reviewName: "Code Quality Assessment",
      date: "2024-06-20",
      remarks: "Code structure needs improvement",
      feedback: "While the application works, the code organization could be better. Consider implementing design patterns and breaking down components further. Documentation is minimal.",
      satisfactionLevel: "Fair",
      status: "Completed",
      type: "faculty"
    }
  ];

  // Static data for incharge reviews
  const inchargeReviews = [
    {
      id: "i1",
      reviewName: "Abstract Review",
      dueDate: "2024-04-01",
      remarks: "Well structured abstract",
      feedback: "The team has demonstrated excellent understanding of the project scope. The abstract clearly outlines the problem statement, methodology, and expected outcomes.",
      satisfactionLevel: "Excellent",
      status: "reviewed",
      type: "incharge"
    },
    {
      id: "i2",
      reviewName: "Literature Review",
      dueDate: "2024-04-15",
      remarks: "Comprehensive coverage of existing solutions",
      feedback: "Good analysis of existing solutions. The team has covered most of the relevant papers and technologies. Some recent papers could be added to strengthen the review.",
      satisfactionLevel: "Very Good",
      status: "reviewed",
      type: "incharge"
    },
    {
      id: "i3",
      reviewName: "Midterm Progress Review",
      dueDate: "2024-05-20",
      remarks: "On track with project timeline",
      feedback: "Project is progressing according to the proposed timeline. Technical implementation is sound. Need to address the feedback from the initial user testing more thoroughly in the next phase.",
      satisfactionLevel: "Good",
      status: "reviewed",
      type: "incharge"
    }
  ];

  // Use static data but would fallback to project data in production
  // const facultyReviews = reviews.filter(review => review.type === 'faculty' || !review.type);
  // const inchargeReviews = reviews.filter(review => review.type === 'incharge');

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <div className="space-y-10">
        {/* Guide Reviews Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-center">
            <h3 className="text-2xl font-bold text-gray-900">Guide Reviews</h3>
          </div>
          {guideReviews.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No guide reviews available yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Review Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remarks
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Detailed Feedback
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Satisfaction Level
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {guideReviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {review.reviewName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{review.date || review.dueDate}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {review.remarks || "No remarks provided"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-md">
                          {review.feedback || "No detailed feedback provided"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {review.satisfactionLevel ? (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${satisfactionColors[review.satisfactionLevel]}`}>
                            {review.satisfactionLevel}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Incharge Reviews Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-center">
            <h3 className="text-2xl font-bold text-gray-900">Incharge Reviews</h3>
          </div>
          
          {inchargeReviews.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No incharge reviews available yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Review Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remarks
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Detailed Feedback
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Satisfaction Level
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inchargeReviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {review.reviewName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{review.dueDate || review.date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {review.remarks || "No remarks provided"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-md">
                          {review.feedback || "No detailed feedback provided"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {review.satisfactionLevel ? (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${satisfactionColors[review.satisfactionLevel]}`}>
                            {review.satisfactionLevel}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage; 