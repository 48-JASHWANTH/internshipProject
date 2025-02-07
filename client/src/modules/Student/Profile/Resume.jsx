import { FaUpload, FaDownload, FaFileAlt } from "react-icons/fa";

const Resume = () => {
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Resume Management</h2>
        <div>
          <button className="bg-yellow-400 text-white px-4 py-2 rounded-lg mr-2">
            <FaUpload className="inline mr-1" /> Upload New
          </button>
          <button className="text-[#82001A] px-4 py-2 rounded-lg">
            <FaDownload className="inline mr-1" /> Download
          </button>
        </div>
      </div>
      <div className="mt-4 border-2 border-dashed border-gray-300 p-8 text-center">
        <FaFileAlt className="text-gray-400 text-5xl mx-auto mb-2" />
        <p className="text-lg font-semibold">resume.pdf</p>
        <p className="text-sm text-gray-500">Last updated: Jan 30, 2024</p>
      </div>
    </div>
  );
};

export default Resume;
