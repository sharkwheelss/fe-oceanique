import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useTickets } from '../../../../context/TicketContext';
import { useEvents } from '../../../../context/EventContext';
import DialogMessage from '../../../../components/helper/DialogMessage';
import { useDialog } from '../../../../components/helper/useDialog';

const TicketForm = () => {
    const { ticketId } = useParams();
    const mode = ticketId ? 'edit' : 'add';
    const isEdit = mode === 'edit';
    const { getAdminTicketById, adminCreateNewTicket, adminUpdateTicket, getAdminTicketCategories } = useTickets();
    const { getAllEvents } = useEvents();
    const navigate = useNavigate();

    const [dialogState, { showSuccess, showError, closeDialog }] = useDialog();

    const [ticketData, setTicketData] = useState({
        name: '',
        description: '',
        parentEventId: '', // Changed to store ID
        categoryId: '', // Changed to store ID
        quota: 0,
        price: 0,
        validDate: '',
        privateCode: '' // Added private code field
    });

    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsData = await getAllEvents();
                console.log('Events fetched:', eventsData);

                if (Array.isArray(eventsData)) {
                    setEvents(eventsData);
                } else if (Array.isArray(eventsData?.data)) {
                    setEvents(eventsData.data);
                } else {
                    console.warn('No events found');
                    setEvents([]);
                }
            } catch (error) {
                console.error('Error fetching events:', error);
                setEvents([]);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const categoryData = await getAdminTicketCategories();
                console.log('category fetched:', categoryData);

                if (Array.isArray(categoryData)) {
                    setCategories(categoryData);
                } else if (Array.isArray(categoryData?.data)) {
                    setCategories(categoryData.data);
                } else {
                    console.warn('No categories found');
                    setCategories([]);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
            }
        };
        fetchCategory();
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
                const ticketResponse = await getAdminTicketById(Number(ticketId));
                console.log('Ticket details fetched:', ticketResponse);

                // Find the event and category IDs based on names
                const eventId = events.find(event => event.name === ticketResponse.event_name)?.id || '';
                const categoryId = categories.find(category => category.name === ticketResponse.category_name)?.id || '';

                setTicketData({
                    name: ticketResponse.name || '',
                    description: ticketResponse.description || '',
                    parentEventId: eventId,
                    categoryId: categoryId,
                    quota: ticketResponse.quota || 0,
                    price: ticketResponse.price || 0,
                    validDate: formatDateForInput(ticketResponse.date),
                    privateCode: ticketResponse.private_code || ''
                });

            } catch (error) {
                console.error('Error fetching ticket details:', error);
                showError(
                    "Load Ticket Failed",
                    "Failed to load ticket details. Please try again.",
                    {
                        showCancel: false,
                        onConfirm: () => {
                            closeDialog();
                            navigate('/admin/tickets');
                        }
                    }
                );
            } finally {
                setIsLoading(false);
            }
        };

        // Only fetch ticket details after events and categories are loaded
        if (isEdit && events.length > 0 && categories.length > 0) {
            fetchTicketDetails();
        }
    }, [ticketId, isEdit, events, categories]);

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0]; // Returns "yyyy-MM-dd"
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'number' ? (parseInt(value) || 0) : value;

        setTicketData(prev => ({
            ...prev,
            [name]: finalValue
        }));
    };

    const validateForm = () => {
        const required = ['name', 'description', 'parentEventId', 'categoryId', 'validDate'];
        const missing = required.filter(field => !ticketData[field]);

        if (missing.length > 0) {
            const fieldNames = missing.map(field => {
                switch (field) {
                    case 'parentEventId': return 'Parent Event';
                    case 'categoryId': return 'Category';
                    case 'validDate': return 'Valid Date';
                    default: return field;
                }
            });
            showError(
                "Validation Error",
                `Please fill in all required fields: ${fieldNames.join(', ')}`,
                {
                    showCancel: false,
                    onConfirm: () => closeDialog()
                }
            );
            return false;
        }

        if (ticketData.quota < 0) {
            showError(
                "Validation Error",
                "Quota cannot be negative",
                {
                    showCancel: false,
                    onConfirm: () => closeDialog()
                }
            );
            return false;
        }

        if (ticketData.price < 0) {
            showError(
                "Validation Error",
                "Price cannot be negative",
                {
                    showCancel: false,
                    onConfirm: () => closeDialog()
                }
            );
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

            const apiParams = [
                ticketData.name,
                ticketData.description,
                ticketData.quota,
                ticketData.price,
                ticketData.validDate,
                ticketData.privateCode || null, // Send null if empty
                Number(ticketData.parentEventId),
                Number(ticketData.categoryId)
            ];

            let result;
            if (isEdit) {
                console.log('Updating ticket with params:', [Number(ticketId), ...apiParams]);
                result = await adminUpdateTicket(Number(ticketId), ...apiParams);
            } else {
                console.log('Creating ticket with params:', apiParams);
                result = await adminCreateNewTicket(...apiParams);
            }

            console.log('API Result:', result);

            // Check if the operation was successful
            if (result && (result.success !== false)) {
                showSuccess(
                    `${isEdit ? "Edit Ticket" : "Add Ticket"} Successful`,
                    `Successfully ${isEdit ? "updated" : "created"} ticket`,
                    {
                        onConfirm: () => {
                            closeDialog();
                            navigate('/admin/tickets');
                        }
                    }
                );
            } else {
                showError(
                    `${isEdit ? "Edit Ticket" : "Add Ticket"} Failed`,
                    result?.message || 'Failed to save ticket. Please try again.',
                    {
                        showCancel: false,
                        onConfirm: () => closeDialog()
                    }
                );
            }
        } catch (error) {
            console.error('Error saving ticket:', error);
            showError(
                `${isEdit ? "Edit Ticket" : "Add Ticket"} Failed`,
                error.message || 'An error occurred while saving the ticket',
                {
                    showCancel: false,
                    onConfirm: () => closeDialog()
                }
            );
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
                            onClick={() => navigate('/admin/tickets')}
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
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
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
                                    name="parentEventId"
                                    value={ticketData.parentEventId}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                                    required
                                >
                                    <option value="">Choose...</option>
                                    {events && events.map(event => (
                                        <option key={event.id} value={event.id}>{event.name}</option>
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
                                    name="categoryId"
                                    value={ticketData.categoryId}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                                    required
                                >
                                    <option value="">Choose...</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Private Code
                                </label>
                                <input
                                    type="text"
                                    name="privateCode"
                                    value={ticketData.privateCode}
                                    onChange={handleInputChange}
                                    placeholder="Enter private code (optional)..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/tickets')}
                                className="px-8 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-teal-600 text-white px-8 py-2 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {isSubmitting ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TicketForm;