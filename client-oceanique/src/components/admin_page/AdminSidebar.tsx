import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
    const { isAdmin, isAdminCMS, isAdminEvent } = useAuth();
    const location = useLocation();

    if (!isAdmin) return null;

    const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
            <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-8">Dashboard</h2>
                <nav className="space-y-2">
                    {isAdminCMS && (
                        <>
                            <Link
                                to="/admin/cms"
                                className={`block px-4 py-2 rounded-lg font-medium transition-colors ${isActive('/admin/cms')
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                CMS Dashboard
                            </Link>
                            <Link
                                to="/admin/cms/users"
                                className={`block px-4 py-2 rounded-lg transition-colors ${isActive('/admin/cms/users')
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                Users
                            </Link>
                            <Link
                                to="/admin/cms/beaches"
                                className={`block px-4 py-2 rounded-lg transition-colors ${isActive('/admin/cms/beaches')
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                Beaches
                            </Link>
                            <Link
                                to="/admin/cms/reviews"
                                className={`block px-4 py-2 rounded-lg transition-colors ${isActive('/admin/cms/reviews')
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                Reviews
                            </Link>
                        </>
                    )}

                    {isAdminEvent && (
                        <>
                            <Link
                                to="/admin/events"
                                className={`block px-4 py-2 rounded-lg font-medium transition-colors ${isActive('/admin/events') && location.pathname === '/admin/events'
                                    ? 'bg-teal-50 text-teal-700'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                Events
                            </Link>
                            <div className="space-y-1">
                                {/* Parent Link */}
                                <Link
                                    to="/admin/events/tickets"
                                    className={`block px-4 py-2 rounded-lg transition-colors font-medium
      ${isActive('/admin/events/tickets') ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-100'}`}
                                >
                                    Tickets
                                </Link>

                                {/* Child Link (Indented) */}
                                <Link
                                    to="/admin/events/tickets/category"
                                    className={`block ml-4 px-4 py-2 rounded-lg transition-colors text-sm 
      ${isActive('/admin/events/tickets/category') ? 'bg-teal-100 text-teal-800' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    Tickets Category
                                </Link>
                            </div>
                            <Link
                                to="/admin/events/transactions-report"
                                className={`block px-4 py-2 rounded-lg transition-colors font-medium ${isActive('/admin/events/transactions')
                                    ? 'bg-teal-50 text-teal-700'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                Transactions Reports
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </div>
    );
};

export default AdminSidebar;