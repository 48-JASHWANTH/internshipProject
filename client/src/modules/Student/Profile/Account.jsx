import { FaLock, FaGithub, FaLinkedin } from "react-icons/fa";

const Account = ({ handleChangePassword }) => {
  return (
    <div className="mt-4 px-2 md:px-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg md:text-xl font-semibold">Account & Settings</h2>
      </div>
      <div className="mt-4 space-y-4">
        <div className="flex items-center p-2 md:p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <FaLock className="text-gray-500 text-lg md:text-xl mr-3" />
          <button onClick={handleChangePassword} className="text-[#82001A] text-sm md:text-base">
            Change Password
          </button>
        </div>
        <div className="flex items-center p-2 md:p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <FaGithub className="text-gray-500 text-lg md:text-xl mr-3" />
          <a
            href="https://github.com/sriramchowdary"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black text-sm md:text-base"
          >
            GitHub
          </a>
        </div>
        <div className="flex items-center p-2 md:p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <FaLinkedin className="text-gray-500 text-lg md:text-xl mr-3" />
          <a
            href="https://linkedin.com/in/sriramchowdary"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm md:text-base"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default Account;
