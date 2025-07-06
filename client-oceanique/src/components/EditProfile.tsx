import { useState, useEffect } from 'react';
import { ChevronLeft, Eye, EyeOff, Upload, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function EditProfilePage() {
    // State for form fields
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        address: '',
        password: '',
        confirmPassword: '',
        bank_name: '',
        account_number: '',
        account_name: '',
        user_types_id: 1,
        currentPassword: '',
        keepExistingProfilePicture: true
    });

    // State for display data (non-editable)
    const [displayData, setDisplayData] = useState({
        personality: ''
    });

    // State for image handling
    const [profileImage, setProfileImage] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    const [imageChanged, setImageChanged] = useState(false);

    // State for password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);

    // State for loading and notifications
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { viewProfile, editProfile } = useAuth();


    // Fetch current user data
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // setLoading(true);
                const response = await viewProfile();
                if (response) {
                    setFormData(prev => ({
                        ...prev,
                        username: response.username || '',
                        email: response.email || '',
                        address: response.address || '',
                        bank_name: response.bank_name || '',
                        account_number: response.account_number || '',
                        account_name: response.account_name || '',
                        user_types_id: response.user_types_id
                    }));
                    setDisplayData({
                        personality: response.personality || ''
                    });
                    setCurrentImageUrl(response.img || '');
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

    // Check if user is admin
    const isAdmin = formData.user_types_id === 3;

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setError('');
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('Image size should be less than 5MB');
                return;
            }

            setProfileImage(file);
            setImageChanged(true);
            setFormData(prev => ({
                ...prev,
                keepExistingProfilePicture: false
            }));

            const reader = new FileReader();
            reader.onload = (e) => {
                setCurrentImageUrl(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Validate form
    const validateForm = () => {
        if (!formData.username.trim()) {
            setError('Username is required');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }

        // If password is being changed, validate it
        if (formData.password || formData.confirmPassword) {
            if (!formData.currentPassword) {
                setError('Current password is required to change password');
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('New passwords do not match');
                return false;
            }
            if (formData.password.length < 6) {
                setError('New password must be at least 6 characters');
                return false;
            }
        }

        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSaving(true);
        setError('');

        try {
            // Create FormData object
            const submitData = new FormData();

            // Add all form fields
            submitData.append('username', formData.username);
            submitData.append('email', formData.email);
            submitData.append('address', formData.address || '');

            // Add password fields if password is being changed
            if (formData.password && formData.currentPassword) {
                submitData.append('password', formData.password);
                submitData.append('currentPassword', formData.currentPassword);
            }

            // Add admin-specific fields
            if (isAdmin) {
                submitData.append('bank_name', formData.bank_name || '');
                submitData.append('account_number', formData.account_number || '');
                submitData.append('account_name', formData.account_name || '');
            }

            // Handle image upload
            if (imageChanged && profileImage) {
                submitData.append('files', profileImage);
                submitData.append('keepExistingProfilePicture', 'false');
            } else if (!imageChanged) {
                submitData.append('keepExistingProfilePicture', 'true');
            }

            // Send to API - use the updateProfile method from context
            await editProfile(submitData);
            console.log(await editProfile(submitData))
            setShowSuccessPopup(true);

        } catch (err) {
            setError(err.message || 'Failed to update profile. Please try again.');
            console.error('Error updating profile:', err);
        } finally {
            setSaving(false);
        }
    };

    // Toggle password visibility functions
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const toggleCurrentPasswordVisibility = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header section with profile image */}
            <div className="bg-gradient-to-r from-teal-400 to-gray-400">
                {/* Navigation */}
                <div className="p-4 flex items-center justify-between">
                    <button onClick={() => navigate('/profile')} className="flex items-center text-white">
                        <ChevronLeft size={20} className="mr-2" />
                        <span>Profile / Edit Profile</span>
                    </button>
                </div>

                {/* Profile image section */}
                <div className="pb-16 pt-8">
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-white border-4 border-blue-600 shadow-lg">
                                <img
                                    src={currentImageUrl || '/api/placeholder/128/128'}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <label className="absolute bottom-0 right-0 bg-teal-500 text-white rounded-full p-2 cursor-pointer hover:bg-teal-600 transition-colors">
                                <Upload size={16} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="px-6 -mt-8 pb-8">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
                    <div>
                        {/* Basic Information Section */}
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            {/* Username field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Email field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Address field */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-600 mb-2">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="Enter your address"
                                />
                            </div>
                        </div>

                        {/* Personality Badge (Non-editable) */}
                        {displayData.personality && (
                            <div className="mb-8 flex justify-center">
                                <div className="bg-teal-500 text-white px-6 py-2 rounded-full text-sm font-medium">
                                    {displayData.personality}
                                </div>
                            </div>
                        )}

                        {/* Admin-only bank fields */}
                        {isAdmin && (
                            <div className="border-t pt-6 mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Banking Information</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Bank Name</label>
                                        <input
                                            type="text"
                                            name="bank_name"
                                            value={formData.bank_name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Account Number</label>
                                        <input
                                            type="text"
                                            name="account_number"
                                            value={formData.account_number}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Account Name</label>
                                        <input
                                            type="text"
                                            name="account_name"
                                            value={formData.account_name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Password Section */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Current Password field */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Current Password</label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="Enter current password to change password"
                                        />
                                        <button
                                            type="button"
                                            onClick={toggleCurrentPasswordVisibility}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="Enter new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm New Password field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Confirm New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={toggleConfirmPasswordVisibility}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Save button */}
                        <div className="mt-8 flex justify-end">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={saving}
                                className="bg-teal-500 text-white px-8 py-3 rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success popup */}
            {showSuccessPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
                                <Check size={32} className="text-teal-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Updated!</h3>
                            <p className="text-gray-600 mb-4">Your profile has been successfully updated.</p>
                            <button
                                onClick={() => {
                                    setShowSuccessPopup(false);
                                    navigate('/profile');
                                }}
                                className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}