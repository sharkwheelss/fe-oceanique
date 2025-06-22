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

function SummaryPage({ responseData, getTicketById, formatCurrency }) {
    // Status is always pending since page can only be opened once
    const paymentStatus = 'pending';

    console.log('response data:', responseData);

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

    // Format date helper
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Calculate total
    const totalAmount = responseData?.bookingResult?.reduce((total, booking) => total + booking.total_payment, 0) || 0;

    // Check if responseData exists and has bookings
    if (!responseData?.bookingResult || responseData.bookingResult.length === 0) {
        return (
            <div className="container mx-auto max-w-6xl px-4">
                <div className="text-center py-8">
                    <p className="text-gray-600">No booking data available.</p>
                </div>
            </div>
        );
    }

    // Status configuration for pending status
    const statusConfig = {
        label: 'Under Review',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800'
    };

    return (
        <div className="container mx-auto max-w-6xl px-4">
            {/* Payment Status Banner */}
            <div className="mb-6 p-4 rounded-lg border border-yellow-200 bg-yellow-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                        <div>
                            <p className="text-yellow-800 font-medium">Payment Under Review</p>
                            <p className="text-yellow-700 text-sm">Your payment evidence is being verified by our team</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-yellow-700">Review in progress</p>
                        <p className="text-lg font-bold text-yellow-800">
                            Usually within 24 hours
                        </p>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-6">Your Ticket(s)</h2>

            {/* Tickets */}
            {responseData?.bookingResult?.map((booking, index) => {
                const ticket = getTicketById ? getTicketById(booking.tickets_id) : null;

                if (!ticket) {
                    return (
                        <div key={booking.id} className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600">Error: Ticket data not found for booking ID {booking.id}</p>
                        </div>
                    );
                }

                // Use the booking ID from response
                const bookingId = booking.id.toString();

                return (
                    <div key={`${booking.id}-${index}`} className="mb-6 bg-white rounded-lg overflow-hidden shadow-md">
                        <div className="flex">
                            {/* Left colored bar with QR code - Always yellow for pending */}
                            <div className="bg-yellow-400 w-24 md:w-32 p-4 flex flex-col items-center justify-center">
                                <div className="w-20 h-20 bg-white rounded p-2 mb-2">
                                    <QRCodeGenerator
                                        bookingId={bookingId}
                                        size={100}
                                    />
                                </div>
                                <p className="text-xs text-center text-white font-medium">
                                    {bookingId}
                                </p>
                            </div>

                            {/* Ticket details */}
                            <div className="p-4 flex-grow">
                                <div className="flex justify-between items-start">
                                    <div className="flex-grow">
                                        <div className="flex items-center mb-2">
                                            <h3 className="font-semibold text-lg">{ticket.name}</h3>
                                            <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium flex items-center ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                                                <div className="w-2 h-2 rounded-full mr-2 bg-yellow-500"></div>
                                                {statusConfig.label}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                            {ticket.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                                                {ticket.category.name}
                                            </span>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                                Valid for {formatDate(ticket.date)}
                                            </span>
                                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                                Group: {booking.group_booking_id}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-right ml-4">
                                        <p className="text-orange-500 text-sm mt-1 font-medium">
                                            {booking.total_tickets} ticket(s)
                                        </p>
                                        <p className="text-lg font-semibold text-gray-800 mt-1">
                                            {formatCurrency ? formatCurrency(booking.total_payment) : `Rp ${booking.total_payment.toLocaleString()}`}
                                        </p>
                                        <p className="text-sm mt-3 text-gray-600">
                                            Payment Method: {booking.payment_method}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Booked at {formatDate(booking.booked_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Total */}
            <div className="flex justify-end items-center mb-8">
                <div className="text-2xl text-teal-500 font-bold">
                    Total: {formatCurrency ? formatCurrency(totalAmount) : `Rp ${totalAmount.toLocaleString()}`}
                </div>
            </div>

            {/* Pending status information */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Our admin team will review your payment evidence</li>
                    <li>• You'll receive an email notification once reviewed</li>
                    <li>• Review process typically takes 2-24 hours</li>
                    <li>• Your tickets will be activated once payment is approved</li>
                </ul>
            </div>

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