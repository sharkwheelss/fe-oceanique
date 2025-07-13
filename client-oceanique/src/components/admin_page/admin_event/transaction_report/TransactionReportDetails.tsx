import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, X, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useTickets } from '../../../../context/TicketContext';
import DialogMessage from '../../../../components/helper/DialogMessage';
import { useDialog } from '../../../../components/helper/useDialog';

// Define the transaction interface based on API response
interface TicketDetail {
    booking_id: number;
    ticket_name: string;
    category: string;
    price: number;
    total_tickets: number;
    subtotal: number;
}

interface Transaction {
    id: number;
    group_booking_id: number;
    booked_at: string;
    booked_by: string;
    payment_method: string;
    total_payment: number;
    total_tickets: number;
    status: string;
    rejection_reason: string | null;
    payment_evidence_path: string;
    ticket_details: TicketDetail[];
}

const TransactionDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // State variables
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [updating, setUpdating] = useState(false);

    const { getAdminTransactionReportById, adminUpdateTransactionReport } = useTickets();
    const [dialogState, { showSuccess, showError, showWarning, closeDialog }] = useDialog();

    useEffect(() => {
        const fetchTransactionDetails = async () => {
            if (!id) {
                setError('Group booking ID is required');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await getAdminTransactionReportById(parseInt(id));

                if (response) {
                    setTransaction(response[0]);
                } else {
                    setError('Transaction not found');
                }

            } catch (error) {
                console.error('Error fetching transaction details:', error);
                setError('Failed to load transaction details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactionDetails();
    }, [id]);

    const handleStatusChange = async (newStatus: 'approved' | 'rejected', reason?: string) => {
        if (!transaction) return;

        try {
            setUpdating(true);

            // Call the API to update transaction status
            await adminUpdateTransactionReport(
                transaction.group_booking_id,
                newStatus,
                reason || ''
            );

            // Update local state
            setTransaction(prev => prev ? {
                ...prev,
                status: newStatus,
                rejection_reason: reason || null
            } : null);

            // Show success dialog
            const statusText = newStatus === 'approved' ? 'approved' : 'rejected';
            showSuccess(
                `Transaction ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}`,
                `Transaction has been ${statusText} successfully.`,
                {
                    showCancel: false,
                    onConfirm: () => {
                        closeDialog();
                    }
                }
            );

        } catch (error) {
            console.error('Error updating transaction status:', error);
            showError(
                'Update Failed',
                'Failed to update transaction status. Please try again.',
                {
                    showCancel: false,
                    onConfirm: () => {
                        closeDialog();
                    }
                }
            );
        } finally {
            setUpdating(false);
        }
    };

    const handleApprove = () => {
        showWarning(
            'Approve Transaction',
            'Are you sure you want to approve this transaction? This action cannot be undone.',
            {
                showCancel: true,
                confirmText: 'Approve',
                cancelText: 'Cancel',
                onConfirm: async () => {
                    closeDialog();
                    await handleStatusChange('approved');
                }
            }
        );
    };

    const handleRejectConfirm = () => {
        if (!rejectionReason.trim()) {
            showError(
                'Rejection Reason Required',
                'Please provide a reason for rejecting this transaction.',
                {
                    showCancel: false,
                    onConfirm: () => {
                        closeDialog();
                    }
                }
            );
            return;
        }

        showWarning(
            'Reject Transaction',
            `Are you sure you want to reject this transaction with the reason: "${rejectionReason}"? This action cannot be undone.`,
            {
                showCancel: true,
                confirmText: 'Reject',
                cancelText: 'Cancel',
                onConfirm: async () => {
                    closeDialog();
                    await handleStatusChange('rejected', rejectionReason);
                    setRejectionReason('');
                }
            }
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                                    Group Booking ID
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 border border-gray-200">
                                    {transaction.group_booking_id}
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
                                    Booked At
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 border border-gray-200">
                                    {formatDate(transaction.booked_at)}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Booked By
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 border border-gray-200">
                                    {transaction.booked_by}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Method
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 border border-gray-200">
                                    {transaction.payment_method}
                                </div>
                            </div>
                        </div>

                        {/* Payment Evidence Section */}
                        {transaction.payment_evidence_path && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">
                                    Payment Evidence
                                </label>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div>
                                        <img
                                            src={transaction.payment_evidence_path}
                                            alt="Payment Evidence"
                                            className="w-full max-w-md rounded-lg border border-gray-200 shadow-sm"
                                            onError={(e) => {
                                                e.currentTarget.src = '/placeholder-image.png';
                                                e.currentTarget.alt = 'Payment evidence not available';
                                            }}
                                        />
                                    </div>
                                    {transaction.status === 'pending' && (
                                        <div className="flex flex-col justify-center">
                                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                                <h4 className="font-semibold text-gray-900 mb-4">Review Payment Evidence</h4>
                                                <p className="text-gray-600 mb-6">
                                                    Please review the payment evidence submitted by the customer and decide whether to approve or reject this transaction.
                                                </p>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Rejection Reason (if rejecting)
                                                    </label>
                                                    <textarea
                                                        value={rejectionReason}
                                                        onChange={(e) => setRejectionReason(e.target.value)}
                                                        placeholder="Enter the reason for rejection..."
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                                        rows={3}
                                                    />
                                                </div>
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={handleApprove}
                                                        disabled={updating}
                                                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        {updating ? 'Approving...' : 'Approve'}
                                                    </button>
                                                    <button
                                                        onClick={handleRejectConfirm}
                                                        disabled={updating}
                                                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Rejection Reason Display */}
                        {transaction.status === 'rejected' && transaction.rejection_reason && (
                            <div>
                                <label className="block text-sm font-medium text-red-700 mb-2">
                                    Rejection Reason
                                </label>
                                <div className="w-full px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-800">
                                    {transaction.rejection_reason}
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
                                        {transaction.ticket_details.map((ticket, index) => (
                                            <tr key={index} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                                <td className="px-4 py-3 text-sm text-gray-900">{ticket.booking_id}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900">{ticket.ticket_name}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900">{ticket.category}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(ticket.price)}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900">{ticket.total_tickets}</td>
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
                                    <span>Total Payment: {formatCurrency(transaction.total_payment)}</span>
                                    <span>Total Tickets: {transaction.total_tickets}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetail;