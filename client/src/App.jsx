import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./modules/Login/Login";
import AdminLayout from "./modules/Admin/AdminLayout";
import FacultyLayout from "./modules/Faculty/FacultyLayout";
import Dashboard from "./modules/Student/Dashboard";
import ArchivedProjects from "./modules/Student/ArchivedProjects/ArchivedProjects";
import ArchivedProjectDetails from "./modules/Student/ArchivedProjects/ArchivedProjectDetails";
import ChangePassword from "./modules/Student/ChangePassword";
import Profile from "./modules/Student/Profile/Profile";
import FacultyDashboard from './modules/Faculty/Dashboard'
import GuideArchivedProjects from './modules/Faculty/ArchivedProjects/Guide/GuideArchivedProjects'
import GuideArchivedProjectDetails from './modules/Faculty/ArchivedProjects/Guide/GuideArchivedProjectDetails'
import InchargeArchivedProjects from './modules/Faculty/ArchivedProjects/Incharge/InchargeArchivedProjects'
import InchargeClass from './modules/Faculty/ArchivedProjects/Incharge/InchargeClass'
import InchargeArchivedProjectDetails from './modules/Faculty/ArchivedProjects/Incharge/InchargeArchivedProjectDetails'
import FacultyProjectForum from './modules/Faculty/ProjectForum/FacultyProjectForum';
import InchargeActiveWorks from './modules/Faculty/ActiveWorks/Incharge/InchargeActiveWorks';
import InchargeClassTeams from './modules/Faculty/ActiveWorks/Incharge/InchargeClassTeams';
import InchargeProjectDetails from './modules/Faculty/ActiveWorks/Incharge/InchargeProjectDetails';
import CreateProjectForm from './modules/Faculty/CreateProject/CreateProjectForm';
import ForumProjectDetails from './modules/Faculty/ProjectForum/ForumProjectDetails';
import ProjectForum from './modules/Student/ProjectForum/ProjectForum';
import ActiveWorks from './modules/Student/ActiveWorks/ActiveWorks';
import CampusProjects from './modules/common/CampusProjects';
import GuideProjectDetails from './modules/Faculty/ActiveWorks/Guide/GuideProjectDetails';
import ProjectDetails from './modules/Student/ActiveWorks/ProjectDetails';
import { Toaster } from 'react-hot-toast';
import GuideActiveWorks from "./modules/Faculty/ActiveWorks/Guide/GuideActiveWorks";
import Student from "./modules/Student/StudentLayout";
import FacultyProfile from "./modules/Faculty/Profile/FacultyProfile";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import AdminDashboard from './modules/Admin/Dashboard';
import AdminProfile from './modules/Admin/Profile';
import AdminFacultyManagement from './modules/Admin/AdminFacultyManagement';
import AdminStudentManagement from './modules/Admin/AdminStudentManagement';
import AddStudent from './modules/Admin/AddStudent';
import AddFaculty from './modules/Admin/AddFaculty';
import StudentView from './modules/Admin/StudentView';
import ViewFaculty from './modules/Admin/ViewFaculty';
import EditStudent from './modules/Admin/EditStudent';
import EditFaculty from './modules/Admin/EditFaculty';
import { useStore } from "./store/useStore";
import ProjectForumDetails from './modules/Student/ProjectForum/ProjectForumDetails';
import Notifications from './modules/Faculty/Notifications';
import StudentNotifications from "./modules/Student/StudentNotifications";
import ResetPassword from './modules/common/ResetPassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationComponent from './modules/Notification/NotificationComponent';

// Component to conditionally render the NotificationComponent
const ConditionalNotification = () => {
  const { isAuthenticated, user } = useStore();
  const location = useLocation();
  
  // Don't show notifications on login or reset password pages
  const isAuthPage = location.pathname === '/' || location.pathname === '/reset-password';
  
  // Return null on auth pages or if not authenticated
  if (!isAuthenticated || isAuthPage || !user) {
    return null;
  }
  
  // Otherwise render the notification component
  return <NotificationComponent />;
};

function App() {
  const PrivateRoute = ({ allowedRoles }) => {
    const { user, isAuthenticated } = useStore();
  
    if (!isAuthenticated || !allowedRoles.includes(user?.role)) {
      return <Navigate to="/" />;
    }
  
    return <Outlet />;
  };
  
  return (
    <>
      <Router>
        {/* <ConditionalNotification /> */}
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
        <ToastContainer
          position="top-center"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/Admin" element={<AdminLayout />}>
              <Route path="Dashboard" element={<AdminDashboard />} />
              <Route path="Profile" element={<AdminProfile />} />
              <Route path="CampusProjects" element={<CampusProjects />} />
              <Route path="Faculty" element={<AdminFacultyManagement />} />
              <Route path="Faculty/:facultyId" element={<ViewFaculty />} />
              <Route path="EditFaculty/:facultyId" element={<EditFaculty />} />
              <Route path="Students" element={<AdminStudentManagement />} />
              <Route path="Students/:studentId" element={<StudentView />} />
              <Route path="EditStudent/:studentId" element={<EditStudent />} />
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
              <Route path="ActiveWorks/Incharge" element={<InchargeActiveWorks />} />
              <Route path="ActiveWorks/Incharge/:classSection" element={<InchargeClassTeams />} />
              <Route path="ActiveWorks/Incharge/:classSection/:projectId" element={<InchargeProjectDetails />} />
              <Route path="ArchivedProjects/Guide" element={<GuideArchivedProjects />} />
              <Route path="ArchivedProjects/Guide/:projectId" element={<GuideArchivedProjectDetails />} />
              <Route path="ArchivedProjects/Incharge" element={<InchargeArchivedProjects />} />
              <Route path="ArchivedProjects/Incharge/:classSection" element={<InchargeClass />} />
              <Route path="ArchivedProjects/Incharge/:classSection/:projectId" element={<InchargeArchivedProjectDetails />} />
              <Route path="CampusProjects" element={<CampusProjects />} />
              <Route path="ProjectForum" element={<FacultyProjectForum />} />
              <Route path="ProjectForum/:projectId" element={<ForumProjectDetails />} />
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
              <Route path="archivedprojects/:projectId" element={<ArchivedProjectDetails />} />
              <Route path="profile" element={<Profile />} />
              <Route path="changepassword" element={<ChangePassword />} />
              <Route path="projectforum" element={<ProjectForum />} />
              <Route path="projectforum/:projectId" element={<ProjectForumDetails />} />
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