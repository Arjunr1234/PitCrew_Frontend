// ProtectedRoute.tsx

import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
    const userInfo = useSelector((state: any) => state.user.userInfo);

    
    if (!userInfo) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />; 
};

export default ProtectedRoute;
