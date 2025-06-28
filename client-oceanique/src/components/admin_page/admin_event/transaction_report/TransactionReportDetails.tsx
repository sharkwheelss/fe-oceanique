import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, X, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Transaction {
    id: string;
    paymentId: string;
    createdAt: string;
    bookedBy: string;
    status: 'pending' | 'approved' | 'rejected';
    bookedAt: string;
    paymentMethod: string;
    tickets: {
        bookingId: string;
        ticketName: string;
        ticketCategory: string;
        ticketPrice: number;
        totalTickets: number;
        subtotal: number;
    }[];
    totalPayment: number;
    totalTickets: number;
    paymentEvidence?: string;
    rejectionReason?: string;
}

const TransactionDetail = () => {
    const navigate = useNavigate();
    const { transactionId } = useParams(); // Get transaction ID from URL parameters

    // State variables
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    // Sample data - replace with actual API call
    const sampleTransactions: Transaction[] = [
        {
            id: '1',
            paymentId: '5245143414',
            createdAt: '07 Mei 13:00',
            bookedBy: 'Ryyan Ramadhan',
            status: 'pending',
            bookedAt: '07 Mei 2025',
            paymentMethod: 'BCA VA',
            tickets: [
                {
                    bookingId: '078340551',
                    ticketName: 'Ticket ABC',
                    ticketCategory: 'VIP 1',
                    ticketPrice: 200000,
                    totalTickets: 1,
                    subtotal: 200000
                },
                {
                    bookingId: '078340552',
                    ticketName: 'Ticket DEF',
                    ticketCategory: 'VIP 2',
                    ticketPrice: 1000000,
                    totalTickets: 2,
                    subtotal: 2000000
                }
            ],
            totalPayment: 2200000,
            totalTickets: 3,
            paymentEvidence: 'https://via.placeholder.com/400x600/059669/ffffff?text=Payment+Evidence'
        },
        {
            id: '2',
            paymentId: '5245143413',
            createdAt: '01 Januari 13:00',
            bookedBy: 'Ryyan Ramadhan',
            status: 'approved',
            bookedAt: '01 Januari 2025',
            paymentMethod: 'BCA VA',
            tickets: [
                {
                    bookingId: '078340553',
                    ticketName: 'Ticket GHI',
                    ticketCategory: 'Regular',
                    ticketPrice: 150000,
                    totalTickets: 2,
                    subtotal: 300000
                }
            ],
            totalPayment: 300000,
            totalTickets: 2
        }
    ];

    useEffect(() => {
        const fetchTransactionDetails = async () => {
            if (!transactionId) {
                setError('Transaction ID is required');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Simulate API call - replace with actual API call
                setTimeout(() => {
                    const foundTransaction = sampleTransactions.find(t => t.id === transactionId);
                    if (foundTransaction) {
                        setTransaction(foundTransaction);
                    } else {
                        setError('Transaction not found');
                    }
                    setLoading(false);
                }, 1000);

            } catch (error) {
                console.error('Error fetching transaction details:', error);
                setError('Failed to load transaction details. Please try again.');
                setLoading(false);
            }
        };

        fetchTransactionDetails();
    }, [transactionId]);

    const handleStatusChange = (newStatus: 'approved' | 'rejected', reason?: string) => {
        if (transaction) {
            const updatedTransaction = {
                ...transaction,
                status: newStatus,
                rejectionReason: reason
            };
            setTransaction(updatedTransaction);

            // Here you would typically make an API call to update the transaction status
            console.log('Updating transaction status:', { transactionId, newStatus, reason });
        }
    };

    const handleReject = () => {
        if (transaction && rejectionReason.trim()) {
            handleStatusChange('rejected', rejectionReason);
            setShowRejectModal(false);
            setRejectionReason('');
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex-1 bg-gray-50">
                <div className="bg-white border-b border-gray-200 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate('/admin/tickets/transactions-report')}
                                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-800">Transaction Detail</h1>
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
                                onClick={() => navigate('/admin/tickets/transactions-report')}
                                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-800">Transaction Detail</h1>
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

    // No transaction data
    if (!transaction) {
        return (
            <div className="flex-1 bg-gray-50">
                <div className="bg-white border-b border-gray-200 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate('/admin/tickets/transactions-report')}
                                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <h1 className="text-2xl font-semibold text-gray-800">Transaction Detail</h1>
                        </div>
                    </div>
                </div>
                <div className="p-8">
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg">Transaction not found</div>
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
                            onClick={() => navigate('/admin/tickets/transactions-report')}
                            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h1 className="text-2xl font-semibold text-gray-800">Transaction Detail</h1>
                    </div>
                </div>
            </div>

            <div className="p-8">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <div className="space-y-8">
                        {/* Transaction Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment ID
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 border border-gray-200">
                                    {transaction.paymentId}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg border border-gray-200">
                                    <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full mr-2 ${transaction.status === 'approved' ? 'bg-green-500' :
                                            transaction.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                                            }`}></div>
                                        <span className="text-sm text-gray-700 capitalize">
                                            {transaction.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Created At
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 border border-gray-200">
                                    {transaction.createdAt}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Booked by
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 border border-gray-200">
                                    {transaction.bookedBy}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Booked at
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 border border-gray-200">
                                    {transaction.bookedAt}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Method
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 border border-gray-200">
                                    {transaction.paymentMethod}
                                </div>
                            </div>
                        </div>

                        {/* Payment Evidence Section */}
                        {transaction.paymentEvidence && transaction.status === 'pending' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">
                                    Payment Evidence
                                </label>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div>
                                        <img
                                            src={transaction.paymentEvidence}
                                            alt="Payment Evidence"
                                            className="w-full max-w-md rounded-lg border border-gray-200 shadow-sm"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                            <h4 className="font-semibold text-gray-900 mb-4">Review Payment Evidence</h4>
                                            <p className="text-gray-600 mb-6">
                                                Please review the payment evidence submitted by the customer and decide whether to approve or reject this transaction.
                                            </p>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleStatusChange('approved')}
                                                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                                >
                                                    <Check className="w-4 h-4" />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => setShowRejectModal(true)}
                                                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Rejection Reason Display */}
                        {transaction.status === 'rejected' && transaction.rejectionReason && (
                            <div>
                                <label className="block text-sm font-medium text-red-700 mb-2">
                                    Rejection Reason
                                </label>
                                <div className="w-full px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-800">
                                    {transaction.rejectionReason}
                                </div>
                            </div>
                        )}

                        {/* Tickets Table */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                Ticket Details
                            </label>
                            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BOOKING ID</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TICKET NAME</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CATEGORY</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRICE</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QTY</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUBTOTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {transaction.tickets.map((ticket, index) => (
                                            <tr key={index} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                                <td className="px-4 py-3 text-sm text-gray-900">{ticket.bookingId}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900">{ticket.ticketName}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900">{ticket.ticketCategory}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(ticket.ticketPrice)}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900">{ticket.totalTickets}</td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(ticket.subtotal)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Total Summary */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                Summary
                            </label>
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
                                    <span>Total Payment: {formatCurrency(transaction.totalPayment)}</span>
                                    <span>Total Tickets: {transaction.totalTickets}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rejection Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 border border-gray-300">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Transaction</h3>
                        <p className="text-gray-600 mb-4">
                            Please provide a reason for rejecting this transaction. This will help the customer understand why their payment was not accepted.
                        </p>
                        <div className="mb-4">
                            <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-2">
                                Rejection Reason *
                            </label>
                            <textarea
                                id="rejectionReason"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Enter the reason for rejection..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                rows={4}
                                required
                            />
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionReason('');
                                }}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={!rejectionReason.trim()}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors"
                            >
                                Reject Transaction
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionDetail;