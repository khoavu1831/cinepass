import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import axiosClient from "../../api/axiosClient";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && (user?.role === "SUPERADMIN" || user?.role === "ADMIN")) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Vui lòng điền đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosClient.post("/auth/login", { email, password });
      
      const { userId, username, email: userEmail, role, accessToken, refreshToken } = res.data;
      const userData = { id: userId, username, email: userEmail, role };
      
      if (userData.role !== "SUPERADMIN" && userData.role !== "ADMIN") {
        toast.error("Tài khoản không có quyền truy cập Admin");
        return;
      }

      login(userData, accessToken, refreshToken);
      toast.success(`Chào mừng Admin ${userData.username}`);
      navigate("/admin/dashboard");
    } catch (error) {
      const msg = error.response?.data?.message || "Đăng nhập thất bại";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f111a] flex items-center justify-center p-4 font-poppins relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none"></div>

      <div className="bg-[#1b1d29] border border-[#2b3561] rounded-2xl w-full max-w-md p-8 shadow-2xl z-10 relative">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
            <i className="fa-solid fa-film text-3xl text-white"></i>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">CinePass Admin</h1>
          <p className="text-gray-400 mt-2 text-sm">Đăng nhập hệ thống quản trị</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-300">Email hoặc Username</label>
            <div className="relative">
              <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
              <input
                type="text"
                placeholder="admin@cinepass.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0f111a] border border-[#2b3561] text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-300">Mật khẩu</label>
            <div className="relative">
              <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0f111a] border border-[#2b3561] text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl py-3.5 mt-4 hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <i className="fa-solid fa-circle-notch fa-spin text-xl"></i>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
