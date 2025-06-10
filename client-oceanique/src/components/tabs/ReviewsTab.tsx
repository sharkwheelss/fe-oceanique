import { useState, useMemo } from 'react';
import { Star, ThumbsUp, Plus, Check, Edit, MessageSquare } from 'lucide-react';
import Pagination from "../helper/pagination";

// Type definitions
type Review = {
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
};

type ReviewsData = {
    users_vote?: number;
    rating_average?: number;
    reviews?: Review[];
    message?: string; // Added for error case
};

type ReviewsSectionProps = {
    reviewsData: ReviewsData;
    currentUserId?: number;
    onNavigate?: (path: string) => void;
};

export default function ReviewsSection({ reviewsData, currentUserId, onNavigate }: ReviewsSectionProps) {
    console.log(reviewsData);

    // Check if there are no reviews (either empty array or error message)
    const hasNoReviews = !reviewsData.reviews || reviewsData.reviews.length === 0 || reviewsData.message;

    // State for sorting option
    const [sortBy, setSortBy] = useState('newest');

    // State for current page
    const [currentPage, setCurrentPage] = useState(1);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Navigation handler
    const handleNavigation = (path: string) => {
        if (onNavigate) {
            onNavigate(path);
        }
    };

    const reviewsPerPage = 5;

    // Early return for no reviews case
    if (hasNoReviews) {
        return (
            <div className="container mx-auto">
                <div className="py-6">
                    <h2 className="text-2xl font-bold mb-8">Overall Rating & Review</h2>

                    {/* Empty state */}
                    <div className="text-center py-12">
                        <div className="mb-6">
                            <MessageSquare size={64} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Reviews Yet</h3>
                            <p className="text-gray-500 mb-6">
                                {reviewsData.message || "Be the first to share your experience at this beach!"}
                            </p>
                        </div>

                        {/* Add review button */}
                        <button
                            className="bg-teal-500 text-white rounded-md px-6 py-3 flex items-center mx-auto hover:bg-teal-600 transition-colors"
                            onClick={() => handleNavigation('/add-review')}
                        >
                            <Plus size={20} className="mr-2" />
                            Write First Review
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Sorting logic (only if we have reviews)
    const reviews: Review[] = [...reviewsData.reviews];

    // First, separate current user's reviews from others
    const currentUserReviews = reviews.filter(review => review.user_id === currentUserId);
    const otherReviews = reviews.filter(review => review.user_id !== currentUserId);

    const sortedReviews = useMemo(() => {
        // Sort other reviews based on selected criteria
        otherReviews.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.posted).getTime() - new Date(a.posted).getTime();
                case 'oldest':
                    return new Date(a.posted).getTime() - new Date(b.posted).getTime();
                case 'highest':
                    return b.rating - a.rating;
                case 'lowest':
                    return a.rating - b.rating;
                default:
                    return 0;
            }
        });

        // Return current user's reviews first, then sorted others
        return [...currentUserReviews, ...otherReviews];
    }, [reviewsData.reviews, sortBy, currentUserId]);

    // Pagination logic
    const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const paginatedReviews = sortedReviews.slice(startIndex, startIndex + reviewsPerPage);

    // Handler for pagination
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Handler for sort change
    const handleSortChange = (newSort: string) => {
        setSortBy(newSort);
        setCurrentPage(1); // Reset to first page when sorting changes
        setIsDropdownOpen(false);
    };

    const sortOptions = [
        { value: 'newest', label: 'Newest' },
        { value: 'oldest', label: 'Oldest' },
        { value: 'highest', label: 'Highest Rating' },
        { value: 'lowest', label: 'Lowest Rating' }
    ];

    return (
        <div className="container mx-auto">
            {/* Reviews Content */}
            <div className="py-6">
                <h2 className="text-2xl font-bold mb-8">Overall Rating & Review</h2>

                {/* Rating Overview and Actions */}
                <div className="flex justify-between items-center mb-8">
                    {/* Rating Circle */}
                    <div className="flex items-center">
                        <div className="relative">
                            <div className="bg-teal-500 text-white w-24 h-24 rounded-full flex flex-col items-center justify-center text-center relative">
                                <span className="text-2xl font-bold">{reviewsData.rating_average || 0}</span>
                                <span className="text-sm">/ 5</span>
                            </div>
                            <Star size={24} className="absolute top-0 right-0 text-yellow-400 fill-current" />
                        </div>
                        <span className="ml-4 text-gray-700">from {reviewsData.users_vote || 0} users</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center">
                        {currentUserReviews.length === 0 && (
                            <button
                                className="bg-teal-500 text-white rounded-md px-4 py-2 mr-4 flex items-center hover:bg-teal-600 transition-colors"
                                onClick={() => handleNavigation('/add-review')}
                            >
                                <Plus size={18} className="mr-1" />
                                Add
                            </button>
                        )}

                        <div className="relative">
                            <button
                                className="flex items-center text-gray-700 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 transition-colors"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <span className="mr-2">Sort By: {sortOptions.find(opt => opt.value === sortBy)?.label}</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                                            onClick={() => handleSortChange(option.value)}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                    {paginatedReviews.map(review => (
                        <ReviewCard
                            key={review.review_id}
                            review={review}
                            isCurrentUser={review.user_id === currentUserId}
                            onEdit={() => handleNavigation(`/edit-review/${review.review_id}`)}
                        />
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
}

// Review card component
function ReviewCard({ review, isCurrentUser, onEdit }: {
    review: Review;
    isCurrentUser: boolean;
    onEdit: () => void;
}) {
    // State for like status
    const [isLiked, setIsLiked] = useState(false);

    // Toggle like
    const toggleLike = () => {
        setIsLiked(prev => !prev);
    };

    // Check if user is experienced (experience === 0 means experienced)
    const isExperiencedUser = review.experience === 0;

    // Get media content (images and videos)
    const mediaContent = review.contents || [];

    // Get option votes as amenities
    const amenities = review.option_votes?.map(vote => vote.option_name) || [];

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between">
                {/* User info */}
                <div className="flex">
                    <div className="mr-4">
                        <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center overflow-hidden">
                            {review.user_profile?.img_path ? (
                                <img
                                    src={review.user_profile.img_path}
                                    alt="User"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-xl font-bold">
                                    {review.username.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center">
                            <h3 className="font-medium">{review.username}</h3>
                            {isCurrentUser && (
                                <button
                                    onClick={onEdit}
                                    className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                                    title="Edit review"
                                >
                                    <Edit size={16} />
                                </button>
                            )}
                        </div>
                        <p className="text-sm text-gray-500">Since {review.join_date}</p>

                        {!isExperiencedUser && (
                            <div className="mt-2 bg-blue-100 text-blue-700 text-xs py-1 px-2 rounded-full inline-flex items-center">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                                <span>from experienced user</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Rating and date */}
                <div className="text-right">
                    <div className="flex items-center justify-end mb-1">
                        <Star size={16} className="text-yellow-400 fill-current mr-1" />
                        <span className="font-medium">{review.rating} / 5</span>
                    </div>
                    <p className="text-xs text-gray-500">(Posted at {review.posted})</p>
                </div>
            </div>

            {/* Review photos/videos */}
            {mediaContent.length > 0 && (
                <div className="flex mt-4 mb-4 flex-wrap gap-2">
                    {mediaContent.slice(0, 4).map((content, index) => (
                        <div key={content.id} className="rounded-md overflow-hidden">
                            {content.path.endsWith('.mp4') ? (
                                <video
                                    src={content.img_path}
                                    className="w-20 h-16 object-cover"
                                    controls={false}
                                    muted
                                />
                            ) : (
                                <img
                                    src={content.img_path}
                                    alt={`Review content ${index + 1}`}
                                    className="w-20 h-16 object-cover"
                                />
                            )}
                        </div>
                    ))}
                    {mediaContent.length > 4 && (
                        <div className="w-20 h-16 bg-gray-200 rounded-md flex items-center justify-center text-sm text-gray-600">
                            +{mediaContent.length - 4}
                        </div>
                    )}
                </div>
            )}

            {/* Review text */}
            <p className="text-gray-700 mb-4">{review.user_review}</p>

            {/* Amenities */}
            {amenities.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {amenities.map((amenity, index) => (
                        <div key={index} className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs flex items-center">
                            <Check size={12} className="text-green-500 mr-1" />
                            {amenity}
                        </div>
                    ))}
                </div>
            )}

            {/* Like button */}
            <div className="flex justify-end">
                <button
                    onClick={toggleLike}
                    className={`${isLiked ? 'text-blue-500' : 'text-gray-400'} hover:text-blue-500 transition-colors`}
                >
                    <ThumbsUp size={20} />
                </button>
            </div>
        </div>
    );
}