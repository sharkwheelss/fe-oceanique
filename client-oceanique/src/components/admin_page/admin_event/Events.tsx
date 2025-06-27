import React, { useState, useContext, useEffect } from 'react';
import { ArrowLeft, Search, Edit, Trash2, Calendar, Clock, MapPin, Plus, Loader2 } from 'lucide-react';

// Assuming you have an EventContext - adjust the import path as needed
// import { EventContext } from '../context/EventContext';

// Mock EventContext for demonstration - replace with your actual context
const EventContext = React.createContext();
const mockEventContext = {
    events: [
        {
            id: 1,
            name: 'Summer Party GSC 2',
            startDate: '2025-05-07',
            startTime: '13:00',
            endDate: '2025-05-08',
            endTime: '09:00',
            type: 'Public',
            location: 'Pantai Hiti Pasir',
            status: 'active',
            description: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
        },
        {
            id: 2,
            name: 'Summer Party GSC 1',
            startDate: '2025-01-01',
            startTime: '13:00',
            endDate: '2025-02-02',
            endTime: '09:00',
            type: 'Private',
            location: 'Pantai Seoul',
            status: 'inactive',
            description: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
        }
    ],
    loading: false,
    error: null,
    createEvent: async (eventData) => {
        console.log('Creating event:', eventData);
        return { success: true, data: { ...eventData, id: Date.now() } };
    },
    updateEvent: async (id, eventData) => {
        console.log('Updating event:', id, eventData);
        return { success: true, data: { ...eventData, id } };
    },
    deleteEvent: async (id) => {
        console.log('Deleting event:', id);
        return { success: true };
    },
    toggleEventStatus: async (id) => {
        console.log('Toggling event status:', id);
        return { success: true };
    }
};

const AdminEventManagement = () => {
    // Replace this with: const { events, loading, error, createEvent, updateEvent, deleteEvent, toggleEventStatus } = useContext(EventContext);
    const { events, loading, error, createEvent, updateEvent, deleteEvent, toggleEventStatus } = mockEventContext;

    const [currentView, setCurrentView] = useState('list');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        location: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (submitError) setSubmitError('');
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError('');

        try {
            let result;
            if (currentView === 'add') {
                result = await createEvent(formData);
            } else if (currentView === 'edit') {
                result = await updateEvent(selectedEvent.id, formData);
            }

            if (result.success) {
                setCurrentView('list');
                resetForm();
            } else {
                setSubmitError(result.error || 'An error occurred');
            }
        } catch (error) {
            setSubmitError(error.message || 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            type: '',
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            location: ''
        });
        setSelectedEvent(null);
        setSubmitError('');
    };

    const handleEdit = (event) => {
        setSelectedEvent(event);
        setFormData({
            name: event.name || '',
            description: event.description || '',
            type: event.type || '',
            startDate: event.startDate || '',
            startTime: event.startTime || '',
            endDate: event.endDate || '',
            endTime: event.endTime || '',
            location: event.location || ''
        });
        setCurrentView('edit');
    };

    const handleView = (event) => {
        setSelectedEvent(event);
        setCurrentView('detail');
    };

    const handleDelete = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                const result = await deleteEvent(eventId);
                if (!result.success) {
                    alert(result.error || 'Failed to delete event');
                }
            } catch (error) {
                alert(error.message || 'Failed to delete event');
            }
        }
    };

    const handleToggleStatus = async (eventId) => {
        try {
            const result = await toggleEventStatus(eventId);
            if (!result.success) {
                alert(result.error || 'Failed to update event status');
            }
        } catch (error) {
            alert(error.message || 'Failed to update event status');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long'
        });
    };

    const filteredEvents = events?.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const Header = ({ title, showBack = false }) => (
        <div className="bg-white border-b border-gray-200 px-8 py-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {showBack && (
                        <button
                            onClick={() => {
                                setCurrentView('list');
                                resetForm();
                            }}
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

    const EventListView = () => (
        <div className="flex-1 bg-gray-50">
            <Header title="Event List" />
            <div className="p-8">
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">Error: {error}</p>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <div className="relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-80"
                                />
                            </div>
                            <button
                                onClick={() => setCurrentView('add')}
                                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center"
                                disabled={loading}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                                <span className="ml-2 text-gray-600">Loading events...</span>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Event Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Start Date & Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            End Date & Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Held at
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredEvents.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                                No events found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredEvents.map((event) => (
                                            <tr key={event.id} className="hover:bg-gray-50">
                                                <td
                                                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer hover:text-teal-600"
                                                    onClick={() => handleView(event)}
                                                >
                                                    {event.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(event.startDate)} {event.startTime}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(event.endDate)} {event.endTime}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {event.type}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {event.location}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleToggleStatus(event.id)}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${event.status === 'active' ? 'bg-teal-600' : 'bg-gray-200'
                                                            }`}
                                                    >
                                                        <span
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${event.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                                                                }`}
                                                        />
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(event)}
                                                            className="text-teal-600 hover:text-teal-900 transition-colors"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(event.id)}
                                                            className="text-red-600 hover:text-red-900 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const EventForm = ({ isEdit = false }) => (
        <div className="flex-1 bg-gray-50">
            <Header title={isEdit ? "Edit Event" : "Add Event"} showBack={true} />
            <div className="p-8">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    {submitError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600">{submitError}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Event Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Type here..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Event Type *
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50"
                                    required
                                >
                                    <option value="">Choose...</option>
                                    <option value="Public">Public</option>
                                    <option value="Private">Private</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Type here..."
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date *
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Time *
                                </label>
                                <input
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date *
                                </label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Time *
                                </label>
                                <input
                                    type="time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location *
                            </label>
                            <select
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50"
                                required
                            >
                                <option value="">Choose...</option>
                                <option value="Pantai Hiti Pasir">Pantai Hiti Pasir</option>
                                <option value="Pantai Seoul">Pantai Seoul</option>
                                <option value="Convention Center">Convention Center</option>
                            </select>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => {
                                    setCurrentView('list');
                                    resetForm();
                                }}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
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

    const EventDetailView = () => (
        <div className="flex-1 bg-gray-50">
            <Header title="Event Detail" showBack={true} />
            <div className="p-8">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Event Name
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                                    {selectedEvent?.name}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Event Type
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                                    {selectedEvent?.type}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 min-h-24">
                                {selectedEvent?.description}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                    {formatDate(selectedEvent?.startDate)}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Time
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 flex items-center">
                                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                    {selectedEvent?.startTime}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                    {formatDate(selectedEvent?.endDate)}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Time
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 flex items-center">
                                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                    {selectedEvent?.endTime}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                            </label>
                            <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                {selectedEvent?.location}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => handleEdit(selectedEvent)}
                                className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Event
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCurrentView = () => {
        switch (currentView) {
            case 'add':
                return <EventForm />;
            case 'edit':
                return <EventForm isEdit={true} />;
            case 'detail':
                return <EventDetailView />;
            default:
                return <EventListView />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {renderCurrentView()}
        </div>
    );
};

export default AdminEventManagement;