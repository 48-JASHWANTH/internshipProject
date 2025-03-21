import React, { useState, useCallback } from 'react';
import { FaArrowLeft, FaUpload, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import useAuthStore from '@/store/authStore';

const AddStudent = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [method, setMethod] = useState('');
  const [formData, setFormData] = useState({
    studentID: '',
    name: '',
    department: '',
    batch: ''
  });
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const departments = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'];
  const batches = ['2021-25', '2022-26', '2023-27', '2024-28'];

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    if (!selectedFile) return;
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        console.log('Excel data parsed:', jsonData);
        
        // Validate data format
        const validData = jsonData.filter(row => 
          row.studentID && row.name && 
          typeof row.studentID === 'string' && 
          typeof row.name === 'string'
        );
        
        console.log('Valid data after filtering:', validData);
        
        if (validData.length === 0) {
          toast.error('No valid data found in the Excel file. Please use the correct format.');
          setFile(null);
          return;
        }
        
        // Show preview of first 5 entries
        const previewEntries = validData.slice(0, 5);
        console.log('Preview data (first 5 entries):', previewEntries);
        setPreviewData(previewEntries);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        toast.error('Error reading file. Please make sure it\'s a valid Excel file.');
        setFile(null);
      }
    };
    reader.readAsBinaryString(selectedFile);
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
    
    console.log('Submitting student data:', formData);
    
    try {
      // Format the data according to the API structure in zadmin.http
      const payload = {
        students: {
          [studentID]: name
        }
      };
      
      const response = await apiClient.post('/admin/add-students', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-storage') ? 
            JSON.parse(localStorage.getItem('auth-storage')).state.token : ''}`
        }
      });
      
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
    
    console.log('Submitting Excel file:', file.name);
    
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
          
          // Format data according to the API structure in zadmin.http
          const students = {};
          jsonData.forEach(row => {
            if (row.studentID && row.name) {
              students[row.studentID] = row.name;
            }
          });
          
          if (Object.keys(students).length === 0) {
            toast.error('No valid student data found in the file');
            setIsLoading(false);
            return;
          }
          
          const payload = { students };
          
          const response = await apiClient.post('/admin/add-students', payload, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('auth-storage') ? 
                JSON.parse(localStorage.getItem('auth-storage')).state.token : ''}`
            }
          });
          
          if (response.data.success) {
            toast.success(`${Object.keys(students).length} students imported successfully`);
            navigate('/Admin/Students');
          } else {
            toast.error(response.data.message || 'Failed to import students');
          }
        } catch (error) {
          console.error('Error processing Excel file:', error);
          toast.error('Error processing the Excel file');
        } finally {
          setIsLoading(false);
        }
      };
      
      reader.readAsBinaryString(file);
    } catch (error) {
      console.error('Error importing students:', error);
      toast.error(error.response?.data?.message || 'An error occurred while importing students');
      setIsLoading(false);
    }
  }, [file, navigate]);

  const goBack = useCallback(() => {
    method ? setMethod('') : navigate('/Admin/Students');
  }, [method, navigate]);

  const renderMethodSelection = () => (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-xl font-semibold text-center mb-8">Choose a method to add students</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => setMethod('manual')}
          className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#9b1a31] hover:bg-gray-50 transition-all"
        >
          <FaUserPlus size={48} className="text-[#9b1a31] mb-4" />
          <h3 className="text-lg font-medium">Manual Entry</h3>
          <p className="text-gray-500 text-center mt-2">Add a single student by entering their details manually</p>
        </button>
        
        <button
          onClick={() => setMethod('excel')}
          className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#9b1a31] hover:bg-gray-50 transition-all"
        >
          <FaUpload size={48} className="text-[#9b1a31] mb-4" />
          <h3 className="text-lg font-medium">Excel Upload</h3>
          <p className="text-gray-500 text-center mt-2">Import multiple students at once using an Excel file</p>
        </button>
      </div>
    </div>
  );

  const renderManualForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Add Student Manually</h2>
      <form onSubmit={handleManualSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
            <input
              type="text"
              name="studentID"
              value={formData.studentID}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
              placeholder="e.g., 22071A3262"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
              placeholder="e.g., John Smith"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
            <select
              name="batch"
              value={formData.batch}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#9b1a31] focus:border-[#9b1a31]"
            >
              <option value="">Select Batch</option>
              {batches.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={goBack}
            className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-[#9b1a31] text-white rounded-md hover:bg-[#7d1526] disabled:opacity-70"
          >
            {isLoading ? 'Adding...' : 'Add Student'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderExcelForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Import Students from Excel</h2>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-2">Please upload an Excel file with the following columns:</p>
        <div className="bg-gray-50 p-3 rounded-md">
          <code>studentID</code>, <code>name</code>, <code>department</code>, <code>batch</code>
        </div>
      </div>
      
      <form onSubmit={handleExcelSubmit}>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Excel File</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
            <div className="space-y-1 text-center">
              <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-[#9b1a31] hover:text-[#7d1526]"
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
            <p className="mt-2 text-sm text-gray-600">
              Selected file: <span className="font-medium">{file.name}</span>
            </p>
          )}
        </div>
        
        {previewData.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Preview (first 5 entries)</h3>
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
                    {previewData[0].department && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                    )}
                    {previewData[0].batch && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Batch
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.map((student, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.studentID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.name}
                      </td>
                      {previewData[0].department && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.department}
                        </td>
                      )}
                      {previewData[0].batch && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.batch}
                        </td>
                      )}
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
            className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading || !file}
            className="px-4 py-2 bg-[#9b1a31] text-white rounded-md hover:bg-[#7d1526] disabled:opacity-70"
          >
            {isLoading ? 'Importing...' : 'Import Students'}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/Admin/Students')}
          className="mr-4 text-gray-600 hover:text-gray-900"
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