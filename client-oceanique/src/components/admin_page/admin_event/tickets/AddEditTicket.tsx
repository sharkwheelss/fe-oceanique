import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';

// Mock data - replace with your actual API calls
const mockEvents = [
    { id: '1', name: 'Summer Party GSC 1' },
    { id: '2', name: 'Summer Party GSC 2' },
    { id: '3', name: 'Winter Festival' },
];

const categories = ['Regular', 'VIP', 'Exclusive', 'Premium'];

const TicketForm = () => {
    const { ticketId } = useParams();
    const mode = ticketId ? 'edit' : 'add';
    const isEdit = mode === 'edit';

    const [ticketData, setTicketData] = useState({
        name: '',
        description: '',
        parentEvent: '',
        category: '',
        quota: 0,
        price: 0,
        validDate: ''
    });

    const [events, setEvents] = useState(mockEvents);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Fetch events data (replace with your actual API call)
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // const eventsData = await getAllEvents();
                // setEvents(eventsData || []);
                setEvents(mockEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, []);

    // Fetch ticket data when in edit mode
    useEffect(() => {
        const fetchTicketDetails = async () => {
            if (!ticketId) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                // Replace with your actual API call
                // const ticketResponse = await getTicketDetails(ticketId);

                // Mock data for demonstration
                const mockTicket = {
                    id: ticketId,
                    name: 'Ticket one plus',
                    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    parentEvent: 'Summer Party GSC 2',
                    category: 'VIP',
                    quota: 30,
                    price: 200000,
                    validDate: '2025-05-07'
                };

                setTicketData({
                    name: mockTicket.name,
                    description: mockTicket.description,
                    parentEvent: mockTicket.parentEvent,
                    category: mockTicket.category,
                    quota: mockTicket.quota,
                    price: mockTicket.price,
                    validDate: mockTicket.validDate
                });

            } catch (error) {
                console.error('Error fetching ticket details:', error);
                setSubmitError('Failed to load ticket details');
            } finally {
                setIsLoading(false);
            }
        };
        fetchTicketDetails();
    }, [ticketId]);

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'number' ? (parseInt(value) || 0) : value;

        setTicketData(prev => ({
            ...prev,
            [name]: finalValue
        }));

        // Clear error when user starts typing
        if (submitError) {
            setSubmitError('');
        }
    };

    const validateForm = () => {
        const required = ['name', 'description', 'parentEvent', 'category', 'validDate'];
        const missing = required.filter(field => !ticketData[field]);

        if (missing.length > 0) {
            setSubmitError(`Please fill in all required fields: ${missing.join(', ')}`);
            return false;
        }

        if (ticketData.quota < 0) {
            setSubmitError('Quota cannot be negative');
            return false;
        }

        if (ticketData.price < 0) {
            setSubmitError('Price cannot be negative');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);
            setSubmitError('');

            // Prepare data for raw body format
            const requestData = {
                name: ticketData.name,
                description: ticketData.description,
                parent_event: ticketData.parentEvent,
                category: ticketData.category,
                quota: ticketData.quota,
                price: ticketData.price,
                valid_date: ticketData.validDate
            };

            let result;
            if (isEdit) {
                // Replace with your actual API call
                // result = await updateTicket(ticketId, requestData);
                console.log('Updating ticket:', requestData);
                result = { success: true };
            } else {
                // Replace with your actual API call
                // result = await createTicket(requestData);
                console.log('Creating ticket:', requestData);
                result = { success: true };
            }

            if (result?.success) {
                if (onNavigateBack) onNavigateBack();
            } else {
                setSubmitError(result?.message || 'Failed to save ticket.');
            }
        } catch (error) {
            console.error('Error saving ticket:', error);
            setSubmitError(error.message || 'An error occurred while saving');
        } finally {
            setIsSubmitting(false);
        }
    };

    const Header = ({ title, showBack = false }) => (
        <div className="bg-white border-b border-gray-200 px-8 py-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {showBack && (
                        <button
                            onClick={onNavigateBack}
                            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                    )}
                    <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
                </div>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex-1 bg-gray-50 flex items-center justify-center">
                <div className="flex items-center">
                    <Loader2 className="w-6 h-6 mr-2 animate-spin text-teal-600" />
                    <span className="text-gray-600">Loading ticket details...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-gray-50">
            <Header title={isEdit ? "Edit Ticket" : "Add Ticket"} showBack={true} />
            <div className="p-8">
                <div onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
                    {submitError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600">{submitError}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ticket Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={ticketData.name}
                                    onChange={handleInputChange}
                                    placeholder="Type here..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Parent Event *
                                </label>
                                <select
                                    name="parentEvent"
                                    value={ticketData.parentEvent}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                                    required
                                >
                                    <option value="">Choose...</option>
                                    {events.map(event => (
                                        <option key={event.id} value={event.name}>{event.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={ticketData.description}
                                onChange={handleInputChange}
                                placeholder="Type here..."
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ticket Category *
                                </label>
                                <select
                                    name="category"
                                    value={ticketData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                                    required
                                >
                                    <option value="">Choose...</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quota *
                                </label>
                                <input
                                    type="number"
                                    name="quota"
                                    value={ticketData.quota}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={ticketData.price}
                                    onChange={handleInputChange}
                                    min="0"
                                    placeholder="Type here..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Valid Date *
                                </label>
                                <input
                                    type="date"
                                    name="validDate"
                                    value={ticketData.validDate}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={onNavigateBack}
                                className="px-8 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-teal-600 text-white px-8 py-2 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {isSubmitting ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketForm;