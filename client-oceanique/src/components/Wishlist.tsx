import React, { useState, useEffect } from 'react';
import { MapPin, Star, Heart, Calendar, X, Loader } from 'lucide-react';
import { useBeaches } from '../context/BeachContext';
import { useNavigate } from 'react-router-dom';
/**
 * WishlistBeachPage - Component for displaying wishlist beach listings
 * Shows beach cards with images, ratings, location, and wishlist functionality
 */
const WishlistBeachPage = () => {
    const [wishlistData, setWishlistData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getWishlist } = useBeaches();

    /**
     * Fetch data on component mount
     */
    useEffect(() => {
        const fetchWishlistData = async () => {
            try {
                const response = await getWishlist();
                console.log('wishlist: ', response);

                setLoading(false);
                setWishlistData(response)
            } catch (error) {
                console.error('Error fetching beaches:', error);
                setLoading(false);
            }
        };
        fetchWishlistData();
    }, []);

    /**
     * Parse price string to get min and max values
     */
    const parsePrice = (priceString) => {
        if (!priceString) return { min: 0, max: 0 };

        const matches = priceString.match(/(\d+)k?\s*-\s*(\d+)k?/);
        if (matches) {
            return {
                min: parseInt(matches[1]),
                max: parseInt(matches[2])
            };
        }
        return { min: 0, max: 0 };
    };

    /**
     * Generate placeholder image based on beach id
     */
    const getBeachImage = (beachId) => {
        const imageIds = [15, 147, 162, 158, 164, 167, 168];
        const imageId = imageIds[beachId % imageIds.length];
        return `https://picsum.photos/id/${imageId}/400/300`;
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Main content */}
            <main className="container mx-auto px-4 py-8">
                {/* Page title */}
                <h1 className="text-3xl font-bold text-center mb-8 sticky top-[72px] bg-white p-4 z-10">
                    Your Wishlist Beaches
                </h1>

                {/* Loading state */}
                {loading ? (
                    <div className="text-center py-16">
                        <Loader className="w-8 h-8 text-blue-500 mx-auto mb-4 animate-spin" />
                        <p className="text-gray-600">Loading your wishlist...</p>
                    </div>
                ) : error ? (
                    /* Error state */
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <X className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">Failed to load wishlist</h3>
                        <p className="text-gray-500 mb-4">{error}</p>
                        <button
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : wishlistData.length === 0 ? (
                    /* Empty state */
                    <div className="text-center py-16">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No beaches in your wishlist</h3>
                        <p className="text-gray-500">Start exploring and add your favorite beaches!</p>
                    </div>
                ) : (
                    <>
                        {/* Results count */}
                        <div className="mb-6">
                            <p className="text-gray-600">
                                {wishlistData.length} beach{wishlistData.length !== 1 ? 'es' : ''} in your wishlist
                            </p>
                        </div>

                        {/* Beach cards grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {wishlistData.map((beach) => (
                                <WishlistBeachCard
                                    key={beach.id}
                                    beach={beach}
                                    getBeachImage={getBeachImage}
                                    parsePrice={parsePrice}
                                />
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

/**
 * WishlistBeachCard - Component for individual wishlist beach card
 */
const WishlistBeachCard = ({ beach, getBeachImage, parsePrice }) => {
    const price = parsePrice(beach.estimate_price);
    const navigate = useNavigate();

    return (
        <div className="rounded-2xl overflow-hidden shadow-md bg-white relative"
            onClick={() => navigate(`/beach-detail/${beach.beaches_id}`)}>
            {/* Remove from wishlist button */}
            <button
                className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors group"
                title="Remove from wishlist"
            >
                <Heart className="w-5 h-5 text-red-500 fill-current group-hover:scale-110 transition-transform" />
            </button>

            {/* Beach image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={getBeachImage(beach.beaches_id)}
                    alt={beach.beach_name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Beach info */}
            <div className="p-4">
                {/* Name and price */}
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold pr-2">{beach.beach_name}</h3>
                    <div className="text-gray-700 text-sm whitespace-nowrap">
                        {beach.estimate_price ? (
                            `Rp${price.min}k - ${price.max}k`
                        ) : (
                            'Price varies'
                        )}
                    </div>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">
                        {beach.rating_average ? beach.rating_average.toFixed(1) : 'No rating'}
                    </span>
                </div>

                {/* Contact Person */}
                {beach.cp_name && (
                    <div className="flex items-center mb-2">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                            <span className="text-blue-600 text-xs font-medium">CP</span>
                        </div>
                        <span className="text-gray-600 text-sm">{beach.cp_name}</span>
                    </div>
                )}

                {/* Website */}
                {beach.official_website && (
                    <div className="flex items-center mb-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2">
                            <span className="text-green-600 text-xs">🌐</span>
                        </div>
                        <a
                            href={`https://${beach.official_website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm hover:underline truncate"
                        >
                            {beach.official_website}
                        </a>
                    </div>
                )}

                {/* Description preview */}
                <div className="mb-3">
                    <p className="text-gray-600 text-sm line-clamp-2">
                        {beach.descriptions ?
                            beach.descriptions.substring(0, 100) + (beach.descriptions.length > 100 ? '...' : '')
                            : 'No description available'
                        }
                    </p>
                </div>

                {/* Added to wishlist date */}
                <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>
                        Added {new Date(beach.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default WishlistBeachPage;