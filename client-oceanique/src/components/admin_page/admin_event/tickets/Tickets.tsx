import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { useTickets } from '../../../../context/TicketContext';
import DialogMessage from '../../../../components/helper/DialogMessage';
import { useDialog } from '../../../../components/helper/useDialog';

const TicketList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { getAdminTicket, adminDeleteTicket } = useTickets();
    const [dialogState, { showSuccess, showError, showWarning, closeDialog, showInfo }] = useDialog();

    // Extract fetchTickets function so it can be reused
    const fetchTickets = async () => {
        try {
            setLoading(true);
            setError(null);

            const ticketsResponse = await getAdminTicket();

            if (ticketsResponse.message && !ticketsResponse.data) {
                showInfo(
                    'No Bank Account Found',
                    ticketsResponse.message,
                    {
                        showCancel: false,
                        onConfirm: () => {
                            closeDialog();
                            navigate('/profile')
                        }
                    }
                );
                setTickets([]);
            } else {
                setTickets(ticketsResponse.data || []);
            }

        } catch (error) {
            console.error('Error fetching tickets:', error);
            setTickets([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleDelete = async (ticketId, ticketName) => {
        // First show confirmation dialog
        showWarning(
            'Delete Ticket',
            `Are you sure you want to delete "${ticketName}"? This action cannot be undone.`,
            {
                showCancel: true,
                confirmText: 'Delete',
                cancelText: 'Cancel',
                onConfirm: async () => {
                    // Close the warning dialog first
                    closeDialog();

                    try {
                        // Perform the delete operation
                        const result = await adminDeleteTicket(ticketId);

                        // Check if the deletion was successful
                        if (result.success) {
                            showSuccess(
                                'Delete Ticket Successful',
                                `"${ticketName}" has been deleted successfully.`,
                                {
                                    showCancel: false,
                                    onConfirm: async () => {
                                        closeDialog();
                                        await fetchTickets();
                                    }
                                }
                            );
                        } else {
                            showError(
                                'Delete Ticket Failed',
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
                        console.error('Delete error:', error);
                        showError(
                            'Delete Ticket Failed',
                            'An unexpected error occurred while deleting the ticket.',
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
            case 'sold out':
                return 'bg-red-100 text-red-700';
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
            default:
                return status;
        }
    };

    const filteredTickets = tickets?.filter(ticket =>
        ticket.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <h1 className="text-2xl font-semibold text-gray-800">Ticket List</h1>
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
                                                    {ticket.event_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                        {ticket.category_name}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(ticket.date)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <span className={`font-medium ${(ticket.quota - ticket.sold) <= 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                                        {ticket.quota - ticket.sold}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatPrice(ticket.price)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor((ticket.quota - ticket.sold) > 0 ? "active" : "sold out")}`}>
                                                        {getStatusText((ticket.quota - ticket.sold) > 0 ? "active" : "sold out")}
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
                                                            onClick={() => handleDelete(ticket.id, ticket.name)}
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