const Dashboard = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Tổng quan hệ thống CinePass</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0f111a] border border-[#2b3561] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400 font-medium">Tổng Người dùng</h3>
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              <i className="fa-solid fa-users"></i>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold text-white">1,245</h2>
            <span className="text-emerald-400 text-sm font-medium flex items-center gap-1">
              <i className="fa-solid fa-arrow-up"></i> 12%
            </span>
          </div>
        </div>

        <div className="bg-[#0f111a] border border-[#2b3561] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400 font-medium">Tổng Phim</h3>
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
              <i className="fa-solid fa-film"></i>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold text-white">450</h2>
            <span className="text-emerald-400 text-sm font-medium flex items-center gap-1">
              <i className="fa-solid fa-arrow-up"></i> 5%
            </span>
          </div>
        </div>

        <div className="bg-[#0f111a] border border-[#2b3561] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400 font-medium">Collections</h3>
            <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400">
              <i className="fa-solid fa-layer-group"></i>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold text-white">12</h2>
            <span className="text-gray-500 text-sm">Đang hoạt động</span>
          </div>
        </div>

        <div className="bg-[#0f111a] border border-[#2b3561] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400 font-medium">Đánh giá mới</h3>
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
              <i className="fa-solid fa-star"></i>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold text-white">89</h2>
            <span className="text-emerald-400 text-sm font-medium flex items-center gap-1">
              <i className="fa-solid fa-arrow-up"></i> 24%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* Recent Users Placeholder */}
        <div className="bg-[#0f111a] border border-[#2b3561] rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Người dùng mới</h3>
          <div className="flex flex-col gap-4">
            <p className="text-gray-400 text-sm">Tính năng đang được phát triển...</p>
          </div>
        </div>
        
        {/* System Logs Placeholder */}
        <div className="bg-[#0f111a] border border-[#2b3561] rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Hoạt động gần đây</h3>
          <div className="flex flex-col gap-4">
            <p className="text-gray-400 text-sm">Tính năng đang được phát triển...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
