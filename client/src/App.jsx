import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./modules/Login/Login";
import Admin from "./modules/Admin/Admin";
import Guide from "./modules/Guide/Guide";
import Student from "./modules/Student/Student";
import InchargeLayout from "./modules/Incharge/InchargeLayout";
import ClassProjects from "./modules/Incharge/ClassProjects";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/inchargeLayout" element={<InchargeLayout />}>
          <Route path="classProjects" element={<ClassProjects />} />
        </Route>
        <Route path="/student" element={<Student />} />
      </Routes>
    </Router>
  );
}
export default App;