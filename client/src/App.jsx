import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./modules/Login/Login";
import Admin from "./modules/Admin/Admin";
import Guide from "./modules/Guide/Guide";
import Student from "./modules/Student/StudentLayout";
import Incharge from "./modules/Incharge/InchargeLayout";
import ClassProjects from "./modules/Incharge/ClassProjects";
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
        <Route path="/guide" element={<Guide />} />
        <Route path="/Incharge" element={<Incharge />}>
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