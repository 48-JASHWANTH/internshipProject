import React, { useState } from 'react';
import { FaSearch, FaPlus, FaTrash, FaEdit, FaUndo, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminFacultyManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const facultyPerPage = 10;
  
  // Mock data - replace with actual API calls
  const facultyList = [
    { facultyID: 'FAC12345', name: 'Dr. John Smith', department: 'Computer Science', status: 'Active' },
    { facultyID: 'FAC12346', name: 'Dr. Jane Doe', department: 'Information Technology', status: 'Active' },
    { facultyID: 'FAC12347', name: 'Dr. Michael Brown', department: 'Computer Science', status: 'Active' },
    { facultyID: 'FAC12348', name: 'Dr. Sarah Williams', department: 'Electronics & Communication', status: 'Active' },
    { facultyID: 'FAC12349', name: 'Dr. David Johnson', department: 'Mechanical Engineering', status: 'Active' },
    { facultyID: 'FAC12350', name: 'Dr. Emily Davis', department: 'Information Technology', status: 'Active' },
    { facultyID: 'FAC12351', name: 'Dr. Robert Wilson', department: 'Computer Science', status: 'Active' },
    { facultyID: 'FAC12352', name: 'Dr. Jennifer Taylor', department: 'Electronics & Communication', status: 'Active' },
    { facultyID: 'FAC12353', name: 'Dr. Thomas Anderson', department: 'Mechanical Engineering', status: 'Active' },
    { facultyID: 'FAC12354', name: 'Dr. Lisa Martinez', department: 'Information Technology', status: 'Active' },
    { facultyID: 'FAC12355', name: 'Dr. Daniel White', department: 'Computer Science', status: 'Active' },
    { facultyID: 'FAC12356', name: 'Dr. Michelle Harris', department: 'Electronics & Communication', status: 'Active' },
    { facultyID: 'FAC12357', name: 'Dr. Christopher Martin', department: 'Mechanical Engineering', status: 'Active' },
    { facultyID: 'FAC12358', name: 'Dr. Jessica Thompson', department: 'Information Technology', status: 'Active' },
    { facultyID: 'FAC12359', name: 'Dr. Matthew Garcia', department: 'Computer Science', status: 'Active' },
    { facultyID: 'FAC12360', name: 'Dr. Amanda Rodriguez', department: 'Electronics & Communication', status: 'Active' },
    { facultyID: 'FAC12361', name: 'Dr. Andrew Lewis', department: 'Mechanical Engineering', status: 'Active' },
    { facultyID: 'FAC12362', name: 'Dr. Stephanie Clark', department: 'Information Technology', status: 'Active' }
  ];
  
  const deletedFaculty = [
    { facultyID: 'FAC12363', name: 'Dr. Robert Johnson', department: 'Computer Science', status: 'Inactive' },
    { facultyID: 'FAC12364', name: 'Dr. Maria Garcia', department: 'Information Technology', status: 'Inactive' },
    { facultyID: 'FAC12365', name: 'Dr. William Brown', department: 'Electronics & Communication', status: 'Inactive' }
  ];

  const displayedFaculty = showDeleted ? deletedFaculty : facultyList;
  const filteredFaculty = displayedFaculty.filter(faculty => 
    faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.facultyID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredFaculty.length / facultyPerPage);
  const indexOfLastFaculty = currentPage * facultyPerPage;
  const indexOfFirstFaculty = indexOfLastFaculty - facultyPerPage;
  const currentFaculty = filteredFaculty.slice(indexOfFirstFaculty, indexOfLastFaculty);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Faculty Management</h1>
        <button 
          onClick={() => navigate('/Admin/AddFaculty')}
          className="bg-[#9b1a31] text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FaPlus /> Add Faculty
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search faculty..."
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
                  Faculty ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
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
              {currentFaculty.map((faculty) => (
                <tr key={faculty.facultyID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {faculty.facultyID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {faculty.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {faculty.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      faculty.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {faculty.status}
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
                Showing <span className="font-medium">{indexOfFirstFaculty + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastFaculty, filteredFaculty.length)}
                </span>{' '}
                of <span className="font-medium">{filteredFaculty.length}</span> results
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

export default AdminFacultyManagement; 