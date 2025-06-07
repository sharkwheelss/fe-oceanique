import { useState, useEffect } from 'react';
import {
    Star,
    ChevronLeft,
    ChevronRight,
    ThumbsUp,
    MapPin
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecommendation } from '../../context/RecommendationContext';

// Define interfaces for the API response structure
interface Destination {
    id: number;
    name: string;
    location: string;
    rating: number;
    reviews: number;
    priceRange: string;
    matchPercentage: number;
    distance: number;
    amenities: Array<{
        type: string;
        count: number;
        icon: string;
    }>;
    eventAvailable: boolean;
    image: string;
    description?: string;
}

interface Review {
    id: number;
    username: string;
    userType: string;
    rating: number;
    date: string;
    content: string;
    images: string[];
    tags: string[];
    experienced?: boolean;
}

interface RecommendationData {
    destinations: Destination[];
    reviews: Review[];
    // Add other fields that your API returns
}

export default function RecommendationResult() {
    const navigate = useNavigate();
    const location = useLocation();
    const { beachRecommendation } = useRecommendation();

    // State for current active destination (for pagination)
    const [currentDestinationIndex, setCurrentDestinationIndex] = useState(0);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadRecommendationData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Check if data was passed from navigation state
                const stateData = location.state?.recommendationData;
                const userOptions = location.state?.userOptions;

                if (stateData) {
                    // Use data from navigation state
                    processRecommendationData(stateData);
                } else if (userOptions) {
                    // Fetch data using userOptions
                    const recommendationData = await beachRecommendation({ userOptions });
                    processRecommendationData(recommendationData);
                } else {
                    // No data available, might need to redirect back to questions
                    setError('No recommendation data available. Please complete the questionnaire first.');
                }
            } catch (error) {
                console.error('Error loading recommendation data:', error);
                setError('Failed to load recommendations. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        loadRecommendationData();
    }, [location.state, beachRecommendation]);

    // Process the API response data
    const processRecommendationData = (data: any) => {
        // Transform the API response to match your component's expected structure
        // Adjust this based on your actual API response structure

        if (data.destinations) {
            setDestinations(data.destinations);
        } else if (data.results) {
            // If API returns results in a different format
            setDestinations(data.results);
        } else if (Array.isArray(data)) {
            // If API returns an array directly
            setDestinations(data);
        } else {
            // Handle other response formats
            console.warn('Unexpected API response format:', data);
            setDestinations([]);
        }

        if (data.reviews) {
            setReviews(data.reviews);
        } else {
            // Use sample reviews if not provided by API
            setReviews(getSampleReviews());
        }
    };

    // Sample reviews fallback
    const getSampleReviews = (): Review[] => [
        {
            id: 1,
            username: "Abi 123",
            userType: "The Adventurer",
            rating: 5,
            date: "05 March 2024",
            content: "Amazing place to visit! The scenery was breathtaking and the facilities were well-maintained. Highly recommend for anyone looking for a great getaway.",
            images: ["/api/placeholder/100/100", "/api/placeholder/100/100"],
            tags: ["Swimming", "Big Bus", "Surfing", "Toilet", "Mosque", "Rainy", "Rp 25k"]
        },
        {
            id: 2,
            username: "Rudi 456",
            userType: "The Scenic Soul",
            rating: 4,
            date: "05 March 2024",
            content: "Great experience overall. The location is perfect and the amenities are satisfactory. Would definitely come back again with family.",
            images: ["/api/placeholder/100/100", "/api/placeholder/100/100"],
            tags: ["Swimming", "Big Bus", "Surfing", "Toilet", "Mosque", "Rainy", "Rp 25k"],
            experienced: true
        }
    ];

    // Function to handle navigation between destinations
    const handleNavigation = (direction: 'next' | 'prev') => {
        if (direction === 'next' && currentDestinationIndex < destinations.length - 1) {
            setCurrentDestinationIndex(prev => prev + 1);
        } else if (direction === 'prev' && currentDestinationIndex > 0) {
            setCurrentDestinationIndex(prev => prev - 1);
        }
    }

    // Function to render star ratings
    const renderStarRating = (rating: number, totalStars = 5) => {
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

    // Function to chunk amenities into rows
    const chunkAmenities = (amenities: any[], size: number) => {
        const chunkedArr = [];
        for (let i = 0; i < amenities.length; i += size) {
            chunkedArr.push(amenities.slice(i, i + size));
        }
        return chunkedArr;
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-6 flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading recommendations...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6 flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/questions')}
                        className="bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-teal-600"
                    >
                        Back to Questions
                    </button>
                </div>
            </div>
        );
    }

    // No destinations available
    if (destinations.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-6 flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">No recommendations found based on your preferences.</p>
                    <button
                        onClick={() => navigate('/questions')}
                        className="bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-teal-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const currentDestination = destinations[currentDestinationIndex];

    // Group amenities into rows of 4
    const amenityRows = chunkAmenities(currentDestination.amenities || [], 4);

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
            {/* Header Section */}
            <div className="p-4 border-b">
                <div className="flex justify-between items-center mb-4">
                    <button
                        className="text-teal-600 flex items-center"
                        onClick={() => navigate('/questions')}
                    >
                        <ChevronLeft size={16} />
                        <span>Start Over</span>
                    </button>
                    <h1 className="text-2xl font-bold text-center">Our top picks for you!</h1>
                    <button
                        className="text-teal-600"
                        onClick={() => navigate('/')}
                    >
                        Finish
                    </button>
                </div>

                <div className="flex justify-between items-center">
                    <p className="text-gray-500 text-sm">Scroll to see the reviews</p>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm">
                            {currentDestinationIndex + 1} of {destinations.length} recommendations
                        </span>
                    </div>
                </div>
            </div>

            {/* Destination Card */}
            <div className="relative p-4">
                {/* Match percentage badge */}
                <div className="absolute top-8 left-8 z-10 bg-white rounded-full p-2 flex flex-col items-center justify-center w-16 h-16 shadow-md">
                    <span className="text-green-500 font-bold">{currentDestination.matchPercentage || 85}%</span>
                    <span className="text-green-500 text-xs">Match</span>
                </div>

                {/* Navigation buttons */}
                <button
                    onClick={() => handleNavigation('prev')}
                    disabled={currentDestinationIndex === 0}
                    className={`absolute top-1/2 left-2 -translate-y-1/2 p-2 rounded-full z-10 ${currentDestinationIndex === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-teal-500 text-white hover:bg-teal-600'
                        }`}
                >
                    <ChevronLeft size={24} />
                </button>

                <button
                    onClick={() => handleNavigation('next')}
                    disabled={currentDestinationIndex === destinations.length - 1}
                    className={`absolute top-1/2 right-2 -translate-y-1/2 p-2 rounded-full z-10 ${currentDestinationIndex === destinations.length - 1
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-teal-500 text-white hover:bg-teal-600'
                        }`}
                >
                    <ChevronRight size={24} />
                </button>

                {/* Destination Image */}
                <div className="rounded-lg overflow-hidden mb-4 relative">
                    <img
                        src={currentDestination.image || "/api/placeholder/800/300"}
                        alt={currentDestination.name}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "/api/placeholder/800/300";
                        }}
                    />

                    {/* Distance badge */}
                    <div className="absolute bottom-4 left-4 bg-white rounded-full px-3 py-1 flex items-center gap-1 text-sm shadow-sm">
                        <MapPin size={14} className="text-red-500" />
                        <span>{currentDestination.distance || 'N/A'} km</span>
                    </div>
                </div>

                {/* Destination Info */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold">{currentDestination.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            {renderStarRating(currentDestination.rating || 4.5)}
                            <span className="text-sm text-gray-600">
                                {currentDestination.rating || 4.5} ({currentDestination.reviews || 0} reviews)
                            </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                            <MapPin size={14} className="text-red-500" />
                            <span>{currentDestination.location}</span>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="font-bold">{currentDestination.priceRange || 'Price varies'}</p>
                        {currentDestination.eventAvailable && (
                            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-1 rounded border border-green-200 mt-1">
                                <span className="w-3 h-3 bg-green-500 rounded-sm"></span>
                                Event Available
                            </span>
                        )}
                    </div>
                </div>

                {/* Description */}
                {currentDestination.description && (
                    <div className="mb-4">
                        <p className="text-gray-700 text-sm">{currentDestination.description}</p>
                    </div>
                )}

                {/* Amenities */}
                {amenityRows.length > 0 && (
                    <div className="mb-6">
                        {amenityRows.map((row, rowIndex) => (
                            <div key={`row-${rowIndex}`} className="flex gap-2 mb-2">
                                {row.map((amenity, index) => (
                                    <div
                                        key={`${amenity.type}-${rowIndex}-${index}`}
                                        className="flex-1 border border-gray-200 rounded-md py-2 px-4 flex items-center justify-center gap-2"
                                    >
                                        <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="text-green-600 text-xs">✓</span>
                                        </span>
                                        <span className="text-sm">{amenity.type} {amenity.count && `(${amenity.count})`}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Reviews Section */}
            {reviews.length > 0 && (
                <div className="border-t pt-4">
                    <div className="flex items-center px-4 pb-2 border-b">
                        <h3 className="font-bold text-lg">Reviews</h3>
                        <div className="ml-2 h-1 w-16 bg-teal-500 rounded"></div>
                    </div>

                    {/* Review Cards */}
                    {reviews.map(review => (
                        <div key={review.id} className="p-4 border-b">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                        {/* User avatar would go here */}
                                    </div>
                                    <div>
                                        <p className="font-bold">{review.username}</p>
                                        <div className="bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-700 mt-1">
                                            {review.userType}
                                        </div>
                                        {review.experienced && (
                                            <div className="flex items-center gap-1 mt-1 text-xs text-blue-600">
                                                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                                                <span>from experienced user</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-1">
                                        {renderStarRating(review.rating)}
                                        <span className="text-sm">{review.rating} / 5</span>
                                    </div>
                                    <p className="text-xs text-gray-500">(Posted at {review.date})</p>
                                    <button className="mt-2">
                                        <ThumbsUp size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Review Content */}
                            <div className="mb-4">
                                {review.images && review.images.length > 0 && (
                                    <div className="flex gap-2 mb-3">
                                        {review.images.map((img, index) => (
                                            <img
                                                key={index}
                                                src={img}
                                                alt={`Review image ${index + 1}`}
                                                className="w-16 h-16 rounded object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "/api/placeholder/100/100";
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                                <p className="text-sm text-gray-700">{review.content}</p>
                            </div>

                            {/* Review Tags */}
                            {review.tags && review.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {review.tags.map((tag, index) => (
                                        <div key={index} className="flex items-center gap-1 bg-gray-50 rounded-full px-3 py-1 text-xs">
                                            <span className="w-3 h-3 bg-green-100 rounded-full flex items-center justify-center">
                                                <span className="text-green-600 text-xs">✓</span>
                                            </span>
                                            <span>{tag}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}