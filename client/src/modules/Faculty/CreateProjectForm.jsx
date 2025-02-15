import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { FaEdit, FaSave, FaInfoCircle } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

const CreateProjectForm = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(1);
  const [formData, setFormData] = useState({
    year: "",
    semester: "",
    branch: "",
    section: "",
    projectType: "",
    teamDetails: null,
  });
  const [excelData, setExcelData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showFormatModal, setShowFormatModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const branches = [
    "Computer Science & Engineering(CSE)",
    "Computer Science & Business Systems(CSBS)",
    "Mechanical Engineering(MECH)",
    "Civil Engineering(CIVIL)",
    "Electrical & Electronics Engineering(ECE)",
    "Electronics & Communication Engineering(EEE)",
  ];
  const projectTypes = [
    "Course Based Project(CBP)",
    "Field Project",
    "Mini Project",
    "Major Project",
  ];
  const sections = ["A", "B", "C", "D"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const processedData = processExcelData(jsonData);
        if (processedData.length > 0) {
          setExcelData(processedData);
          setFormData({
            ...formData,
            teamDetails: file,
          });
        } else {
          alert("No valid data found. Please check the Excel format.");
        }
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        alert("Error parsing Excel file. Please check the format.");
      }
    };

    if (file) {
      reader.readAsArrayBuffer(file);
    }
  };

  const processExcelData = (jsonData) => {
    if (!jsonData || jsonData.length === 0) return [];

    const firstRow = jsonData[0];
    const columns = Object.keys(firstRow);

    // Helper function to clean column names
    const cleanColumnName = (col) =>
      col.toLowerCase().replace(/[^a-z0-9]/g, "");

    // Find columns with flexible naming and remove punctuation
    const teamNoColumn = columns.find((col) =>
      cleanColumnName(col).match(/teamno|groupno|batchno|team|group/)
    );

    const studentNameColumn = columns.find((col) =>
      cleanColumnName(col).match(/studentname|name|student/)
    );

    const rollNoColumn = columns.find((col) =>
      cleanColumnName(col).match(/rollno|regno|studentid|roll/)
    );

    const guideColumn = columns.find((col) =>
      cleanColumnName(col).match(
        /guidename|guide|faculty|mentor|supervisor|facultyname|mentorname/
      )
    );

    const projectTitleColumn = columns.find((col) =>
      cleanColumnName(col).match(/projecttitle|title|project|topic|projectname/)
    );

    if (!teamNoColumn || !studentNameColumn || !rollNoColumn) {
      alert("Required columns missing (Team No, Student Name, Roll No)");
      return [];
    }

    const teams = {};
    let currentTeamNo = null;
    const teamSizes = new Set(); // To track different team sizes

    jsonData.forEach((row) => {
      const teamNo = row[teamNoColumn]?.toString() || currentTeamNo;
      const studentName = row[studentNameColumn]?.toString();
      const rollNo = row[rollNoColumn]?.toString();
      const guide = guideColumn ? row[guideColumn]?.toString() : "Not Assigned";
      const projectTitle = projectTitleColumn
        ? row[projectTitleColumn]?.toString() || "To be assigned"
        : "To be assigned";

      if (teamNo) currentTeamNo = teamNo;

      if (currentTeamNo && studentName && rollNo) {
        if (!teams[currentTeamNo]) {
          teams[currentTeamNo] = {
            teamNo: currentTeamNo,
            students: [],
            guide: guide,
            projectTitle: projectTitle,
            memberCount: 0,
          };
        } else if (projectTitle !== "To be assigned") {
          teams[currentTeamNo].projectTitle = projectTitle;
        }

        // Check if student is already added to prevent duplicates
        const isDuplicate = teams[currentTeamNo].students.some(
          (s) => s.rollNo === rollNo || s.name === studentName
        );

        if (!isDuplicate) {
          teams[currentTeamNo].students.push({
            name: studentName,
            rollNo: rollNo,
          });
          teams[currentTeamNo].memberCount++;
        }

        if (guide !== "Not Assigned") teams[currentTeamNo].guide = guide;
      }
    });

    // Validate team sizes
    const processedTeams = Object.values(teams);
    processedTeams.forEach((team) => {
      teamSizes.add(team.memberCount);
    });

    // If there are different team sizes, show warning
    if (teamSizes.size > 1) {
      const sizesArray = Array.from(teamSizes);
      alert(
        `Warning: Teams have different sizes (${sizesArray.join(
          ", "
        )} members). Please verify the data.`
      );
    }

    // Sort teams by team number
    return processedTeams.sort((a, b) => {
      const aNum = parseInt(a.teamNo.replace(/\D/g, ""));
      const bNum = parseInt(b.teamNo.replace(/\D/g, ""));
      return aNum - bNum;
    });
  };

  const handleNext = () => {
    setPhase(2);
  };

  const handleSubmit = () => {
    const finalData = {
      ...formData,
      teams: excelData,
    };
    console.log("Submitting data:", finalData);
    navigate("/Faculty/Projects");
  };

  const handleBack = () => {
    setPhase(1);
  };

  const handleValidateAndNext = () => {
    if (
      !formData.year ||
      !formData.semester ||
      !formData.branch ||
      !formData.section ||
      !formData.projectType ||
      !formData.teamDetails
    ) {
      alert("Please fill all required fields");
      return;
    }
    setPhase(2);
  };

  const handleEditAll = () => {
    setIsEditing(true);
    setFormData({
      ...formData,
      isEditing: true,
    });
  };

  const handleTeamEdit = (teamNo, field, value) => {
    setExcelData((prevData) =>
      prevData.map((team) =>
        team.teamNo === teamNo ? { ...team, [field]: value } : team
      )
    );
    setHasChanges(true);
  };

  const handleAddStudent = (teamNo) => {
    setExcelData((prevData) =>
      prevData.map((team) => {
        if (team.teamNo === teamNo) {
          return {
            ...team,
            students: [...team.students, { name: "", rollNo: "", isNew: true }],
            memberCount: team.memberCount + 1,
          };
        }
        return team;
      })
    );
    setHasChanges(true);
  };

  const handleRemoveStudent = (teamNo, studentIndex) => {
    setExcelData((prevData) =>
      prevData.map((team) => {
        if (team.teamNo === teamNo) {
          const newStudents = team.students.filter(
            (_, index) => index !== studentIndex
          );
          return {
            ...team,
            students: newStudents,
            memberCount: team.memberCount - 1,
          };
        }
        return team;
      })
    );
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleStudentEdit = (teamNo, studentIndex, field, value) => {
    setExcelData((prevData) =>
      prevData.map((team) => {
        if (team.teamNo === teamNo) {
          const newStudents = [...team.students];
          newStudents[studentIndex] = {
            ...newStudents[studentIndex],
            [field]: value,
          };
          return {
            ...team,
            students: newStudents,
          };
        }
        return team;
      })
    );
  };

  const renderPhaseOne = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Year <span className="text-red-500">*</span>
          </label>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#82001A] 
              ${!formData.year && "border-red-300"}`}
            required
          >
            <option value="">Select Year</option>
            {[1, 2, 3, 4].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Semester <span className="text-red-500">*</span>
          </label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#82001A]
              ${!formData.semester && "border-red-300"}`}
            required
          >
            <option value="">Select Semester</option>
            {[1, 2].map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Branch <span className="text-red-500">*</span>
          </label>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#82001A]
              ${!formData.branch && "border-red-300"}`}
            required
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Section <span className="text-red-500">*</span>
          </label>
          <select
            name="section"
            value={formData.section}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#82001A]
              ${!formData.section && "border-red-300"}`}
            required
          >
            <option value="">Select Section</option>
            {sections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Project Type <span className="text-red-500">*</span>
        </label>
        <select
          name="projectType"
          value={formData.projectType}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#82001A]
            ${!formData.projectType && "border-red-300"}`}
          required
        >
          <option value="">Select Project Type</option>
          {projectTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <label className="block text-gray-700 text-sm font-bold">
            Upload Team Details (Excel) <span className="text-red-500">*</span>
          </label>
          <div
            className="cursor-pointer text-[#82001A]"
            data-tooltip-id="excel-format-tooltip"
            data-tooltip-content="Click to see Excel format details"
            onClick={() => setShowFormatModal(true)}
          >
            <FaInfoCircle size={16} />
          </div>
        </div>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#82001A]
            ${!formData.teamDetails && "border-red-300"}`}
          required
        />
        <Tooltip id="excel-format-tooltip" />
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={handleValidateAndNext}
          className="px-4 py-2 bg-[#82001A] text-white rounded-lg hover:bg-[#9b1a31]"
        >
          Next
        </button>
      </div>

      {/* Excel Format Modal */}
      {showFormatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Excel Format Guide</h3>
              <button
                onClick={() => setShowFormatModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-medium mb-2">Required Columns:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Team/Group Number (e.g., "Team No.", "Group #", "Batch
                    Number")
                  </li>
                  <li>
                    Student Name (e.g., "Student's Name", "Name", "Student")
                  </li>
                  <li>
                    Roll Number (e.g., "Roll No.", "Reg. No", "Student ID")
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">Optional Columns:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Project Title (e.g., "Project Title", "Topic", "Project
                    Name")
                  </li>
                  <li>Guide (e.g., "Guide Name", "Faculty", "Mentor")</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">Example Format:</p>
                <table className="min-w-full border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border p-2">Team No</th>
                      <th className="border p-2">Student Name</th>
                      <th className="border p-2">Roll No</th>
                      <th className="border p-2">Project Title</th>
                      <th className="border p-2">Guide</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">1</td>
                      <td className="border p-2">John Doe</td>
                      <td className="border p-2">20B81A0501</td>
                      <td className="border p-2">Smart Home</td>
                      <td className="border p-2">Dr. Smith</td>
                    </tr>
                    <tr>
                      <td className="border p-2">1</td>
                      <td className="border p-2">Jane Smith</td>
                      <td className="border p-2">20B81A0502</td>
                      <td className="border p-2">Smart Home</td>
                      <td className="border p-2">Dr. Smith</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                <p className="font-medium">Notes:</p>
                <ul className="list-disc pl-5">
                  <li>Column names are flexible and punctuation is ignored</li>
                  <li>All teams should have the same number of members</li>
                  <li>
                    Students in the same team should have the same team number
                  </li>
                  <li>Duplicate entries will be automatically removed</li>
                  <li>Project Title and Guide columns are optional</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPhaseTwo = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-[#82001A]">Confirm Details</h3>
        <div className="flex gap-2">
          {isEditing ? (
            <button
              type="button"
              onClick={handleSaveChanges}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                hasChanges
                  ? "text-green-600 hover:bg-green-50"
                  : "text-gray-400"
              } rounded-lg`}
              disabled={!hasChanges}
            >
              <FaSave className="w-4 h-4" />
              Save Changes
            </button>
          ) : (
            <button
              type="button"
              onClick={handleEditAll}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#82001A] hover:bg-red-50 rounded-lg"
            >
              <FaEdit className="w-4 h-4" />
              Edit Details
            </button>
          )}
        </div>
      </div>

      {/* Project Details Card */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h4 className="text-lg font-semibold mb-4 text-gray-800">
          Project Details
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {isEditing ? (
            <>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Year
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-[#82001A]"
                >
                  {[1, 2, 3, 4].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Semester
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-[#82001A]"
                >
                  {[1, 2].map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Branch
                </label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-[#82001A]"
                >
                  {branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Section
                </label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-[#82001A]"
                >
                  {sections.map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Project Type
                </label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-[#82001A]"
                >
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm font-medium text-gray-600">Year</p>
                <p className="text-base mt-1">{formData.year}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Semester</p>
                <p className="text-base mt-1">{formData.semester}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Branch</p>
                <p className="text-base mt-1">{formData.branch}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Section</p>
                <p className="text-base mt-1">{formData.section}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Project Type
                </p>
                <p className="text-base mt-1">{formData.projectType}</p>
              </div>
            </>
          )}
          <div>
            <p className="text-sm font-medium text-gray-600">File Name</p>
            <p className="text-base mt-1 truncate">
              {formData.teamDetails?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Teams Table */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guide
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {excelData.map((team) => (
                <tr key={team.teamNo} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Team {team.teamNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.memberCount} members
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {team.students.map((student, index) => (
                        <div
                          key={student.rollNo || index}
                          className="flex items-center gap-2 text-sm"
                        >
                          {isEditing ? (
                            <>
                              <input
                                type="text"
                                value={student.rollNo}
                                onChange={(e) =>
                                  handleStudentEdit(
                                    team.teamNo,
                                    index,
                                    "rollNo",
                                    e.target.value
                                  )
                                }
                                className="w-32 px-2 py-1 border rounded"
                                placeholder="Roll No"
                              />
                              <input
                                type="text"
                                value={student.name}
                                onChange={(e) =>
                                  handleStudentEdit(
                                    team.teamNo,
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="flex-1 px-2 py-1 border rounded"
                                placeholder="Student Name"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveStudent(team.teamNo, index)
                                }
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                ×
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="font-medium text-gray-900 min-w-[100px]">
                                {student.rollNo}
                              </span>
                              <span className="text-gray-600">
                                {student.name}
                              </span>
                            </>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => handleAddStudent(team.teamNo)}
                          className="text-sm text-[#82001A] hover:text-[#9b1a31] mt-2"
                        >
                          + Add Student
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? (
                      <input
                        type="text"
                        value={team.projectTitle}
                        onChange={(e) =>
                          handleTeamEdit(
                            team.teamNo,
                            "projectTitle",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      <div className="text-sm text-gray-900">
                        {team.projectTitle}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? (
                      <input
                        type="text"
                        value={team.guide}
                        onChange={(e) =>
                          handleTeamEdit(team.teamNo, "guide", e.target.value)
                        }
                        className="w-full px-2 py-1 border rounded"
                        placeholder="Enter guide name"
                      />
                    ) : (
                      <div className="text-sm text-gray-900">{team.guide}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button
          type="button"
          onClick={handleBack}
          className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2.5 bg-[#82001A] text-white font-medium rounded-lg hover:bg-[#9b1a31] transition-colors duration-200"
        >
          Submit
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        {phase === 1 ? renderPhaseOne() : renderPhaseTwo()}
      </form>
    </div>
  );
};

export default CreateProjectForm;
