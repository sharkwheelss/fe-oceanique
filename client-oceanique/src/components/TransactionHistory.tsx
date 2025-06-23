import React, { useState, useEffect, useRef } from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import { useEvents } from '../context/EventContext';

// QR Code Generator Component
function QRCodeGenerator({ bookingId, size = 80 }) {
    const canvasRef = useRef(null);
    const [fallbackUrl, setFallbackUrl] = useState('');

    useEffect(() => {
        if (bookingId) {
            // Try to use QRCode library if available
            if (typeof window !== 'undefined' && window.QRCode) {
                window.QRCode.toCanvas(canvasRef.current, bookingId, {
                    width: size,
                    margin: 1,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                }, (error) => {
                    if (error) {
                        console.error('QR Code generation error:', error);
                        // Fallback to API
                        setFallbackUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(bookingId)}`);
                    }
                });
            } else {
                // Fallback to API if QRCode library not available
                setFallbackUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(bookingId)}`);
            }
        }
    }, [bookingId, size]);

    return (
        <div className="w-full h-full flex items-center justify-center">
            {fallbackUrl ? (
                <img
                    src={fallbackUrl}
                    alt={`QR Code for booking ${bookingId}`}
                    className="w-full h-full rounded"
                    style={{ maxWidth: `${size}px`, maxHeight: `${size}px` }}
                    onError={(e) => {
                        // Final fallback to placeholder
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%23666' font-size='12'%3EQR%3C/text%3E%3C/svg%3E";
                    }}
                />
            ) : (
                <canvas
                    ref={canvasRef}
                    className="w-full h-full rounded"
                    style={{ maxWidth: `${size}px`, maxHeight: `${size}px` }}
                />
            )}
        </div>
    );
}

/**
 * TransactionHistoryPage - Main component for the transaction history page
 * Displays user's ticket transactions with different status tabs (Pending, Cancelled, Approved)
 */
const TransactionHistoryPage = () => {
    // State for active tab (pending, cancelled, approved)
    const [activeTab, setActiveTab] = useState('pending');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getTransactionHistory } = useEvents();

    // API response interface
    interface ApiTransaction {
        id: number;
        group_booking_id: number;
        booked_at: string;
        total_tickets: number;
        subtotal: number;
        status: 'pending' | 'rejected' | 'approved';
        payment_method: string;
        updated_at: string;
        total_payment: number;
        users_id: number;
        tickets_id: number;
    }

    interface ApiResponse {
        message: string;
        data: ApiTransaction[];
    }

    // Internal interfaces
    interface Ticket {
        name: string;
        ticketId: string;
        type: string;
        date: string;
        quantity: number;
        price: number;
        status: 'pending' | 'rejected' | 'approved';
        paymentMethod: string;
        cancelDate?: string;
        successDate?: string;
        apiId: number;
    }

    interface Transaction {
        id: string;
        group_booking_id: number;
        tickets: Ticket[];
        totalPrice: number;
        status: 'pending' | 'rejected' | 'approved';
        timeRemaining?: string;
        booked_at: string;
        updated_at: string;
    }


    // Transform API data to component format
    const transformApiData = (apiData: ApiTransaction[]): Transaction[] => {
        // Group transactions by group_booking_id
        const groupedTransactions = apiData.reduce((acc, transaction) => {
            const groupId = transaction.group_booking_id.toString();
            if (!acc[groupId]) {
                acc[groupId] = [];
            }
            acc[groupId].push(transaction);
            return acc;
        }, {} as Record<string, ApiTransaction[]>);

        // Transform grouped transactions
        return Object.entries(groupedTransactions).map(([groupId, groupTransactions]) => {
            const firstTransaction = groupTransactions[0];

            // Create tickets from grouped transactions
            const tickets: Ticket[] = groupTransactions.map((transaction, index) => ({
                name: `Event Ticket ${transaction.tickets_id}`,
                ticketId: transaction.id.toString(),
                type: transaction.tickets_id === 2 ? 'Standard' : 'VIP',
                date: new Date(transaction.booked_at).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                }),
                quantity: transaction.total_tickets,
                price: transaction.total_payment,
                status: transaction.status,
                paymentMethod: transaction.payment_method,
                cancelDate: transaction.status === 'rejected' ?
                    new Date(transaction.updated_at).toLocaleString('en-US', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : undefined,
                successDate: transaction.status === 'approved' ?
                    new Date(transaction.updated_at).toLocaleString('en-US', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : undefined,
                apiId: transaction.id
            }));

            // Calculate total price
            const totalPrice = groupTransactions.reduce((sum, t) => sum + t.total_payment, 0);

            return {
                id: groupId,
                group_booking_id: firstTransaction.group_booking_id,
                tickets,
                totalPrice,
                status: firstTransaction.status,
                timeRemaining: firstTransaction.status === 'pending' ? '59.00' : undefined,
                booked_at: firstTransaction.booked_at,
                updated_at: firstTransaction.updated_at
            };
        });
    };

    // Load QRCode library dynamically
    useEffect(() => {
        if (typeof window !== 'undefined' && !window.QRCode) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js';
            script.onload = () => {
                // QRious is now available as window.QRious
                window.QRCode = {
                    toCanvas: (canvas, text, options, callback) => {
                        try {
                            const qr = new window.QRious({
                                element: canvas,
                                value: text,
                                size: options.width || 128,
                                background: options.color?.light || '#FFFFFF',
                                foreground: options.color?.dark || '#000000'
                            });
                            if (callback) callback(null);
                        } catch (error) {
                            if (callback) callback(error);
                        }
                    }
                };
            };
            document.head.appendChild(script);
        }
    }, []);

    // Load transactions on component mount
    useEffect(() => {
        const loadTransactions = async () => {
            try {
                setLoading(true);
                const response = await getTransactionHistory();
                console.log('API Response:', response);
                const transformedData = transformApiData(response);
                setTransactions(transformedData);
            } catch (error) {
                console.error('Error loading transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        loadTransactions();
    }, []);

    /**
     * Filters transactions based on the active tab
     * @returns {Array} Filtered transactions based on status
     */
    const getFilteredTransactions = (): Transaction[] => {
        return transactions.filter(transaction => transaction.status === activeTab);
    };

    /**
     * Format price to rupiah format
     * @param {number} price - Price to format
     * @returns {string} Formatted price
     */
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('id-ID').format(price);
    };

    /**
     * Get the color style for status badge
     * @param {string} status - Transaction status
     * @returns {string} Tailwind CSS classes for the status badge
     */
    type TransactionStatus = 'pending' | 'rejected' | 'approved';

    const getStatusColor = (status: TransactionStatus): string => {
        const statusColorMap: Record<TransactionStatus, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            rejected: 'bg-red-100 text-red-800',
            approved: 'bg-green-100 text-green-800',
        };
        return statusColorMap[status] || 'bg-gray-100 text-gray-800';
    };

    /**
     * Handle tab change
     * @param {string} tab - Tab name
     */
    const handleTabChange = (tab: TransactionStatus): void => {
        setActiveTab(tab);
    };

    /**
     * Render a ticket card
     * @param {Object} ticket - Ticket information
     * @param {string} transactionId - Parent transaction ID
     * @returns {JSX.Element} Ticket card component
     */
    const renderTicketCard = (ticket: Ticket, transactionId: string): JSX.Element => {
        const statusColor = getStatusColor(ticket.status);

        // Select accent color for left ticket border based on status
        const borderColor =
            ticket.status === 'pending' ? 'bg-yellow-500' :
                ticket.status === 'rejected' ? 'bg-red-500' : 'bg-green-500';

        return (
            <div key={ticket.ticketId} className="flex mb-4 border border-gray-300 border-opacity-50 rounded-lg overflow-hidden shadow-sm">
                {/* Left colored border */}
                <div className={`w-4 ${borderColor}`}></div>

                <div className="flex flex-1 p-4">
                    {/* QR Code */}
                    <div className="w-32 h-32 mr-4">
                        <div className="w-full h-full bg-white border border-gray-300 border-opacity-50 flex items-center justify-center">
                            <QRCodeGenerator
                                bookingId={ticket.ticketId}
                                size={100}
                            />
                        </div>
                    </div>

                    {/* Ticket info */}
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-semibold">{ticket.name}</h3>
                                {ticket.status !== 'pending' && (
                                    <div className="inline-flex items-center mt-1">
                                        <span className={`px-2 py-1 text-xs rounded-full ${statusColor}`}>
                                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="text-right">
                                <div className="text-gray-700">GRPTRX-{transactionId}</div>
                                <div className="text-orange-500 mt-1">
                                    {ticket.quantity} ticket(s)
                                </div>
                            </div>
                        </div>

                        {/* Ticket description */}
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
                                <div>Payment Method: {ticket.paymentMethod}</div>
                                {ticket.status === 'rejected' && ticket.cancelDate && (
                                    <div>Cancelled at {ticket.cancelDate}</div>
                                )}
                                {ticket.status === 'approved' && ticket.successDate && (
                                    <div>Success at {ticket.successDate}</div>
                                )}
                            </div>
                        </div>

                        {/* ID */}
                        <div className="mt-2 text-sm text-gray-500">
                            IDTRX-{ticket.ticketId}
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
    const renderTransaction = (transaction: Transaction): JSX.Element => {
        // Pending transactions show a payment countdown
        const showCountdown = transaction.status === 'pending';

        return (
            <div key={transaction.id} className="mb-8 border border-gray-300 border-opacity-50 rounded-lg overflow-hidden">

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

                </div>
            </div>
        );
    };

    // Loading state
    if (loading) {
        return (
            <div className="max-h-screen">
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Loading transactions...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-h-screen">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 sticky top-[72px] z-40 bg-white">
                {(['pending', 'rejected', 'approved'] as TransactionStatus[]).map((tab) => (
                    <button
                        key={tab}
                        className={`px-6 py-3 font-medium capitalize ${activeTab === tab
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
                {getFilteredTransactions().length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No {activeTab} transactions found.
                    </div>
                ) : (
                    getFilteredTransactions().map(transaction => renderTransaction(transaction))
                )}
            </div>
        </div>
    );
};

export default TransactionHistoryPage;