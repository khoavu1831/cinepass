import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-[#0f111a] font-poppins text-white overflow-hidden">
      {/* Sidebar cố định bên trái */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />
        
        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#1b1d29] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
