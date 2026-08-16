import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import StudentLayout from "./components/StudentLayout";
import StudentDashboard from "./pages/Student/StudentDashboard";
import BrowseInternships from "./pages/Student/BrowseInternships";
import InternshipDetails from "./pages/Student/InternshipDetails";
import ApplyInternship from "./pages/Student/ApplyInternship";
import MyApplications from "./pages/Student/MyApplications";
import Attendance from "./pages/Student/Attendance";
import Profile from "./pages/Student/Profile";
import "./App.css";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="browse" element={<BrowseInternships />} />
          <Route path="internship/:id" element={<InternshipDetails />} />
          <Route path="apply/:id" element={<ApplyInternship />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
