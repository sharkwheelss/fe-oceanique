import React, { useState } from 'react';
import { ArrowLeft, Search, Edit, Trash2, Plus, Calendar, Loader2 } from 'lucide-react';

// Types
interface Ticket {
    id: string;
    name: string;
    description: string;
    parentEvent: string;
    category: string;
    quota: number;
    price: number;
    validDate: string;
}

interface Event {
    id: string;
    name: string;
}

// Mock data
const mockEvents: Event[] = [
    { id: '1', name: 'Summer Party GSC 1' },
    { id: '2', name: 'Summer Party GSC 2' },
    { id: '3', name: 'Winter Festival' },
];

const mockTickets: Ticket[] = [
    {
        id: '1',
        name: 'Ticket one plus',
        description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        parentEvent: 'Summer Party GSC 2',
        category: 'VIP',
        quota: 30,
        price: 200000,
        validDate: '2025-05-07'
    },
    {
        id: '2',
        name: 'Ticket secondary',
        description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        parentEvent: 'Summer Party GSC 1',
        category: 'Exclusive',
        quota: 0,
        price: 1000000,
        validDate: '2024-01-01'
    }
];

const categories = ['Regular', 'VIP', 'Exclusive', 'Premium'];

const AdminTicketSystem: React.FC = () => {
    const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit' | 'detail'>('list');
    const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [formData, setFormData] = useState<Partial<Ticket>>({
        name: '',
        description: '',
        parentEvent: '',
        category: '',
        quota: 0,
        price: 0,
        validDate: ''
    });

    const handleInputChange = (field: keyof Ticket, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (submitError) setSubmitError('');
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError('');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (currentView === 'add') {
                const newTicket: Ticket = {
                    id: Date.now().toString(),
                    name: formData.name || '',
                    description: formData.description || '',
                    parentEvent: formData.parentEvent || '',
                    category: formData.category || '',
                    quota: formData.quota || 0,
                    price: formData.price || 0,
                    validDate: formData.validDate || ''
                };
                setTickets(prev => [...prev, newTicket]);
            } else if (currentView === 'edit' && selectedTicket) {
                setTickets(prev => prev.map(ticket =>
                    ticket.id === selectedTicket.id
                        ? { ...ticket, ...formData }
                        : ticket
                ));
            }
            setCurrentView('list');
            resetForm();
        } catch (error) {
            setSubmitError('An error occurred while saving');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setFormData(ticket);
        setCurrentView('edit');
    };

    const handleDelete = async (ticketId: string) => {
        if (window.confirm('Are you sure you want to delete this ticket?')) {
            setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
        }
    };

    const handleView = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setCurrentView('detail');
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            parentEvent: '',
            category: '',
            quota: 0,
            price: 0,
            validDate: ''
        });
        setSelectedTicket(null);
        setSubmitError('');
    };

    const filteredTickets = tickets.filter(ticket =>
        ticket.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

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

    const TicketListView = () => (
        <div className="flex-1 bg-gray-50">
            <Header title="Ticket List" />
            <div className="p-8">
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
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ticket Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Valid Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quota
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Parent Event
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredTickets.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                            No tickets found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTickets.map((ticket) => (
                                        <tr key={ticket.id} className="hover:bg-gray-50">
                                            <td
                                                className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer hover:text-teal-600"
                                                onClick={() => handleView(ticket)}
                                            >
                                                {ticket.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(ticket.validDate)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {ticket.quota}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {ticket.category}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatPrice(ticket.price)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {ticket.parentEvent}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(ticket)}
                                                        className="text-teal-600 hover:text-teal-900 transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(ticket.id)}
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
                    </div>
                </div>
            </div>
        </div>
    );

    const TicketForm = ({ isEdit = false }) => (
        <div className="flex-1 bg-gray-50">
            <Header title={isEdit ? "Edit Ticket" : "Add Ticket"} showBack={true} />
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
                                    Ticket Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name || ''}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Type here..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Parent Event *
                                </label>
                                <select
                                    value={formData.parentEvent || ''}
                                    onChange={(e) => handleInputChange('parentEvent', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50"
                                    required
                                >
                                    <option value="">Choose...</option>
                                    {mockEvents.map(event => (
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
                                value={formData.description || ''}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Type here..."
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ticket Category *
                                </label>
                                <select
                                    value={formData.category || ''}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50"
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
                                    value={formData.quota || 0}
                                    onChange={(e) => handleInputChange('quota', parseInt(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50"
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
                                    value={formData.price || 0}
                                    onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                                    placeholder="Type here..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Valid Date *
                                </label>
                                <input
                                    type="date"
                                    value={formData.validDate || ''}
                                    onChange={(e) => handleInputChange('validDate', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50"
                                    required
                                />
                            </div>
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

    const TicketDetailView = () => (
        <div className="flex-1 bg-gray-50">
            <Header title="Ticket Detail" showBack={true} />
            <div className="p-8">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ticket Name
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                                    {selectedTicket?.name}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Parent Event
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                                    {selectedTicket?.parentEvent}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 min-h-24">
                                {selectedTicket?.description}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                                    {selectedTicket?.category}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quota
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                                    {selectedTicket?.quota}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                                    {selectedTicket ? formatPrice(selectedTicket.price) : ''}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Valid Date
                                </label>
                                <div className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700 flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                    {selectedTicket ? formatDate(selectedTicket.validDate) : ''}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => handleEdit(selectedTicket!)}
                                className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Ticket
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
                return <TicketForm />;
            case 'edit':
                return <TicketForm isEdit={true} />;
            case 'detail':
                return <TicketDetailView />;
            default:
                return <TicketListView />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {renderCurrentView()}
        </div>
    );
};

export default AdminTicketSystem;