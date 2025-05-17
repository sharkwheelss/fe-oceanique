import { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Edit2,
    Star
} from 'lucide-react';

export default function UserProfilePage() {
    // User data state
    const [userData, setUserData] = useState({
        username: "Ryyan Ramadhan",
        email: "himail@gmail.com",
        address: "jalan lorem ipsum",
        userType: "Adventurer",
        profileImage: "/api/placeholder/200/200",
        preferences: {
            accessibility: 1,
            activity: 1,
            beachType: 1,
            facilities: 1,
            cleanliness: 1,
            budget: 1,
            weatherCondition: 1
        }
    });

    // Sample reviews data
    const [reviews, setReviews] = useState([
        {
            id: 1,
            username: "Abi 123",
            memberSince: "2021",
            rating: 5,
            date: "05 March 2024",
            content: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
            images: ["/api/placeholder/100/100", "/api/placeholder/100/100"],
            tags: ["Swimming", "Big Bus", "Surfing", "Toilet", "Mosque", "Rainy", "Rp 25k"]
        },
        {
            id: 2,
            username: "Abi 123",
            memberSince: "2021",
            rating: 5,
            date: "05 March 2024",
            content: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
            images: ["/api/placeholder/100/100", "/api/placeholder/100/100"],
            tags: ["Swimming", "Big Bus", "Surfing", "Toilet", "Mosque", "Rainy", "Rp 25k"]
        }
    ]);

    // Function to render star ratings
    const renderStarRating = (rating, totalStars = 5) => {
        return (
            <div className="flex items-center">
                {[...Array(totalStars)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        );
    }

    // Function to handle edit profile
    const handleEditProfile = () => {
        // This would typically open a modal or navigate to an edit page
        console.log("Edit profile clicked");
    };

    // Array of preference categories
    const preferenceCategories = [
        { id: "accessibility", label: "Accessibility" },
        { id: "activity", label: "Activity" },
        { id: "beachType", label: "Beach Type" },
        { id: "facilities", label: "Facilities" },
        { id: "cleanliness", label: "Cleanliness" },
        { id: "budget", label: "Budget" },
        { id: "weatherCondition", label: "Weather Condition" }
    ];

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow">
            {/* Navigation header */}
            <div className="flex items-center p-4">
                <button className="rounded-full bg-teal-200 p-2 mr-3">
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
                    <button className="text-white flex items-center text-sm font-medium">
                        Log out <ChevronRight size={16} className="ml-1" />
                    </button>
                </div>

                {/* Profile info */}
                <div className="p-6 pb-10 relative">
                    {/* Profile image */}
                    <div className="absolute -top-16 left-6 w-32 h-32 rounded-full overflow-hidden border-4 border-white">
                        <img
                            src={userData.profileImage}
                            alt={userData.username}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Edit button */}
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={handleEditProfile}
                            className="bg-teal-500 text-white px-6 py-2 rounded-full text-sm"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <div className="bg-gray-100 p-3 rounded text-gray-700">
                                {userData.address}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="bg-gray-100 p-3 rounded text-gray-700">
                                {userData.email}
                            </div>
                        </div>
                    </div>

                    {/* User type badge */}
                    <div className="flex justify-center mt-6">
                        <div className="inline-flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2">
                            <span className="p-1 bg-yellow-100 rounded-full">
                                🏄
                            </span>
                            {userData.userType}
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="mt-8">
                        <h3 className="font-medium text-lg mb-4">Ranks your preferences</h3>
                        <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
                            {preferenceCategories.map((category) => (
                                <div key={category.id} className="flex flex-col">
                                    <span className="text-sm mb-1">{category.label}</span>
                                    <div className="bg-gray-200 p-3 rounded text-center">
                                        {userData.preferences[category.id]}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-4">
                <div className="flex items-center px-4 pb-2">
                    <h3 className="font-bold text-lg">Reviews</h3>
                    <div className="ml-2 h-1 w-16 bg-teal-500 rounded"></div>
                </div>

                {/* Review Cards */}
                {reviews.map(review => (
                    <div key={review.id} className="p-6 border-t">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                                    {/* Placeholder for user avatar */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold">{review.username}</p>
                                    <p className="text-xs text-gray-500">Since {review.memberSince}</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-1">
                                    {renderStarRating(review.rating)}
                                    <span className="text-sm ml-1">{review.rating} / 5</span>
                                </div>
                                <p className="text-xs text-gray-500">(Posted at {review.date})</p>
                                <button className="mt-2">
                                    <Edit2 size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Review Content */}
                        <div className="mb-4">
                            <div className="flex gap-2 mb-3">
                                {review.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Review image ${index + 1}`}
                                        className="w-16 h-16 rounded object-cover"
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-gray-700">{review.content}</p>
                        </div>

                        {/* Review Tags */}
                        <div className="flex flex-wrap gap-2">
                            {review.tags.map((tag, index) => (
                                <div key={index} className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-full px-3 py-1 text-xs">
                                    {tag !== "Rp 25k" && (
                                        <span className="w-3 h-3 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="text-green-600 text-xs">✓</span>
                                        </span>
                                    )}
                                    <span>{tag}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}