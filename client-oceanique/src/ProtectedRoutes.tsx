import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;