import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminNavbar = () => {
    const { isAdmin, isAdminCMS, isAdminEvent, logout } = useAuth();
    const location = useLocation();

    if (!isAdmin) return null;

    const isActive = (path: string) => location.pathname.startsWith(path);

    // Role-specific navigation items
    const cmsNavItems = [
        { path: '/admin/cms', label: 'CMS Dashboard' },
        { path: '/admin/cms/users', label: 'Users' },
        { path: '/admin/cms/beaches', label: 'Beaches' },
        { path: '/admin/cms/reviews', label: 'Reviews' },
    ];

    const eventNavItems = [
        { path: '/admin/events', label: 'Event Dashboard' },
        { path: '/admin/events/manage', label: 'Manage Events' },
        { path: '/admin/events/create', label: 'Create Event' },
    ];

    const getNavItems = () => {
        if (isAdminCMS && isAdminEvent) {
            // If user has both roles, show both sections
            return [...cmsNavItems, ...eventNavItems];
        } else if (isAdminCMS) {
            return cmsNavItems;
        } else if (isAdminEvent) {
            return eventNavItems;
        }
        return [];
    };

    const navItems = getNavItems();

    return (
        <nav className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/admin" className="text-xl font-bold">
                            Oceanique Admin
                        </Link>
                        <div className="hidden md:flex space-x-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item.path)
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/home"
                            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Back to Site
                        </Link>
                        <button
                            onClick={logout}
                            className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;