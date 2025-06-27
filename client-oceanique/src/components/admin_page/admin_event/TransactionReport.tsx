import React, { useState } from 'react';
import { Search, Check, X, Eye, Calendar, Users, CreditCard, Clock, CheckCircle, XCircle, ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';

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

const TransactionReport: React.FC = () => {
    const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    // Sample data
    const [transactions, setTransactions] = useState<Transaction[]>([
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
        },
        {
            id: '3',
            paymentId: '5245143412',
            createdAt: '02 Februari 09:00',
            bookedBy: 'Ryyan Ramadhan',
            status: 'approved',
            bookedAt: '02 Februari 2025',
            paymentMethod: 'BCA VA',
            tickets: [
                {
                    bookingId: '078340554',
                    ticketName: 'Ticket JKL',
                    ticketCategory: 'VIP 1',
                    ticketPrice: 200000,
                    totalTickets: 1,
                    subtotal: 200000
                }
            ],
            totalPayment: 200000,
            totalTickets: 1
        },
        {
            id: '4',
            paymentId: '0123781741',
            createdAt: '01 Januari 13:30',
            bookedBy: 'Ryyan Ramadhan',
            status: 'rejected',
            bookedAt: '01 Januari 2024',
            paymentMethod: 'BCA VA',
            tickets: [
                {
                    bookingId: '078340555',
                    ticketName: 'Ticket MNO',
                    ticketCategory: 'Regular',
                    ticketPrice: 100000,
                    totalTickets: 1,
                    subtotal: 100000
                }
            ],
            totalPayment: 100000,
            totalTickets: 1,
            rejectionReason: 'Invalid payment evidence provided'
        }
    ]);

    const handleStatusChange = (transactionId: string, newStatus: 'approved' | 'rejected', reason?: string) => {
        setTransactions(prev =>
            prev.map(transaction =>
                transaction.id === transactionId
                    ? { ...transaction, status: newStatus, rejectionReason: reason }
                    : transaction
            )
        );

        if (selectedTransaction?.id === transactionId) {
            setSelectedTransaction(prev => prev ? { ...prev, status: newStatus, rejectionReason: reason } : null);
        }
    };

    const handleReject = () => {
        if (selectedTransaction && rejectionReason.trim()) {
            handleStatusChange(selectedTransaction.id, 'rejected', rejectionReason);
            setShowRejectModal(false);
            setRejectionReason('');
        }
    };

    const handleView = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setCurrentView('detail');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-4 h-4" />;
            case 'approved':
                return <CheckCircle className="w-4 h-4" />;
            case 'rejected':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const filteredTransactions = transactions.filter(transaction =>
        transaction.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.bookedBy.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const TransactionListView = () => (
        <div className="px-8 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Transaction Report</h1>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative w-80">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    PAYMENT ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    CREATED AT
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    BOOKED BY
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    TOTAL AMOUNT
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    STATUS
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ACTIONS
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center text-gray-500">
                                        No transactions found
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((transaction, index) => (
                                    <tr key={transaction.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {transaction.paymentId}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {transaction.createdAt}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {transaction.bookedBy}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                            {formatCurrency(transaction.totalPayment)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className={`w-2 h-2 rounded-full mr-2 ${transaction.status === 'approved' ? 'bg-green-500' :
                                                    transaction.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                                                    }`}></div>
                                                <span className="text-sm text-gray-700 capitalize">
                                                    {transaction.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleView(transaction)}
                                                    className="p-1 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const TransactionDetailView = () => {
        if (!selectedTransaction) return null;

        return (
            <div className="px-8 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <button
                            onClick={() => setCurrentView('list')}
                            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h1 className="text-2xl font-semibold text-gray-900">Transaction Detail</h1>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-8">
                    <div className="space-y-8">
                        {/* Transaction Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment ID
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-gray-700 border border-gray-200">
                                    {selectedTransaction.paymentId}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full mr-2 ${selectedTransaction.status === 'approved' ? 'bg-green-500' :
                                            selectedTransaction.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                                            }`}></div>
                                        <span className="text-sm text-gray-700 capitalize">
                                            {selectedTransaction.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Created At
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-gray-700 border border-gray-200">
                                    {selectedTransaction.createdAt}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Booked by
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-gray-700 border border-gray-200">
                                    {selectedTransaction.bookedBy}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Booked at
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-gray-700 border border-gray-200">
                                    {selectedTransaction.bookedAt}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Method
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-50 rounded-lg text-gray-700 border border-gray-200">
                                    {selectedTransaction.paymentMethod}
                                </div>
                            </div>
                        </div>

                        {/* Payment Evidence Section */}
                        {selectedTransaction.paymentEvidence && selectedTransaction.status === 'pending' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">
                                    Payment Evidence
                                </label>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div>
                                        <img
                                            src={selectedTransaction.paymentEvidence}
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
                                                    onClick={() => handleStatusChange(selectedTransaction.id, 'approved')}
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
                        {selectedTransaction.status === 'rejected' && selectedTransaction.rejectionReason && (
                            <div>
                                <label className="block text-sm font-medium text-red-700 mb-2">
                                    Rejection Reason
                                </label>
                                <div className="w-full px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-800">
                                    {selectedTransaction.rejectionReason}
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
                                        {selectedTransaction.tickets.map((ticket, index) => (
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
                                    <span>Total Payment: {formatCurrency(selectedTransaction.totalPayment)}</span>
                                    <span>Total Tickets: {selectedTransaction.totalTickets}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderCurrentView = () => {
        switch (currentView) {
            case 'detail':
                return <TransactionDetailView />;
            default:
                return <TransactionListView />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {renderCurrentView()}

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

export default TransactionReport;