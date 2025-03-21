import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaTrash, FaEye, FaUndo, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

const AdminStudentManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [deletedStudents, setDeletedStudents] = useState([]);
  const studentsPerPage = 10;
  
  // Add new state for confirmation dialog
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    studentId: null
  });

  // Fetch students data
  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      // Fetch both active and deleted students in parallel
      const [activeResponse, deletedResponse] = await Promise.all([
        apiClient.get('/admin/students', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth-storage') ? 
              JSON.parse(localStorage.getItem('auth-storage')).state.token : ''}`
          }
        }),
        apiClient.get('/admin/students/deleted', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth-storage') ? 
              JSON.parse(localStorage.getItem('auth-storage')).state.token : ''}`
          }
        })
      ]);

      console.log(activeResponse);

      if (activeResponse.data.success && deletedResponse.data.success) {
        // Ensure we only set active students in the active list
        const activeStudents = activeResponse.data.students.filter(student => student.isActive);
        setStudents(activeStudents.map(student => ({
          ...student,
          status: 'Active'
        })));

        // Ensure we only set inactive students in the deleted list
        const deletedStudents = deletedResponse.data.students.filter(student => !student.isActive);
        setDeletedStudents(deletedStudents.map(student => ({
          ...student,
          status: 'Inactive'
        })));
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error(error.response?.data?.message || 'Error fetching students');
    } finally {
      setIsLoading(false);
    }
  };

  // Show delete confirmation dialog
  const handleDeleteClick = (studentId) => {
    setDeleteConfirm({
      show: true,
      studentId
    });
  };

  // Handle student deletion with confirmation
  const handleDeleteStudent = async () => {
    if (!deleteConfirm.studentId) return;

    try {
      const response = await apiClient.delete(`/admin/students/${deleteConfirm.studentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-storage') ? 
            JSON.parse(localStorage.getItem('auth-storage')).state.token : ''}`
        }
      });

      if (response.data.success) {
        // Remove student from active list
        const deletedStudent = students.find(s => s.studentID === deleteConfirm.studentId);
        if (deletedStudent) {
          setStudents(prev => prev.filter(s => s.studentID !== deleteConfirm.studentId));
          setDeletedStudents(prev => [...prev, { ...deletedStudent, status: 'Inactive', isActive: false }]);
        }
        toast.success('Student deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error(error.response?.data?.message || 'Error deleting student');
    } finally {
      setDeleteConfirm({
        show: false,
        studentId: null
      });
    }
  };

  // Handle student restoration
  const handleRestoreStudent = async (studentId) => {
    try {
      const response = await apiClient.post(`/admin/students/${studentId}/restore`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-storage') ? 
            JSON.parse(localStorage.getItem('auth-storage')).state.token : ''}`
        }
      });

      if (response.data.success) {
        // Remove student from deleted list and add to active list
        const restoredStudent = deletedStudents.find(s => s.studentID === studentId);
        if (restoredStudent) {
          setDeletedStudents(prev => prev.filter(s => s.studentID !== studentId));
          setStudents(prev => [...prev, { ...restoredStudent, status: 'Active', isActive: true }]);
        }
        toast.success('Student restored successfully');
      }
    } catch (error) {
      console.error('Error restoring student:', error);
      toast.error(error.response?.data?.message || 'Error restoring student');
    }
  };

  // Fetch data when component mounts or when showDeleted changes
  useEffect(() => {
    fetchStudents();
  }, []); // Remove showDeleted from dependency array since we're now fetching both lists at once

  // Filter students based on search term and active/deleted status
  const filteredStudents = React.useMemo(() => {
    const list = showDeleted ? deletedStudents : students;
    return list.filter(student => 
      (student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [showDeleted, students, deletedStudents, searchTerm]);

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
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b1a31]"></div>
          </div>
        ) : (
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
                        student.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        {showDeleted ? (
                          <button 
                            className="text-green-600 hover:text-green-900" 
                            onClick={() => handleRestoreStudent(student.studentID)}
                          >
                            <FaUndo className="w-5 h-5" />
                          </button>
                        ) : (
                          <>
                            <button 
                              className="text-blue-600 hover:text-blue-900"
                              onClick={() => navigate(`/Admin/Students/${student.studentID}`)}
                            >
                              <FaEye className="w-5 h-5" />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900" 
                              onClick={() => handleDeleteClick(student.studentID)}
                            >
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
        )}
        
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

      {/* Confirmation Dialog */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this student? This action can be undone later.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteConfirm({ show: false, studentId: null })}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteStudent}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudentManagement; 