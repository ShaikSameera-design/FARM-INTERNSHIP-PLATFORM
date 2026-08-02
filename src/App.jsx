import React, { useState, useEffect } from "react";
import CollegeDashboard from "./pages/College/CollegeDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLogin from "./pages/Admin/AdminLogin";

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

  // Check if current route is /admin
  const isAdminRoute = currentPath.toLowerCase().startsWith("/admin");

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