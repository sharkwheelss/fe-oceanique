import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Edit, MapPin, Tag, Users, DollarSign } from 'lucide-react';

// Types
interface Ticket {
    id: string;
    name: string;
    description: string;
    parentEvent: string;
    category: string;
    quota: number;
    price: number;
    validDate: string;
    sold?: number;
    status?: string;
}

// Mock data for demonstration
const mockTickets: Ticket[] = [
    {
        id: '1',
        name: 'Ticket one plus',
        description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        parentEvent: 'Summer Party GSC 2',
        category: 'VIP',
        quota: 30,
        price: 200000,
        validDate: '2025-05-07',
        sold: 15,
        status: 'active'
    },
    {
        id: '2',
        name: 'Ticket secondary',
        description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
        parentEvent: 'Summer Party GSC 1',
        category: 'Exclusive',
        quota: 50,
        price: 1000000,
        validDate: '2024-01-01',
        sold: 45,
        status: 'sold_out'
    }
];

const TicketDetails = () => {
    const navigate = useNavigate();
    const { ticketId } = useParams(); // Get ticket ID from URL parameters

    // State variables
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTicketDetails = async () => {
            if (!ticketId) {
                setError('Ticket ID is required');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Find ticket by ID (replace with actual API call)
                const foundTicket = mockTickets.find(t => t.id === ticketId);

                if (foundTicket) {
                    setTicket(foundTicket);
                } else {
                    setError('Ticket not found');
                }
            } catch (error) {
                console.error('Error fetching ticket details:', error);
                setError('Failed to load ticket details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchTicketDetails();
    }, [ticketId]);

    const formatDate = (dateString: string) => {
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

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'sold_out':
                return 'bg-red-100 text-red-800';
            case 'inactive':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    const handleEdit = () => {
        navigate(`/admin/tickets/${ticketId}/edit`);
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex-1 bg-gray-50">
                <div className="bg-white border-b border-gray-200 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate('/admin/tickets')}
                                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-800">Ticket Detail</h1>
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
                                onClick={() => navigate('/admin/tickets')}
                                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-800">Ticket Detail</h1>
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

    // No ticket data
    if (!ticket) {
        return (
            <div className="flex-1 bg-gray-50">
                <div className="bg-white border-b border-gray-200 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate('/admin/tickets')}
                                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-800">Ticket Detail</h1>
                        </div>
                    </div>
                </div>
                <div className="p-8">
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg">Ticket not found</div>
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
                            onClick={() => navigate('/admin/tickets')}
                            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h1 className="text-2xl font-semibold text-gray-800">Ticket Detail</h1>
                    </div>
                    <button
                        onClick={handleEdit}
                        className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center"
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Ticket
                    </button>
                </div>
            </div>

            <div className="p-8">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ticket Name
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                                    {ticket.name || 'No name specified'}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Parent Event
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                    {ticket.parentEvent || 'No parent event specified'}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 min-h-24">
                                {ticket.description || 'No description provided'}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 flex items-center">
                                    <Tag className="w-4 h-4 mr-2 text-gray-500" />
                                    {ticket.category || 'No category specified'}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Valid Date
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                    {formatDate(ticket.validDate)}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 flex items-center">
                                    <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                                    {formatPrice(ticket.price)}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quota
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 flex items-center">
                                    <Users className="w-4 h-4 mr-2 text-gray-500" />
                                    {ticket.quota}
                                </div>
                            </div>
                        </div>

                        {/* Additional ticket information if available */}
                        {(ticket.sold !== undefined || ticket.status) && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {ticket.sold !== undefined && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Sold
                                        </label>
                                        <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                                            {ticket.sold}
                                        </div>
                                    </div>
                                )}

                                {ticket.sold !== undefined && ticket.quota && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Remaining
                                        </label>
                                        <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                                            {ticket.quota - ticket.sold}
                                        </div>
                                    </div>
                                )}

                                {ticket.status && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                                {ticket.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Sales Progress Bar */}
                        {ticket.sold !== undefined && ticket.quota && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sales Progress
                                </label>
                                <div className="w-full">
                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                        <span>Sold: {ticket.sold}</span>
                                        <span>Total: {ticket.quota}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${Math.min((ticket.sold / ticket.quota) * 100, 100)}%`
                                            }}
                                        ></div>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {Math.round((ticket.sold / ticket.quota) * 100)}% sold
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetails;