import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1">
        <Topbar />
        <div className="p-4 bg-light min-vh-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
