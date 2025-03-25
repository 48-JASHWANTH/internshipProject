import React, { useState } from 'react';
import { FaArrowLeft, FaUpload, FaUserPlus, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';

const AddFaculty = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState(''); // 'manual' or 'excel'
  const [formData, setFormData] = useState({
    facultyID: '',
    name: '',
    department: '',
    designation: ''
  });
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Department and designation options
  const departments = ['CSE', 'IT', 'EEE', 'EIE', 'ECE', 'MATHS&MANAGEMENT', 'CE', 'AE', 'ME', 'CS-AIMLIOT', 'ENGLISH', 'CHEMISTRY', 'PHYSICS', 'DS,CS&AIDS'];
  const designations = ['Associate Professor', 'Professor', 'Assistant Professor'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Preview first 5 entries
          setPreviewData(jsonData.slice(0, 5));
        } catch (error) {
          console.error('Error parsing Excel file:', error);
          toast.error('Error parsing Excel file');
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.facultyID || !formData.name || !formData.department || !formData.designation) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post('/admin/add-faculty', {
        faculties: {
          [formData.facultyID]: formData.name
        },
        details: {
          [formData.facultyID]: {
            department: formData.department,
            designation: formData.designation
          }
        }
      }, {withCredentials: true});

      if (response.data.success) {
        toast.success('Faculty added successfully');
        navigate('/Admin/Faculty');
      } else {
        toast.error(response.data.message || 'Failed to add faculty');
      }
    } catch (error) {
      console.error('Error adding faculty:', error);
      toast.error(error.response?.data?.message || 'Error adding faculty');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExcelSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          console.log('Excel data parsed:', jsonData);
          
          // Process data for API format
          const faculties = {};
          const details = {};
          
          let hasValidData = false;
          
          jsonData.forEach(row => {
            // Check for facultyID and name using various possible column names
            const facultyID = row.facultyID || row.FacultyID || row.faculty_id || row.id || row.ID;
            const name = row.name || row.Name || row.faculty_name || row.facultyName;
            const department = row.department || row.Department || row.dept || row.Dept;
            const designation = row.designation || row.Designation || row.position || row.Position;
            
            if (facultyID && name) {
              hasValidData = true;
              faculties[facultyID] = name;
              details[facultyID] = {
                department: department || '',
                designation: designation || ''
              };
            }
          });
          
          if (!hasValidData) {
            toast.error('No valid faculty data found in the Excel file. Please check the format.');
            setIsLoading(false);
            return;
          }
          
          console.log('Processed data:', { faculties, details });
          
          // Send to API
          const response = await apiClient.post('/admin/add-faculty', {
            faculties: faculties,
            details: details
          }, {withCredentials: true});

          if (response.data.success) {
            toast.success(`${Object.keys(faculties).length} faculty members added successfully`);
            navigate('/Admin/Faculty');
          } else {
            toast.error(response.data.message || 'Failed to add faculty');
          }
        } catch (error) {
          console.error('Error processing Excel file:', error);
          toast.error('Error processing Excel file: ' + (error.response?.data?.message || error.message));
          setIsLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error adding faculty:', error);
      toast.error('Error adding faculty: ' + (error.response?.data?.message || error.message));
      setIsLoading(false);
    }
  };

  const renderMethodSelection = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <h2 className="text-xl font-semibold mb-8">Choose a method to add faculty</h2>
      <div className="flex flex-col sm:flex-row gap-6">
        <div 
          onClick={() => setMethod('manual')}
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border border-gray-200 w-full sm:w-64"
        >
          <div className="flex flex-col items-center">
            <FaUserPlus className="text-[#9b1a31] text-4xl mb-4" />
            <h3 className="text-lg font-medium mb-2">Add Manually</h3>
            <p className="text-gray-500 text-center text-sm mb-4">Add a single faculty member with detailed information</p>
            <button className="mt-2 text-[#9b1a31] font-medium flex items-center">
              Select <FaChevronRight className="ml-1" />
            </button>
          </div>
        </div>
        
        <div 
          onClick={() => setMethod('excel')}
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border border-gray-200 w-full sm:w-64"
        >
          <div className="flex flex-col items-center">
            <FaUpload className="text-[#9b1a31] text-4xl mb-4" />
            <h3 className="text-lg font-medium mb-2">Import from Excel</h3>
            <p className="text-gray-500 text-center text-sm mb-4">Upload an Excel file with multiple faculty members</p>
            <button className="mt-2 text-[#9b1a31] font-medium flex items-center">
              Select <FaChevronRight className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderManualForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Add Faculty Manually</h2>
      <form onSubmit={handleManualSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Faculty ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="facultyID"
              value={formData.facultyID}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9b1a31]"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9b1a31]"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9b1a31]"
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Designation <span className="text-red-500">*</span>
            </label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9b1a31]"
              required
            >
              <option value="">Select Designation</option>
              {designations.map(desig => (
                <option key={desig} value={desig}>{desig}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => setMethod('')}
            className="px-4 py-2 text-gray-700 mr-4"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-[#9b1a31] text-white rounded-md hover:bg-[#7d1526] disabled:opacity-70"
          >
            {isLoading ? 'Adding...' : 'Add Faculty'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderExcelForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Import Faculty from Excel</h2>
      <form onSubmit={handleExcelSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Excel File <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9b1a31]"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            File should have columns: facultyID, name, department, designation
          </p>
        </div>
        
        {previewData.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-medium mb-2">Preview (first 5 entries):</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(previewData[0]).map((key) => (
                      <th
                        key={key}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.map((row, index) => (
                    <tr key={index}>
                      {Object.keys(previewData[0]).map((key) => (
                        <td key={`${index}-${key}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row[key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setMethod('')}
            className="px-4 py-2 text-gray-700 mr-4"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading || !file}
            className="px-4 py-2 bg-[#9b1a31] text-white rounded-md hover:bg-[#7d1526] disabled:opacity-70"
          >
            {isLoading ? 'Importing...' : 'Import Faculty'}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/Admin/Faculty')}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Add Faculty</h1>
      </div>
      
      {!method && renderMethodSelection()}
      {method === 'manual' && renderManualForm()}
      {method === 'excel' && renderExcelForm()}
    </div>
  );
};

export default AddFaculty; 