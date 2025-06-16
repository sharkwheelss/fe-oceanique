import {
    ArrowRight,
    Trash2,
} from 'lucide-react';

function BookingSummaryPage({
    selectedTickets,
    removeTicket,
    subtotals,
    total,
    formatCurrency,
    goToNextPage,
    eventData,
    getTicketByName
}) {
    // Format date function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="container mx-auto max-w-4xl px-4">
            <h2 className="text-2xl font-bold mb-8">Booking Summary</h2>

            {/* Tickets Summary */}
            <div className="space-y-6">
                {Object.entries(selectedTickets).map(([ticketName, quantity]) => {
                    if (quantity > 0) {
                        const ticket = getTicketByName(ticketName);

                        if (!ticket) return null;

                        return (
                            <div key={ticketName} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                {/* Teal left border */}
                                <div className="flex">
                                    <div className="w-4 bg-teal-400 flex-shrink-0"></div>
                                    <div className="flex-1 p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1 pr-4">
                                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                                    {ticket.name}
                                                </h3>

                                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                                    {ticket.description}
                                                </p>

                                                <div className="flex flex-wrap gap-2">
                                                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                                                        {ticket.category.name}
                                                    </span>
                                                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                                                        {formatDate(eventData.start_date)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-gray-900 mb-1">
                                                        {formatCurrency(ticket.price)}
                                                    </div>
                                                    <div className="text-orange-500 text-sm font-medium">
                                                        {quantity} ticket(s)
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => removeTicket(ticketName)}
                                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 mt-1"
                                                    title="Remove ticket"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Subtotal line - moved inside the card content */}
                                        <div className="text-right text-gray-700 font-medium pt-4 border-t border-gray-100">
                                            Subtotal: {formatCurrency(subtotals[ticketName])}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>

            {/* Show message if no tickets selected */}
            {Object.values(selectedTickets).every(quantity => quantity === 0) && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No tickets selected</p>
                </div>
            )}

            {/* Total and Continue Button */}
            <div className="mt-12 flex justify-between items-center">
                <div className="text-2xl font-bold text-teal-500">
                    Total: {formatCurrency(total)}
                </div>
                <button
                    onClick={goToNextPage}
                    disabled={total === 0}
                    className={`px-8 py-3 rounded-lg flex items-center font-medium transition-all ${total > 0
                        ? 'bg-teal-500 hover:bg-teal-600 text-white shadow-md hover:shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    Continue to Payment
                    <ArrowRight className="ml-2 h-5 w-5" />
                </button>
            </div>
        </div>
    );
}

export default BookingSummaryPage;