import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    CheckCircle,
} from 'lucide-react';
import BookingSummaryPage from './Booking';
import PaymentMethodPage from './Payment';
import SummaryPage from './Summary';

// Main App component to manage routing between pages
export default function MainPurchase() {
    const location = useLocation();
    const { tickets: selectedTicketIds, eventData } = location.state || {};

    // State for current page/step in the process
    const [currentPage, setCurrentPage] = useState('booking');

    // State for ticket quantities (convert from ID-based to name-based)
    const [selectedTickets, setSelectedTickets] = useState({});

    // Timer state for payment countdown (in seconds)
    const [paymentTimer, setPaymentTimer] = useState(59 * 60); // 59 minutes in seconds

    // Initialize selectedTickets state based on passed data
    useEffect(() => {
        if (selectedTicketIds && eventData?.tickets) {
            const ticketQuantities = {};

            // Convert ID-based selection to name-based selection
            eventData.tickets.forEach(ticket => {
                const quantity = selectedTicketIds[ticket.id] || 0;
                ticketQuantities[ticket.name] = quantity;
            });

            setSelectedTickets(ticketQuantities);
        }
    }, [selectedTicketIds, eventData]);

    // Function to format time as mm:ss
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Navigate to the next page
    const goToNextPage = () => {
        if (currentPage === 'booking') setCurrentPage('payment');
        else if (currentPage === 'payment') setCurrentPage('confirmation');
    };

    // Navigate to the previous page
    const goToPreviousPage = () => {
        if (currentPage === 'payment') setCurrentPage('booking');
        else if (currentPage === 'confirmation') setCurrentPage('payment');
    };

    // Remove a ticket from selection
    const removeTicket = (ticketName) => {
        setSelectedTickets(prev => ({
            ...prev,
            [ticketName]: 0
        }));
    };

    // Get ticket details by name
    const getTicketByName = (ticketName) => {
        return eventData?.tickets?.find(ticket => ticket.name === ticketName);
    };

    // Calculate subtotals
    const calculateSubtotals = () => {
        const subtotals = {};

        Object.entries(selectedTickets).forEach(([ticketName, quantity]) => {
            const ticket = getTicketByName(ticketName);
            if (ticket) {
                subtotals[ticketName] = quantity * ticket.price;
            }
        });

        return subtotals;
    };

    const calculateTotal = () => {
        const subtotals = calculateSubtotals();
        return Object.values(subtotals).reduce((sum, value) => sum + value, 0);
    };

    // Format currency
    const formatCurrency = (amount) => {
        return `Rp${amount.toLocaleString('id-ID')}`;
    };

    // Show loading or error if data is not available
    if (!eventData || !selectedTicketIds) {
        return (
            <div className="max-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Loading purchase data...</p>
                </div>
            </div>
        );
    }

    // Render current page based on state
    const renderCurrentPage = () => {
        switch (currentPage) {
            case 'booking':
                return <BookingSummaryPage
                    selectedTickets={selectedTickets}
                    removeTicket={removeTicket}
                    subtotals={calculateSubtotals()}
                    total={calculateTotal()}
                    formatCurrency={formatCurrency}
                    goToNextPage={goToNextPage}
                    eventData={eventData}
                    getTicketByName={getTicketByName}
                />;
            case 'payment':
                return <PaymentMethodPage
                    total={calculateTotal()}
                    formatCurrency={formatCurrency}
                    goToNextPage={goToNextPage}
                    eventData={eventData}
                />;
            case 'confirmation':
                return <SummaryPage
                    selectedTickets={selectedTickets}
                    subtotals={calculateSubtotals()}
                    total={calculateTotal()}
                    formatCurrency={formatCurrency}
                    timer={formatTime(paymentTimer)}
                    eventData={eventData}
                    getTicketByName={getTicketByName}
                />;
            default:
                return null;
        }
    };

    return (
        <div className="max-h-screen">
            {/* Header */}
            <Header currentPage={currentPage} goToPreviousPage={goToPreviousPage} eventData={eventData} />

            {/* Progress Indicator */}
            <ProgressIndicator currentPage={currentPage} />

            {/* Content */}
            <div className="pt-6 pb-12">
                {renderCurrentPage()}
            </div>
        </div>
    );
}

// Header component
function Header({ eventData }) {
    return (
        <div className="bg-white shadow-sm">
            <div className="container mx-auto max-w-6xl px-4 py-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-500 text-white hover:bg-teal-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div>
                        <p className="text-gray-600 text-sm">
                            <span className="text-gray-700 hover:text-teal-600 cursor-pointer underline">
                                {eventData?.name || 'Event Mid Sea Shore'}
                            </span>
                            {' / '}
                            <span className="text-gray-700">Ticket Purchase</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Progress Indicator component
function ProgressIndicator({ currentPage }) {
    const steps = [
        { id: 'booking', label: 'Booking', active: currentPage === 'booking', complete: currentPage === 'payment' || currentPage === 'confirmation' },
        { id: 'payment', label: 'Payment', active: currentPage === 'payment', complete: currentPage === 'confirmation' },
        { id: 'ticket', label: 'Your Ticket', active: currentPage === 'confirmation', complete: false }
    ];

    return (
        <div className="bg-white">
            <div className="container mx-auto max-w-6xl px-4 py-8">
                <div className="flex items-center justify-center">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            {/* Step node */}
                            <div className="flex flex-col items-center">
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${step.complete
                                    ? 'bg-teal-500 border-teal-500'
                                    : step.active
                                        ? 'bg-teal-500 border-teal-500'
                                        : 'bg-white border-gray-300'
                                    }`}>
                                    {step.complete ? (
                                        <CheckCircle className="h-5 w-5 text-white" />
                                    ) : (
                                        <div className={`w-3 h-3 rounded-full ${step.active ? 'bg-white' : 'bg-gray-300'
                                            }`}></div>
                                    )}
                                </div>

                                {/* Step label */}
                                <span className={`mt-2 text-sm font-medium ${step.active || step.complete ? 'text-teal-500' : 'text-gray-400'
                                    }`}>
                                    {step.label}
                                </span>
                            </div>

                            {/* Connector line (not for the last item) */}
                            {index < steps.length - 1 && (
                                <div className="w-16 mx-4 mb-6">
                                    <div className={`h-0.5 ${steps[index + 1].active || steps[index + 1].complete
                                        ? 'bg-teal-500'
                                        : 'bg-gray-300'
                                        }`}></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}