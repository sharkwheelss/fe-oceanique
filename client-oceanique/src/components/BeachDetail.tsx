import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Star, Heart, Sun } from 'lucide-react';
import ReviewsTab from './tabs/ReviewsTab';
import AboutTab from './tabs/AboutTab';
import FacilityTab from './tabs/FacilityTab';
import PhotoVideoTab from './tabs/PhotoVideoTab';
import LocationTab from './tabs/LocationTab';
import { useBeaches } from '../context/BeachContext';
import { useAuth } from '../context/AuthContext';

// Main BeachDetailPage component
export interface Beach {
    id: number;
    beach_name: string;
    descriptions: string;
    cp_name: string;
    official_website: string;
    rating_average: number;
    estimate_price: string;
    latitude: string;
    longitude: string;
    kecamatan: string;
    kota: string;
    province: string;
    path: string;
    img_path: string;
    count_reviews: number;
    activities: Activity[];
    facilities: Facility[];
    contents: BeachContent[];
    reviews: BeachReview[];
}

export interface Activity {
    option_id: number;
    beach_id: number;
    name: string;
}

export interface Facility {
    id: number;
    facility_name: string;
    facility_category_id: number;
    beaches_id: number;
}

export interface BeachContent {
    id: number;
    path: string;
    beaches_id: number;
    reviews_id: number;
    img_path: string;
}

export interface BeachReview {
    id: number;
    rating: number;
    beaches_id: number;
    users_id: number;
    created_at: string; // ISO 8601 timestamp
    updated_at: string;
    option_vote_id: number;
    votes: number;
}

export interface ReviewContent {
    id: number;
    path: string;
    img_path?: string;
}

export interface OptionVote {
    id: number;
    option_name: string;
    reviews_id: number;
}

export interface UserProfile {
    id: number;
    path: string;
    img_path?: string;
}

export interface ReviewDetail {
    review_id: number;
    user_id: number;
    username: string;
    join_date: number;
    rating: number;
    user_review: string;
    posted: string;
    experience: number;
    contents: ReviewContent[];
    option_votes: OptionVote[];
    user_profile?: UserProfile;
}

export interface BeachReviewsResponse {
    users_vote: number;
    rating_average: number;
    reviews: ReviewDetail[];
}

// Main BeachDetailPage component
export default function BeachDetailPage() {
    // Get beach data from context - Added wishlist methods
    const {
        getBeachDetails,
        getBeachReviews,
        addToWishlist,
        removeFromWishlist,
        checkWishlistStatus,
        loading
    } = useBeaches();
    const { user } = useAuth();
    const navigate = useNavigate();

    // State for active tab, beach data, and wishlist
    const [activeTab, setActiveTab] = useState('about');
    const [beachData, setBeachData] = useState<Beach | null>(null);
    const [beachReviews, setBeachReviews] = useState<BeachReviewsResponse | null>(null);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    // Get beachId from URL params (you might need to adjust this based on your routing)
    const beachId = new URLSearchParams(window.location.search).get('id') ||
        window.location.pathname.split('/').pop();

    // Fetch beach data on component mount
    useEffect(() => {
        const fetchBeachData = async () => {
            if (!beachId) return;

            try {
                const response = await getBeachDetails(beachId);
                const resReviews = await getBeachReviews(beachId);

                // Convert into array
                const beach = Array.isArray(response) ? response[0] : response;
                const reviews = Array.isArray(resReviews) ? resReviews[0] : resReviews;

                setBeachData(beach);
                setBeachReviews(reviews);

                // Check wishlist status after beach data is loaded
                if (user?.id && beach?.id) {
                    await checkWishlistStatusHandler(beach.id.toString());
                }
            } catch (error) {
                console.error('Error fetching beaches:', error);
            }
        };

        fetchBeachData();
    }, [beachId, user?.id]);

    console.log('beach data:', beachData?.id)
    console.log('review data:', beachReviews)

    // Wishlist management functions
    const checkWishlistStatusHandler = async (beachId: string) => {
        if (!user?.id) return;

        try {
            console.log('Check status: ', beachId);
            // Assuming checkWishlistStatus returns boolean or an object indicating wishlist status
            const status = await checkWishlistStatus(user.id, parseInt(beachId));
            setIsWishlisted(!!status); // Convert to boolean
        } catch (error) {
            console.error('Error checking wishlist status:', error);
        }
    };

    const toggleWishlist = async () => {
        if (!user?.id || !beachData?.id) {
            // Redirect to login if user is not authenticated
            navigate('/login');
            return;
        }

        setWishlistLoading(true);

        try {
            console.log('Toggle wishlist clicked');

            if (isWishlisted) {
                // Remove from wishlist
                await removeFromWishlist(user.id, beachData.id);
                setIsWishlisted(false);
                console.log('Removed from wishlist');
            } else {
                // Add to wishlist
                await addToWishlist(user.id, beachData.id);
                setIsWishlisted(true);
                console.log('Added to wishlist');
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            // Optionally show error message to user
            alert('Failed to update wishlist. Please try again.');
        } finally {
            setWishlistLoading(false);
        }
    };

    // Handler for changing active tab
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    if (loading || !beachData) {
        return (
            <div className="max-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl">Loading details...</div>
            </div>
        );
    }

    return (
        <div className="max-h-screen pb-8">
            {/* Header with Navigation and Wishlist */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center">
                    {/* Back button and breadcrumb */}
                    <div className="flex items-center">
                        <button className="bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600 transition-colors mr-4"
                            onClick={() => window.history.back()}>
                            <ChevronLeft size={24} />
                        </button>
                        <div className="text-gray-600">
                            <a href="#" className="hover:text-teal-500 transition-colors">Beach</a>
                            <span className="mx-2">/</span>
                            <span>{beachData.beach_name}</span>
                        </div>
                    </div>

                    {/* Wishlist button */}
                    <button
                        onClick={toggleWishlist}
                        disabled={wishlistLoading}
                        className={`flex items-center px-6 py-3 rounded-full ${isWishlisted
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-teal-500 hover:bg-teal-600'
                            } text-white font-medium transition-colors ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        <Heart
                            size={20}
                            className={`mr-2 ${isWishlisted ? 'fill-current' : ''}`}
                        />
                        {wishlistLoading
                            ? 'Updating...'
                            : isWishlisted
                                ? 'Remove from wishlist'
                                : 'Save to wishlist'
                        }
                    </button>
                </div>
            </div>

            {/* Beach Title and Info */}
            <div className="container mx-auto px-4 pb-4">
                <div className="flex justify-between items-start">
                    <div>
                        {/* Beach name and weather */}
                        <div className="flex items-center mb-2">
                            <h1 className="text-3xl font-bold mr-4">{beachData.beach_name}</h1>
                            {/* Weather is not in the Beach interface, but keeping it for potential future use */}
                            <div className="bg-gray-100 text-gray-800 rounded-full px-4 py-1 flex items-center">
                                <Sun size={16} className="text-yellow-500 mr-2" />
                                <span className="text-sm">Sunny</span>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center mb-2">
                            <Star size={20} className="text-yellow-400 fill-current" />
                            <span className="ml-2 font-semibold">
                                {beachData.rating_average} ({beachData.count_reviews} reviews)
                            </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center">
                            <MapPin size={20} className="text-red-500" />
                            <span className="ml-2 text-gray-700">
                                {beachData.kecamatan}, {beachData.kota}, {beachData.province}
                            </span>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="text-2xl font-bold">{beachData.estimate_price}</div>
                </div>
            </div>

            {/* Beach Image */}
            <div className="container mx-auto px-4 mb-4">
                <div className="rounded-lg overflow-hidden">
                    <img
                        src={beachData.img_path}
                        alt={beachData.beach_name}
                        className="w-full h-96 object-cover"
                    />
                </div>
            </div>

            {/* Event Availability */}
            <div className="container mx-auto px-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-6 text-center text-gray-600">
                    {/* Event availability logic can be added here based on your data structure */}
                    No event available
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

                {/* Tab Content - Passing beachData as props */}
                <div className="py-6">
                    {activeTab === 'about' && (
                        <AboutTab beachData={beachData} />
                    )}

                    {activeTab === 'facility' && (
                        <FacilityTab beachData={beachData} />
                    )}

                    {activeTab === 'foto_video' && (
                        <PhotoVideoTab beachData={beachData.contents} />
                    )}

                    {activeTab === 'reviews' && (
                        <ReviewsTab
                            reviewsData={beachReviews}
                            currentUserId={user?.id}
                            onNavigate={navigate}
                            beachId={beachData?.id.toString()}
                        />
                    )}

                    {activeTab === 'location' && (
                        <LocationTab beachData={beachData} />
                    )}
                </div>
            </div>
        </div>
    );
}

// Tab button component
interface TabButtonProps {
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
}

function TabButton({ children, active, onClick }: TabButtonProps) {
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