

import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
    const providerInfo = useSelector((state: any) => state.provider.providerInfo);

    
    if (!providerInfo) {
        return <Navigate to="/provider/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
