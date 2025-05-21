import { useNavigate } from "react-router-dom";
import { useState } from "react";
import VideoComponent from "./VideoComponent";
import { FaUserTie, FaUserShield, FaUserGraduate } from "react-icons/fa"; 
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useStore } from "@/store/useStore";

function Login() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("student"); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const login = useStore(state => state.login);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Format credentials based on user type
      const credentials = userType === 'student' 
        ? { studentID: username, password } 
        : userType === 'faculty'
          ? { facultyID: username, password }
          : { adminID: username, password };
      
      console.log("Attempting login with:", { userType, credentials });
      
      const result = await login(credentials, userType);
      
      if (result.success) {
        // Success toast with custom configuration
        toast.success(`Welcome ${username}!`, {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          style: {
            backgroundColor: '#4CAF50',
            color: 'white',
            fontWeight: 'bold'
          }
        });

        // Redirect based on user type
        switch(userType) {
          case 'student':
            navigate('/Student/Dashboard');
            break;
          case 'faculty':
            navigate('/Faculty/Dashboard');
            break;
          case 'admin':
            navigate('/Admin/Dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        // Check if account is locked
        if (result.status === 403) {
          toast.error(result.message || 'Account is locked due to multiple failed attempts', {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            style: {
              backgroundColor: '#f44336',
              color: 'white',
              fontWeight: 'bold'
            }
          });
        } 
        // For invalid credentials with attempts info
        else if (result.attemptsRemaining !== undefined) {
          toast.error(`Invalid username or password. ${result.attemptsRemaining} attempts remaining before account lockout.`, {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            style: {
              backgroundColor: '#f44336',
              color: 'white',
              fontWeight: 'bold'
            }
          });
        } 
        // Default error message
        else {
          toast.error('Invalid username or password', {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            style: {
              backgroundColor: '#f44336',
              color: 'white',
              fontWeight: 'bold'
            }
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      // Error toast for unexpected errors
      toast.error('An unexpected error occurred. Please try again.', {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: {
          backgroundColor: '#f44336',
          color: 'white',
          fontWeight: 'bold'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const userTypes = [
    { name: "student", icon: <FaUserGraduate /> },
    { name: "faculty", icon: <FaUserTie /> },
    { name: "admin", icon: <FaUserShield /> },
  ];

  const handleForgotPassword = () => {
    navigate('/reset-password');
  };

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
              <div className="mt-1 text-left">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-white hover:text-red-300 transition-colors"
                >
                  Forgot your password?
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
              className="w-full bg-red-900 text-white p-3 rounded-md hover:bg-red-950 transition-colors disabled:opacity-70"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
