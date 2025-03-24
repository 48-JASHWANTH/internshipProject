import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaTrash, FaEye, FaUndo, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

const AdminFacultyManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [faculty, setFaculty] = useState([]);
  const [deletedFaculty, setDeletedFaculty] = useState([]);
  const facultyPerPage = 10;
  
  // Add state for confirmation dialog
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    facultyId: null
  });

  // Fetch faculty data
  const fetchFaculty = async () => {
    setIsLoading(true);
    try {
      // Fetch both active and deleted faculty in parallel
      const [activeResponse, deletedResponse] = await Promise.all([
        apiClient.get('/admin/faculty',{withCredentials: true} ),
        apiClient.get('/admin/faculty/deleted', {withCredentials: true})
      ]);

      if (activeResponse.data.success && deletedResponse.data.success) {
        // Ensure we only set active faculty in the active list
        // Note: softDeleted=false means active faculty
        const activeFaculty = activeResponse.data.faculties.filter(member => !member.softDeleted);
        setFaculty(activeFaculty.map(member => ({
          ...member,
          status: 'Active'
        })));

        // Ensure we only set inactive faculty in the deleted list
        // Note: softDeleted=true means deleted faculty
        const inactiveFaculty = deletedResponse.data.faculties.filter(member => member.softDeleted);
        setDeletedFaculty(inactiveFaculty.map(member => ({
          ...member,
          status: 'Inactive'
        })));
      }
    } catch (error) {
      console.error('Error fetching faculty:', error);
      toast.error(error.response?.data?.message || 'Error fetching faculty');
    } finally {
      setIsLoading(false);
    }
  };

  // Show delete confirmation dialog
  const handleDeleteClick = (facultyId) => {
    setDeleteConfirm({
      show: true,
      facultyId
    });
  };

  // Handle faculty deletion with confirmation
  const handleDeleteFaculty = async () => {
    if (!deleteConfirm.facultyId) return;

    try {
      const response = await apiClient.delete(`/admin/faculty/${deleteConfirm.facultyId}`, {withCredentials: true});

      if (response.data.success) {
        // Remove faculty from active list and add to deleted list
        const deletedMember = faculty.find(f => f.facultyID === deleteConfirm.facultyId);
        if (deletedMember) {
          setFaculty(prev => prev.filter(f => f.facultyID !== deleteConfirm.facultyId));
          setDeletedFaculty(prev => [...prev, { ...deletedMember, status: 'Inactive', softDeleted: true }]);
        }
        toast.success('Faculty deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting faculty:', error);
      toast.error(error.response?.data?.message || 'Error deleting faculty');
    } finally {
      setDeleteConfirm({
        show: false,
        facultyId: null
      });
    }
  };

  // Handle faculty restoration
  const handleRestoreFaculty = async (facultyId) => {
    try {
      const response = await apiClient.post(`/admin/faculty/${facultyId}/restore`);

      if (response.data.success) {
        // Remove faculty from deleted list and add to active list
        const restoredMember = deletedFaculty.find(f => f.facultyID === facultyId);
        if (restoredMember) {
          setDeletedFaculty(prev => prev.filter(f => f.facultyID !== facultyId));
          setFaculty(prev => [...prev, { ...restoredMember, status: 'Active', softDeleted: false }]);
        }
        toast.success('Faculty restored successfully');
      }
    } catch (error) {
      console.error('Error restoring faculty:', error);
      toast.error(error.response?.data?.message || 'Error restoring faculty');
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchFaculty();
  }, []);

  // Filter faculty based on search term and active/deleted status
  const filteredFaculty = React.useMemo(() => {
    const list = showDeleted ? deletedFaculty : faculty;
    return list.filter(member => 
      (member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.facultyID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [showDeleted, faculty, deletedFaculty, searchTerm]);

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
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div className="relative mb-4 md:mb-0 md:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search faculty..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9b1a31]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showDeleted}
                onChange={() => setShowDeleted(!showDeleted)}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#9b1a31]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9b1a31]"></div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                {showDeleted ? 'Showing Deleted Faculty' : 'Showing Active Faculty'}
              </span>
            </label>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b1a31]"></div>
          </div>
        ) : filteredFaculty.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {showDeleted ? 'No deleted faculty found.' : 'No faculty found.'}
          </div>
        ) : (
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
                    Email
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
                {currentFaculty.map((member) => (
                  <tr key={member.facultyID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {member.facultyID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        {showDeleted ? (
                          <button 
                            className="text-green-600 hover:text-green-900" 
                            onClick={() => handleRestoreFaculty(member.facultyID)}
                          >
                            <FaUndo className="w-5 h-5" />
                          </button>
                        ) : (
                          <>
                            <button 
                              className="text-blue-600 hover:text-blue-900"
                              onClick={() => navigate(`/Admin/Faculty/${member.facultyID}`)}
                            >
                              <FaEye className="w-5 h-5" />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900" 
                              onClick={() => handleDeleteClick(member.facultyID)}
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
        {filteredFaculty.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
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
        )}
      </div>

      {/* Confirmation Dialog */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this faculty member? This action can be undone later.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteConfirm({ show: false, facultyId: null })}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteFaculty}
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

export default AdminFacultyManagement; 