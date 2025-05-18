import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Minus, Plus, ArrowRight } from 'lucide-react';

// Main component for the Event Ticket Purchase page
export default function EventTicketPage() {
    const navigate = useNavigate();

    // State for ticket quantities
    const [tickets, setTickets] = useState({
        "Ticket Apache Epic 1": 1,
        "Ticket Laohi 2": 2,
        "Ticket Laohi 3": 0
    });

    // Array of available tickets with their details
    const availableTickets = [
        {
            id: 1,
            name: "Ticket Apache Epic 1",
            price: "Rp220.000",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
            type: "Standard",
            date: "26 April 2025",
            remaining: 10,
            soldOut: false
        },
        {
            id: 2,
            name: "Ticket Laohi 2",
            price: "Rp1000.000",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
            type: "VIP 1",
            date: "03 May 2025",
            remaining: 10,
            soldOut: false
        },
        {
            id: 3,
            name: "Ticket Laohi 3",
            price: "Rp1000.000",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
            type: "VIP 2",
            date: "26 April 2025",
            remaining: 0,
            soldOut: true
        }
    ];

    // Calculate total selected tickets
    const totalSelectedTickets = Object.values(tickets).reduce((acc, curr) => acc + curr, 0);

    // Handler for incrementing ticket quantity
    const handleIncrement = (ticketName) => {
        const ticket = availableTickets.find(t => t.name === ticketName);
        if (ticket && !ticket.soldOut && tickets[ticketName] < ticket.remaining) {
            setTickets({
                ...tickets,
                [ticketName]: tickets[ticketName] + 1
            });
        }
    };

    // Handler for decrementing ticket quantity
    const handleDecrement = (ticketName) => {
        if (tickets[ticketName] > 0) {
            setTickets({
                ...tickets,
                [ticketName]: tickets[ticketName] - 1
            });
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header section */}
            <div className="bg-white p-4 shadow-sm">
                <div className="container mx-auto max-w-4xl">
                    <div className="flex items-center mb-4">
                        <button className="p-2 rounded-full bg-teal-100"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="h-5 w-5 text-teal-500" />
                        </button>
                        <div className="ml-4">
                            <p className="text-gray-600 text-sm">Pantai Pasir Putih / Event Mid Sea Shore</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3">
                            <img
                                src="https://picsum.photos/id/20/3670/2462"
                                alt="Summer Beach Party Event"
                                className="rounded-lg w-full md:w-auto"
                            />
                        </div>

                        <div className="md:w-2/3 md:pl-6 mt-4 md:mt-0">
                            <div className="flex items-center space-x-2">
                                <span className="px-2 py-1 rounded-full bg-green-100 text-xs text-green-600 font-medium">Ongoing</span>
                                <span className="px-2 py-1 rounded-full bg-blue-100 text-xs text-blue-600 font-medium">Public</span>
                            </div>

                            <h1 className="text-2xl font-semibold mt-2">Event Mid Sea Shore</h1>

                            <p className="text-gray-600 mt-2 text-sm">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                            </p>

                            <div className="mt-4 flex items-center text-gray-600">
                                <MapPin className="h-5 w-5 text-pink-500" />
                                <span className="ml-2 text-sm">Pantai Pasir Putih</span>
                            </div>

                            <div className="mt-2 flex items-center text-gray-600">
                                <Calendar className="h-5 w-5 text-pink-500" />
                                <span className="ml-2 text-sm">26 April 2025 09.00 - 03 May 2025 13.00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Available Tickets section */}
            <div className="container mx-auto max-w-4xl mt-6 px-4">
                <h2 className="text-xl font-semibold mb-4">Available Tickets</h2>

                {availableTickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        className={`mb-4 rounded-lg border-l-8 ${ticket.soldOut ? 'bg-gray-200 border-gray-400' : 'bg-white border-teal-400'}`}
                    >
                        <div className="p-4">
                            <div className="flex flex-col md:flex-row justify-between">
                                <div className="md:w-3/4">
                                    <h3 className="font-semibold">{ticket.name}</h3>
                                    <p className="text-gray-600 text-sm mt-2">{ticket.description}</p>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-xs">
                                            {ticket.type}
                                        </span>
                                        <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-xs">
                                            {ticket.date}
                                        </span>
                                    </div>
                                </div>

                                <div className="md:w-1/4 mt-4 md:mt-0 flex flex-col items-end">
                                    <div className="text-right">
                                        <p className="font-bold text-lg">{ticket.price}</p>
                                        {ticket.soldOut ? (
                                            <p className="text-orange-500 text-sm">Sold Out</p>
                                        ) : (
                                            <p className="text-orange-500 text-sm">{ticket.remaining} left</p>
                                        )}
                                    </div>

                                    {!ticket.soldOut && (
                                        <div className="flex items-center mt-4">
                                            <button
                                                onClick={() => handleDecrement(ticket.name)}
                                                className={`p-1 rounded-full ${tickets[ticket.name] > 0 ? 'bg-teal-500' : 'bg-gray-300'}`}
                                                disabled={tickets[ticket.name] === 0}
                                            >
                                                <Minus className="h-4 w-4 text-white" />
                                            </button>
                                            <span className="mx-4 w-6 text-center">{tickets[ticket.name]}</span>
                                            <button
                                                onClick={() => handleIncrement(ticket.name)}
                                                className={`p-1 rounded-full ${tickets[ticket.name] < ticket.remaining ? 'bg-teal-500' : 'bg-gray-300'}`}
                                                disabled={tickets[ticket.name] >= ticket.remaining}
                                            >
                                                <Plus className="h-4 w-4 text-white" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer with continue button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
                <div className="container mx-auto max-w-4xl flex justify-between items-center">
                    <div className="text-teal-500">
                        ({totalSelectedTickets}) tickets selected
                    </div>
                    <button
                        className={`px-6 py-3 rounded-lg flex items-center ${totalSelectedTickets > 0 ? 'bg-teal-500 text-white' : 'bg-gray-300 text-gray-500'}`}
                        disabled={totalSelectedTickets === 0}
                        onClick={() => navigate('/purchase/2', { state: { tickets } })}
                    >
                        Continue
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}