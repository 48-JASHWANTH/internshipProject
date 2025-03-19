import React, { useState } from 'react';
import { FaSearch, FaPlus, FaTrash, FaEdit, FaUndo, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminStudentManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;
  
  // Mock data - replace with actual API calls
  const studentList = [
    { studentID: '22071A3262', name: 'John Smith', department: 'CSE', batch: '2022-26', status: 'Active' },
    { studentID: '22071A3263', name: 'Jane Doe', department: 'IT', batch: '2022-26', status: 'Active' },
    { studentID: '22071A3264', name: 'Michael Johnson', department: 'CSE', batch: '2022-26', status: 'Active' },
    { studentID: '22071A3265', name: 'Emily Davis', department: 'ECE', batch: '2022-26', status: 'Active' },
    { studentID: '22071A3266', name: 'David Wilson', department: 'MECH', batch: '2022-26', status: 'Active' },
    { studentID: '22071A3267', name: 'Sarah Martinez', department: 'IT', batch: '2022-26', status: 'Active' },
    { studentID: '22071A3268', name: 'James Taylor', department: 'CSE', batch: '2022-26', status: 'Active' },
    { studentID: '22071A3269', name: 'Jennifer Anderson', department: 'ECE', batch: '2022-26', status: 'Active' },
    { studentID: '22071A3270', name: 'Robert Thomas', department: 'MECH', batch: '2022-26', status: 'Active' },
    { studentID: '22071A3271', name: 'Lisa Jackson', department: 'IT', batch: '2022-26', status: 'Active' },
    { studentID: '22071A3272', name: 'Daniel White', department: 'CSE', batch: '2022-26', status: 'Active' },
    { studentID: '22071A3273', name: 'Michelle Harris', department: 'ECE', batch: '2022-26', status: 'Active' },
    { studentID: '22071A3274', name: 'Christopher Martin', department: 'MECH', batch: '2022-26', status: 'Active' },
    { studentID: '22071A3275', name: 'Jessica Thompson', department: 'IT', batch: '2022-26', status: 'Active' },
    { studentID: '22071A3276', name: 'Matthew Garcia', department: 'CSE', batch: '2022-26', status: 'Active' },
    { studentID: '22071A3277', name: 'Amanda Martinez', department: 'ECE', batch: '2022-26', status: 'Active' },
    { studentID: '22071A3278', name: 'Andrew Robinson', department: 'MECH', batch: '2022-26', status: 'Active' },
    { studentID: '22071A3279', name: 'Stephanie Clark', department: 'IT', batch: '2022-26', status: 'Active' },
    { studentID: '22071A3280', name: 'Joshua Rodriguez', department: 'CSE', batch: '2022-26', status: 'Active' },
    { studentID: '22071A3281', name: 'Nicole Lewis', department: 'ECE', batch: '2022-26', status: 'Active' },
    { studentID: '22071A3282', name: 'Kevin Lee', department: 'MECH', batch: '2022-26', status: 'Active' },
    { studentID: '22071A3283', name: 'Rebecca Walker', department: 'IT', batch: '2022-26', status: 'Active' }
  ];
  
  const deletedStudents = [
    { studentID: '22071A3284', name: 'Robert Johnson', department: 'CSE', batch: '2022-26', status: 'Inactive' },
    { studentID: '22071A3285', name: 'Maria Garcia', department: 'IT', batch: '2022-26', status: 'Inactive' },
    { studentID: '22071A3286', name: 'William Brown', department: 'ECE', batch: '2022-26', status: 'Inactive' }
  ];

  const displayedStudents = showDeleted ? deletedStudents : studentList;
  const filteredStudents = displayedStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
        <button 
          onClick={() => navigate('/Admin/AddStudent')}
          className="bg-[#9b1a31] text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FaPlus /> Add Student
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search students..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-[#9b1a31]"
                checked={showDeleted}
                onChange={() => {
                  setShowDeleted(!showDeleted);
                  setCurrentPage(1); // Reset to first page when toggling
                }}
              />
              <span className="ml-2 text-gray-700">Show Deleted</span>
            </label>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentStudents.map((student) => (
                <tr key={student.studentID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.studentID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.batch}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      {showDeleted ? (
                        <button className="text-green-600 hover:text-green-900">
                          <FaUndo className="w-5 h-5" />
                        </button>
                      ) : (
                        <>
                          <button className="text-blue-600 hover:text-blue-900">
                            <FaEdit className="w-5 h-5" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <FaTrash className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstStudent + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastStudent, filteredStudents.length)}
                </span>{' '}
                of <span className="font-medium">{filteredStudents.length}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                    currentPage === 1 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                
                {/* Page numbers */}
                {[...Array(totalPages).keys()].map(number => (
                  <button
                    key={number + 1}
                    onClick={() => paginate(number + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      currentPage === number + 1
                        ? 'z-10 bg-[#9b1a31] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b1a31]'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    }`}
                  >
                    {number + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                    currentPage === totalPages 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentManagement; 