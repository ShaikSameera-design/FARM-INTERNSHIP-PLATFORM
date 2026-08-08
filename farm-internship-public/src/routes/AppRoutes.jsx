import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import StudentRegistration from "../pages/StudentRegistration.jsx";
import FarmerRegistration from "../pages/FarmerRegistration.jsx";
import CollegeRegistration from "../pages/CollegeRegistration.jsx";
import NotFound from "../pages/NotFound.jsx";

/**
 * Public Module routes only:
 * Home, Login, Student, Farmer, College Registration.
 * No dashboard or private routes are defined here by design.
 */
function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register/student" element={<StudentRegistration />} />
        <Route path="/register/farmer" element={<FarmerRegistration />} />
        <Route path="/register/college" element={<CollegeRegistration />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
