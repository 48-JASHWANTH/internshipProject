import React, { useState } from 'react';
import { FaArrowLeft, FaUpload, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import { useStore } from '@/store/useStore';

const AddFaculty = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState(''); // 'manual' or 'excel'
  const [formData, setFormData] = useState({
    facultyID: '',
    name: '',
    department: '',
    email: '',
    mobile: ''
  });
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    
    if (!formData.facultyID || !formData.name || !formData.department) {
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
            email: formData.email,
            mobile: formData.mobile
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
          
          // Process data for API format
          const faculty = {};
          const details = {};
          
          jsonData.forEach(row => {
            if (row.facultyID && row.name) {
              faculty[row.facultyID] = row.name;
              details[row.facultyID] = {
                department: row.department || '',
                email: row.email || '',
                mobile: row.mobile || ''
              };
            }
          });
          
          // Send to API
          const response = await apiClient.post('/admin/add-faculty', {
            faculty,
            details
          }, {withCredentials: true});

          if (response.data.success) {
            toast.success(`${Object.keys(faculty).length} faculty members added successfully`);
            navigate('/Admin/Faculty');
          } else {
            toast.error(response.data.message || 'Failed to add faculty');
          }
        } catch (error) {
          console.error('Error processing Excel file:', error);
          toast.error('Error processing Excel file');
          setIsLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error adding faculty:', error);
      toast.error(error.response?.data?.message || 'Error adding faculty');
      setIsLoading(false);
    }
  };

  const renderMethodSelection = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <h2 className="text-xl font-semibold mb-8">Choose a method to add faculty</h2>
      <div className="flex flex-col sm:flex-row gap-6">
        <button
          onClick={() => setMethod('manual')}
          className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <FaUserPlus className="text-[#9b1a31] text-4xl mb-4" />
          <span className="text-lg font-medium">Add Manually</span>
          <p className="text-gray-500 text-sm mt-2 text-center">Add a single faculty member with details</p>
        </button>
        
        <button
          onClick={() => setMethod('excel')}
          className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <FaUpload className="text-[#9b1a31] text-4xl mb-4" />
          <span className="text-lg font-medium">Import from Excel</span>
          <p className="text-gray-500 text-sm mt-2 text-center">Upload an Excel file with multiple faculty members</p>
        </button>
      </div>
    </div>
  );

  const renderManualForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Add Faculty Member</h2>
      <form onSubmit={handleManualSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9b1a31]"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9b1a31]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile
            </label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9b1a31]"
            />
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
            File should have columns: facultyID, name, department, email, mobile
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