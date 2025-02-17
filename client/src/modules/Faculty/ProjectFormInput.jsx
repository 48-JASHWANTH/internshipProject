import React, { useState } from "react";
import * as XLSX from "xlsx";
import { FaInfoCircle } from "react-icons/fa";

const ProjectFormInput = ({ formData, setFormData, setExcelData, setPhase }) => {
  const [showFormatModal, setShowFormatModal] = useState(false);

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
      ...(name === 'projectType' && { subject: '' }),
    });
  };

  const processExcelData = (jsonData) => {
    if (!jsonData || jsonData.length === 0) return [];

    const firstRow = jsonData[0];
    const columns = Object.keys(firstRow);

    const cleanColumnName = (col) =>
      col.toLowerCase().replace(/[^a-z0-9]/g, "");

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
      cleanColumnName(col).match(/guidename|guide|faculty|mentor|supervisor|facultyname|mentorname/)
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
    const teamSizes = new Set();

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
        }

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
        if (projectTitle !== "To be assigned")
          teams[currentTeamNo].projectTitle = projectTitle;
      }
    });

    const processedTeams = Object.values(teams);
    processedTeams.forEach((team) => {
      teamSizes.add(team.memberCount);
    });

    if (teamSizes.size > 1) {
      const sizesArray = Array.from(teamSizes);
      alert(
        `Warning: Teams have different sizes (${sizesArray.join(
          ", "
        )} members). Please verify the data.`
      );
    }

    return processedTeams.sort((a, b) => {
      const aNum = parseInt(a.teamNo.replace(/\D/g, ""));
      const bNum = parseInt(b.teamNo.replace(/\D/g, ""));
      return aNum - bNum;
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

  const handleValidateAndNext = () => {
    if (
      !formData.year ||
      !formData.semester ||
      !formData.branch ||
      !formData.section ||
      !formData.projectType ||
      !formData.teamDetails ||
      (formData.projectType === "Course Based Project(CBP)" && !formData.subject)
    ) {
      alert("Please fill all required fields");
      return;
    }
    setPhase(2);
  };

  return (
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
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#82001A]"
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
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#82001A]"
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

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Branch <span className="text-red-500">*</span>
        </label>
        <select
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#82001A]"
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
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#82001A]"
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

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Project Type <span className="text-red-500">*</span>
        </label>
        <select
          name="projectType"
          value={formData.projectType}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#82001A]"
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

      {formData.projectType === "Course Based Project(CBP)" && (
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Subject Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Enter subject name"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#82001A]"
            required
          />
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-2">
          <label className="block text-gray-700 text-sm font-bold">
            Upload Team Details (Excel) <span className="text-red-500">*</span>
          </label>
          <div
            className="cursor-pointer text-[#82001A]"
            onClick={() => setShowFormatModal(true)}
          >
            <FaInfoCircle size={16} />
          </div>
        </div>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#82001A]"
          required
        />
      </div>

      {showFormatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Excel Format Guide</h3>
              <button onClick={() => setShowFormatModal(false)}>✕</button>
            </div>
            <div className="space-y-4">
              <p>Required columns (names can be flexible):</p>
              <ul className="list-disc pl-5">
                <li>Team/Group Number (e.g., "Team No", "Group", "Batch")</li>
                <li>Student Name (e.g., "Name", "Student Name")</li>
                <li>Roll Number (e.g., "Roll No", "Reg No", "ID")</li>
                <li>Project Title (Optional)</li>
                <li>Guide (Optional)</li>
              </ul>
              <p>Example format:</p>
              <table className="min-w-full border">
                <thead>
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
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={handleValidateAndNext}
          className="px-4 py-2 bg-[#82001A] text-white rounded-lg hover:bg-[#9b1a31]"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProjectFormInput; 