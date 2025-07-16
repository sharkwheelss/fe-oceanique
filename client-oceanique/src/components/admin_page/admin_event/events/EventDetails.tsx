import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';
import { useEvents } from '../../../../context/EventContext';

const EventDetails = () => {
    const navigate = useNavigate();
    const { eventId } = useParams(); // Get event ID from URL parameters
    const { getAdminEventDetails } = useEvents();

    // Add missing state variables
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!eventId) {
                setError('Event ID is required');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Use the correct function to get event details by ID
                const eventResponse = await getAdminEventDetails(eventId);
                console.log('Event details response:', eventResponse);

                // Handle different response structures
                if (eventResponse) {
                    setEvent(eventResponse[0]);
                } else {
                    setError('Event not found');
                }
            } catch (error) {
                console.error('Error fetching event details:', error);
                setError('Failed to load event details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [eventId]);

    const formatDate = (dateString) => {
        if (!dateString) return 'No date specified';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid date';

            return date.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        } catch (error) {
            return 'Invalid date';
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex-1 bg-gray-50">
                <div className="bg-white border-b border-gray-200 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate(`/admin/events`)}
                                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-800">Event Detail</h1>
                        </div>
                    </div>
                </div>
                <div className="p-8">
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="h-8 bg-gray-200 rounded mb-6"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                            <div className="h-20 bg-gray-200 rounded mb-6"></div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="h-8 bg-gray-200 rounded"></div>
                                <div className="h-8 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex-1 bg-gray-50">
                <div className="bg-white border-b border-gray-200 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate(`/admin/events`)}
                                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-800">Event Detail</h1>
                        </div>
                    </div>
                </div>
                <div className="p-8">
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <div className="text-center py-12">
                            <div className="text-red-500 text-lg font-medium mb-2">Error</div>
                            <div className="text-gray-600 mb-4">{error}</div>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // No event data
    if (!event) {
        return (
            <div className="flex-1 bg-gray-50">
                <div className="bg-white border-b border-gray-200 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate(`/admin/events`)}
                                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-800">Event Detail</h1>
                        </div>
                    </div>
                </div>
                <div className="p-8">
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg">Event not found</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main component render
    return (
        <div className="flex-1 bg-gray-50">
            <div className="bg-white border-b border-gray-200 px-8 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate(`/admin/events`)}
                            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h1 className="text-2xl font-semibold text-gray-800">Event Detail</h1>
                    </div>

                </div>
            </div>

            <div className="p-8">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Event Name
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                                    {event?.name || 'No name specified'}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Event Type
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                                    {event?.jenis || 'No type specified'}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 min-h-24">
                                {event?.description || 'No description provided'}
                            </div>
                        </div>

                        {event?.path && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Event Images
                                </label>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {(Array.isArray(event.path) ? event.path : [event.path]).map((image, index) => (
                                        <div key={index} className="relative group">
                                            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center border overflow-hidden relative">
                                                <>
                                                    <img
                                                        src={image}
                                                        alt={`Event image ${index + 1}`}
                                                        className="w-full h-full object-cover cursor-pointer"
                                                        onClick={() => setSelectedImage(image)}
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            const fallback = e.currentTarget.nextElementSibling;
                                                            if (fallback) fallback.style.display = 'flex';
                                                        }}
                                                    />
                                                    <span className="absolute inset-0 hidden items-center justify-center text-xs text-gray-500 bg-white bg-opacity-75 p-2 text-center">
                                                        {image}
                                                    </span>
                                                </>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {selectedImage && (
                                    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-70 flex items-center justify-center z-50">
                                        <div className="relative max-w-4xl w-full px-4">
                                            <button
                                                onClick={() => setSelectedImage(null)}
                                                className="absolute top-2 right-2 text-black text-2xl font-bold z-10"
                                            >
                                                &times;
                                            </button>
                                            <img
                                                src={selectedImage}
                                                alt="Full preview"
                                                className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-xl"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                    {formatDate(event?.start_date)}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Time
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 flex items-center">
                                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                    {event?.start_time || 'No start time specified'}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                    {formatDate(event?.end_date)}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Time
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 flex items-center">
                                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                    {event?.end_time || 'No end time specified'}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                            </label>
                            <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                {event?.beach_name || 'No location specified'}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Social Media
                            </label>
                            <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                                {event?.social_media || '-'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;