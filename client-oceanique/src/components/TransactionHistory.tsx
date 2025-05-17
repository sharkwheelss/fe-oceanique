import React, { useState } from 'react';
import { Clock, ChevronDown } from 'lucide-react';

/**
 * TransactionHistoryPage - Main component for the transaction history page
 * Displays user's ticket transactions with different status tabs (Pending, Cancelled, Paid)
 */
const TransactionHistoryPage = () => {
    // State for active tab (Pending, Cancelled, Paid)
    const [activeTab, setActiveTab] = useState('Pending');

    // Sample transaction data based on the screenshots
    const transactions = [
        {
            id: '52451434',
            tickets: [
                {
                    name: 'Ticket Apache Epic 1',
                    ticketId: '0105042501',
                    type: 'Standard',
                    date: '26 April 2025',
                    quantity: 1,
                    price: 220000,
                    status: 'Pending',
                    paymentMethod: 'BCA VA'
                },
                {
                    name: 'Ticket Laohi 2',
                    ticketId: '0105042502',
                    type: 'VIP 1',
                    date: '03 May 2025',
                    quantity: 2,
                    price: 2000000,
                    status: 'Pending',
                    paymentMethod: 'BCA VA'
                }
            ],
            totalPrice: 2220000,
            status: 'Pending',
            timeRemaining: '59.00'
        },
        {
            id: '32324345',
            tickets: [
                {
                    name: 'Ticket Apache Epic 1',
                    ticketId: '0105042501',
                    type: 'Standard',
                    date: '26 April 2025',
                    quantity: 1,
                    price: 220000,
                    status: 'Cancelled',
                    paymentMethod: 'BCA VA',
                    cancelDate: '05-04-2025 13.29'
                },
                {
                    name: 'Ticket Laohi 2',
                    ticketId: '0105042502',
                    type: 'VIP 1',
                    date: '03 May 2025',
                    quantity: 2,
                    price: 2000000,
                    status: 'Cancelled',
                    paymentMethod: 'BCA VA',
                    cancelDate: '05-04-2025 13.29'
                }
            ],
            totalPrice: 2220000,
            status: 'Cancelled'
        },
        {
            id: '42342243',
            tickets: [
                {
                    name: 'Ticket Apache Epic 1',
                    ticketId: '0105042501',
                    type: 'Standard',
                    date: '26 April 2025',
                    quantity: 1,
                    price: 220000,
                    status: 'Paid',
                    paymentMethod: 'BCA VA',
                    successDate: '05-04-2025 13.29'
                },
                {
                    name: 'Ticket Laohi 2',
                    ticketId: '0105042502',
                    type: 'VIP 1',
                    date: '03 May 2025',
                    quantity: 2,
                    price: 2000000,
                    status: 'Paid',
                    paymentMethod: 'BCA VA',
                    successDate: '05-04-2025 13.29'
                }
            ],
            totalPrice: 2220000,
            status: 'Paid'
        }
    ];

    /**
     * Filters transactions based on the active tab
     * @returns {Array} Filtered transactions based on status
     */
    const getFilteredTransactions = () => {
        return transactions.filter(transaction => transaction.status === activeTab);
    };

    /**
     * Format price to rupiah format
     * @param {number} price - Price to format
     * @returns {string} Formatted price
     */
    interface Ticket {
        name: string;
        ticketId: string;
        type: string;
        date: string;
        quantity: number;
        price: number;
        status: 'Pending' | 'Cancelled' | 'Paid';
        paymentMethod: string;
        cancelDate?: string;
        successDate?: string;
    }

    interface Transaction {
        id: string;
        tickets: Ticket[];
        totalPrice: number;
        status: 'Pending' | 'Cancelled' | 'Paid';
        timeRemaining?: string;
    }

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('id-ID').format(price);
    };

    /**
     * Get the color style for status badge
     * @param {string} status - Transaction status
     * @returns {string} Tailwind CSS classes for the status badge
     */
    interface StatusColorMap {
        [key: string]: string;
    }

    type TransactionStatus = 'Pending' | 'Cancelled' | 'Paid';

    const getStatusColor = (status: TransactionStatus): string => {
        const statusColorMap: StatusColorMap = {
            Pending: 'bg-yellow-100 text-yellow-800',
            Cancelled: 'bg-red-100 text-red-800',
            Paid: 'bg-green-100 text-green-800',
        };
        return statusColorMap[status] || 'bg-gray-100 text-gray-800';
    };

    /**
     * Handle tab change
     * @param {string} tab - Tab name
     */
    interface TabChangeHandler {
        (tab: TransactionStatus): void;
    }

    const handleTabChange: TabChangeHandler = (tab) => {
        setActiveTab(tab);
    };

    /**
     * Render a ticket card
     * @param {Object} ticket - Ticket information
     * @param {string} transactionId - Parent transaction ID
     * @returns {JSX.Element} Ticket card component
     */
    interface RenderTicketCardProps {
        ticket: Ticket;
        transactionId: string;
    }

    const renderTicketCard = (ticket: Ticket, transactionId: string): JSX.Element => {
        const statusColor = getStatusColor(ticket.status);

        // Select accent color for left ticket border based on status
        const borderColor =
            ticket.status === 'Pending' ? 'bg-yellow-500' :
                ticket.status === 'Cancelled' ? 'bg-red-500' : 'bg-teal-500';

        return (
            <div key={ticket.ticketId} className="flex mb-4 border border-gray-300 border-opacity-50 rounded-lg overflow-hidden shadow-sm">
                {/* Left colored border */}
                <div className={`w-4 ${borderColor}`}></div>

                <div className="flex flex-1 p-4">
                    {/* QR Code */}
                    <div className="w-32 h-32 mr-4">
                        <div className="w-full h-full bg-white border border-gray-300 border-opacity-50 flex items-center justify-center">
                            <img src="qr-code.jpg" alt="QR Code" className="w-28 h-28" />
                        </div>
                    </div>

                    {/* Ticket info */}
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-semibold">{ticket.name}</h3>
                                {ticket.status !== 'Pending' && (
                                    <div className="inline-flex items-center mt-1">
                                        <span className={`px-2 py-1 text-xs rounded-full ${statusColor}`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="text-right">
                                <div className="text-gray-700">Payment ID: {transactionId}</div>
                                <div className="text-orange-500 mt-1">
                                    {ticket.quantity} ticket(s)
                                </div>
                            </div>
                        </div>

                        {/* Ticket description (Lorem ipsum placeholder) */}
                        <p className="text-gray-600 mt-2 text-sm">
                            Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem
                            ipsum has been the industry's standard dummy text ever since the 1500s, when an
                            unknown printer took a galley of type and scrambled it to make a type specimen
                            book. It has survived not only five centuries, but also the leap into electronic
                            typesetting, remaining essentially unchanged.
                        </p>

                        {/* Bottom info */}
                        <div className="flex justify-between mt-4">
                            <div className="flex space-x-2">
                                {/* Ticket type */}
                                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-md text-sm">
                                    {ticket.type}
                                </span>

                                {/* Date */}
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                                    {ticket.date}
                                </span>
                            </div>

                            {/* Payment info */}
                            <div className="text-right text-sm text-gray-600">
                                <div>Payment Method: BCA VA</div>
                                {ticket.status === 'Cancelled' && (
                                    <div>Cancelled at {ticket.cancelDate}</div>
                                )}
                                {ticket.status === 'Paid' && (
                                    <div>Success at {ticket.successDate}</div>
                                )}
                            </div>
                        </div>

                        {/* ID */}
                        <div className="mt-2 text-sm text-gray-500">
                            ID: {ticket.ticketId}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    /**
     * Render transaction section with tickets and total
     * @param {Object} transaction - Transaction data
     * @returns {JSX.Element} Transaction section component
     */
    interface RenderTransactionProps {
        transaction: Transaction;
    }

    const renderTransaction = (transaction: Transaction): JSX.Element => {
        // Pending transactions show a payment countdown
        const showCountdown = transaction.status === 'Pending';

        return (
            <div key={transaction.id} className="mb-8 border border-gray-300 border-opacity-50 rounded-lg overflow-hidden">
                {/* Payment countdown for pending transactions */}
                {showCountdown && (
                    <div className="text-center py-3 border-b border-gray-300 border-opacity-50 flex items-center justify-center">
                        <div className="flex items-center">
                            <span className="font-semibold">Complete Your Payment in </span>
                            <span className="text-red-500 font-semibold ml-1">{transaction.timeRemaining}</span>
                        </div>
                    </div>
                )}

                {/* Transaction heading for pending transactions */}
                {showCountdown && (
                    <div className="px-6 py-4">
                        <h2 className="text-xl font-semibold">Your Ticket(s)</h2>
                    </div>
                )}

                {/* Ticket cards */}
                <div className="p-6">
                    {transaction.tickets.map((ticket: Ticket) => renderTicketCard(ticket, transaction.id))}

                    {/* Total */}
                    <div className="flex justify-end mt-4">
                        <div className="text-right">
                            <div className="text-teal-500 text-xl font-semibold">
                                Total: Rp{formatPrice(transaction.totalPrice)}
                            </div>
                        </div>
                    </div>

                    {/* Action buttons for pending transactions */}
                    {showCountdown && (
                        <div className="flex justify-end mt-6 space-x-4">
                            <button className="px-6 py-3 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition">
                                Cancel
                            </button>
                            <button className="px-6 py-3 bg-teal-500 text-white rounded-md font-medium hover:bg-teal-600 transition flex items-center">
                                How to Pay
                                <span className="ml-1 bg-white bg-opacity-20 rounded-full p-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className=" min-h-screen">
            {/* Main content */}
            {/* Tabs */}
            <div className="flex border-b border-gray-200 sticky top-[72px] z-40 bg-white">
                {(['Pending', 'Cancelled', 'Paid'] as TransactionStatus[]).map((tab) => (
                    <button
                        key={tab}
                        className={`px-6 py-3 font-medium ${activeTab === tab
                            ? 'text-teal-500 border-b-2 border-teal-500'
                            : 'text-gray-500 hover:text-gray-800'
                            }`}
                        onClick={() => handleTabChange(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Sort button */}
            <div className="flex justify-end mb-6">
                <button className="flex items-center px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Sort By</span>
                    <ChevronDown className="w-4 h-4 ml-2" />
                </button>
            </div>

            {/* Transactions list */}
            <div>
                {getFilteredTransactions().map(transaction => renderTransaction(transaction))}
            </div>
        </div>
    );
};

export default TransactionHistoryPage;