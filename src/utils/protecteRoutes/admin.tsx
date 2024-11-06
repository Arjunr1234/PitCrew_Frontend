

import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
    const admin = useSelector((state: any) => state.admin.isAdmin);
    
    if (!admin) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />; 
};

export default ProtectedRoute;
