import { Link, useLocation } from "react-router-dom";
import movieSvg from "/movie.svg";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "fa-solid fa-chart-pie" },
    { name: "Quản lý Người dùng", path: "/admin/users", icon: "fa-solid fa-users" },
    { name: "Quản lý Phim", path: "/admin/movies", icon: "fa-solid fa-film" },
    { name: "Quản lý Collections", path: "/admin/collections", icon: "fa-solid fa-layer-group" },
    { name: "Cài đặt Hệ thống", path: "/admin/settings", icon: "fa-solid fa-gear" },
  ];

  return (
    <div className="w-64 bg-[#0f111a] border-r border-[#2b3561] flex flex-col transition-all duration-300">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-[#2b3561]">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <img src={movieSvg} alt="Logo" className="w-8 h-8" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            CinePass Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? "bg-mainblue/20 text-mainblue font-semibold border border-mainblue/30" 
                  : "text-gray-400 hover:bg-[#2b3561]/50 hover:text-white"
              }`}
            >
              <i className={`${item.icon} text-lg w-5 text-center`}></i>
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Info */}
      <div className="p-4 border-t border-[#2b3561]">
        <div className="bg-[#1b1d29] rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
            SA
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Super Admin</h4>
            <p className="text-xs text-gray-400">Hệ thống</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
