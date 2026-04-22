import { useState } from "react";
import axiosClient from "../../api/axiosClient";
import toast from "react-hot-toast";

function Signup({ onSwitchSignin }) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!displayName || !email || !password || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp");
      return;
    }

    try {
      setLoading(true);
      await axiosClient.post("/auth/register", {
        displayName,
        email,
        password
      });
      
      toast.success("Đăng ký thành công, vui lòng đăng nhập!");
      onSwitchSignin(); // Switch to login modal
    } catch (error) {
      const msg = error.response?.data?.message || "Đăng ký thất bại";
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
      <h1 className="font-semibold text-xl">Đăng ký</h1>
      <p className="max-md:text-[12px] text-[15px] mb-3">Nếu bạn đã có tài khoản,
        <span
          onClick={onSwitchSignin}
          className="text-mainblue cursor-pointer ml-1"
        > đăng nhập ngay
        </span>
      </p>
      <input
        className="py-3 pl-4 border placeholder-gray-500 text-gray-500 rounded-md text-sm max-md:text-[12px]"
        placeholder="Tên hiển thị"
        type="text"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
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
      <input
        className="py-3 pl-4 border placeholder-gray-500 text-gray-500 rounded-md text-sm max-md:text-[12px]"
        placeholder="Nhập lại mật khẩu"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button 
        disabled={loading}
        className="bg-mainblue py-2 px-4 rounded-md text-sm mt-3 cursor-pointer disabled:opacity-50 text-white font-medium"
      >
        {loading ? "Đang xử lý..." : "Đăng ký"}
      </button>
    </form>
  )
}

export default Signup