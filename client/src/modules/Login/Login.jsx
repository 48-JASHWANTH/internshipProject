import { useNavigate } from "react-router-dom";
import { useState } from "react";
import VideoComponent from "./VideoComponent";
import { FaUserTie, FaChalkboardTeacher, FaUserShield, FaUserGraduate } from "react-icons/fa"; 
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuthStore from '@/store/authStore';
import { toast } from 'react-hot-toast';

function Login() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("Student"); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, clearError } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Format credentials based on user type
    const credentials = userType === 'Student' 
      ? { studentID: username, password } 
      : { facultyID: username, password };
    
    const result = await login(credentials, userType);
    
    if (result.success) {
      toast.success(`Welcome ${username}!`);
      // Redirect based on user type
      switch(userType) {
        case 'Student':
          navigate('/Student/Dashboard');
          break;
        case 'Faculty':
          navigate('/Faculty/Dashboard');
          break;
        case 'Admin':
          navigate('/Admin/Dashboard');
          break;
        default:
          navigate('/');
      }
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  const userTypes = [
    { name: "Student", icon: <FaUserGraduate /> },
    { name: "Faculty", icon: <FaUserTie /> },
    { name: "Admin", icon: <FaUserShield /> },
  ];

  return (
    <div className="w-full h-screen">
      <VideoComponent />
      <div className="absolute w-full h-full top-0 flex flex-col justify-center items-center">
        <div className="backdrop-brightness-75 p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
          <h1 className="text-4xl font-extrabold mb-6 text-center text-red-700 font-serif">
            VNR VJIET
          </h1>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">LOGIN</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            
            <div>
              <label className="block mb-2 font-medium text-white">Username</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-white">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div>
              <label className="block mb-2 font-medium text-white text-center">
                Select User Type
              </label>
              <div className="flex justify-around mb-4">
                {userTypes.map((type) => (
                  <button
                    key={type.name}
                    type="button"
                    onClick={() => setUserType(type.name)}
                    className={`p-4 rounded-full text-3xl ${
                      userType === type.name
                        ? "bg-red-900 text-white"
                        : "bg-gray-200 text-gray-700"
                    } transition-colors hover:bg-red-700 hover:text-white`}
                  >
                    {type.icon}
                  </button>
                ))}
              </div>
              <p className="text-center text-white">
                Selected: <span className="font-bold">{userType}</span>
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-red-900 text-white p-3 rounded-md hover:bg-red-950 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
