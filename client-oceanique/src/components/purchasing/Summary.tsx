import { HelpCircle, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from 'react';

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

function SummaryPage({ selectedTickets, subtotals, total, formatCurrency, timer, eventData, getTicketByName }) {
    // Payment evidence status: 'pending', 'approved', 'rejected'
    const [paymentStatus, setPaymentStatus] = useState('pending'); // This would come from your backend/state management

    // Mock function to simulate admin approval (for demo purposes)
    const simulateApproval = () => setPaymentStatus('approved');
    const simulateRejection = () => setPaymentStatus('rejected');

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

    // Get status configuration
    const getStatusConfig = (status) => {
        switch (status) {
            case 'pending':
                return {
                    color: 'yellow',
                    bgColor: 'bg-yellow-100',
                    textColor: 'text-yellow-700',
                    borderColor: 'border-yellow-200',
                    icon: Clock,
                    label: 'Pending Review',
                    description: 'Your payment evidence is being reviewed by our admin team.'
                };
            case 'approved':
                return {
                    color: 'green',
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-700',
                    borderColor: 'border-green-200',
                    icon: CheckCircle,
                    label: 'Paid',
                    description: 'Your payment has been approved and confirmed.'
                };
            case 'rejected':
                return {
                    color: 'red',
                    bgColor: 'bg-red-100',
                    textColor: 'text-red-700',
                    borderColor: 'border-red-200',
                    icon: XCircle,
                    label: 'Payment Rejected',
                    description: 'Your payment evidence was rejected. Please contact support or resubmit.'
                };
            default:
                return {
                    color: 'gray',
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-700',
                    borderColor: 'border-gray-200',
                    icon: AlertCircle,
                    label: 'Unknown',
                    description: 'Status unknown'
                };
        }
    };

    const statusConfig = getStatusConfig(paymentStatus);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="container mx-auto max-w-6xl px-4">
            {/* Payment Status Banner */}
            <div className={`mb-6 p-4 rounded-lg border ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <StatusIcon className={`h-6 w-6 mr-3 ${statusConfig.textColor}`} />
                        <div>
                            <h3 className={`font-semibold ${statusConfig.textColor}`}>
                                Payment Status: {statusConfig.label}
                            </h3>
                            <p className={`text-sm ${statusConfig.textColor} mt-1`}>
                                {statusConfig.description}
                            </p>
                        </div>
                    </div>

                    {/* Show timer only for pending status */}
                    {paymentStatus === 'pending' && (
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Review in progress</p>
                            <p className="text-lg font-bold text-orange-600">
                                Usually within 24 hours
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Demo buttons - remove in production */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-sm text-gray-600 mb-2">Demo Controls (Remove in production):</p>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPaymentStatus('pending')}
                        className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                    >
                        Set Pending
                    </button>
                    <button
                        onClick={simulateApproval}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                    >
                        Approve
                    </button>
                    <button
                        onClick={simulateRejection}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                    >
                        Reject
                    </button>
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-6">Your Ticket(s)</h2>

            {/* Tickets */}
            {Object.entries(selectedTickets).map(([ticketName, quantity]) => {
                if (quantity > 0) {
                    const ticket = getTicketByName(ticketName);

                    // Generate payment ID based on status
                    const paymentId = paymentStatus === 'approved' ? '42342243' : '52451434';

                    // Generate booking ID from ticket ID and payment ID
                    const bookingId = `${ticket?.id || '0105042501'}-${paymentId}`;

                    // Determine ticket visual state
                    const getTicketBarColor = () => {
                        switch (paymentStatus) {
                            case 'approved': return 'bg-teal-500';
                            case 'rejected': return 'bg-red-500';
                            default: return 'bg-yellow-400';
                        }
                    };

                    return (
                        <div key={ticketName} className="mb-6 bg-white rounded-lg overflow-hidden shadow-sm border">
                            <div className="flex">
                                {/* Left colored bar with QR code */}
                                <div className={`${getTicketBarColor()} w-24 md:w-32 p-4 flex flex-col items-center justify-center`}>
                                    <div className="w-20 h-20 bg-white rounded p-2 mb-2">
                                        <QRCodeGenerator
                                            bookingId={bookingId}
                                            size={80}
                                        />
                                    </div>
                                    <p className="text-xs text-center text-white font-medium">
                                        ID: {ticket?.id || '0105042501'}
                                    </p>
                                </div>

                                {/* Ticket details */}
                                <div className="p-4 flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-grow">
                                            <div className="flex items-center mb-2">
                                                <h3 className="font-semibold text-lg">{ticketName}</h3>
                                                <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium flex items-center ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                                                    <div className={`w-2 h-2 rounded-full mr-2 ${paymentStatus === 'approved' ? 'bg-green-500' :
                                                        paymentStatus === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                                                        }`}></div>
                                                    {statusConfig.label}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                                when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                                                    {ticket?.type || 'Standard'}
                                                </span>
                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                                    {ticket?.date || '26 April 2025'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-right ml-4">
                                            <p className="text-sm font-medium text-gray-700">
                                                Payment ID: {paymentId}
                                            </p>
                                            <p className="text-orange-500 text-sm mt-1 font-medium">
                                                {quantity} ticket(s)
                                            </p>
                                            <p className="text-sm mt-3 text-gray-600">
                                                Payment Method: BCA VA
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {paymentStatus === 'approved' ? 'Success at 05-04-2025 13:29' :
                                                    paymentStatus === 'rejected' ? 'Rejected at 05-04-2025 13:29' :
                                                        'Submitted at 05-04-2025 13:29'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
                return null;
            })}

            {/* Subtotals */}
            <div className="space-y-2 mb-4">
                {Object.entries(selectedTickets).map(([ticketName, quantity]) => {
                    if (quantity > 0) {
                        return (
                            <div key={`subtotal-${ticketName}`} className="flex justify-end">
                                <p className="text-gray-700">
                                    Subtotal: {formatCurrency(subtotals[ticketName])}
                                </p>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>

            {/* Total and action buttons */}
            <div className="flex justify-between items-center mb-8">
                <div className="text-2xl text-teal-500 font-bold">
                    Total: {formatCurrency(total)}
                </div>
                <div className="flex space-x-4">
                    {paymentStatus === 'rejected' && (
                        <button className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors">
                            Resubmit Payment
                        </button>
                    )}
                    {paymentStatus === 'pending' && (
                        <button className="px-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors">
                            Cancel Order
                        </button>
                    )}
                    <button className="px-6 py-3 rounded-lg bg-teal-500 hover:bg-teal-600 text-white flex items-center font-medium transition-colors">
                        Contact Support
                        <HelpCircle className="ml-2 h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Status-specific additional information */}
            {paymentStatus === 'pending' && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Our admin team will review your payment evidence</li>
                        <li>• You'll receive an email notification once reviewed</li>
                        <li>• Review process typically takes 2-24 hours</li>
                        <li>• Your tickets will be activated once payment is approved</li>
                    </ul>
                </div>
            )}

            {paymentStatus === 'approved' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Payment Confirmed!</h4>
                    <p className="text-sm text-green-700">
                        Your payment has been successfully verified. Your tickets are now active and ready to use.
                        You can download or print your tickets from your account.
                    </p>
                </div>
            )}

            {paymentStatus === 'rejected' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-2">Payment Evidence Rejected</h4>
                    <p className="text-sm text-red-700 mb-2">
                        Your payment evidence could not be verified. Common reasons include:
                    </p>
                    <ul className="text-sm text-red-700 space-y-1">
                        <li>• Incorrect payment amount</li>
                        <li>• Unclear or unreadable screenshot</li>
                        <li>• Payment to wrong account</li>
                        <li>• Expired payment deadline</li>
                    </ul>
                    <p className="text-sm text-red-700 mt-2">
                        Please resubmit with correct payment evidence or contact support for assistance.
                    </p>
                </div>
            )}

            {/* Transaction recorded notice */}
            <div className="flex justify-center">
                <div className="w-full max-w-4xl px-4 py-3 border-t border-b border-dashed border-gray-300 text-center">
                    <p className="text-gray-600">This transaction has been recorded in your transaction history.</p>
                </div>
            </div>
        </div>
    );
}

export default SummaryPage;