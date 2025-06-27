import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();

    return (
        <div className='bg-white border-b border-gray-200 px-8 py-6'>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back, {user?.username}</p>
                </div>
            </div>
        </div>

    );
};

export default AdminDashboard;