import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { user, isAdminCMS, isAdminEvent } = useAuth();

    const getUserTypeLabel = () => {
        switch (user?.user_types_id) {
            case 2: return 'CMS Administrator';
            case 3: return 'Event Administrator';
            default: return 'Administrator';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-2">Welcome back, {user?.username}</p>
                    <p className="text-sm text-gray-500">{getUserTypeLabel()}</p>
                </div>

                {/* Role-based quick actions */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Admin Panel</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {isAdminCMS && (
                            <>
                                <Link
                                    to="/admin/cms"
                                    className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <h3 className="font-semibold text-blue-900">CMS Dashboard</h3>
                                    <p className="text-blue-600 text-sm mt-1">Manage content and users</p>
                                </Link>
                                <Link
                                    to="/admin/cms/users"
                                    className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                    <h3 className="font-semibold text-green-900">Manage Users</h3>
                                    <p className="text-green-600 text-sm mt-1">View and edit user accounts</p>
                                </Link>
                                <Link
                                    to="/admin/cms/beaches"
                                    className="p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
                                >
                                    <h3 className="font-semibold text-teal-900">Manage Beaches</h3>
                                    <p className="text-teal-600 text-sm mt-1">Add, edit, and remove beaches</p>
                                </Link>
                                <Link
                                    to="/admin/cms/reviews"
                                    className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                                >
                                    <h3 className="font-semibold text-orange-900">Review Management</h3>
                                    <p className="text-orange-600 text-sm mt-1">Moderate user reviews</p>
                                </Link>
                            </>
                        )}

                        {isAdminEvent && (
                            <>
                                <Link
                                    to="/admin/events"
                                    className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                                >
                                    <h3 className="font-semibold text-purple-900">Event Dashboard</h3>
                                    <p className="text-purple-600 text-sm mt-1">Event management overview</p>
                                </Link>
                                <Link
                                    to="/admin/events/manage"
                                    className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                >
                                    <h3 className="font-semibold text-indigo-900">Manage Events</h3>
                                    <p className="text-indigo-600 text-sm mt-1">Edit and delete events</p>
                                </Link>
                                <Link
                                    to="/admin/events/create"
                                    className="p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
                                >
                                    <h3 className="font-semibold text-pink-900">Create Event</h3>
                                    <p className="text-pink-600 text-sm mt-1">Add new events</p>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Common actions for all admins */}
                <div className="mt-8 bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            to="/home"
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            Back to Main Site
                        </Link>
                        <Link
                            to="/profile"
                            className="px-4 py-2 bg-teal-100 hover:bg-teal-200 text-teal-800 rounded-md transition-colors"
                        >
                            My Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;