import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const AdminGuard = () => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    if (user?.role !== 'SUPERADMIN' && user?.role !== 'ADMIN') {
        // Nếu user bình thường cố tình vào admin -> quay về home
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminGuard;
