import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { useEvents } from '../../../../context/EventContext';
import DialogMessage from '../../../../components/helper/DialogMessage';
import { useDialog } from '../../../../components/helper/useDialog';

const EventList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const { getAdminEvents, adminDeleteEvent } = useEvents();
    const [dialogState, { showSuccess, showError, showWarning, closeDialog }] = useDialog();

    // Extract fetchEvents function so it can be reused
    const fetchEvents = async () => {
        try {
            setLoading(true);
            const eventsResponse = await getAdminEvents();
            console.log(eventsResponse);

            // Assuming the response structure - adjust based on your actual API response
            if (eventsResponse && eventsResponse.data) {
                setEvents(eventsResponse.data);
            } else if (Array.isArray(eventsResponse)) {
                setEvents(eventsResponse);
            } else {
                setEvents([]);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (eventId: any, eventName: any) => {
        // First show confirmation dialog
        showWarning(
            'Delete Event',
            `Are you sure you want to delete "${eventName}"? This action cannot be undone.`,
            {
                showCancel: true,
                confirmText: 'Delete',
                cancelText: 'Cancel',
                onConfirm: async () => {
                    // Close the warning dialog first
                    closeDialog();

                    try {
                        // Perform the delete operation
                        const result = await adminDeleteEvent(eventId);

                        // Check if the deletion was successful
                        if (result.success) {
                            showSuccess(
                                'Delete Event Successful',
                                result.message || `"${eventName}" has been deleted successfully.`,
                                {
                                    showCancel: false,
                                    onConfirm: async () => {
                                        closeDialog();
                                        // Reload the events data after successful deletion
                                        await fetchEvents();
                                    }
                                }
                            );
                        } else {
                            showError(
                                'Delete Event Failed',
                                result.message,
                                {
                                    showCancel: false,
                                    onConfirm: () => {
                                        closeDialog();
                                    }
                                }
                            );
                        }
                    } catch (error) {
                        showError(
                            'Delete Event Failed',
                            'An unexpected error occurred while deleting the event.',
                            {
                                showCancel: false,
                                onConfirm: () => {
                                    closeDialog();
                                }
                            }
                        );
                    }
                }
            }
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(' pukul', ', ');
    };

    const filteredEvents = events?.filter(event =>
        event.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className="flex-1 bg-gray-50">
            {/* Reusable Dialog Component */}
            <DialogMessage
                type={dialogState.type}
                title={dialogState.title}
                message={dialogState.message}
                isOpen={dialogState.isOpen}
                onClose={closeDialog}
                redirectPath={dialogState.redirectPath}
                onConfirm={dialogState.onConfirm}
                confirmText={dialogState.confirmText}
                cancelText={dialogState.cancelText}
                showCancel={dialogState.showCancel}
                autoClose={dialogState.autoClose}
                autoCloseDelay={dialogState.autoCloseDelay}
            />

            <div className="bg-white border-b border-gray-200 px-8 py-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">Event List</h1>
                </div>
            </div>

            <div className="p-8">

                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <div className="relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-80"
                                />
                            </div>
                            <button
                                onClick={() => navigate('/admin/events/create')}
                                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center"
                                disabled={loading}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Event
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                                <span className="ml-2 text-gray-600">Loading events...</span>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Event Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Start Date & Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            End Date & Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredEvents.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                                {loading ? 'Loading...' : 'No events found'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredEvents.map((event) => (
                                            <tr key={event.id} className="hover:bg-gray-50">
                                                <td
                                                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium 'text-gray-900 cursor-pointer hover:text-teal-600`}
                                                    onClick={() => {
                                                        navigate(`/admin/events/${event.id}`);
                                                    }}
                                                >
                                                    {event.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(event.start_datetime)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(event.end_datetime)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${event.jenis === 'private'
                                                            ? 'bg-red-100 text-red-700'
                                                            : event.jenis === 'public'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-slate-100 text-slate-600' // fallback
                                                            }`}
                                                    >
                                                        {event.jenis.charAt(0).toUpperCase() + event.jenis.slice(1)}
                                                    </span>

                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {event.beach_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${event.status === 'ongoing' ? 'bg-teal-100 text-teal-700'
                                                            : event.status === 'upcoming' ? 'bg-gray-200 text-gray-600'
                                                                : event.status === 'ended_soon' ? 'bg-yellow-100 text-yellow-800'
                                                                    : event.status === 'ended' ? 'bg-red-100 text-red-600'
                                                                        : 'bg-slate-100 text-slate-600' // fallback
                                                            }`}
                                                    >
                                                        {event.status === 'ended_soon' ? 'Ended Soon' : event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => {
                                                                navigate(`/admin/events/${event.id}/edit`);
                                                            }}
                                                            className={`transition-colors text-teal-600 hover:text-teal-900 cursor-pointer`}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                handleDelete(event.id, event.name);
                                                                if (event.status === 'ended') {
                                                                }
                                                            }}
                                                            className={`transition-colors text-red-600 hover:text-red-900 cursor-pointer`}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>

                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventList;