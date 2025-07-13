import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { useTickets } from '../../../../context/TicketContext';
import DialogMessage from '../../../../components/helper/DialogMessage';
import { useDialog } from '../../../../components/helper/useDialog';

// Types
interface TicketCategory {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

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
    onDelete: (id: string, name: string) => void;
    loading?: boolean;
    error?: string;
}> = ({ categories, onAdd, onEdit, onDelete, loading = false, error = '' }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

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
                                    placeholder="Search categories..."
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
                                Add Category
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
                                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                {loading ? 'Loading...' : 'No categories found'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCategories.map((category) => (
                                            <tr key={category.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {category.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(category.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(category.updated_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => onEdit(category)}
                                                            className="text-teal-600 hover:text-teal-900 transition-colors"
                                                            title="Edit category"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => onDelete(category.id, category.name)}
                                                            className="text-red-600 hover:text-red-900 transition-colors"
                                                            title="Delete category"
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
    const [categories, setCategories] = useState<TicketCategory[]>([]);
    const [editingCategory, setEditingCategory] = useState<TicketCategory | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Use the reusable dialog hook
    const [dialogState, { showSuccess, showError, showWarning, closeDialog }] = useDialog();

    const { getAdminTicketCategories,
        adminCreateNewTicketCategories,
        adminUpdateTicketCategories,
        adminDeleteTicketCategories } = useTickets();

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await getAdminTicketCategories();
            console.log('Categories response:', response);

            // Handle response structure similar to your events page
            if (response && response.data) {
                setCategories(response.data);
            } else if (Array.isArray(response)) {
                setCategories(response);
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to load categories. Please try again.');
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const resetForm = () => {
        setEditingCategory(null);
        setSubmitError('');
    };

    const handleAddCategory = async (name: string) => {
        setIsSubmitting(true);
        setSubmitError('');

        try {
            const result = await adminCreateNewTicketCategories(name);

            if (result) {
                // Refresh the categories list
                await fetchCategories();
                setCurrentView('list');
                resetForm();
                showSuccess(
                    'Add Category Successful',
                    'Category has been added successfully!',
                    {
                        showCancel: false,
                        onConfirm: () => {
                            closeDialog();
                        }
                    }
                );
            } else {
                setSubmitError('Failed to add category');
            }
        } catch (error) {
            console.error('Add category error:', error);
            setSubmitError('An error occurred while adding the category.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditCategory = async (id: string, name: string) => {
        setIsSubmitting(true);
        setSubmitError('');

        try {
            const result = await adminUpdateTicketCategories(parseInt(id), name);

            if (result) {
                // Refresh the categories list
                await fetchCategories();
                setCurrentView('list');
                resetForm();
                showSuccess(
                    'Update Category Successful',
                    'Category has been updated successfully!',
                    {
                        showCancel: false,
                        onConfirm: () => {
                            closeDialog();
                        }
                    }
                );
            } else {
                setSubmitError('Failed to update category');
            }
        } catch (error) {
            console.error('Update category error:', error);
            setSubmitError('An error occurred while updating the category.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCategory = async (id: string, categoryName: string) => {
        // First show confirmation dialog
        showWarning(
            'Delete Category',
            `Are you sure you want to delete "${categoryName}"? This action cannot be undone.`,
            {
                showCancel: true,
                confirmText: 'Delete',
                cancelText: 'Cancel',
                onConfirm: async () => {
                    // Close the warning dialog first
                    closeDialog();

                    try {
                        // Perform the delete operation
                        const result = await adminDeleteTicketCategories(parseInt(id));

                        // Check if the deletion was successful
                        if (result?.message?.toLowerCase().includes('success')) {
                            showSuccess(
                                'Delete Category Successful',
                                `"${categoryName}" has been deleted successfully.`,
                                {
                                    showCancel: false,
                                    onConfirm: async () => {
                                        closeDialog();
                                        // Reload the categories data after successful deletion
                                        await fetchCategories();
                                    }
                                }
                            );
                        } else {
                            showError(
                                'Delete Category Failed',
                                result?.message || 'Failed to delete category. Please try again.',
                                {
                                    showCancel: false,
                                    onConfirm: () => {
                                        closeDialog();
                                    }
                                }
                            );
                        }
                    } catch (error) {
                        console.error('Delete error:', error);
                        showError(
                            'Delete Category Failed',
                            'An unexpected error occurred while deleting the category.',
                            {
                                showCancel: false,
                                onConfirm: () => {
                                    closeDialog();
                                }
                            }
                        );
                    }
                }
            }
        );
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
    return (
        <>
            {/* Reusable Dialog Component */}
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

            {currentView === 'list' && (
                <ListTicketCategories
                    categories={categories}
                    onAdd={() => setCurrentView('add')}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteCategory}
                    loading={loading}
                    error={error}
                />
            )}

            {currentView === 'add' && (
                <AddTicketCategory
                    onBack={handleBack}
                    onSave={handleAddCategory}
                    isSubmitting={isSubmitting}
                    submitError={submitError}
                />
            )}

            {currentView === 'edit' && editingCategory && (
                <EditTicketCategory
                    category={editingCategory}
                    onBack={handleBack}
                    onSave={handleEditCategory}
                    isSubmitting={isSubmitting}
                    submitError={submitError}
                />
            )}
        </>
    );
};

export default TicketCategoryManagement;