import { useState } from 'react';
import { ChevronLeft, MapPin, Star, Heart, Sun } from 'lucide-react';
import ReviewsTab from './tabs/ReviewsTab';
import AboutTab from './tabs/AboutTab';
import FacilityTab from './tabs/FacilityTab';
import PhotoVideoTab from './tabs/PhotoVideoTab';
import LocationTab from './tabs/LocationTab';


// Main BeachDetailPage component
export default function BeachDetailPage() {
    // State for wishlist status
    const [isInWishlist, setIsInWishlist] = useState(false);
    // State for active tab
    const [activeTab, setActiveTab] = useState('about');

    // Beach data (normally would be fetched from API based on ID in URL)
    const beachData = {
        id: 1,
        name: 'Pantai Pasir Putih',
        price: 'Rp10k - 35k',
        rating: 4.9,
        review: 145,
        location: 'Cungkil, Surabaya, Jawa Timur',
        weather: 'Mostly Sunny',
        image: 'https://picsum.photos/id/16/2500/1667',
        hasEvent: false,
        about: 'Information about this beach would go here...',
        facility: 'List of facilities would go here...',
        photos: [],
        videos: [],
        reviews: [],
        mapLocation: {}
    };

    // Handler for toggling wishlist status
    const toggleWishlist = () => {
        setIsInWishlist(prev => !prev);
    };

    // Handler for changing active tab
    const handleTabChange = (tab: string): void => {
        setActiveTab(tab);
    };

    return (
        <div className="min-h-screen pb-8">
            {/* Header with Navigation and Wishlist */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center">
                    {/* Back button and breadcrumb */}
                    <div className="flex items-center">
                        <button className="bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600 transition-colors mr-4">
                            <ChevronLeft size={24} />
                        </button>
                        <div className="text-gray-600">
                            <a href="#" className="hover:text-teal-500 transition-colors">Beach</a>
                            <span className="mx-2">/</span>
                            <span>{beachData.name}</span>
                        </div>
                    </div>

                    {/* Wishlist button */}
                    <button
                        onClick={toggleWishlist}
                        className={`flex items-center px-6 py-3 rounded-full ${isInWishlist ? 'bg-red-500' : 'bg-teal-500'
                            } text-white font-medium hover:bg-opacity-90 transition-colors`}
                    >
                        <Heart size={20} className={`mr-2 ${isInWishlist ? 'fill-current' : ''}`} />
                        Save to wishlist
                    </button>
                </div>
            </div>

            {/* Beach Title and Info */}
            <div className="container mx-auto px-4 pb-4">
                <div className="flex justify-between items-start">
                    <div>
                        {/* Beach name and weather */}
                        <div className="flex items-center mb-2">
                            <h1 className="text-3xl font-bold mr-4">{beachData.name}</h1>
                            <div className="bg-gray-100 text-gray-800 rounded-full px-4 py-1 flex items-center">
                                <Sun size={16} className="text-yellow-500 mr-2" />
                                <span className="text-sm">{beachData.weather}</span>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center mb-2">
                            <Star size={20} className="text-yellow-400 fill-current" />
                            <span className="ml-2 font-semibold">{beachData.rating} ({beachData.reviews} reviews)</span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center">
                            <MapPin size={20} className="text-red-500" />
                            <span className="ml-2 text-gray-700">{beachData.location}</span>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="text-2xl font-bold">{beachData.price}</div>
                </div>
            </div>

            {/* Beach Image */}
            <div className="container mx-auto px-4 mb-4">
                <div className="rounded-lg overflow-hidden">
                    <img
                        src={beachData.image}
                        alt={beachData.name}
                        className="w-full h-96 object-cover"
                    />
                </div>
            </div>

            {/* Event Availability */}
            <div className="container mx-auto px-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-6 text-center text-gray-600">
                    {beachData.hasEvent ? 'Events available' : 'No event available'}
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="container mx-auto px-4">
                <div className="flex border-b border-gray-200 sticky top-[72px] z-40 bg-white">
                    <TabButton
                        active={activeTab === 'about'}
                        onClick={() => handleTabChange('about')}
                    >
                        About
                    </TabButton>

                    <TabButton
                        active={activeTab === 'facility'}
                        onClick={() => handleTabChange('facility')}
                    >
                        Facility
                    </TabButton>

                    <TabButton
                        active={activeTab === 'foto_video'}
                        onClick={() => handleTabChange('foto_video')}
                    >
                        Foto / Video
                    </TabButton>

                    <TabButton
                        active={activeTab === 'reviews'}
                        onClick={() => handleTabChange('reviews')}
                    >
                        Reviews
                    </TabButton>

                    <TabButton
                        active={activeTab === 'location'}
                        onClick={() => handleTabChange('location')}
                    >
                        Location
                    </TabButton>
                </div>

                {/* Tab Content */}
                <div className="py-6">
                    {activeTab === 'about' && (
                        <AboutTab />
                    )}

                    {activeTab === 'facility' && (
                        <FacilityTab />
                    )}

                    {activeTab === 'foto_video' && (
                        <PhotoVideoTab />
                    )}

                    {activeTab === 'reviews' && (
                        <ReviewsTab />
                    )}

                    {activeTab === 'location' && (
                        <LocationTab />
                    )}
                </div>
            </div>
        </div>
    );
}

// Tab button component
function TabButton({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-4 font-medium text-sm ${active
                ? 'text-teal-500 border-b-2 border-teal-500'
                : 'text-gray-600 hover:text-teal-500'
                } transition-colors`}
        >
            {children}
        </button>
    );
}
