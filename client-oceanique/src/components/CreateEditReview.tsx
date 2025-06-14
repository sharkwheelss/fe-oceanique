import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, Check, X } from 'lucide-react';
import { useBeaches } from '../context/BeachContext';

interface CreateEditReviewProps {
    reviewId?: string; // Changed from existingReview object to reviewId string
    isLoading?: boolean;
}

interface ReviewFormData {
    rating: number;
    comment: string;
    optionVotes: number[];
    photos: File[];
}

interface Option {
    id: number;
    name: string;
    preference_categories_id: number;
}

interface Category {
    id: number;
    name: string;
    options: Option[];
}

interface PopupState {
    show: boolean;
    type: 'success' | 'error';
    message: string;
}

interface ReviewDetails {
    id: number;
    rating: number;
    user_review: string;
    beaches_id: number;
    beach_name: string;
    option_votes: string;
    path: string | null;
}

/**
 * Dynamic Beach Review Form Component
 * Handles both adding new reviews and editing existing ones
 */
export default function CreateEditReview({
    isLoading = false,
}: CreateEditReviewProps) {
    const { beachId, reviewId } = useParams();
    const isEditMode = !!reviewId;

    console.log(reviewId)
    // State for form data
    const [formData, setFormData] = useState<ReviewFormData>({
        rating: 5,
        comment: '',
        optionVotes: [],
        photos: []
    });

    // State for photo previews
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
    const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
    const [newPhotos, setNewPhotos] = useState<File[]>([]);

    // State for dropdown selection
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    // State for dynamic categories and options
    const [categories, setCategories] = useState<Category[]>([]);
    const [optionsLoading, setOptionsLoading] = useState(true);

    // State for review details (edit mode)
    const [reviewDetails, setReviewDetails] = useState<ReviewDetails | null>(null);
    const [reviewLoading, setReviewLoading] = useState(false);

    // State for submission
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State for popup
    const [popup, setPopup] = useState<PopupState>({
        show: false,
        type: 'success',
        message: ''
    });

    const { getListOptions, addBeachReviews, getDetailsReview, editDetailsReview } = useBeaches();

    // Category names mapping (you can adjust these based on your preference_categories)
    const categoryNames: { [key: number]: string } = {
        1: 'Accessibility',
        2: 'Activity',
        3: 'Beach Type',
        4: 'Facility',
        5: 'Cleanliness',
        6: 'Budget',
        7: 'Weather'
    };

    // Fetch review details if in edit mode
    useEffect(() => {
        const fetchReviewDetails = async () => {
            if (!isEditMode || !reviewId) return;

            try {
                setReviewLoading(true);
                const response = await getDetailsReview(reviewId);
                console.log('Fetched review details:', response);

                if (response) {
                    setReviewDetails(response);

                    // Parse option_votes string to array of numbers
                    const optionVotesArray = response.option_votes
                        ? response.option_votes.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
                        : [];

                    // Set form data with fetched review details
                    setFormData({
                        rating: response.rating,
                        comment: response.user_review,
                        optionVotes: optionVotesArray,
                        photos: [] // Keep this empty for new photos only
                    });

                    // Handle existing photos separately
                    if (response.path) {
                        const photoUrls = response.path.split(',').filter(url => url.trim());
                        setExistingPhotos(photoUrls);
                        setPhotoPreviews(photoUrls); // Show existing photos in preview
                    }
                }
            } catch (error) {
                console.error('Error fetching review details:', error);
                setPopup({
                    show: true,
                    type: 'error',
                    message: 'Failed to load review details. Please try again.'
                });
            } finally {
                setReviewLoading(false);
            }
        };

        fetchReviewDetails();
    }, [reviewId, isEditMode]);

    // Fetch options from API on component mount
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                setOptionsLoading(true);
                const response = await getListOptions();

                if (response) {
                    // Group options by preference_categories_id
                    const groupedOptions: { [key: number]: Option[] } = {};

                    response.forEach((option: Option) => {
                        if (!groupedOptions[option.preference_categories_id]) {
                            groupedOptions[option.preference_categories_id] = [];
                        }
                        groupedOptions[option.preference_categories_id].push(option);
                    });

                    // Convert to categories array
                    const categoriesArray: Category[] = Object.keys(groupedOptions).map(categoryId => ({
                        id: parseInt(categoryId),
                        name: categoryNames[parseInt(categoryId)] || `Category ${categoryId}`,
                        options: groupedOptions[parseInt(categoryId)]
                    }));

                    setCategories(categoriesArray);
                }
            } catch (error) {
                console.error('Error fetching options:', error);
                setPopup({
                    show: true,
                    type: 'error',
                    message: 'Failed to load beach options. Please refresh the page.'
                });
            } finally {
                setOptionsLoading(false);
            }
        };

        fetchOptions();
    }, []);

    // Get option name by ID
    const getOptionName = (optionId: number): string => {
        for (const category of categories) {
            const option = category.options.find(opt => opt.id === optionId);
            if (option) return option.name;
        }
        return `Option ${optionId}`;
    };

    /**
     * Close popup and handle navigation if success
     */
    const closePopup = (): void => {
        setPopup({ show: false, type: 'success', message: '' });

        // If it was a success popup, navigate back to review page
        if (popup.type === 'success') {
            window.history.back();
        }
    };

    /**
     * Toggle dropdown menu visibility
     */
    const toggleDropdown = (categoryName: string): void => {
        if (openDropdown === categoryName) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(categoryName);
        }
    };

    /**
     * Handle selecting/deselecting beach features
     */
    const handleFeatureToggle = (optionId: number): void => {
        if (formData.optionVotes.includes(optionId)) {
            setFormData({
                ...formData,
                optionVotes: formData.optionVotes.filter(id => id !== optionId)
            });
        } else {
            setFormData({
                ...formData,
                optionVotes: [...formData.optionVotes, optionId]
            });
        }
    };

    /**
     * Handle photo selection
     */
    const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const files = event.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        const totalPhotos = existingPhotos.length + newPhotos.length + newFiles.length;

        // Limit to 5 photos total (existing + new)
        if (totalPhotos > 5) {
            setPopup({
                show: true,
                type: 'error',
                message: 'Maximum 5 photos allowed'
            });
            return;
        }

        const updatedNewPhotos = [...newPhotos, ...newFiles];
        setNewPhotos(updatedNewPhotos);

        // Update formData with new photos
        setFormData({
            ...formData,
            photos: updatedNewPhotos
        });

        // Create preview URLs for new files and combine with existing
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setPhotoPreviews(prev => [...prev, ...newPreviews]);
    };

    /**
     * Remove a photo
     */
    const removePhoto = (index: number): void => {
        const isExistingPhoto = index < existingPhotos.length;

        if (isExistingPhoto) {
            // Remove from existing photos
            const updatedExistingPhotos = existingPhotos.filter((_, i) => i !== index);
            setExistingPhotos(updatedExistingPhotos);
        } else {
            // Remove from new photos
            const newPhotoIndex = index - existingPhotos.length;
            const updatedNewPhotos = newPhotos.filter((_, i) => i !== newPhotoIndex);
            setNewPhotos(updatedNewPhotos);

            // Update formData
            setFormData({
                ...formData,
                photos: updatedNewPhotos
            });

            // Revoke URL for new photo
            if (photoPreviews[index].startsWith('blob:')) {
                URL.revokeObjectURL(photoPreviews[index]);
            }
        }

        // Update previews
        const updatedPreviews = photoPreviews.filter((_, i) => i !== index);
        setPhotoPreviews(updatedPreviews);
    };

    /**
     * Handle form submission
     */
    const handleSubmit = async (): Promise<void> => {
        // Validate required fields
        if (!formData.rating || !formData.comment.trim() || formData.optionVotes.length === 0) {
            setPopup({
                show: true,
                type: 'error',
                message: 'Please fill in all required fields'
            });
            return;
        }

        setIsSubmitting(true);

        // Create FormData for multipart/form-data submission
        const submitData = new FormData();

        // Add text fields
        const currentBeachId = isEditMode && reviewDetails ? reviewDetails.beaches_id.toString() : (beachId ?? "");
        submitData.append('beachId', currentBeachId);
        submitData.append('rating', formData.rating.toString());
        submitData.append('comment', formData.comment);

        // Add option votes as individual form fields
        formData.optionVotes.forEach((optionId) => {
            submitData.append('optionVotes', optionId.toString());
        });

        // Add new photos only
        formData.photos.forEach((photo) => {
            submitData.append('files', photo);
        });

        // IMPORTANT: Tell backend whether to keep existing files
        if (isEditMode) {
            // Keep existing files if user hasn't removed any existing photos
            const keepExisting = existingPhotos.length > 0;
            submitData.append('keepExistingFiles', keepExisting.toString());
            submitData.append('reviewId', reviewId);
        }

        try {
            if (isEditMode) {
                await editDetailsReview(reviewId, submitData);
            } else {
                await addBeachReviews(submitData);
            }

            setPopup({
                show: true,
                type: 'success',
                message: isEditMode
                    ? 'Review updated successfully!'
                    : 'Review submitted successfully!'
            });
        } catch (error) {
            console.error('Error submitting review:', error);
            setPopup({
                show: true,
                type: 'error',
                message: 'Failed to save review. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Cleanup preview URLs on unmount
    useEffect(() => {
        return () => {
            photoPreviews.forEach(url => {
                if (url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, []);

    // Show loading state
    if (optionsLoading || (isEditMode && reviewLoading)) {
        return (
            <div className="max-w-4xl mx-auto p-4 bg-white">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">
                            {isEditMode ? 'Loading review details...' : 'Loading beach options...'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 bg-white">
            {/* Popup Modal */}
            {popup.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg">
                        <div className="text-center">
                            {popup.type === 'success' ? (
                                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                                    <Check size={32} className="text-green-500" />
                                </div>
                            ) : (
                                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                                    <X size={32} className="text-red-500" />
                                </div>
                            )}
                            <h3 className={`text-lg font-semibold mb-2 ${popup.type === 'success' ? 'text-green-700' : 'text-red-700'
                                }`}>
                                {popup.type === 'success' ? 'Success!' : 'Error'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {popup.message}
                            </p>
                            <button
                                onClick={closePopup}
                                className={`px-6 py-2 rounded-full text-white font-medium ${popup.type === 'success'
                                    ? 'bg-green-500 hover:bg-green-600'
                                    : 'bg-red-500 hover:bg-red-600'
                                    } transition-colors`}
                            >
                                {popup.type === 'success' ? 'Continue' : 'Try Again'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header with back button */}
            <div className="flex items-center mb-6">
                <button
                    className="rounded-full bg-teal-500 p-2 mr-3"
                    onClick={() => window.history.back()}
                    disabled={isLoading || isSubmitting}
                >
                    <ChevronLeft size={24} className="text-white" />
                </button>
                <h1 className="text-xl text-gray-600">
                    {isEditMode && reviewDetails ? reviewDetails.beach_name : 'Pantai'} / {isEditMode ? 'Edit Review' : 'Your Review'}
                </h1>
            </div>

            <div>
                {/* Photo Upload Section */}
                <div className="mb-6">
                    <label className="block mb-2">
                        Upload your photos {!isEditMode && <span className="text-red-500">*</span>}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {/* Photo previews */}
                        {photoPreviews.map((preview, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={preview.startsWith('http') || preview.startsWith('blob:')
                                        ? preview
                                        : `http://localhost:5000/uploads/contents/${preview}`
                                    }
                                    alt={`Preview ${index + 1}`}
                                    className="w-32 h-32 object-cover rounded border"
                                />
                                <button
                                    type="button"
                                    onClick={() => removePhoto(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                    disabled={isLoading || isSubmitting}
                                >
                                    <X size={12} />
                                </button>
                                {/* Show indicator for existing vs new photos */}
                                {index < existingPhotos.length && (
                                    <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                                        Existing
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Add photo button */}
                        {photoPreviews.length < 5 && (
                            <label className="w-32 h-32 bg-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,video/*"
                                    onChange={handlePhotoSelect}
                                    className="hidden"
                                    disabled={isLoading || isSubmitting}
                                />
                                <span className="text-3xl">+</span>
                            </label>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        {photoPreviews.length}/5 photos selected
                    </p>
                </div>

                {/* Rating Section */}
                <div className="mb-6">
                    <label className="block mb-2">
                        Your Rating <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center">
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={formData.rating}
                            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                            className="w-64 h-2 bg-gray-300 rounded outline-none appearance-none"
                            disabled={isLoading || isSubmitting}
                        />
                        <div className="flex items-center ml-4">
                            <span className="text-gray-500 mr-4">1</span>
                            <span className="font-medium text-lg">{formData.rating}</span>
                            <span className="text-gray-500 ml-4">5</span>
                        </div>
                    </div>
                </div>

                {/* Review Text Section */}
                <div className="mb-6">
                    <label className="block mb-2">
                        Your Review <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={formData.comment}
                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                        placeholder="Share your experience at this beach..."
                        className="w-full border rounded p-3 h-32 resize-none"
                        disabled={isLoading || isSubmitting}
                    />
                </div>

                {/* Beach Features Section */}
                <div className="mb-10">
                    <label className="block mb-2">
                        What did you find on this beach? <span className="text-red-500">*</span>
                    </label>

                    {/* Dropdown Categories */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {categories.map((category) => (
                            <div key={category.id} className="relative">
                                <button
                                    type="button"
                                    onClick={() => toggleDropdown(category.name)}
                                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded flex items-center transition-colors"
                                    disabled={isLoading || isSubmitting}
                                >
                                    {category.name}
                                    <span className="ml-2">▼</span>
                                </button>

                                {/* Dropdown Menu */}
                                {openDropdown === category.name && (
                                    <div className="absolute top-full left-0 bg-white shadow-lg rounded p-2 z-10 mt-1 w-48 border max-h-48 overflow-y-auto">
                                        {category.options.map(option => (
                                            <div
                                                key={option.id}
                                                onClick={() => handleFeatureToggle(option.id)}
                                                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                            >
                                                {formData.optionVotes.includes(option.id) && (
                                                    <Check size={16} className="text-green-500 mr-2" />
                                                )}
                                                <span className="text-sm">{option.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Selected Features Tags */}
                    <div className="flex flex-wrap gap-2">
                        {formData.optionVotes.map((optionId) => (
                            <div
                                key={optionId}
                                className="bg-white border border-gray-200 rounded-full px-3 py-1 flex items-center"
                            >
                                <Check size={16} className="text-green-500 mr-1" />
                                <span className="text-sm">{getOptionName(optionId)}</span>
                                <button
                                    type="button"
                                    onClick={() => handleFeatureToggle(optionId)}
                                    className="ml-2 text-gray-400 hover:text-red-500"
                                    disabled={isLoading || isSubmitting}
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {formData.optionVotes.length === 0 && (
                        <p className="text-gray-500 text-sm mt-2">
                            Please select at least one option from the categories above.
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="px-8 py-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                        disabled={isLoading || isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full transition-colors disabled:bg-gray-400"
                        disabled={isLoading || optionsLoading || isSubmitting || (isEditMode && reviewLoading)}
                    >
                        {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Review' : 'Save Review')}
                    </button>
                </div>
            </div>
        </div>
    );
}