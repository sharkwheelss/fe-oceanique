import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

interface AdminProtectedRouteProps {
    adminType?: 'cms' | 'event' | 'any';
}

const AdminProtectedRoute = ({ adminType = 'any' }: AdminProtectedRouteProps) => {
    const { isAuthenticated, isLoading, isAdmin, isAdminCMS, isAdminEvent } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
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
        case 'any':
        default:
            hasAccess = isAdmin;
            break;
    }

    if (!hasAccess) {
        // Redirect non-admin users to home or show unauthorized page
        return <Navigate to="/home" replace />;
        // Or you could show an unauthorized component:
        // return <Unauthorized />;
    }

    return <Outlet />;
};

export default AdminProtectedRoute;