import { useState } from 'react';
import { Star, ThumbsUp, Plus, Check } from 'lucide-react';
import Pagination from '../helper/pagination';

export default function ReviewsSection() {
    // State for sorting option
    const [sortBy, setSortBy] = useState('newest');

    // State for current page
    const [currentPage, setCurrentPage] = useState(1);

    // Sample review data
    const reviews = [
        {
            id: 1,
            username: 'Abi 123',
            userSince: '2021',
            rating: 3.5,
            date: '05 March 2024',
            text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
            photos: ['/api/placeholder/100/80', '/api/placeholder/100/80'],
            isExperiencedUser: true,
            amenities: ['Swimming', 'Big Bus', 'Surfing', 'Toilet', 'Mosque', 'Rainy', 'Rp 250k']
        },
        {
            id: 2,
            username: 'Abi 123',
            userSince: '2021',
            rating: 5,
            date: '05 March 2024',
            text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
            photos: ['/api/placeholder/100/80', '/api/placeholder/100/80'],
            isExperiencedUser: true,
            amenities: ['Swimming', 'Big Bus', 'Surfing', 'Toilet', 'Mosque', 'Rainy', 'Rp 250k']
        },
        {
            id: 3,
            username: 'Abi 123',
            userSince: '2021',
            rating: 5,
            date: '05 March 2024',
            text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
            photos: ['/api/placeholder/100/80', '/api/placeholder/100/80'],
            isExperiencedUser: true,
            amenities: ['Swimming', 'Big Bus', 'Surfing', 'Toilet', 'Mosque', 'Rainy', 'Rp 250k']
        }
    ];

    // Calculate overall rating
    const overallRating = 4.5;
    const totalReviews = 32;

    // Handler for pagination
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

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
                                <span className="text-2xl font-bold">{overallRating}</span>
                                <span className="text-sm">/ 5</span>
                            </div>
                            <Star size={24} className="absolute top-0 right-0 text-yellow-400 fill-current" />
                        </div>
                        <span className="ml-4 text-gray-700">from {totalReviews} users</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center">
                        <button className="bg-teal-500 text-white rounded-md px-4 py-2 mr-4 flex items-center">
                            <Plus size={18} className="mr-1" />
                            Add
                        </button>

                        <div className="relative">
                            <button className="flex items-center text-gray-700 border border-gray-300 rounded-md px-4 py-2">
                                <span className="mr-2">Sort By</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                    {reviews.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={10}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}

// Review card component
type Review = {
    id: number;
    username: string;
    userSince: string;
    rating: number;
    date: string;
    text: string;
    photos: string[];
    isExperiencedUser: boolean;
    amenities: string[];
};

function ReviewCard({ review }: { review: Review }) {
    // State for like status
    const [isLiked, setIsLiked] = useState(false);

    // Toggle like
    const toggleLike = () => {
        setIsLiked(prev => !prev);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between">
                {/* User info */}
                <div className="flex">
                    <div className="mr-4">
                        <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center overflow-hidden">
                            <img src="/api/placeholder/50/50" alt="User" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium">{review.username}</h3>
                        <p className="text-sm text-gray-500">Since {review.userSince}</p>

                        {review.isExperiencedUser && (
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
                    <p className="text-xs text-gray-500">(Posted at {review.date})</p>
                </div>
            </div>

            {/* Review photos */}
            <div className="flex mt-4 mb-4">
                {review.photos.map((photo, index) => (
                    <div key={index} className="mr-2 rounded-md overflow-hidden">
                        <img src={photo} alt={`Review ${index + 1}`} className="w-20 h-16 object-cover" />
                    </div>
                ))}
            </div>

            {/* Review text */}
            <p className="text-gray-700 mb-4">{review.text}</p>

            {/* Amenities */}
            <div className="flex flex-wrap gap-2 mb-2">
                {review.amenities.map((amenity, index) => (
                    <div key={index} className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs flex items-center">
                        <Check size={12} className="text-green-500 mr-1" />
                        {amenity}
                    </div>
                ))}
            </div>

            {/* Like button */}
            <div className="flex justify-end">
                <button
                    onClick={toggleLike}
                    className={`${isLiked ? 'text-blue-500' : 'text-gray-400'}`}
                >
                    <ThumbsUp size={20} />
                </button>
            </div>
        </div>
    );
}
