import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './modules/Login/Login';
import Admin from './modules/Admin/Admin';
import Guide from './modules/Guide/Guide';
import Incharge from './modules/Incharge/Incharge';
import Student from './modules/Student/Student';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/incharge" element={<Incharge />} />
        <Route path="/student" element={<Student />} />
      </Routes>
    </Router>
  );
}

export default App;
