import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./modules/Login/Login";
import Admin from "./modules/Admin/Admin";
import FacultyLayout from "./modules/Faculty/FacultyLayout";
import Dashboard from "./modules/Student/Dashboard";
import ArchivedProjects from "./modules/Student/ArchivedProjects";
import ChangePassword from "./modules/Student/ChangePassword";
import Profile from "./modules/Student/Profile/Profile";
import FacultyDashboard from './modules/Faculty/Dashboard'
import FacultyArchivedProjects from './modules/Faculty/ArchivedProjects'
import CreateProjectForm from './modules/Faculty/CreateProject/CreateProjectForm';
import ProjectForum from './modules/Student/ProjectForum';
import ActiveWorks from './modules/Student/ActiveWorks/ActiveWorks';
import CampusProjects from './modules/Student/CampusProjects';
import ProjectDetails from './modules/Student/ActiveWorks/ProjectDetails';
import CampusProject from './modules/Faculty/CampusProjects';
import { Toaster } from 'react-hot-toast';
import Guide from "./modules/Faculty/ActiveWorks/Guide";
import Incharge from "./modules/Faculty/ActiveWorks/Incharge";
import Student from "./modules/Student/StudentLayout";
import FacultyProfile from "./modules/Faculty/Profile/FacultyProfile";import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store/authStore";
function App() {
  const PrivateRoute = ({ allowedRoles }) => {
    const { user, isAuthenticated } = useAuthStore();
  
    if (!isAuthenticated || !allowedRoles.includes(user?.role)) {
      return <Navigate to="/" />;
    }
  
    return <Outlet />;
  };
  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#22c55e',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Admin Routes */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<Admin />}>
            <Route path="dashboard" element={<Admin />} />
          </Route>
        </Route>

        {/* Faculty Routes */}
        <Route element={<PrivateRoute allowedRoles={["faculty"]} />}>
          <Route path="/Faculty" element={<FacultyLayout />}>
            <Route path="Dashboard" element={<FacultyDashboard />} />
            <Route path="ActiveWorks/Guide" element={<Guide />} />
            <Route path="ActiveWorks/Incharge" element={<Incharge />} />
            <Route path="ArchivedProjects" element={<FacultyArchivedProjects />} />
            <Route path="CampusProjects" element={<CampusProject />} />
            <Route path="ProjectForum" element={<ProjectForum />} />
            <Route path="Create" element={<CreateProjectForm />} />
            <Route path="FacultyProfile" element={<FacultyProfile />} />
          </Route>
        </Route>
        {/* Student Routes */}
        <Route element={<PrivateRoute allowedRoles={["student"]} />}>
          <Route path="/student" element={<Student />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="archivedprojects" element={<ArchivedProjects />} />
            <Route path="profile" element={<Profile />} />
            <Route path="changepassword" element={<ChangePassword />} />
            <Route path="projectforum" element={<ProjectForum />} />
            <Route path="activeworks" element={<ActiveWorks />} />
            <Route path="activeworks/:projectId" element={<ProjectDetails />} />
            <Route path="campusprojects" element={<CampusProjects />} />
          </Route>
        </Route>
      </Routes>
    </Router>
    </>
  );
}
export default App;