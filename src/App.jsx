import { useState, useEffect } from "react";
import CollegeDashboard from "./pages/College/CollegeDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLogin from "./pages/Admin/AdminLogin";
import CommunicationPage from "./pages/Communication/CommunicationPage";
import StudentPage from "./pages/Student/student";
import FarmerPage from "./pages/Farmer/farmer";
import PublicPage from "./pages/Public/public";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    () => sessionStorage.getItem("admin_authenticated") === "true"
  );

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      setIsAdminAuthenticated(sessionStorage.getItem("admin_authenticated") === "true");
    };

    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const lowerPath = currentPath.toLowerCase();
  const isAdminRoute = lowerPath.startsWith("/admin");
  const isCommunicationRoute = lowerPath === "/communication";
  const isStudentRoute = lowerPath === "/student";
  const isFarmerRoute = lowerPath === "/farmer";
  const isPublicRoute = lowerPath === "/public";

  if (isCommunicationRoute) {
    return <CommunicationPage />;
  }

  if (isStudentRoute) {
    return <StudentPage />;
  }

  if (isFarmerRoute) {
    return <FarmerPage />;
  }

  if (isPublicRoute) {
    return <PublicPage />;
  }

  if (isAdminRoute) {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={() => {
            sessionStorage.setItem("admin_authenticated", "true");
            setIsAdminAuthenticated(true);
          }}
        />
      );
    }

    return (
      <AdminDashboard
        onLogout={() => {
          sessionStorage.removeItem("admin_authenticated");
          setIsAdminAuthenticated(false);
        }}
      />
    );
  }

  // Non-admin route view (Default Public/College Portal)
  return <CollegeDashboard />;
}

export default App;