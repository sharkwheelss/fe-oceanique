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
import { useBeaches } from '../../context/BeachContext';

interface BeachesView {
    id: number;
    name: string;
    location: string;
    rating: number;
    reviews: number;
    priceRange: string;
    matchPercentage: number;
    // distance: number;
    // eventAvailable: boolean;
    image: string;
    description?: string;
    amenities: Array<{
        option_name: string;
        id: number;
    }>;
}

// Interface for the actual API response
interface ApiBeachData {
    beach_id: number;
    beach_name: string;
    cp_name: string;
    descriptions: string;
    estimate_price: string;
    id: number;
    kecamatan: string;
    kota: string;
    latitude: number;
    longitude: number;
    match_percentage: number;
    official_website: string;
    province: string;
    rating_average: number;
    reviewCount: number;
}

interface Review {
    review_id: number;
    user_id: number;
    username: string;
    join_date: number;
    rating: number;
    user_review: string;
    posted: string;
    experience: number;
    contents: Array<{
        id: number;
        path: string;
        img_path: string;
    }>;
    option_votes: Array<{
        id: number;
        option_name: string;
        reviews_id: number;
    }>;
    user_profile?: {
        id: number;
        path: string;
        img_path: string;
    };
}

interface ReviewApiResponse {
    message: string;
    data: Array<{
        users_vote: number;
        rating_average: number;
        reviews: Review[];
    }>;
}

export default function RecommendationResult() {
    const navigate = useNavigate();
    const location = useLocation();
    const { beachRecommendation } = useRecommendation();
    const { getBeachReviews } = useBeaches();

    // State for current active destination (for pagination)
    const [currentDestinationIndex, setCurrentDestinationIndex] = useState(0);
    const [destinations, setDestinations] = useState<BeachesView[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [originalApiData, setOriginalApiData] = useState<ApiBeachData[]>([]);

    // Store reviews for each beach to avoid refetching
    const [beachReviews, setBeachReviews] = useState<Map<number, Review[]>>(new Map());

    useEffect(() => {
        const loadRecommendationData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Check if data was passed from navigation state
                const stateData = location.state?.recommendationData;
                const userOptions = location.state?.userOptions;

                let recommendationData;

                if (stateData) {
                    // Use data from navigation state
                    recommendationData = stateData;
                } else if (userOptions) {
                    // Fetch data using userOptions
                    recommendationData = await beachRecommendation({ userOptions });
                } else {
                    // No data available, might need to redirect back to questions
                    setError('No recommendation data available. Please complete the questionnaire first.');
                    return;
                }

                processRecommendationData(recommendationData);
                console.log('Recommendation data loaded:', recommendationData);
            } catch (error) {
                console.error('Error loading recommendation data:', error);
                setError('Failed to load recommendations. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        loadRecommendationData();
    }, [location.state, beachRecommendation]);

    // Load reviews when destination changes
    useEffect(() => {
        const loadReviewsForCurrentDestination = async () => {
            if (destinations.length === 0) return;

            const currentDestination = destinations[currentDestinationIndex];
            const currentBeachId = originalApiData[currentDestinationIndex]?.beach_id;

            if (!currentBeachId) return;

            // Check if we already have reviews for this beach
            if (beachReviews.has(currentBeachId)) {
                setReviews(beachReviews.get(currentBeachId) || []);
                return;
            }

            try {
                setIsLoadingReviews(true);
                const reviewData = await getBeachReviews(currentBeachId);
                console.log('Review data for beach', currentBeachId, ':', reviewData);

                let currentReviews: Review[] = [];
                if (Array.isArray(reviewData) && reviewData.length > 0 && Array.isArray(reviewData[0].reviews)) {
                    currentReviews = reviewData[0].reviews;
                }

                // Store reviews in cache
                setBeachReviews(prev => new Map(prev).set(currentBeachId, currentReviews));
                setReviews(currentReviews);

                // Update the current destination with amenities from reviews
                updateDestinationWithReviewData(currentDestinationIndex, currentReviews);
            } catch (error) {
                console.error('Error loading reviews for beach', currentBeachId, ':', error);
                setReviews([]);
            } finally {
                setIsLoadingReviews(false);
            }
        };

        loadReviewsForCurrentDestination();
    }, [currentDestinationIndex, destinations, originalApiData, getBeachReviews, beachReviews]);

    // Transform API beach data to component format
    const transformApiBeachToDestination = (apiBeach: ApiBeachData, reviewOptions: any[] = []): BeachesView => {
        // Get unique option votes for amenities
        const uniqueOptions = reviewOptions.reduce((acc, option) => {
            if (!acc.find(item => item.option_name === option.option_name)) {
                acc.push({
                    option_name: option.option_name,
                    id: option.id
                });
            }
            return acc;
        }, [] as Array<{ option_name: string; id: number }>);

        return {
            id: apiBeach.id,
            name: apiBeach.beach_name,
            location: `${apiBeach.kecamatan}, ${apiBeach.kota}, ${apiBeach.province}`,
            rating: apiBeach.rating_average,
            reviews: apiBeach.reviewCount,
            priceRange: apiBeach.estimate_price,
            matchPercentage: apiBeach.match_percentage,
            // distance: calculateDistance(parseFloat(apiBeach.latitude), parseFloat(apiBeach.longitude)),
            amenities: uniqueOptions,
            image: 'https://picsum.photos/id/13/2500/1667',
            description: apiBeach.descriptions
        };
    };

    // console.log(destinations)


    // Update destination with review data
    const updateDestinationWithReviewData = (destIndex: number, reviewData: Review[]) => {
        const allOptionVotes = reviewData.flatMap(review => review.option_votes || []);
        const uniqueOptions = allOptionVotes.reduce((acc, option) => {
            if (!acc.find(item => item.option_name === option.option_name)) {
                acc.push({
                    option_name: option.option_name,
                    id: option.id
                });
            }
            return acc;
        }, [] as Array<{ option_name: string; id: number }>);

        setDestinations(prev => {
            const updated = [...prev];
            if (updated[destIndex]) {
                updated[destIndex] = {
                    ...updated[destIndex],
                    amenities: uniqueOptions
                };
            }
            return updated;
        });
    };

    // Process the API response data
    const processRecommendationData = (data: any) => {
        console.log('Processing API data:', data);

        try {
            let processedDestinations: BeachesView[] = [];
            let apiBeaches: ApiBeachData[] = [];

            // Handle different possible response structures
            if (data.data && Array.isArray(data.data)) {
                // API returns { data: [...] }
                apiBeaches = data.data;
                processedDestinations = data.data.map((beach: ApiBeachData) =>
                    transformApiBeachToDestination(beach, [])
                );
            } else if (Array.isArray(data)) {
                // API returns array directly
                apiBeaches = data;
                processedDestinations = data.map((beach: ApiBeachData) =>
                    transformApiBeachToDestination(beach, [])
                );
            } else if (data.destinations && Array.isArray(data.destinations)) {
                // Legacy format support
                processedDestinations = data.destinations;
                apiBeaches = data.destinations;
            } else if (data.results && Array.isArray(data.results)) {
                // Another possible format
                apiBeaches = data.results;
                processedDestinations = data.results.map((beach: ApiBeachData) =>
                    transformApiBeachToDestination(beach, [])
                );
            } else {
                console.warn('Unexpected API response format:', data);
                processedDestinations = [];
                apiBeaches = [];
            }

            // Sort by match percentage (highest first)
            const sortedIndices = processedDestinations
                .map((_, index) => index)
                .sort((a, b) => processedDestinations[b].matchPercentage - processedDestinations[a].matchPercentage);

            processedDestinations = sortedIndices.map(index => processedDestinations[index]);
            apiBeaches = sortedIndices.map(index => apiBeaches[index]);

            console.log('Processed destinations:', processedDestinations);
            setDestinations(processedDestinations);
            setOriginalApiData(apiBeaches);

        } catch (error) {
            console.error('Error processing recommendation data:', error);
            setError('Failed to process recommendation data.');
        }
    };

    // Transform API review to component format
    const transformApiReviewToComponent = (review: Review) => {
        return {
            id: review.review_id,
            username: review.username,
            userType: review.experience > 0 ? "Experienced User" : "Regular User",
            rating: review.rating,
            date: review.posted,
            content: review.user_review,
            images: review.contents?.map(content => content.img_path) || [],
            tags: review.option_votes?.map(vote => vote.option_name) || [],
            experienced: review.experience > 0
        };
    };

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
            <div className="max-w-4xl mx-auto p-6 flex justify-center items-center max-h-screen">
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
            <div className="max-w-4xl mx-auto p-6 flex justify-center items-center max-h-screen">
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
            <div className="max-w-4xl mx-auto p-6 flex justify-center items-center max-h-screen">
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

    console.log(currentDestination.reviews)

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
                    <span className="text-green-500 font-bold">{currentDestination.matchPercentage}%</span>
                    <span className="text-green-500 text-xs">Match</span>
                </div>

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

                    {/* Distance badge
                    <div className="absolute bottom-4 left-4 bg-white rounded-full px-3 py-1 flex items-center gap-1 text-sm shadow-sm">
                        <MapPin size={14} className="text-red-500" />
                        <span>{currentDestination.distance} km</span>
                    </div> */}
                </div>

                {/* Destination Info */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold">{currentDestination.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            {renderStarRating(currentDestination.rating)}
                            <span className="text-sm text-gray-600">
                                {currentDestination.rating} ({currentDestination.reviews || 0} reviews)
                            </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                            <MapPin size={14} className="text-red-500" />
                            <span>{currentDestination.location}</span>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="font-bold">{currentDestination.priceRange}</p>
                        {/* {currentDestination.eventAvailable && (
                            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-1 rounded border border-green-200 mt-1">
                                <span className="w-3 h-3 bg-green-500 rounded-sm"></span>
                                Event Available
                            </span>
                        )} */}
                    </div>
                </div>

                {/* Description */}
                {currentDestination.description && (
                    <div className="mb-4">
                        <p className="text-gray-700 text-sm">{currentDestination.description}</p>
                    </div>
                )}

                {/* Amenities/Options */}
                {amenityRows.length > 0 && (
                    <div className="mb-6">
                        <div className="mb-2">
                            <span className="font-semibold text-gray-700 text-base">What People Said</span>
                            <div className="h-1 w-24 bg-teal-500 rounded mt-1"></div>
                        </div>
                        {amenityRows.map((row, rowIndex) => (
                            <div key={`row-${rowIndex}`} className="flex gap-2 mb-2">
                                {row.map((amenity, index) => (
                                    <div
                                        key={`${amenity.option_name}-${rowIndex}-${index}`}
                                        className="flex-1 border border-gray-200 rounded-md py-2 px-4 flex items-center justify-center gap-2"
                                    >
                                        <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="text-green-600 text-xs">✓</span>
                                        </span>
                                        <span className="text-sm">{amenity.option_name}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}

            </div>

            {/* Reviews Section */}
            <div className="border-t pt-4">
                <div className="flex items-center px-4 pb-2 border-b">
                    <h3 className="font-bold text-lg">Reviews</h3>
                    <div className="ml-2 h-1 w-16 bg-teal-500 rounded"></div>
                    {isLoadingReviews && (
                        <div className="ml-4 w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                    )}
                </div>

                {/* Review Cards */}
                {isLoadingReviews ? (
                    <div className="p-4 text-center">
                        <p className="text-gray-600">Loading reviews...</p>
                    </div>
                ) : reviews.length > 0 ? (
                    reviews.map(review => {
                        // Transform API review to component format if needed
                        const displayReview = review.review_id ? transformApiReviewToComponent(review) : review;

                        return (
                            <div key={displayReview.id} className="p-4 border-b">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                            {review.user_profile?.img_path ? (
                                                <img
                                                    src={review.user_profile.img_path}
                                                    alt="User profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : null}
                                        </div>
                                        <div>
                                            <p className="font-bold">{displayReview.username}</p>
                                            <div className="bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-700 mt-1">
                                                {displayReview.userType}
                                            </div>
                                            {displayReview.experienced && (
                                                <div className="flex items-center gap-1 mt-1 text-xs text-blue-600">
                                                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                                                    <span>from experienced user</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-1">
                                            {renderStarRating(displayReview.rating)}
                                            <span className="text-sm">{displayReview.rating} / 5</span>
                                        </div>
                                        <p className="text-xs text-gray-500">(Posted at {displayReview.date})</p>

                                    </div>
                                </div>

                                {/* Review Content */}
                                <div className="mb-4">
                                    {displayReview.images && displayReview.images.length > 0 && (
                                        <div className="flex gap-2 mb-3">
                                            {displayReview.images.map((img, index) => (
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
                                    <p className="text-sm text-gray-700">{displayReview.content}</p>
                                </div>

                                {/* Review Tags */}
                                {displayReview.tags && displayReview.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {displayReview.tags.map((tag, index) => (
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
                        );
                    })
                ) : (
                    <div className="p-4 text-center">
                        <p className="text-gray-600">No reviews available for this beach.</p>
                    </div>
                )}
            </div>
        </div>
    );
}