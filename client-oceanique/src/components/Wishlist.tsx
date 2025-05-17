import React from 'react';
import { MapPin, Star } from 'lucide-react';

/**
 * BeachListingPage - Component for displaying beach listings
 * Shows beach cards with images, ratings, location, and event availability
 */
const BeachListingPage = () => {
    /**
     * Sample beach data based on the screenshot
     */
    const beaches = [
        {
            id: 1,
            name: 'Pantai Pasir Putih',
            image: 'https://picsum.photos/id/15/2500/1667', // Placeholder for sunset beach image
            rating: 4.9,
            reviews: 145,
            price: { min: 10, max: 35 },
            currency: 'k',
            location: 'Cungkil, Surabaya, Jawa Timur',
            distance: 3.4,
            hasEvent: true
        },
        {
            id: 2,
            name: 'Pantai Pasir Putih',
            image: 'https://picsum.photos/id/15/2500/1667', // Placeholder for palm tree beach image
            rating: 4.9,
            reviews: 145,
            price: { min: 10, max: 35 },
            currency: 'k',
            location: 'Cungkil, Surabaya, Jawa Timur',
            distance: 3.4,
            hasEvent: false
        }
    ];

    return (
        <div className="bg-white min-h-screen">

            {/* Main content */}
            <main className="container mx-auto px-4 py-8">
                {/* Page title */}
                <h1 className="text-3xl font-bold text-center mb-8 z-10 top-[72px] sticky bg-white p-4">Your Lovely Beach</h1>

                {/* Beach cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {beaches.map((beach) => (
                        <BeachCard key={beach.id} beach={beach} />
                    ))}
                </div>
            </main>
        </div>
    );
};

/**
 * BeachCard - Component for individual beach listing card
 * @param {Object} props - Component props
 * @param {Object} props.beach - Beach data object
 * @returns {JSX.Element} Beach card component
 */
type Beach = {
    id: number;
    name: string;
    image: string;
    rating: number;
    reviews: number;
    price: { min: number; max: number };
    currency: string;
    location: string;
    distance: number;
    hasEvent: boolean;
};

const BeachCard: React.FC<{ beach: Beach }> = ({ beach }) => {
    return (
        <div className="rounded-2xl overflow-hidden shadow-md bg-white">
            {/* Beach image */}
            <div className="relative h-48 overflow-hidden">
                {/* Placeholder image */}
                <img
                    src={beach.image}
                    alt={beach.name}
                    className="w-full h-full object-cover"
                />

                {/* Distance badge */}
                <div className="absolute bottom-4 left-4 bg-white rounded-full px-3 py-1 text-sm font-medium shadow-md flex items-center">
                    <MapPin className="w-4 h-4 text-rose-500 mr-1" />
                    <span>{beach.distance} km</span>
                </div>
            </div>

            {/* Beach info */}
            <div className="p-4">
                {/* Name and price */}
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{beach.name}</h3>
                    <div className="text-gray-700">
                        Rp{beach.price.min}{beach.currency} - {beach.price.max}{beach.currency}
                    </div>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{beach.rating}</span>
                    <span className="ml-1 text-gray-500">({beach.reviews} reviews)</span>
                </div>

                {/* Location */}
                <div className="flex items-start mb-4">
                    <MapPin className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
                    <span className="ml-1 text-gray-600">{beach.location}</span>
                </div>

                {/* Event availability */}
                <div className="flex justify-end">
                    {beach.hasEvent ? (
                        <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-md">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Event Available
                        </div>
                    ) : (
                        <div className="flex items-center text-sm text-rose-600 bg-rose-50 px-3 py-1 rounded-md">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            No Event
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BeachListingPage;