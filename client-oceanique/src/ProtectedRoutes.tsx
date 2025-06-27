import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading, isCust } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center max-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500" />
            </div>
        );
    }

    if (!isAuthenticated && !isCust) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;