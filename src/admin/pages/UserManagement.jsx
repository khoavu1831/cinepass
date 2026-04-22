import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import toast from "react-hot-toast";
import useAuthStore from "../../store/useAuthStore";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const { user: currentUser } = useAuthStore();
  const isSuperAdmin = currentUser?.role === "SUPERADMIN";

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/admin/users`);
      setUsers(res.data);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBan = async (id, currentStatus) => {
    if (!window.confirm(`Bạn có chắc muốn ${currentStatus ? 'khóa' : 'mở khóa'} tài khoản này?`)) return;
    try {
      await axiosClient.put(`/admin/users/${id}/ban`);
      toast.success("Đã thay đổi trạng thái tài khoản");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  const handleUpdateRole = async (id, newRole) => {
    if (!window.confirm(`Xác nhận cấp quyền ${newRole}?`)) return;
    try {
      await axiosClient.put(`/admin/users/${id}/role`, `"${newRole}"`, {
        headers: { 'Content-Type': 'application/json' }
      });
      toast.success("Cấp quyền thành công");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý Người dùng</h1>
          <p className="text-gray-400 text-sm mt-1">Quản trị tài khoản và phân quyền</p>
        </div>
      </div>

      <div className="bg-[#0f111a] border border-[#2b3561] rounded-2xl overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#2b3561] flex items-center justify-between">
          <div className="relative w-64">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="Tìm kiếm user..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1b1d29] border border-[#2b3561] text-white text-sm rounded-lg py-2 pl-9 pr-3 focus:outline-none focus:border-mainblue transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-[#1b1d29] border-b border-[#2b3561]">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Vai trò</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium">Ngày tham gia</th>
                <th className="px-6 py-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    <i className="fa-solid fa-circle-notch fa-spin text-2xl mb-2"></i>
                    <p>Đang tải dữ liệu...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-[#2b3561] hover:bg-[#1b1d29] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{u.username}</div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`py-1 px-2 rounded-md font-semibold text-xs border ${
                        u.role === 'SUPERADMIN' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                        u.role === 'ADMIN' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 ${u.isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                        <span className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                        {u.isActive ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Grant Admin (Only SuperAdmin can do this, and not on another SuperAdmin) */}
                        {isSuperAdmin && u.role !== 'SUPERADMIN' && (
                          <div className="relative group">
                            <button className="text-gray-400 hover:text-blue-400 p-2 rounded-lg hover:bg-blue-500/10 transition-colors">
                              <i className="fa-solid fa-shield-halved"></i>
                            </button>
                            <div className="absolute right-0 mt-1 w-32 bg-[#1b1d29] border border-[#2b3561] rounded-lg shadow-xl hidden group-hover:block z-10">
                              {u.role !== 'ADMIN' && (
                                <button onClick={() => handleUpdateRole(u.id, 'ADMIN')} className="w-full text-left px-4 py-2 hover:bg-[#2b3561] text-xs text-blue-400">Set Admin</button>
                              )}
                              {u.role !== 'USER' && (
                                <button onClick={() => handleUpdateRole(u.id, 'USER')} className="w-full text-left px-4 py-2 hover:bg-[#2b3561] text-xs text-gray-400">Set User</button>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Ban/Unban (Can't ban SuperAdmin, Admin can't ban Admin) */}
                        {u.role !== 'SUPERADMIN' && (isSuperAdmin || u.role !== 'ADMIN') && (
                          <button 
                            onClick={() => handleToggleBan(u.id, u.isActive)}
                            className={`p-2 rounded-lg transition-colors ${u.isActive ? 'text-gray-400 hover:text-red-500 hover:bg-red-500/10' : 'text-red-400 hover:text-emerald-500 hover:bg-emerald-500/10'}`}
                            title={u.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                          >
                            <i className={`fa-solid ${u.isActive ? 'fa-lock' : 'fa-lock-open'}`}></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
