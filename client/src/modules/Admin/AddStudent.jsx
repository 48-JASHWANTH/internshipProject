import React, { useState, useCallback } from 'react';
import { FaArrowLeft, FaUpload, FaUserPlus, FaFileExcel, FaUser, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';

const AddStudent = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState('');
  const [formData, setFormData] = useState({
    studentID: '',
    name: '',
    department: '',
    batch: ''
  });
  const [excelFormData, setExcelFormData] = useState({
    department: '',
    batch: ''
  });
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const departments = ['CSE', 'CSBS', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'];

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleExcelFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setExcelFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.includes('excel') || 
          droppedFile.name.endsWith('.xlsx') || 
          droppedFile.name.endsWith('.xls')) {
        setFile(droppedFile);
        processExcelFile(droppedFile);
      } else {
        toast.error('Please upload an Excel file (.xlsx or .xls)');
      }
    }
  }, []);

  const processExcelFile = (selectedFile) => {
    if (!selectedFile) return;
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Validate data format - looking for RollNo and Name columns
        const validData = jsonData.filter(row => 
          (row.RollNo || row.studentID) && 
          (row.Name || row.name)
        );
        
        // Normalize the data to use consistent field names
        const normalizedData = validData.map(row => ({
          studentID: row.RollNo || row.studentID,
          name: row.Name || row.name
        }));
        
        if (normalizedData.length === 0) {
          toast.error('No valid data found in the Excel file. Please ensure it has RollNo and Name columns.');
          setFile(null);
          return;
        }
        
        // Show preview of first 5 entries
        const previewEntries = normalizedData.slice(0, 5);
        setPreviewData(previewEntries);
        toast.success(`Found ${normalizedData.length} student records`);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        toast.error('Error reading file. Please make sure it\'s a valid Excel file.');
        setFile(null);
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    processExcelFile(selectedFile);
  }, []);

  const handleManualSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { studentID, name, department, batch } = formData;
    
    // Validate inputs
    if (!studentID || !name || !department || !batch) {
      toast.error('All fields are required');
      setIsLoading(false);
      return;
    }
    
    try {
      // Format the data according to the API structure
      const payload = {
        students: {
          [studentID]: name
        },
        department,
        batch
      };
      
      const response = await apiClient.post('/admin/add-students', payload, {withCredentials: true});
      
      if (response.data.success) {
        toast.success('Student added successfully');
        navigate('/Admin/Students');
      } else {
        toast.error(response.data.message || 'Failed to add student');
      }
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error(error.response?.data?.message || 'An error occurred while adding the student');
    } finally {
      setIsLoading(false);
    }
  }, [formData, navigate]);

  const handleExcelSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!file) {
      toast.error('Please select a file');
      setIsLoading(false);
      return;
    }
    
    if (!excelFormData.department || !excelFormData.batch) {
      toast.error('Department and Batch are required');
      setIsLoading(false);
      return;
    }
    
    try {
      // Convert Excel data to the format expected by the API
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const data = evt.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Format data according to the API structure
          const students = {};
          jsonData.forEach(row => {
            const studentID = row.RollNo || row.studentID;
            const name = row.Name || row.name;
            if (studentID && name) {
              students[studentID] = name;
            }
          });
          
          if (Object.keys(students).length === 0) {
            toast.error('No valid student data found in the file');
            setIsLoading(false);
            return;
          }
          
          const payload = {
            students,
            department: excelFormData.department,
            batch: excelFormData.batch
          };
          
          const response = await apiClient.post('/admin/add-students', payload, {withCredentials: true});
          
          if (response.data.success) {
            toast.success(`Successfully imported ${Object.keys(students).length} students`);
            navigate('/Admin/Students');
          } else {
            toast.error(response.data.message || 'Failed to import students');
          }
        } catch (error) {
          console.error('Error processing Excel data:', error);
          toast.error(error.response?.data?.message || 'An error occurred while importing students');
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsBinaryString(file);
    } catch (error) {
      console.error('Error reading file:', error);
      toast.error('Error reading file');
      setIsLoading(false);
    }
  }, [file, excelFormData, navigate]);

  const goBack = () => {
    setMethod('');
  };

  const renderMethodSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        onClick={() => setMethod('manual')}
        className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300 border-2 border-transparent hover:border-[#9b1a31]"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-14 h-14 rounded-full bg-[#9b1a31]/10 flex items-center justify-center">
            <FaUser className="text-[#9b1a31] text-2xl" />
          </div>
          <FaChevronRight className="text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Add Single Student</h3>
        <p className="text-gray-600">Manually add a student with all required details.</p>
      </div>
      
      <div 
        onClick={() => setMethod('excel')}
        className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300 border-2 border-transparent hover:border-[#9b1a31]"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-14 h-14 rounded-full bg-[#9b1a31]/10 flex items-center justify-center">
            <FaFileExcel className="text-[#9b1a31] text-2xl" />
          </div>
          <FaChevronRight className="text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Bulk Import</h3>
        <p className="text-gray-600">Import multiple students from an Excel file.</p>
      </div>
    </div>
  );

  const renderManualForm = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Add Student</h2>
      
      <form onSubmit={handleManualSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
            <input
              type="text"
              name="studentID"
              value={formData.studentID}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
              placeholder="e.g., 22071A3255"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
              placeholder="Student's full name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div className="col-span-2">
            <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-1">
              Batch
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <input
                  type="number"
                  name="batchStartYear"
                  id="batchStartYear"
                  placeholder="Start Year"
                  value={formData.batchStartYear || ''}
                  onChange={(e) => {
                    const startYear = e.target.value;
                    handleInputChange({
                      target: {
                        name: 'batchStartYear',
                        value: startYear
                      }
                    });
                    // Auto-update the batch when start year changes
                    if (startYear && formData.batchEndYear) {
                      handleInputChange({
                        target: {
                          name: 'batch',
                          value: `${startYear}-${formData.batchEndYear}`
                        }
                      });
                    }
                  }}
                  min="2000"
                  max="2099"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9b1a31] focus:ring-[#9b1a31] sm:text-sm"
                />
              </div>
              <span className="text-gray-500">-</span>
              <div className="flex-1">
                <input
                  type="number"
                  name="batchEndYear"
                  id="batchEndYear"
                  placeholder="End Year"
                  value={formData.batchEndYear || ''}
                  onChange={(e) => {
                    const endYear = e.target.value;
                    handleInputChange({
                      target: {
                        name: 'batchEndYear',
                        value: endYear
                      }
                    });
                    // Auto-update the batch when end year changes
                    if (formData.batchStartYear && endYear) {
                      handleInputChange({
                        target: {
                          name: 'batch',
                          value: `${formData.batchStartYear}-${endYear}`
                        }
                      });
                    }
                  }}
                  min="1"
                  max="99"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9b1a31] focus:ring-[#9b1a31] sm:text-sm"
                />
              </div>
            </div>
            {formData.batchStartYear && formData.batchEndYear && 
              parseInt(formData.batchStartYear) + parseInt(formData.batchEndYear) <= parseInt(formData.batchStartYear) && (
              <p className="mt-1 text-sm text-red-600">
                End year should be greater than start year
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.batchStartYear && formData.batchEndYear 
                ? `Selected batch: ${formData.batchStartYear}-${formData.batchEndYear}`
                : "Example: 2024-28"}
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={goBack}
            className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-[#9b1a31] text-white rounded-md hover:bg-[#7d1526] transition-colors disabled:opacity-70 flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
            ) : (
              <>
                <FaUserPlus className="mr-2" />
                Add Student
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  const renderExcelForm = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Import Students from Excel</h2>
      
      <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h3 className="text-blue-700 font-medium mb-1">File Format Requirements</h3>
        <p className="text-blue-600 text-sm">
          Your Excel file should have the following columns:
        </p>
        <div className="mt-2 bg-white p-3 rounded-md border border-blue-200 font-mono text-sm">
          <span className="text-green-600">RollNo</span>, <span className="text-purple-600">Name</span>
        </div>
      </div>
      
      <form onSubmit={handleExcelSubmit} onDragEnter={handleDrag}>
        {/* Department and Batch fields for all imported students */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department (for all students)</label>
            <select
              name="department"
              value={excelFormData.department}
              onChange={handleExcelFormChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-1">
              Batch
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <input
                  type="number"
                  name="batchStartYear"
                  id="excelBatchStartYear"
                  placeholder="Start Year"
                  value={excelFormData.batchStartYear || ''}
                  onChange={(e) => {
                    const startYear = e.target.value;
                    handleExcelFormChange({
                      target: {
                        name: 'batchStartYear',
                        value: startYear
                      }
                    });
                    // Auto-update the batch when start year changes
                    if (startYear && excelFormData.batchEndYear) {
                      handleExcelFormChange({
                        target: {
                          name: 'batch',
                          value: `${startYear}-${excelFormData.batchEndYear}`
                        }
                      });
                    }
                  }}
                  min="2000"
                  max="2099"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9b1a31] focus:ring-[#9b1a31] sm:text-sm"
                />
              </div>
              <span className="text-gray-500">-</span>
              <div className="flex-1">
                <input
                  type="number"
                  name="batchEndYear"
                  id="excelBatchEndYear"
                  placeholder="End Year"
                  value={excelFormData.batchEndYear || ''}
                  onChange={(e) => {
                    const endYear = e.target.value;
                    handleExcelFormChange({
                      target: {
                        name: 'batchEndYear',
                        value: endYear
                      }
                    });
                    // Auto-update the batch when end year changes
                    if (excelFormData.batchStartYear && endYear) {
                      handleExcelFormChange({
                        target: {
                          name: 'batch',
                          value: `${excelFormData.batchStartYear}-${endYear}`
                        }
                      });
                    }
                  }}
                  min="1"
                  max="99"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9b1a31] focus:ring-[#9b1a31] sm:text-sm"
                />
              </div>
            </div>
            {excelFormData.batchStartYear && excelFormData.batchEndYear && 
              parseInt(excelFormData.batchStartYear) + parseInt(excelFormData.batchEndYear) <= parseInt(excelFormData.batchStartYear) && (
              <p className="mt-1 text-sm text-red-600">
                End year should be greater than start year
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {excelFormData.batchStartYear && excelFormData.batchEndYear 
                ? `Selected batch: ${excelFormData.batchStartYear}-${excelFormData.batchEndYear}`
                : "Example: 2024-28"}
            </p>
          </div>
        </div>
        
        <div 
          className={`mt-4 relative ${dragActive ? 'border-[#9b1a31]' : 'border-gray-300'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Excel File</label>
          <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
            dragActive ? 'border-[#9b1a31] bg-[#9b1a31]/5' : 'border-gray-300 bg-gray-50'
          }`}>
            <div className="space-y-1 text-center">
              <FaUpload className={`mx-auto h-12 w-12 ${dragActive ? 'text-[#9b1a31]' : 'text-gray-400'}`} />
              <div className="flex flex-col sm:flex-row items-center justify-center text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-[#9b1a31] hover:text-[#7d1526] focus-within:outline-none"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">XLSX or XLS up to 10MB</p>
            </div>
          </div>
          {file && (
            <div className="mt-3 flex items-center p-2 bg-green-50 border border-green-200 rounded-md">
              <FaFileExcel className="text-green-500 mr-2" />
              <span className="text-sm text-green-700 font-medium">{file.name}</span>
              <span className="ml-2 text-xs text-green-600">({(file.size / 1024).toFixed(2)} KB)</span>
            </div>
          )}
        </div>
        
        {previewData.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-3">Preview (first {previewData.length} entries)</h3>
            <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Batch
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.map((student, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.studentID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={excelFormData.department ? "text-gray-900 font-medium" : "text-gray-400 italic"}>
                          {excelFormData.department || "Not set"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={excelFormData.batch ? "text-gray-900 font-medium" : "text-gray-400 italic"}>
                          {excelFormData.batch || "Not set"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={goBack}
            className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading || !file || !excelFormData.department || !excelFormData.batch}
            className="px-4 py-2 bg-[#9b1a31] text-white rounded-md hover:bg-[#7d1526] transition-colors disabled:opacity-70 flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Importing...
              </>
            ) : (
              <>
                <FaFileExcel className="mr-2" />
                Import Students
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/Admin/Students')}
          className="mr-4 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Add Students</h1>
      </div>
      
      {!method && renderMethodSelection()}
      {method === 'manual' && renderManualForm()}
      {method === 'excel' && renderExcelForm()}
    </div>
  );
};

export default AddStudent;