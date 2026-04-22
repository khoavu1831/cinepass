import { useState } from "react";
import axiosClient from "../../api/axiosClient";
import useAuthStore from "../../store/useAuthStore";
import toast from "react-hot-toast";

function Signin({ onSwitchSignup, onSwitchForgetPassword, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosClient.post("/auth/login", { email, password });
      
      const { user, accessToken, refreshToken } = res.data;
      login(user, accessToken, refreshToken);
      toast.success("Đăng nhập thành công");
      if (onSuccess) onSuccess();
    } catch (error) {
      const msg = error.response?.data?.message || "Đăng nhập thất bại";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-3 max-md:p-6 mb-4 p-12"
      onSubmit={handleSubmit}
    >
      <h1 className="font-semibold text-xl">Đăng nhập</h1>
      <p className="max-md:text-[12px] text-[15px] mb-3">Nếu bạn chưa có tài khoản,
        <span
          className="text-mainblue cursor-pointer ml-1"
          onClick={onSwitchSignup}
        >đăng ký ngay
        </span>
      </p>
      <input
        className="py-3 pl-4 border placeholder-gray-500 text-gray-500 rounded-md text-sm max-md:text-[12px]"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="py-3 pl-4 border placeholder-gray-500 text-gray-500 rounded-md text-sm max-md:text-[12px]"
        placeholder="Mật khẩu"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button 
        disabled={loading}
        className="bg-mainblue py-2 px-4 rounded-md text-sm mt-3 cursor-pointer disabled:opacity-50 text-white font-medium"
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
      <span
        className="m-auto cursor-pointer text-gray-300 text-sm max-md:text-[12px]"
        onClick={onSwitchForgetPassword}
      >Quên mật khẩu?
      </span>
    </form>
  )
}

export default Signin