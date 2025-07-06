import { useState, useEffect } from 'react';
import {
    ChevronLeft,
    Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserProfilePage() {
    const navigate = useNavigate();
    const { viewProfile } = useAuth();
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        address: "",
        img: "",
        personality: "",
        bank_name: "",
        account_number: "",
        account_name: "",
        user_types_id: 1,
        preference: {}
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user profile data
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const response = await viewProfile();
                if (response) {
                    setUserData(response);
                }
            } catch (err) {
                setError("Failed to load profile data");
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    // Array of preference categories with their display names
    const preferenceCategories = [
        { id: "Accessibility", label: "Accessibility" },
        { id: "Activity", label: "Activity" },
        { id: "Beach Type", label: "Beach Type" },
        { id: "Facility", label: "Facility" },
        { id: "Cleanliness", label: "Cleanliness" },
        { id: "Budget", label: "Budget" },
        { id: "Weather", label: "Weather" }
    ];

    // Check if user is admin
    const isAdmin = userData.user_types_id === 3;

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
                <div className="text-center">Loading profile...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
                <div className="text-center text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow">
            {/* Navigation header */}
            <div className="flex items-center p-4">
                <button
                    onClick={() => navigate(-1)}
                    className="rounded-full bg-teal-200 p-2 mr-3"
                >
                    <ChevronLeft size={20} className="text-teal-800" />
                </button>
                <div className="text-gray-700">
                    <span className="text-gray-500">Profile</span> / {userData.username}
                </div>
            </div>

            {/* Profile card */}
            <div className="rounded-lg overflow-hidden mb-6">
                {/* Gradient header */}
                <div className="h-16 bg-gradient-to-r from-teal-400 to-gray-400 flex justify-end items-center px-4">
                </div>

                {/* Profile info */}
                <div className="p-6 pb-10 relative">
                    {/* Profile image */}
                    <div className="absolute -top-16 left-6 w-32 h-32 rounded-full overflow-hidden border-4 border-white">
                        <img
                            src={userData.img}
                            alt={userData.username}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Edit button */}
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={() => navigate("/edit-profile")}
                            className="bg-teal-500 text-white px-6 py-2 rounded-full text-sm hover:bg-teal-600 transition-colors"
                        >
                            Edit
                        </button>
                    </div>

                    {/* User details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <div className="bg-gray-100 p-3 rounded text-gray-700">
                                {userData.username}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="bg-gray-100 p-3 rounded text-gray-700">
                                {userData.email}
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <div className="bg-gray-100 p-3 rounded text-gray-700">
                                {userData.address || "-"}
                            </div>
                        </div>

                        {/* Admin-only bank fields */}
                        {isAdmin && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                                    <div className="bg-gray-100 p-3 rounded text-gray-700">
                                        {userData.bank_name || "-"}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                                    <div className="bg-gray-100 p-3 rounded text-gray-700">
                                        {userData.account_number || "-"}
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                                    <div className="bg-gray-100 p-3 rounded text-gray-700">
                                        {userData.account_name || "-"}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* User personality badge */}
                    {!isAdmin && (
                        <div className="flex justify-center mt-6">
                            <div className="inline-flex items-center gap-2 bg-teal-500 text-white border border-white rounded-full px-4 py-2">
                                {userData.personality || "-"}
                            </div>
                        </div>
                    )}

                    {/* Preferences */}
                    {userData.preference && Object.keys(userData.preference).length > 0 && (
                        <div className="mt-8">
                            <h3 className="font-medium text-lg mb-4">How You Ranked Your Preferences</h3>
                            <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
                                {preferenceCategories.map((category) => (
                                    <div key={category.id} className="flex flex-col">
                                        <span className="text-sm mb-1">{category.label}</span>
                                        <div className="bg-gray-200 p-3 rounded text-center font-semibold">
                                            {userData.preference[category.id] || "-"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}