import { useState } from 'react';
import { ChevronLeft, MapPin, Star, Heart, Sun } from 'lucide-react';

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
        reviews: 145,
        location: 'Cungkil, Surabaya, Jawa Timur',
        weather: 'Mostly Sunny',
        image: '/api/placeholder/1000/400',
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
        <div className="min-h-screen bg-gray-50 pb-8">
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
                <div className="flex border-b border-gray-200">
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
                        <div>
                            <h3 className="text-xl font-semibold mb-4">About Pantai Pasir Putih</h3>
                            <p className="text-gray-700">
                                Pantai Pasir Putih is a beautiful beach located in Surabaya, East Java.
                                The beach features pristine white sand and clear blue waters, making it a
                                popular destination for both locals and tourists. Visitors can enjoy
                                swimming, sunbathing, and various water activities. The beach is also known
                                for its stunning sunsets, as shown in the image.
                            </p>
                            <p className="text-gray-700 mt-4">
                                The beach is well-maintained and offers basic facilities for visitors.
                                It's an ideal place for a day trip or weekend getaway. The calm waters make
                                it suitable for families with children as well.
                            </p>
                        </div>
                    )}

                    {activeTab === 'facility' && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Facilities Available</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li>Parking area</li>
                                <li>Public restrooms</li>
                                <li>Food stalls and restaurants</li>
                                <li>Beach chairs and umbrellas for rent</li>
                                <li>Changing rooms</li>
                                <li>Lifeguard service (during peak hours)</li>
                                <li>Souvenir shops</li>
                            </ul>
                        </div>
                    )}

                    {activeTab === 'foto_video' && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Photos & Videos</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="rounded-lg overflow-hidden">
                                    <img src="/api/placeholder/300/200" alt="Beach photo 1" className="w-full h-48 object-cover" />
                                </div>
                                <div className="rounded-lg overflow-hidden">
                                    <img src="/api/placeholder/300/200" alt="Beach photo 2" className="w-full h-48 object-cover" />
                                </div>
                                <div className="rounded-lg overflow-hidden">
                                    <img src="/api/placeholder/300/200" alt="Beach photo 3" className="w-full h-48 object-cover" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Reviews</h3>
                            <div className="space-y-4">
                                <ReviewItem
                                    name="John Doe"
                                    date="April 15, 2025"
                                    rating={5}
                                    comment="Beautiful beach with crystal clear water. Highly recommended!"
                                />
                                <ReviewItem
                                    name="Jane Smith"
                                    date="March 22, 2025"
                                    rating={4.5}
                                    comment="Great place for family trips. The sand is clean and the water is not too deep."
                                />
                                <ReviewItem
                                    name="Mike Johnson"
                                    date="February 10, 2025"
                                    rating={5}
                                    comment="Amazing sunset views! I got some incredible photos here."
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'location' && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Location</h3>
                            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                                <p className="text-gray-600">Map would be displayed here</p>
                            </div>
                            <div className="mt-4">
                                <h4 className="font-medium mb-2">How to get there:</h4>
                                <p className="text-gray-700">
                                    From Surabaya city center, head east towards Cungkil district.
                                    Follow the signs for Pantai Pasir Putih. The beach is approximately
                                    30 minutes by car from downtown Surabaya.
                                </p>
                            </div>
                        </div>
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

// Review item component
// Define a type for the ReviewItem props
interface ReviewItemProps {
    name: string;
    date: string;
    rating: number;
    comment: string;
}

function ReviewItem({ name, date, rating, comment }: ReviewItemProps) {
    return (
        <div className="border-b border-gray-200 pb-4">
            <div className="flex justify-between items-center mb-2">
                <div className="font-medium">{name}</div>
                <div className="text-sm text-gray-500">{date}</div>
            </div>
            <div className="flex items-center mb-2">
                <Star size={16} className="text-yellow-400 fill-current" />
                <span className="ml-1 text-sm">{rating}</span>
            </div>
            <p className="text-gray-700">{comment}</p>
        </div>
    );
}