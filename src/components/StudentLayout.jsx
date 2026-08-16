import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function StudentLayout() {
  return (
    <div className="student-app">
      <Sidebar />
      <main className="student-main">
        <Outlet />
      </main>
    </div>
  );
}

export default StudentLayout;
