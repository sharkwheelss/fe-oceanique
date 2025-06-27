import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import NotFound from './components/NotFound';

interface AdminProtectedRouteProps {
    adminType?: 'cms' | 'event';
}

const AdminProtectedRoute = ({ adminType = 'event' }: AdminProtectedRouteProps) => {
    const { isAuthenticated, isLoading, isAdminCMS, isAdminEvent } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500" />
            </div>
        );
    }

    if (!isAuthenticated && !isAdminEvent) {
        return <Navigate to="/adminevent-signin" state={{ from: location }} replace />;
    } else if (!isAuthenticated && !isAdminCMS) {
        return <Navigate to="/admincms-signin" state={{ from: location }} replace />;
    }

    // Check specific admin permissions
    let hasAccess = false;
    switch (adminType) {
        case 'cms':
            hasAccess = isAdminCMS;
            break;
        case 'event':
            hasAccess = isAdminEvent;
            break;
    }

    if (!hasAccess) {
        return <NotFound />;
    }

    return <Outlet />;
};

export default AdminProtectedRoute;