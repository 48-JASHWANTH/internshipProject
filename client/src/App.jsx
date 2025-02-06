import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./modules/Login/Login";
import Admin from "./modules/Admin/Admin";
import Student from "./modules/Student/StudentLayout";
import Faculty from "./modules/Faculty/FacultyLayout";
import ClassProjects from "./modules/Faculty/ClassProjects";
// import ActiveWorks from "./modules/Student/ActiveWorks";
import Dashboard from "./modules/Student/Dashboard";
import ArchivedProjects from "./modules/Student/ArchivedProjects";
import ChangePassword from "./modules/Student/ChangePassword";
import Profile from "./modules/Student/Profile";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/faculty" element={<Faculty />}>
          <Route path="classProjects" element={<ClassProjects />} />
        </Route>
        <Route path="/student" element={<Student />} >  
          <Route path="ArchivedProjects" element={<ArchivedProjects />} />
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="Profile" element={<Profile />} />
        <Route path="ChangePassword" element={<ChangePassword />} />
        </Route>
      </Routes>
    </Router>
  );
}
export default App;