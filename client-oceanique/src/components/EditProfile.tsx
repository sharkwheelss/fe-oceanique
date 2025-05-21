import { useState } from 'react';
import { ChevronLeft, Eye, EyeOff, ChevronDown, LogOut, Check } from 'lucide-react';

export default function ProfileEditor() {
    // State for form fields
    const [formData, setFormData] = useState({
        username: 'Ryyan Ramadhan',
        email: 'himail@gmail.com',
        address: 'Jalan lorem ipsum',
        password: '********',
        confirmPassword: '********'
    });

    // State for password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // State for saving notification
    const [showSaveNotification, setShowSaveNotification] = useState(false);

    // Rank categories for preferences
    const rankCategories = [
        "Accessibility",
        "Activity",
        "Beach Type",
        "Facilities",
        "Cleanliness",
        "Budget",
        "Weather Condition"
    ];

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Show save notification
        setShowSaveNotification(true);

        // Hide notification after 3 seconds
        setTimeout(() => {
            setShowSaveNotification(false);
        }, 3000);

        // Here you would typically send data to an API
        console.log('Form submitted:', formData);
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Toggle confirm password visibility
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header section */}
            <header className="bg-gradient-to-r from-teal-400 to-gray-400 p-5 text-white relative">
                <div className="container mx-auto flex items-center">
                    <a onClick={() => window.history.back()} className="flex items-center">
                        <div className="bg-teal-500 rounded-full p-4 inline-flex">
                            <ChevronLeft size={24} />
                        </div>
                        <span className="ml-4 text-lg font-medium">Profile / Edit Profile</span>
                    </a>
                    <div className="ml-auto">
                        <a href="#" className="text-black hover:underline flex items-center">
                            Log out
                            <span className="ml-2"><LogOut size={16} /></span>
                        </a>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-grow container mx-auto py-8 px-4">
                <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Profile image section */}
                        <div className="md:w-1/4 flex flex-col items-center">
                            <div className="relative">
                                <div className="w-40 h-40 rounded-full overflow-hidden bg-amber-200">
                                    <img
                                        src="/api/placeholder/160/160"
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="mt-4 flex justify-center">
                                    <div className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white">
                                        <span className="text-sm font-medium text-gray-700">Adventurer</span>
                                        <ChevronDown size={16} className="ml-2" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form fields section */}
                        <div className="md:w-3/4 grid md:grid-cols-2 gap-6">
                            {/* Username field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-100 rounded-md"
                                />
                            </div>

                            {/* Address field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-100 rounded-md"
                                />
                            </div>

                            {/* Email field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-100 rounded-md"
                                />
                            </div>

                            {/* Password field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-100 rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password field */}
                            <div className="md:col-span-2 lg:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-100 rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Save button */}
                            <div className="md:col-span-2 flex justify-end mt-4">
                                <button
                                    onClick={handleSubmit}
                                    className="bg-teal-500 text-white px-6 py-3 rounded-md hover:bg-teal-600 transition"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Preferences section */}
                    <div className="mt-12">
                        <h2 className="text-xl font-semibold mb-6">Ranks your preferences</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                            {rankCategories.map((category, index) => (
                                <div key={index} className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-2">{category}</label>
                                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md flex items-center justify-between">
                                        <span>1</span>
                                        <ChevronDown size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Save notification */}
            {showSaveNotification && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md flex items-center">
                    <Check size={16} className="mr-2" />
                    <span>Profile saved successfully!</span>
                </div>
            )}
        </div>
    );
}