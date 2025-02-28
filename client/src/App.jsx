import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./modules/Login/Login";
import Admin from "./modules/Admin/Admin";
import Student from "./modules/Student/StudentLayout";
import Faculty from "./modules/Faculty/FacultyLayout";
import ClassProjects from "./modules/Faculty/ClassProjects";
import Dashboard from "./modules/Student/Dashboard";
import ArchivedProjects from "./modules/Student/ArchivedProjects";
import ChangePassword from "./modules/Student/ChangePassword";
import Profile from "./modules/Student/Profile/Profile";
import FacultyDashboard from './modules/Faculty/Dashboard'
import FacultyActiveWorks from './modules/Faculty/ActiveWorks/ActiveWorks'
import FacultyArchivedProjects from './modules/Faculty/ArchivedProjects'
import CreateProjectForm from './modules/Faculty/CreateProjectForm';
import ProjectForum from './modules/Student/ProjectForum';
import ActiveWorks from './modules/Student/ActiveWorks/ActiveWorks';
import CampusProjects from './modules/Student/CampusProjects';
import ProjectDetails from './modules/Student/ActiveWorks/ProjectDetails';
import { Toaster } from 'react-hot-toast';

function App() {
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
          <Route path="/admin" element={<Admin />}>
            <Route path="dashboard" element={<Admin />} />
          </Route>

          {/* Faculty Routes */}
          <Route path="/faculty" element={<Faculty />}>
            <Route path="dashboard" element={<FacultyDashboard />} />
            <Route path="projects" element={<ClassProjects />} />
            <Route path="activeworks" element={<FacultyActiveWorks />} />
            <Route path="archived" element={<FacultyArchivedProjects />} />
            <Route path="Projects/Create" element={<CreateProjectForm />} />
          </Route>

          {/* Student Routes */}
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
        </Routes>
      </Router>
    </>
  );
}
export default App;