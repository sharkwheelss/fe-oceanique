
import {
    ArrowRight,
    Trash2,
} from 'lucide-react';

function BookingSummaryPage({ selectedTickets, removeTicket, subtotals, total, formatCurrency, goToNextPage }) {
    // Ticket details mapped to their respective data
    const ticketDetails = {
        "Ticket Apache Epic 1": {
            price: 220000,
            type: "Standard",
            date: "26 April 2025"
        },
        "Ticket Laohi 2": {
            price: 1000000,
            type: "VIP 1",
            date: "03 May 2025"
        }
    };

    return (
        <div className="container mx-auto max-w-6xl px-4">
            <h2 className="text-xl font-semibold mb-6">Booking Summary</h2>

            {/* Tickets Summary */}
            {Object.entries(selectedTickets).map(([ticketName, quantity]) => {
                if (quantity > 0) {
                    const ticket = ticketDetails[ticketName];

                    return (
                        <div key={ticketName} className="mb-6 bg-white rounded-lg border-l-8 border-teal-400">
                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold">{ticketName}</h3>
                                        <p className="text-gray-600 text-sm mt-2">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                                        </p>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-xs">
                                                {ticket.type}
                                            </span>
                                            <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-xs">
                                                {ticket.date}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-bold text-lg">{formatCurrency(ticket.price)}</p>
                                        <p className="text-orange-500 text-sm">{quantity} ticket(s)</p>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={() => removeTicket(ticketName)}
                                        className="text-gray-600 hover:text-red-500"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                }
                return null;
            })}

            {/* Subtotals and Total */}
            {Object.entries(selectedTickets).map(([ticketName, quantity]) => {
                if (quantity > 0) {
                    return (
                        <div key={`subtotal-${ticketName}`} className="flex justify-end mb-2">
                            <p className="text-gray-700">
                                Subtotal: {formatCurrency(subtotals[ticketName])}
                            </p>
                        </div>
                    );
                }
                return null;
            })}

            {/* Continue to Payment Button */}
            <div className="mt-8 flex justify-between items-center">
                <div className="text-xl text-teal-500 font-medium">
                    Total: {formatCurrency(total)}
                </div>
                <button
                    onClick={goToNextPage}
                    className="px-6 py-3 rounded-lg bg-teal-500 text-white flex items-center"
                >
                    Continue to Payment
                    <ArrowRight className="ml-2 h-5 w-5" />
                </button>
            </div>
        </div>
    );
}

export default BookingSummaryPage;