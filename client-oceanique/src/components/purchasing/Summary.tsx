import { HelpCircle } from "lucide-react";

function TicketConfirmationPage({ selectedTickets, subtotals, total, formatCurrency, timer }) {
    // Ticket details mapped to their respective data
    const ticketDetails = {
        "Ticket Apache Epic 1": {
            id: "0105042501",
            price: 220000,
            type: "Standard",
            date: "26 April 2025",
            paymentId: "52451434",
            paymentMethod: "BCA VA"
        },
        "Ticket Laohi 2": {
            id: "0105042502",
            price: 1000000,
            type: "VIP 1",
            date: "03 May 2025",
            paymentId: "52451434",
            paymentMethod: "BCA VA"
        }
    };

    return (
        <div className="container mx-auto max-w-6xl px-4">
            {/* Timer notification */}
            <div className="flex justify-center mb-6">
                <div className="w-full max-w-4xl px-4 py-2 border-t border-b border-dashed border-gray-300 text-center">
                    <p className="text-lg">
                        Complete Your Payment in <span className="text-red-500 font-bold">{timer}</span>
                    </p>
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-6">Your Ticket(s)</h2>

            {/* Tickets */}
            {Object.entries(selectedTickets).map(([ticketName, quantity]) => {
                if (quantity > 0) {
                    const ticket = ticketDetails[ticketName];

                    return (
                        <div key={ticketName} className="mb-6 bg-white rounded-lg overflow-hidden">
                            <div className="flex">
                                {/* Left yellow bar with QR code */}
                                <div className="bg-yellow-400 w-24 md:w-32 p-4 flex flex-col items-center justify-center">
                                    <img
                                        src="/api/placeholder/100/100"
                                        alt="QR Code"
                                        className="w-full"
                                    />
                                    <p className="text-xs text-center mt-2">ID: {ticket.id}</p>
                                </div>

                                {/* Ticket details */}
                                <div className="p-4 flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center">
                                                <h3 className="font-semibold">{ticketName}</h3>
                                                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs flex items-center">
                                                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                                                    Pending
                                                </span>
                                            </div>

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
                                            <p className="text-sm">Payment ID: {ticket.paymentId}</p>
                                            <p className="text-orange-500 text-sm mt-1">{quantity} ticket(s)</p>
                                            <p className="text-sm mt-4 text-gray-600">Payment Method: {ticket.paymentMethod}</p>
                                        </div>
                                    </div>
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

            {/* Total and action buttons */}
            <div className="mt-6 flex justify-between items-center">
                <div className="text-xl text-teal-500 font-medium">
                    Total: {formatCurrency(total)}
                </div>
                <div className="flex space-x-4">
                    <button className="px-8 py-3 rounded-lg bg-red-500 text-white">
                        Cancel
                    </button>
                    <button className="px-8 py-3 rounded-lg bg-teal-500 text-white flex items-center">
                        How to Pay
                        <HelpCircle className="ml-2 h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Transaction recorded notice */}
            <div className="mt-8 flex justify-center mb-6">
                <div className="w-full max-w-4xl px-4 py-2 border-t border-b border-dashed border-gray-300 text-center">
                    <p className="text-gray-600">This has been recorded in your transaction history.</p>
                </div>
            </div>
        </div>
    );
}

export default TicketConfirmationPage;