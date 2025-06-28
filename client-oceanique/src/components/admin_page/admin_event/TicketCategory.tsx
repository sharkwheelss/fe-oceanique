import React, { useState } from 'react';
import { ArrowLeft, Search, Edit, Trash2, Plus, Loader2 } from 'lucide-react';

// Types
interface TicketCategory {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

// Mock data
const initialCategories: TicketCategory[] = [
    {
        id: '1',
        name: 'Regular',
        createdAt: '07 Mei 2025',
        updatedAt: '07 Mei 2025'
    },
    {
        id: '2',
        name: 'VIP',
        createdAt: '01 Januari 2025',
        updatedAt: '01 Januari 2025'
    }
];

// Header component matching events page style
const Header: React.FC<{ title: string; showBack?: boolean; onBack?: () => void }> = ({
    title,
    showBack = false,
    onBack
}) => (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                {showBack && (
                    <button
                        onClick={onBack}
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

// Add Ticket Category Page
const AddTicketCategory: React.FC<{
    onBack: () => void;
    onSave: (name: string) => void;
    isSubmitting?: boolean;
    submitError?: string;
}> = ({ onBack, onSave, isSubmitting = false, submitError = '' }) => {
    const [categoryName, setCategoryName] = useState('');

    const handleSave = () => {
        if (categoryName.trim()) {
            onSave(categoryName.trim());
            setCategoryName('');
        }
    };

    return (
        <div className="flex-1 bg-gray-50">
            <Header title="Add Ticket Category" showBack={true} onBack={onBack} />
            <div className="p-8">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    {submitError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600">{submitError}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category Name *
                            </label>
                            <input
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="Type here..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50"
                                required
                            />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={onBack}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSubmitting || !categoryName.trim()}
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

// Edit Ticket Category Page
const EditTicketCategory: React.FC<{
    category: TicketCategory;
    onBack: () => void;
    onSave: (id: string, name: string) => void;
    isSubmitting?: boolean;
    submitError?: string;
}> = ({ category, onBack, onSave, isSubmitting = false, submitError = '' }) => {
    const [categoryName, setCategoryName] = useState(category.name);

    const handleSave = () => {
        if (categoryName.trim()) {
            onSave(category.id, categoryName.trim());
        }
    };

    return (
        <div className="flex-1 bg-gray-50">
            <Header title="Edit Ticket Category" showBack={true} onBack={onBack} />
            <div className="p-8">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    {submitError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600">{submitError}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category Name *
                            </label>
                            <input
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-50"
                                required
                            />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={onBack}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSubmitting || !categoryName.trim()}
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

// List Ticket Categories Page
const ListTicketCategories: React.FC<{
    categories: TicketCategory[];
    onAdd: () => void;
    onEdit: (category: TicketCategory) => void;
    onDelete: (id: string) => void;
    loading?: boolean;
    error?: string;
}> = ({ categories, onAdd, onEdit, onDelete, loading = false, error = '' }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 bg-gray-50">
            <Header title="Ticket Categories" />
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
                                onClick={onAdd}
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
                                <span className="ml-2 text-gray-600">Loading categories...</span>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created At
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Updated At
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredCategories.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                No categories found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCategories.map((category) => (
                                            <tr key={category.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {category.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {category.createdAt}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {category.updatedAt}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => onEdit(category)}
                                                            className="text-teal-600 hover:text-teal-900 transition-colors"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => onDelete(category.id)}
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
};

// Main Ticket Category Component
const TicketCategoryManagement: React.FC = () => {
    const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>('list');
    const [categories, setCategories] = useState<TicketCategory[]>(initialCategories);
    const [editingCategory, setEditingCategory] = useState<TicketCategory | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const resetForm = () => {
        setEditingCategory(null);
        setSubmitError('');
    };

    const handleAddCategory = async (name: string) => {
        setIsSubmitting(true);
        setSubmitError('');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newCategory: TicketCategory = {
                id: Date.now().toString(),
                name,
                createdAt: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
                updatedAt: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
            };

            setCategories([...categories, newCategory]);
            setCurrentView('list');
            resetForm();
        } catch (error) {
            setSubmitError('Failed to add category');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditCategory = async (id: string, name: string) => {
        setIsSubmitting(true);
        setSubmitError('');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setCategories(categories.map(cat =>
                cat.id === id
                    ? { ...cat, name, updatedAt: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) }
                    : cat
            ));

            setCurrentView('list');
            resetForm();
        } catch (error) {
            setSubmitError('Failed to update category');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                setCategories(categories.filter(cat => cat.id !== id));
            } catch (error) {
                alert('Failed to delete category');
            }
        }
    };

    const handleEditClick = (category: TicketCategory) => {
        setEditingCategory(category);
        setCurrentView('edit');
    };

    const handleBack = () => {
        setCurrentView('list');
        resetForm();
    };

    // Render based on current view
    if (currentView === 'list') {
        return (
            <ListTicketCategories
                categories={categories}
                onAdd={() => setCurrentView('add')}
                onEdit={handleEditClick}
                onDelete={handleDeleteCategory}
                loading={loading}
                error={error}
            />
        );
    }

    if (currentView === 'add') {
        return (
            <AddTicketCategory
                onBack={handleBack}
                onSave={handleAddCategory}
                isSubmitting={isSubmitting}
                submitError={submitError}
            />
        );
    }

    if (currentView === 'edit' && editingCategory) {
        return (
            <EditTicketCategory
                category={editingCategory}
                onBack={handleBack}
                onSave={handleEditCategory}
                isSubmitting={isSubmitting}
                submitError={submitError}
            />
        );
    }

    return null;
};

export default TicketCategoryManagement;