import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { ArrowLeft, MapPin, Calendar, Minus, Plus, ArrowRight, X } from 'lucide-react';

// Interface for ticket category
export interface TicketCategory {
    id: number;
    name: string;
    users_id: number;
}

// Interface for individual ticket
export interface Ticket {
    id: number;
    name: string;
    description: string;
    quota: number;
    price: number;
    private_code: boolean;
    events_id: number;
    tickets_categories_id: number;
    category: TicketCategory;
    booked_count: number;
    remaining_tickets: number;
    is_available: number; // 0 or 1 (boolean as number)
    is_sold_out: boolean;
}

// Interface for event data
export interface EventData {
    id: number;
    name: string;
    description: string;
    is_active: number; // 0 or 1 (boolean as number)
    start_date: string; // ISO date string
    end_date: string; // ISO date string
    start_time: string; // HH:MM:SS format
    end_time: string; // HH:MM:SS format
    jenis: "public" | "private";
    beaches_id: number;
    users_id: number;
    beach_name: string;
    province: string;
    city: string;
    subdistrict: string;
    status: "ongoing" | "upcoming" | "ended soon" | "ended";
    img_path: string;
    tickets: Ticket[];
    can_purchase: boolean;
}

// Interface for API response
export interface EventApiResponse {
    message: string;
    data: EventData[];
}

// Interface for ticket quantities state (used in component)
export interface TicketQuantities {
    [ticketId: number]: number;
}

// Interface for private code modal props
export interface PrivateCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (code: string) => void;
    ticketName: string;
}

// Interface for event ticket page props (if needed)
export interface EventTicketPageProps {
    eventData?: EventData;
}

// Type for event status with colors
export type EventStatusConfig = {
    [key in EventData['status']]: {
        color: string;
        text: string;
    };
};

// Private Code Modal Component
const PrivateCodeModal: React.FC<PrivateCodeModalProps> = ({ isOpen, onClose, onSubmit, ticketName }) => {
    const [privateCode, setPrivateCode] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (privateCode.trim()) {
            onSubmit(privateCode);
            setPrivateCode('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Enter Private Code</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                    {ticketName} requires a private code to purchase.
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={privateCode}
                        onChange={(e) => setPrivateCode(e.target.value)}
                        placeholder="Enter private code"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
                        autoFocus
                    />
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!privateCode.trim()}
                            className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-300"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Main component for the Event Ticket Purchase page
export default function EventTicketPage() {
    // State management
    const [eventData, setEventData] = useState<EventData | null>(null);
    const [tickets, setTickets] = useState<TicketQuantities>({});
    const [showPrivateCodeModal, setShowPrivateCodeModal] = useState(false);
    const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { getEventDetails } = useEvents();
    const { eventId } = useParams();

    // Fetch event data and initialize ticket quantities
    useEffect(() => {
        const fetchEventData = async () => {

            try {
                console.log('Starting to fetch event data for ID:', eventId);
                setLoading(true);
                setError(null);

                const response = await getEventDetails(eventId);
                console.log('Raw API Response:', response);

                if (!response) {
                    throw new Error('No data received from API');
                }

                // Handle response based on your API structure
                let eventData;
                if (Array.isArray(response)) {
                    eventData = response[0];
                } else {
                    eventData = response;
                }

                if (!eventData) {
                    throw new Error('Event not found');
                }

                console.log('Processed event data:', eventData);
                setEventData(eventData);

                // Initialize ticket quantities
                const initialTickets = {};
                if (eventData.tickets && Array.isArray(eventData.tickets)) {
                    eventData.tickets.forEach((ticket: Ticket) => {
                        initialTickets[ticket.id] = 0;
                    });
                }
                setTickets(initialTickets);

            } catch (err: unknown) {
                console.error('Error in fetchEventData:', err);
                setError(err instanceof Error ? err.message : 'Failed to load event data');
            } finally {
                setLoading(false);
            }
        };

        fetchEventData();
    }, [eventId]);

    // Format price to Indonesian Rupiah
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    // Format time
    const formatTime = (timeString: string) => {
        return timeString.slice(0, 5); // Extract HH:MM from HH:MM:SS
    };

    // Get status badge color and text
    const getStatusBadge = (status: EventData['status']) => {
        const statusConfig = {
            ongoing: { color: 'bg-green-100 text-green-600', text: 'Ongoing' },
            upcoming: { color: 'bg-blue-100 text-blue-600', text: 'Upcoming' },
            'ended soon': { color: 'bg-orange-100 text-orange-600', text: 'Ending Soon' },
            ended: { color: 'bg-red-100 text-red-600', text: 'Ended' }
        };
        return statusConfig[status] || statusConfig.ongoing;
    };

    // Calculate total selected tickets
    const totalSelectedTickets = Object.values(tickets).reduce((acc: number, curr: number) => acc + curr, 0);

    // Handler for incrementing ticket quantity
    const handleIncrement = (ticket: Ticket) => {
        if (ticket.private_code && tickets[ticket.id] === 0) {
            // Show private code modal for first increment of private tickets
            setCurrentTicket(ticket);
            setShowPrivateCodeModal(true);
        } else if (!ticket.is_sold_out && tickets[ticket.id] < ticket.remaining_tickets) {
            setTickets(prevTickets => ({
                ...prevTickets,
                [ticket.id]: prevTickets[ticket.id] + 1
            }));
        }
    };

    // Handler for decrementing ticket quantity
    const handleDecrement = (ticketId: number) => {
        if (tickets[ticketId] > 0) {
            setTickets(prevTickets => ({
                ...prevTickets,
                [ticketId]: prevTickets[ticketId] - 1
            }));
        }
    };

    // Handler for private code submission
    const handlePrivateCodeSubmit = (code: string) => {
        // Here you would validate the private code with your API
        console.log('Private code submitted:', code, 'for ticket:', currentTicket?.name);

        // For now, we'll assume the code is valid and increment the ticket
        if (currentTicket) {
            setTickets(prevTickets => ({
                ...prevTickets,
                [currentTicket.id]: prevTickets[currentTicket.id] + 1
            }));
        }

        setShowPrivateCodeModal(false);
        setCurrentTicket(null);
    };

    // Loading state
    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading event details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !eventData) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg mb-4">{error || 'Event not found'}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Check if event allows purchasing
    const canPurchase = eventData.can_purchase && eventData.status !== 'ended';
    const statusBadge = getStatusBadge(eventData.status);

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header section */}
            <div className="bg-white p-4 shadow-sm">
                <div className="container mx-auto max-w-4xl">
                    <div className="flex items-center mb-4">
                        <button
                            className="p-2 rounded-full bg-teal-100"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft className="h-5 w-5 text-teal-500" />
                        </button>
                        <div className="ml-4">
                            <p className="text-gray-600 text-sm">
                                {eventData.beach_name} / {eventData.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3">
                            <img
                                src={eventData.img_path}
                                alt={eventData.name}
                                className="rounded-lg w-full md:w-auto object-cover"
                                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/api/placeholder/400/300';
                                }}
                            />
                        </div>

                        <div className="md:w-2/3 md:pl-6 mt-4 md:mt-0">
                            <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                                    {statusBadge.text}
                                </span>
                                <span className="px-2 py-1 rounded-full bg-blue-100 text-xs text-blue-600 font-medium">
                                    {eventData.jenis === 'public' ? 'Public' : 'Private'}
                                </span>
                            </div>

                            <h1 className="text-2xl font-semibold mt-2">{eventData.name}</h1>

                            <p className="text-gray-600 mt-2 text-sm">
                                {eventData.description}
                            </p>

                            <div className="mt-4 flex items-center text-gray-600">
                                <MapPin className="h-5 w-5 text-pink-500" />
                                <span className="ml-2 text-sm">
                                    {eventData.beach_name}, {eventData.city}, {eventData.province}
                                </span>
                            </div>

                            <div className="mt-2 flex items-center text-gray-600">
                                <Calendar className="h-5 w-5 text-pink-500" />
                                <span className="ml-2 text-sm">
                                    {formatDate(eventData.start_date)} {formatTime(eventData.start_time)} - {formatDate(eventData.end_date)} {formatTime(eventData.end_time)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Available Tickets section */}
            {eventData.tickets && eventData.tickets.length > 0 && (
                <div className="container mx-auto max-w-4xl mt-6 px-4">
                    <h2 className="text-xl font-semibold mb-4">Available Tickets</h2>

                    {eventData.tickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            className={`mb-4 rounded-lg border-l-8 ${ticket.is_sold_out || !canPurchase
                                ? 'bg-gray-200 border-gray-400'
                                : 'bg-white border-teal-400'
                                }`}
                        >
                            <div className="p-4">
                                <div className="flex flex-col md:flex-row justify-between">
                                    <div className="md:w-3/4">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold">{ticket.name}</h3>
                                            {ticket.private_code && (
                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                                                    Private
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 text-sm mt-2">{ticket.description}</p>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-xs">
                                                {ticket.category.name}
                                            </span>
                                            <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-xs">
                                                {formatDate(eventData.start_date)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="md:w-1/4 mt-4 md:mt-0 flex flex-col items-end">
                                        <div className="text-right">
                                            <p className="font-bold text-lg">{formatPrice(ticket.price)}</p>
                                            {ticket.is_sold_out ? (
                                                <p className="text-red-500 text-sm">Sold Out</p>
                                            ) : !canPurchase ? (
                                                <p className="text-gray-500 text-sm">Not Available</p>
                                            ) : (
                                                <p className="text-orange-500 text-sm">{ticket.remaining_tickets} left</p>
                                            )}
                                        </div>

                                        {!ticket.is_sold_out && canPurchase && (
                                            <div className="flex items-center mt-4">
                                                <button
                                                    onClick={() => handleDecrement(ticket.id)}
                                                    className={`p-1 rounded-full ${tickets[ticket.id] > 0 ? 'bg-teal-500' : 'bg-gray-300'
                                                        }`}
                                                    disabled={tickets[ticket.id] === 0}
                                                >
                                                    <Minus className="h-4 w-4 text-white" />
                                                </button>
                                                <span className="mx-4 w-6 text-center">{tickets[ticket.id] || 0}</span>
                                                <button
                                                    onClick={() => handleIncrement(ticket)}
                                                    className={`p-1 rounded-full ${tickets[ticket.id] < ticket.remaining_tickets
                                                        ? 'bg-teal-500'
                                                        : 'bg-gray-300'
                                                        }`}
                                                    disabled={tickets[ticket.id] >= ticket.remaining_tickets}
                                                >
                                                    <Plus className="h-4 w-4 text-white" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* No tickets message */}
            {(!eventData.tickets || eventData.tickets.length === 0) && (
                <div className="container mx-auto max-w-4xl mt-6 px-4">
                    <div className="bg-white rounded-lg p-8 text-center">
                        <p className="text-gray-500 text-lg">No tickets available for this event</p>
                    </div>
                </div>
            )}

            {/* Footer with continue button - only show if tickets exist and can purchase */}
            {eventData.tickets && eventData.tickets.length > 0 && canPurchase && (
                <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
                    <div className="container mx-auto max-w-4xl flex justify-between items-center">
                        <div className="text-teal-500">
                            ({totalSelectedTickets}) tickets selected
                        </div>
                        <button
                            className={`px-6 py-3 rounded-lg flex items-center ${totalSelectedTickets > 0 ? 'bg-teal-500 text-white' : 'bg-gray-300 text-gray-500'
                                }`}
                            disabled={totalSelectedTickets === 0}
                            onClick={() => {
                                // navigate('/purchase/2', { state: { tickets, eventData } });
                                console.log('Navigate to purchase page with:', { tickets, eventData });
                            }}
                        >
                            Continue
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Private Code Modal */}
            <PrivateCodeModal
                isOpen={showPrivateCodeModal}
                onClose={() => {
                    setShowPrivateCodeModal(false);
                    setCurrentTicket(null);
                }}
                onSubmit={handlePrivateCodeSubmit}
                ticketName={currentTicket?.name}
            />
        </div>
    );
}