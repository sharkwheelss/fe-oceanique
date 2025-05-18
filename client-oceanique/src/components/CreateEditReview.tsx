import { useState } from 'react';
import { ChevronLeft, Check } from 'lucide-react';

/**
 * Beach Review Form Component
 * A form interface for submitting reviews about beaches
 */
export default function BeachReviewForm() {
    // State for form data
    const [formData, setFormData] = useState({
        photos: [],
        rating: 5,
        review: '',
        beachFeatures: ['Swimming'],
    });

    // State for dropdown selection
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    // Categories for the beach features
    const categories = [
        { name: 'Accessibility', options: ['Parking nearby', 'Wheelchair accessible', 'Public transit', 'Walking path'] },
        { name: 'Activity', options: ['Swimming', 'Surfing', 'Fishing', 'Picnic', 'Beach volleyball'] },
        { name: 'Beach Type', options: ['Sandy', 'Rocky', 'Coral', 'Pebble', 'Cliff'] },
        { name: 'Facility', options: ['Restrooms', 'Showers', 'Food stalls', 'Lifeguards', 'Rentals'] },
        { name: 'cleanliness', options: ['Very clean', 'Clean', 'Average', 'Dirty', 'Very dirty'] },
        { name: 'Budget', options: ['Free', 'Low cost', 'Moderate', 'Expensive', 'VIP'] },
        { name: 'Weather', options: ['Sunny', 'Cloudy', 'Windy', 'Rainy', 'Hot', 'Mild'] },
    ];

    /**
     * Toggle dropdown menu visibility
     * @param {string} category - The category name to toggle
     */
    interface BeachReviewFormData {
        photos: string[];
        rating: number;
        review: string;
        beachFeatures: string[];
    }

    interface Category {
        name: string;
        options: string[];
    }

    const toggleDropdown = (category: string): void => {
        if (openDropdown === category) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(category);
        }
    };

    /**
     * Handle selecting/deselecting beach features
     * @param {string} feature - The feature being toggled
     */
    interface HandleFeatureToggle {
        (feature: string): void;
    }

    const handleFeatureToggle: HandleFeatureToggle = (feature) => {
        if (formData.beachFeatures.includes(feature)) {
            setFormData({
                ...formData,
                beachFeatures: formData.beachFeatures.filter((item: string) => item !== feature)
            });
        } else {
            setFormData({
                ...formData,
                beachFeatures: [...formData.beachFeatures, feature]
            });
        }
    };

    /**
     * Handle photo upload functionality
     */
    const handlePhotoUpload = () => {
        // In a real implementation, this would open a file selector
        // and add the selected photos to the formData.photos array
        alert('Photo upload functionality would be implemented here');
    };

    /**
     * Handle form submission
     */
    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        alert('Review saved successfully!');
        // In a real implementation, this would send the data to a server
    };

    return (
        <div className="max-w-4xl mx-auto p-4 bg-white">
            {/* Header with back button */}
            <div className="flex items-center mb-6">
                <button className="rounded-full bg-teal-500 p-2 mr-3" 
                onClick={() => window.history.back()}>
                    <ChevronLeft size={24} className="text-white" />
                </button>
                <h1 className="text-xl text-gray-600">Pantai Pasir Putih / Add Review</h1>
            </div>

            <div>
                {/* Photo Upload Section */}
                <div className="mb-6">
                    <label className="block mb-2">
                        Upload your photo <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={handlePhotoUpload}
                            className="w-32 h-32 bg-gray-300 flex items-center justify-center"
                        >
                            <span className="text-3xl">+</span>
                        </button>
                        <button
                            type="button"
                            onClick={handlePhotoUpload}
                            className="w-32 h-32 bg-gray-300 flex items-center justify-center"
                        >
                            <span className="text-3xl">+</span>
                        </button>
                    </div>
                </div>

                {/* Rating Section */}
                <div className="mb-6">
                    <label className="block mb-2">
                        Your Rating <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center">
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={formData.rating}
                            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                            className="w-64 h-1 appearance-none bg-gray-300 rounded outline-none"
                        />
                        <div className="flex items-center ml-4">
                            <span className="text-gray-500 mr-12">1</span>
                            <span className="font-medium">{formData.rating}</span>
                        </div>
                    </div>
                </div>

                {/* Review Text Section */}
                <div className="mb-6">
                    <label className="block mb-2">
                        Your Review <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={formData.review}
                        onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                        placeholder="Type here..."
                        className="w-full border rounded p-3 h-32"
                    />
                </div>

                {/* Beach Features Section */}
                <div className="mb-10">
                    <label className="block mb-2">
                        What did you find on this beach? <span className="text-red-500">*</span>
                    </label>

                    {/* Dropdown Categories */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {categories.map((category) => (
                            <div key={category.name} className="relative">
                                <button
                                    type="button"
                                    onClick={() => toggleDropdown(category.name)}
                                    className="bg-gray-200 px-4 py-2 rounded flex items-center"
                                >
                                    {category.name}
                                    <span className="ml-2">▼</span>
                                </button>

                                {/* Dropdown Menu - Would be implemented in full version */}
                                {openDropdown === category.name && (
                                    <div className="absolute top-full left-0 bg-white shadow-lg rounded p-2 z-10 mt-1 w-48">
                                        {category.options.map(option => (
                                            <div
                                                key={option}
                                                onClick={() => handleFeatureToggle(option)}
                                                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                            >
                                                {formData.beachFeatures.includes(option) && (
                                                    <Check size={16} className="text-green-500 mr-2" />
                                                )}
                                                <span>{option}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Selected Features Tags */}
                    <div className="flex flex-wrap gap-2">
                        {formData.beachFeatures.map((feature) => (
                            <div
                                key={feature}
                                className="bg-white border border-gray-200 rounded-full px-3 py-1 flex items-center"
                            >
                                <Check size={16} className="text-green-500 mr-1" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}