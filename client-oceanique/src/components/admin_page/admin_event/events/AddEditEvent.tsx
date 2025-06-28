import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';

const EventForm = ({
    mode = 'add', // 'add' or 'edit'
    eventData = null,
    isSubmitting = false,
    submitError = ''
}) => {
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

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [keepExistingFiles, setKeepExistingFiles] = useState(true);

    // Initialize form data when eventData changes (for edit mode)
    useEffect(() => {
        if (mode === 'edit' && eventData) {
            setFormData({
                name: eventData.name || '',
                description: eventData.description || '',
                type: eventData.type || '',
                startDate: eventData.startDate || '',
                startTime: eventData.startTime || '',
                endDate: eventData.endDate || '',
                endTime: eventData.endTime || '',
                location: eventData.location || ''
            });
            setSelectedFiles([]);
            setKeepExistingFiles(true);
        } else {
            // Reset form for add mode
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
            setSelectedFiles([]);
            setKeepExistingFiles(true);
        }
    }, [mode, eventData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        // Create FormData for file upload
        const submitData = new FormData();

        // Append form fields
        Object.keys(formData).forEach(key => {
            submitData.append(key, formData[key]);
        });

        // Append files
        selectedFiles.forEach((file) => {
            submitData.append('images', file);
        });

        // For edit mode, add keepExistingFiles parameter
        if (mode === 'edit') {
            submitData.append('keepExistingFiles', keepExistingFiles);
        }

        // Call the parent's onSave function
        onSave(submitData, formData);
    };

    const Header = ({ title, showBack = false }) => (
        <div className="bg-white border-b border-gray-200 px-8 py-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {showBack && (
                        <button
                            onClick={onCancel}
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

    // File Upload Component
    const FileUploadSection = ({ isEdit = false }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Images
            </label>

            {isEdit && eventData?.images?.length > 0 && (
                <div className="mb-4">
                    <div className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            id="keepExistingFiles"
                            checked={keepExistingFiles}
                            onChange={(e) => setKeepExistingFiles(e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="keepExistingFiles" className="text-sm text-gray-600">
                            Keep existing images ({eventData.images.length} files)
                        </label>
                    </div>
                    {keepExistingFiles && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                            {eventData.images.map((image, index) => (
                                <div key={index} className="relative">
                                    <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <span className="text-xs text-gray-500 text-center p-1">
                                            {image}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
                <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                                {isEdit ? 'Upload additional images' : 'Upload event images'}
                            </span>
                            <span className="mt-1 block text-sm text-gray-500">
                                PNG, JPG, GIF up to 10MB each
                            </span>
                        </label>
                        <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
            </div>

            {selectedFiles.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                        {isEdit ? 'New images to upload:' : 'Selected files:'}
                    </h4>
                    <div className="space-y-2">
                        {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <span className="text-sm text-gray-600">{file.name}</span>
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const isEdit = mode === 'edit';

    return (
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

                        <FileUploadSection isEdit={isEdit} />

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
                                onClick={onCancel}
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
};

export default EventForm;