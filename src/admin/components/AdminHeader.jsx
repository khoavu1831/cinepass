import useAuthStore from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdminHeader = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất khỏi Admin");
    navigate("/admin/login");
  };

  return (
    <header className="h-20 bg-[#0f111a] border-b border-[#2b3561] flex items-center justify-between px-8 z-10 shadow-sm shadow-black/50">
      <div className="flex items-center">
        {/* Search Bar - Optional for Global Search */}
        <div className="relative w-96 hidden md:block">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            placeholder="Tìm kiếm phim, user..." 
            className="w-full bg-[#1b1d29] border border-[#2b3561] text-white text-sm rounded-full py-2.5 pl-11 pr-4 focus:outline-none focus:border-mainblue focus:ring-1 focus:ring-mainblue transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative text-gray-400 hover:text-white transition-colors">
          <i className="fa-regular fa-bell text-xl"></i>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
        </button>

        <div className="w-px h-6 bg-[#2b3561]"></div>

        {/* User Profile */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-white">{user?.username || "Admin"}</span>
            <span className="text-xs text-gray-400">{user?.role || "Administrator"}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="w-10 h-10 rounded-full bg-[#2b3561] hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-all border border-transparent hover:border-red-500/50"
            title="Đăng xuất"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
