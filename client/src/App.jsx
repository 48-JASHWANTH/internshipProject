import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./modules/Login/Login";
import AdminLayout from "./modules/Admin/AdminLayout";
import FacultyLayout from "./modules/Faculty/FacultyLayout";
import Dashboard from "./modules/Student/Dashboard";
import ArchivedProjects from "./modules/Student/ArchivedProjects";
import ChangePassword from "./modules/Student/ChangePassword";
import Profile from "./modules/Student/Profile/Profile";
import FacultyDashboard from './modules/Faculty/Dashboard'
import FacultyArchivedProjects from './modules/Faculty/ArchivedProjects/ArchivedProjects'
import CreateProjectForm from './modules/Faculty/CreateProject/CreateProjectForm';
import ProjectForum from './modules/Student/ProjectForum';
import ActiveWorks from './modules/Student/ActiveWorks/ActiveWorks';
import CampusProjects from './modules/Student/CampusProjects';
import GuideProjectDetails from './modules/Faculty/ActiveWorks/Guide/GuideProjectDetails';
import ProjectDetails from './modules/Student/ActiveWorks/ProjectDetails';
import CampusProject from './modules/Faculty/CampusProjects';
import { Toaster } from 'react-hot-toast';
import GuideActiveWorks from "./modules/Faculty/ActiveWorks/Guide/GuideActiveWorks";
import Incharge from "./modules/Faculty/ActiveWorks/Incharge/InchargeActiveWorks";
import Student from "./modules/Student/StudentLayout";
import FacultyProfile from "./modules/Faculty/Profile/FacultyProfile";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import AdminDashboard from './modules/Admin/Dashboard';
import AdminProfile from './modules/Admin/Profile';
import AdminFacultyManagement from './modules/Admin/AdminFacultyManagement';
import AdminStudentManagement from './modules/Admin/AdminStudentManagement';
import AddStudent from './modules/Admin/AddStudent';
import AddFaculty from './modules/Admin/AddFaculty';
import Notifications from './modules/Faculty/Notifications';
import ArchivedProjectDetails from './modules/Faculty/ArchivedProjects/ArchivedProjectDetails';
import StudentNotifications from "./modules/Student/StudentNotifications";

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
          <Route path="/Admin" element={<AdminLayout />}>
            <Route path="Dashboard" element={<AdminDashboard />} />
            <Route path="Profile" element={<AdminProfile />} />
            <Route path="CampusProjects" element={<CampusProjects />} />
            <Route path="Faculty" element={<AdminFacultyManagement />} />
            <Route path="Students" element={<AdminStudentManagement />} />
            <Route path="AddStudent" element={<AddStudent />} />
            <Route path="AddFaculty" element={<AddFaculty />} />
          </Route>
        </Route>

        {/* Faculty Routes */}
        <Route element={<PrivateRoute allowedRoles={["faculty"]} />}>
          <Route path="/Faculty" element={<FacultyLayout />}>
            <Route path="Dashboard" element={<FacultyDashboard />} />
            <Route path="ActiveWorks/guide" element={<GuideActiveWorks />} />
            <Route path="ActiveWorks/guide/:projectId" element={<GuideProjectDetails />} />
            <Route path="ActiveWorks/Incharge" element={<Incharge />} />
            <Route path="ArchivedProjects" element={<FacultyArchivedProjects />} />
            <Route path="ArchivedProjects/:projectId" element={<ArchivedProjectDetails />} />
            <Route path="CampusProjects" element={<CampusProject />} />
            <Route path="ProjectForum" element={<ProjectForum />} />
            <Route path="Create" element={<CreateProjectForm />} />
            <Route path="FacultyProfile" element={<FacultyProfile />} />
            <Route path="Notifications" element={<Notifications />} />
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
            <Route path="notifications" element={<StudentNotifications />} /> 
          </Route>
        </Route>
      </Routes>
    </Router>
    </>
  );
}
export default App;