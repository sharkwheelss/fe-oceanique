import { useState } from 'react';
import {
    CheckCircle,
} from 'lucide-react';
import BookingSummaryPage from './Booking';
import PaymentMethodPage from './Payment';
import SummaryPage from './Summary';

// Main App component to manage routing between pages
export default function App() {
    // State for current page/step in the process
    const [currentPage, setCurrentPage] = useState('booking'); 

    // State for ticket quantities
    const [selectedTickets, setSelectedTickets] = useState({
        "Ticket Apache Epic 1": 1,
        "Ticket Laohi 2": 2,
        "Ticket Laohi 3": 0
    });

    // Timer state for payment countdown (in seconds)
    const [paymentTimer, setPaymentTimer] = useState(59 * 60); // 59 minutes in seconds

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

    // Calculate totals
    const calculateSubtotals = () => {
        const subtotals = {
            "Ticket Apache Epic 1": selectedTickets["Ticket Apache Epic 1"] * 220000,
            "Ticket Laohi 2": selectedTickets["Ticket Laohi 2"] * 1000000,
            "Ticket Laohi 3": selectedTickets["Ticket Laohi 3"] * 1000000
        };

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
                />;
            case 'payment':
                return <PaymentMethodPage
                    total={calculateTotal()}
                    formatCurrency={formatCurrency}
                    goToNextPage={goToNextPage}
                />;
            case 'confirmation':
                return <SummaryPage
                    selectedTickets={selectedTickets}
                    subtotals={calculateSubtotals()}
                    total={calculateTotal()}
                    formatCurrency={formatCurrency}
                    timer={formatTime(paymentTimer)}
                />;
        }
    };

    return (
        <div className="min-h-screen px-4 py-6">
            {/* Header */}
            <Header currentPage={currentPage} goToPreviousPage={goToPreviousPage} />

            {/* Progress Indicator */}
            <ProgressIndicator currentPage={currentPage} />

            {/* Content */}
            {renderCurrentPage()}
        </div>
    );
}

// Header component
function Header({ currentPage, goToPreviousPage }) {
    // Function to get the appropriate breadcrumb based on the current page
    const getBreadcrumb = () => {
        if (currentPage === 'booking' || currentPage === 'payment') {
            return (
                <p className="text-gray-600 text-sm">
                    <span className="text-gray-700 hover:text-teal-600 cursor-pointer">Event Mid Sea Shore</span>
                    {' / '}
                    <span className="text-gray-700 hover:text-teal-600 cursor-pointer">Ticket Purchase</span>
                </p>
            );
        } else if (currentPage === 'confirmation') {
            return (
                <p className="text-gray-600 text-sm">
                    <span className="text-gray-700 hover:text-teal-600 cursor-pointer">Transaction History</span>
                    {' / '}
                    <span className="text-gray-700 hover:text-teal-600 cursor-pointer">Ticket Purchase</span>
                </p>
            );
        }
    };
}

// Progress Indicator component
function ProgressIndicator({ currentPage }) {
    const steps = [
        { id: 'booking', label: 'Booking', active: true, complete: currentPage !== 'selection' },
        { id: 'payment', label: 'Payment', active: currentPage === 'payment' || currentPage === 'confirmation', complete: currentPage === 'confirmation' },
        { id: 'ticket', label: 'Your Ticket', active: currentPage === 'confirmation', complete: false }
    ];

    return (
        <div className="container mx-auto max-w-6xl px-4 py-6 sticky top-[72px] z-10">
            <div className="flex items-center justify-center">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                        {/* Step node */}
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step.complete ? 'bg-teal-500' : (step.active ? 'bg-teal-500' : 'bg-gray-300')
                            }`}>
                            {step.complete ? (
                                <CheckCircle className="h-5 w-5 text-white" />
                            ) : (
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                            )}
                        </div>

                        {/* Step label */}
                        <span className={`ml-2 ${step.active || step.complete ? 'text-teal-500' : 'text-gray-400'
                            }`}>{step.label}</span>

                        {/* Connector line (not for the last item) */}
                        {index < steps.length - 1 && (
                            <div className="flex-grow mx-4">
                                <div className={`h-px ${steps[index + 1].active || steps[index + 1].complete ? 'bg-teal-500' : 'bg-gray-300'
                                    }`}></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}