import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';

// Event interface (same as in your EventsPage)
interface Event {
    id: number;
    name: string;
    description: string;
    is_active: number;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    jenis: string;
    beaches_id: number;
    users_id: number;
    beach_name: string;
    province: string;
    city: string;
    subdistrict: string;
    path: string;
    status: string;
    img_path: string;
}

interface WishlistEventsSectionProps {
    wishlistBeachIds: number[]; // Array of beach IDs from user's wishlist
}

const WishlistEventsSection: React.FC<WishlistEventsSectionProps> = ({ wishlistBeachIds }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { getAllEvents } = useEvents();

    // console.log(wishlistBeachIds)

    useEffect(() => {
        const fetchWishlistEvents = async () => {
            try {
                setLoading(true);
                const allEvents = await getAllEvents();

                if (allEvents && wishlistBeachIds.length > 0) {
                    // Filter events that are ongoing and match wishlist beaches
                    const filteredEvents = allEvents.filter(event =>
                        wishlistBeachIds.includes(event.beaches_id)
                    );

                    // Limit to 4 events for display
                    setEvents(filteredEvents.slice(0, 4));
                }
            } catch (error) {
                console.error('Error fetching wishlist events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlistEvents();
    }, [wishlistBeachIds]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ongoing':
                return 'bg-green-500 text-white';
            case 'ended soon':
                return 'bg-yellow-500 text-white';
            case 'ended':
                return 'bg-red-500 text-white';
            case 'upcoming':
                return 'bg-blue-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    if (loading) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading events...</p>
                    </div>
                </div>
            </section>
        );
    }

    // Don't show section if no events or no wishlist
    if (events.length === 0 || wishlistBeachIds.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        All Events at Your Favorite Beaches
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover exciting events at the beaches you love
                    </p>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                            onClick={() => navigate(`/event-detail/${event.id}`)}
                        >
                            {/* Event Image */}
                            <div className="relative h-48">
                                <img
                                    src={event.img_path}
                                    alt={event.name}
                                    className="w-full h-full object-cover"
                                />
                                {/* Status Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                                        {event.status}
                                    </span>
                                </div>
                            </div>

                            {/* Event Content */}
                            <div className="p-4">
                                {/* Event Title */}
                                <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2">
                                    {event.name}
                                </h3>

                                {/* Date and Time */}
                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>{formatDate(event.start_date)} - {formatDate(event.end_date)}</span>
                                </div>

                                {/* Location */}
                                <div className="flex items-center text-sm text-gray-600 mb-3">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    <span className="truncate">{event.beach_name}</span>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {event.description}
                                </p>

                                {/* Footer */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-sm">
                                        <Users className="w-4 h-4 mr-1 text-gray-400" />
                                        <span className={`px-2 py-1 rounded text-xs ${event.jenis === 'public' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {event.jenis === 'public' ? 'Public' : 'Private'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Events Button */}
                <div className="text-center">
                    <button
                        onClick={() => navigate('/events')}
                        className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 font-medium"
                    >
                        View All Events
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default WishlistEventsSection;