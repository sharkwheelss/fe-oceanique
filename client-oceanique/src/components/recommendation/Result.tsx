import { useState } from 'react';
import {
    Star,
    ChevronLeft,
    ChevronRight,
    ThumbsUp,
    MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DestinationPage() {
    // State for current active destination (for pagination)
    const [currentDestinationIndex, setCurrentDestinationIndex] = useState(0);
    const navigate = useNavigate();

    // Sample data for destinations
    const destinations = [
        {
            id: 1,
            name: "Pantai Pasir Putih",
            location: "Cungkil Surabaya, Jawa Timur",
            rating: 4.9,
            reviews: 145,
            priceRange: "Rp10k - 35k",
            matchPercentage: 88,
            distance: 3,
            amenities: [
                { type: "Swimming", count: 2, icon: "swimming" },
                { type: "Cloudy", count: 14, icon: "cloudy" },
                { type: "Toilet", count: 20, icon: "toilet" },
                { type: "Toilet", count: 20, icon: "toilet" },
                { type: "Mosque", count: 14, icon: "mosque" },
                { type: "Sunny", count: 4, icon: "sunny" },
                { type: "Bus", count: 14, icon: "bus" },
                { type: "Bus", count: 14, icon: "bus" },
                { type: "Swimming", count: 2, icon: "swimming" },
                { type: "Cloudy", count: 14, icon: "cloudy" },
                { type: "Toilet", count: 20, icon: "toilet" },
                { type: "Toilet", count: 20, icon: "toilet" },
                { type: "Mosque", count: 14, icon: "mosque" },
                { type: "Sunny", count: 4, icon: "sunny" },
                { type: "Bus", count: 14, icon: "bus" },
                { type: "Bus", count: 14, icon: "bus" },
            ],
            eventAvailable: true,
            image: "/api/placeholder/800/300"
        }
    ];

    // Sample data for reviews
    const reviews = [
        {
            id: 1,
            username: "Abi 123",
            userType: "The Adventurer",
            rating: 5,
            date: "05 March 2024",
            content: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
            images: ["/api/placeholder/100/100", "/api/placeholder/100/100"],
            tags: ["Swimming", "Big Bus", "Surfing", "Toilet", "Mosque", "Rainy", "Rp 25k"]
        },
        {
            id: 2,
            username: "Rudi 456",
            userType: "The Scenic Soul",
            rating: 4,
            date: "05 March 2024",
            content: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
            images: ["/api/placeholder/100/100", "/api/placeholder/100/100"],
            tags: ["Swimming", "Big Bus", "Surfing", "Toilet", "Mosque", "Rainy", "Rp 25k"],
            experienced: true
        }
    ];

    // Function to handle navigation between destinations
    const handleNavigation = (direction) => {
        if (direction === 'next' && currentDestinationIndex < destinations.length - 1) {
            setCurrentDestinationIndex(prev => prev + 1);
        } else if (direction === 'prev' && currentDestinationIndex > 0) {
            setCurrentDestinationIndex(prev => prev - 1);
        }
    }

    // Current destination
    const currentDestination = destinations[currentDestinationIndex];

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

    // Function to chunk amenities into rows
    const chunkAmenities = (amenities, size) => {
        const chunkedArr = [];
        for (let i = 0; i < amenities.length; i += size) {
            chunkedArr.push(amenities.slice(i, i + size));
        }
        return chunkedArr;
    }

    // Group amenities into rows of 4
    const amenityRows = chunkAmenities(currentDestination.amenities, 4);

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
            {/* Header Section */}
            <div className="p-4 border-b">
                <div className="flex justify-between items-center mb-4">
                    <button className="text-teal-600 flex items-center"
                    onClick={() => navigate('/preference')}>
                        <ChevronLeft size={16} />
                        <span>Start Over</span>
                    </button>
                    <h1 className="text-2xl font-bold text-center">Our top picks for you!</h1>
                    <button className="text-teal-600">
                        Finish
                    </button>
                </div>

                <div className="flex justify-between items-center">
                    <p className="text-gray-500 text-sm">Scroll to see the reviews</p>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center text-gray-700 text-sm">
                            <span className="mr-1">Sort By Distance</span>
                        </button>
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

                {/* Navigation buttons */}
                <button
                    onClick={() => handleNavigation('prev')}
                    disabled={currentDestinationIndex === 0}
                    className="absolute top-1/2 left-2 -translate-y-1/2 bg-teal-500 text-white p-2 rounded-full z-10"
                >
                    <ChevronLeft size={24} />
                </button>

                <button
                    onClick={() => handleNavigation('next')}
                    disabled={currentDestinationIndex === destinations.length - 1}
                    className="absolute top-1/2 right-2 -translate-y-1/2 bg-teal-500 text-white p-2 rounded-full z-10"
                >
                    <ChevronRight size={24} />
                </button>

                {/* Destination Image */}
                <div className="rounded-lg overflow-hidden mb-4 relative">
                    <img
                        src={currentDestination.image}
                        alt={currentDestination.name}
                        className="w-full h-64 object-cover"
                    />

                    {/* Distance badge */}
                    <div className="absolute bottom-4 left-4 bg-white rounded-full px-3 py-1 flex items-center gap-1 text-sm shadow-sm">
                        <MapPin size={14} className="text-red-500" />
                        <span>{currentDestination.distance} km</span>
                    </div>
                </div>

                {/* Destination Info */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold">{currentDestination.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            {renderStarRating(currentDestination.rating)}
                            <span className="text-sm text-gray-600">{currentDestination.rating} ({currentDestination.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                            <MapPin size={14} className="text-red-500" />
                            <span>{currentDestination.location}</span>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="font-bold">{currentDestination.priceRange}</p>
                        {currentDestination.eventAvailable && (
                            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-1 rounded border border-green-200 mt-1">
                                <span className="w-3 h-3 bg-green-500 rounded-sm"></span>
                                Event Available
                            </span>
                        )}
                    </div>
                </div>

                {/* Amenities */}
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
                                    <span className="text-sm">{amenity.type} by {amenity.count} people</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Reviews Section */}
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
                                <div key={index} className="flex items-center gap-1 bg-gray-50 rounded-full px-3 py-1 text-xs">
                                    {tag === "Swimming" || tag === "Big Bus" || tag === "Surfing" || tag === "Toilet" || tag === "Mosque" || tag === "Rainy" ? (
                                        <span className="w-3 h-3 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="text-green-600 text-xs">✓</span>
                                        </span>
                                    ) : null}
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