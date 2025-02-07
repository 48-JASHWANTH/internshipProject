import { FaLock, FaGithub, FaLinkedin } from "react-icons/fa";

const Account = ({ handleChangePassword }) => {
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Account & Settings</h2>
      </div>
      <div className="mt-4 space-y-4">
        <div className="flex items-center">
          <FaLock className="text-gray-500 text-xl mr-2" />
          <button onClick={handleChangePassword} className="text-[#82001A]">
            Change Password
          </button>
        </div>
        <div className="flex items-center">
          <FaGithub className="text-gray-500 text-xl mr-2" />
          <a
            href="https://github.com/sriramchowdary"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black"
          >
            GitHub
          </a>
        </div>
        <div className="flex items-center">
          <FaLinkedin className="text-gray-500 text-xl mr-2" />
          <a
            href="https://linkedin.com/in/sriramchowdary"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default Account;
