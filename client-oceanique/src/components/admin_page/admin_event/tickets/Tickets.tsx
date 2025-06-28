import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const TicketList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mock data for demonstration - replace with actual API calls
    const mockTickets = [
        {
            id: '1',
            name: 'Ticket one plus',
            description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            parentEvent: 'Summer Party GSC 2',
            category: 'VIP',
            quota: 30,
            price: 200000,
            validDate: '2025-05-07',
            status: 'active'
        },
        {
            id: '2',
            name: 'Ticket secondary',
            description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            parentEvent: 'Summer Party GSC 1',
            category: 'Exclusive',
            quota: 0,
            price: 1000000,
            validDate: '2024-01-01',
            status: 'sold_out'
        },
        {
            id: '3',
            name: 'Regular Access',
            description: 'Standard access ticket for general admission to the event.',
            parentEvent: 'Winter Festival',
            category: 'Regular',
            quota: 100,
            price: 50000,
            validDate: '2025-12-15',
            status: 'active'
        }
    ];

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setLoading(true);
                setError(null);

                // Simulate API call - replace with actual API call
                await new Promise(resolve => setTimeout(resolve, 500));

                // Replace this with actual API call
                // const ticketsResponse = await getAdminTickets();
                // setTickets(ticketsResponse.data || ticketsResponse);

                setTickets(mockTickets);
            } catch (error) {
                console.error('Error fetching tickets:', error);
                setError('Failed to load tickets. Please try again.');
                setTickets([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    const handleDelete = async (ticketId) => {
        const confirmed = window.confirm('🗑️ Are you sure you want to delete this ticket?\nThis action cannot be undone.');
        if (!confirmed) return;

        try {
            // Replace with actual API call
            // const result = await adminDeleteTicket(ticketId);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
            toast.success('✅ Ticket deleted successfully');

        } catch (error) {
            console.error('Delete error:', error);
            toast.error('🚫 An error occurred while deleting the ticket.');
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-700';
            case 'sold_out':
                return 'bg-red-100 text-red-700';
            case 'expired':
                return 'bg-gray-100 text-gray-700';
            case 'inactive':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-slate-100 text-slate-600';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active':
                return 'Active';
            case 'sold_out':
                return 'Sold Out';
            case 'expired':
                return 'Expired';
            case 'inactive':
                return 'Inactive';
            default:
                return status;
        }
    };

    const filteredTickets = tickets?.filter(ticket =>
        ticket.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className="flex-1 bg-gray-50">
            <div className="bg-white border-b border-gray-200 px-8 py-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">Ticket List</h1>
                </div>
            </div>

            <div className="p-8">
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">Error: {error}</p>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <div className="relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search tickets..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-80"
                                />
                            </div>
                            <button
                                onClick={() => navigate('/admin/tickets/create')}
                                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center"
                                disabled={loading}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Ticket
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                                <span className="ml-2 text-gray-600">Loading tickets...</span>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ticket Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Parent Event
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Valid Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quota
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
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
                                    {filteredTickets.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                                {loading ? 'Loading...' : 'No tickets found'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredTickets.map((ticket) => (
                                            <tr key={ticket.id} className="hover:bg-gray-50">
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer hover:text-teal-600"
                                                    onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                                                >
                                                    {ticket.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {ticket.parentEvent}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                        {ticket.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(ticket.validDate)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <span className={`font-medium ${ticket.quota <= 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                                        {ticket.quota}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatPrice(ticket.price)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                                        {getStatusText(ticket.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => navigate(`/admin/tickets/${ticket.id}/edit`)}
                                                            className="text-teal-600 hover:text-teal-900 transition-colors"
                                                            title="Edit ticket"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(ticket.id)}
                                                            className="text-red-600 hover:text-red-900 transition-colors"
                                                            title="Delete ticket"
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

export default TicketList;