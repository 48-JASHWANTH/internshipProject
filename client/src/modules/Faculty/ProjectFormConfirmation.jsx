import React, { useState } from "react";
import { FaEdit, FaSave } from "react-icons/fa";
import SearchableDropdown from "../common/SearchableDropdown";

const facultyList = [
  { id: "FAC001", name: "Dr. Sarah Johnson" },
  { id: "FAC002", name: "Dr. Michael Chen" },
  { id: "FAC003", name: "Dr. Emily White" },
  { id: "FAC004", name: "Prof. David Brown" },
  { id: "FAC005", name: "Dr. Lisa Anderson" },
];

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

const ProjectFormConfirmation = ({
  formData,
  setFormData,
  excelData,
  setExcelData,
  setPhase,
  handleSubmit,
}) => {
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [isEditingExcel, setIsEditingExcel] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [focusedInput, setFocusedInput] = useState(null);

  const isEditing = isEditingBasic || isEditingExcel;

  const handleEditBasicDetails = () => {
    setIsEditingBasic(true);
    setFormData({
      ...formData,
      isEditing: true,
    });
  };

  const handleEditExcelDetails = () => {
    setIsEditingExcel(true);
    setFormData({
      ...formData,
      isEditing: true,
    });
  };

  const handleTeamEdit = (teamNo, field, value) => {
    setExcelData((prevData) =>
      prevData.map((team) =>
        team.teamNo === teamNo
          ? {
              ...team,
              [field]: value,
              ...(field === "guide" && {
                facultyId: facultyList.find((f) => f.name === value)?.id,
              }),
            }
          : team
      )
    );
    setHasChanges(true);
  };

  const handleStudentEdit = (teamNo, studentIndex, field, value) => {
    // Keep track of the currently focused element
    const activeElement = document.activeElement;
    
    setExcelData((prevData) =>
      prevData.map((team) => {
        if (team.teamNo === teamNo) {
          const newStudents = [...team.students];
          newStudents[studentIndex] = {
            ...newStudents[studentIndex],
            [field]: value,
            errors: {
              ...newStudents[studentIndex].errors,
              [field]: value.trim() === '' ? 'Required' : null
            }
          };
          return { ...team, students: newStudents };
        }
        return team;
      })
    );
    setHasChanges(true);
    
    // Restore focus to the active element after state update
    if (activeElement) {
      setTimeout(() => {
        activeElement.focus();
        // Optionally move cursor to end of input
        if (activeElement.tagName === 'INPUT') {
          const len = activeElement.value.length;
          activeElement.setSelectionRange(len, len);
        }
      }, 0);
    }
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

  const handleBasicDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    setIsEditingBasic(false);
    setIsEditingExcel(false);
    setHasChanges(false);
    setFormData({
      ...formData,
      isEditing: false,
    });
  };

  const validateForm = () => {
    let isValid = true;
    let firstError = null;

    const updatedData = excelData.map((team) => ({
      ...team,
      students: team.students.map((student, studentIndex) => {
        const studentErrors = {};
        if (!student.name?.trim()) {
          studentErrors.name = 'Required';
          isValid = false;
          if (!firstError) {
            firstError = { teamNo: team.teamNo, studentIndex, field: 'name' };
          }
        }
        if (!student.rollNo?.trim()) {
          studentErrors.rollNo = 'Required';
          isValid = false;
          if (!firstError) {
            firstError = { teamNo: team.teamNo, studentIndex, field: 'rollNo' };
          }
        }
        return {
          ...student,
          errors: studentErrors
        };
      })
    }));

    setExcelData(updatedData);

    // If there's an error, scroll to and focus the first error field
    if (firstError) {
      const element = document.querySelector(`[data-team="${firstError.teamNo}"][data-student="${firstError.studentIndex}"][data-field="${firstError.field}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }

    return isValid;
  };

  const handleSubmitWrapper = () => {
    if (!validateForm()) {
      return;
    }
    handleSubmit();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-[#82001A]">Confirm Details</h3>
        <div className="flex gap-2">
          {(isEditingBasic || isEditingExcel) ? (
            <button
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
            <>
              <button
                onClick={handleEditBasicDetails}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#82001A] hover:bg-red-50 rounded-lg"
              >
                <FaEdit className="w-4 h-4" />
                Edit Basic Details
              </button>
              <button
                onClick={handleEditExcelDetails}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#82001A] hover:bg-red-50 rounded-lg"
              >
                <FaEdit className="w-4 h-4" />
                Edit Excel Details
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h4 className="text-lg font-semibold mb-4 text-gray-800">
          Project Details
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {isEditingBasic ? (
            <>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Year
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleBasicDetailsChange}
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
                  onChange={handleBasicDetailsChange}
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
                  onChange={handleBasicDetailsChange}
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
                  onChange={handleBasicDetailsChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-[#82001A]"
                >
                  {["A", "B", "C", "D"].map((section) => (
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
                  onChange={handleBasicDetailsChange}
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
                          {isEditingExcel ? (
                            <>
                              <div className="flex flex-col">
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
                                  onFocus={() => setFocusedInput(`${team.teamNo}-${index}-rollNo`)}
                                  data-team={team.teamNo}
                                  data-student={index}
                                  data-field="rollNo"
                                  autoFocus={focusedInput === `${team.teamNo}-${index}-rollNo`}
                                  className={`w-32 px-2 py-1 border rounded ${
                                    student.errors?.rollNo ? 'border-red-500' : ''
                                  }`}
                                  placeholder="Roll No"
                                />
                                {student.errors?.rollNo && (
                                  <span className="text-xs text-red-500">{student.errors.rollNo}</span>
                                )}
                              </div>
                              <div className="flex flex-col">
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
                                  onFocus={() => setFocusedInput(`${team.teamNo}-${index}-name`)}
                                  data-team={team.teamNo}
                                  data-student={index}
                                  data-field="name"
                                  autoFocus={focusedInput === `${team.teamNo}-${index}-name`}
                                  className={`flex-1 px-2 py-1 border rounded ${
                                    student.errors?.name ? 'border-red-500' : ''
                                  }`}
                                  placeholder="Student Name"
                                />
                                {student.errors?.name && (
                                  <span className="text-xs text-red-500">{student.errors.name}</span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveStudent(team.teamNo, index)}
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
                      {isEditingExcel && (
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
                    {isEditingExcel ? (
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
                    {isEditingExcel ? (
                      <SearchableDropdown
                        value={team.guide}
                        onChange={(selected) =>
                          handleTeamEdit(team.teamNo, "guide", selected.name)
                        }
                        options={facultyList}
                        placeholder="Select guide..."
                        className="w-full"
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
          onClick={() => setPhase(1)}
          className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmitWrapper}
          className="px-6 py-2.5 bg-[#82001A] text-white font-medium rounded-lg hover:bg-[#9b1a31] transition-colors duration-200"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ProjectFormConfirmation;
