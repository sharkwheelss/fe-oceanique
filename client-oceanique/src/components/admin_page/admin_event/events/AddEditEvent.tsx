import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEvents } from '../../../../context/EventContext';
import { useBeaches } from '../../../../context/BeachContext';

const EventForm = () => {
    const { eventId } = useParams();
    const { getAdminEventDetails, adminCreateNewEvent, adminUpdateEvent } = useEvents();
    const { getAllBeaches } = useBeaches();
    const navigate = useNavigate();

    // Determine mode based on whether eventId exists in URL
    const mode = eventId ? 'edit' : 'add';
    const isEdit = mode === 'edit';

    const [eventData, setEventData] = useState({
        name: '',
        description: '',
        start_date: '',
        start_time: '',
        end_date: '',
        end_time: '',
        jenis: '',
        beach_id: '',
        beach_name: ''
    });
    const [beaches, setBeaches] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [keepExistingFiles, setKeepExistingFiles] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Fetch beaches data
    useEffect(() => {
        const fetchBeaches = async () => {
            try {
                const beachesData = await getAllBeaches();
                setBeaches(beachesData || []);
            } catch (error) {
                console.error('Error fetching beaches:', error);
            }
        };
        fetchBeaches();
    }, []);

    // Fetch event data when in edit mode
    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!eventId) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const eventResponse = await getAdminEventDetails(eventId);
                console.log('Event details response:', eventResponse);

                if (eventResponse && eventResponse.length > 0) {
                    const event = eventResponse[0];
                    setEventData({
                        name: event.name,
                        description: event.description,
                        start_date: formatDateForInput(event.start_date),
                        start_time: event.start_time,
                        end_date: formatDateForInput(event.end_date),
                        end_time: event.end_time,
                        jenis: event.jenis,
                        beach_id: event.beach_id,
                        beach_name: event.beach_name
                    });

                    // Handle existing images
                    if (event.path) {
                        const images = Array.isArray(event.path) ? event.path : [event.path];
                        setExistingImages(images);
                    }
                }
            } catch (error) {
                console.error('Error fetching event details:', error);
                setSubmitError('Failed to load event details');
            } finally {
                setIsLoading(false);
            }
        };
        fetchEventDetails();
    }, [eventId]);

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (submitError) {
            setSubmitError('');
        }
    };

    const handleBeachChange = (e) => {
        const selectedBeachId = e.target.value;
        const selectedBeach = beaches.find(beach => beach.id.toString() === selectedBeachId);

        setEventData(prev => ({
            ...prev,
            beach_id: selectedBeachId,
            beach_name: selectedBeach ? selectedBeach.name : ''
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        const required = ['name', 'description', 'start_date', 'start_time', 'end_date', 'end_time', 'beach_id'];
        const missing = required.filter(field => !eventData[field]);

        if (missing.length > 0) {
            setSubmitError(`Please fill in all required fields: ${missing.join(', ')}`);
            return false;
        }

        // Validate date logic
        const startDateTime = new Date(`${eventData.start_date}T${eventData.start_time}`);
        const endDateTime = new Date(`${eventData.end_date}T${eventData.end_time}`);

        if (endDateTime <= startDateTime) {
            setSubmitError('End date and time must be after start date and time');
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

            // Create FormData for file upload
            const formData = new FormData();

            // Append form fields
            formData.append('name', eventData.name);
            formData.append('description', eventData.description);
            formData.append('start_date', eventData.start_date);
            formData.append('start_time', eventData.start_time);
            formData.append('end_date', eventData.end_date);
            formData.append('end_time', eventData.end_time);
            formData.append('jenis', eventData.jenis);
            formData.append('beaches_id', eventData.beach_id);

            // Append files
            selectedFiles.forEach((file) => {
                formData.append('files', file);
            });

            // For edit mode, add keepExistingFiles parameter
            if (isEdit) {
                formData.append('keepExistingFiles', keepExistingFiles.toString());
            }

            let result;
            if (isEdit) {
                result = await adminUpdateEvent(eventId, formData);
            } else {
                result = await adminCreateNewEvent(formData);
            }

            if (result?.success) {
                navigate('/admin/events');
            } else {
                setSubmitError(result?.message || 'Failed to save event.');
            }
        } catch (error) {
            console.error('Error saving event:', error);
            setSubmitError(error.message);
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
                            onClick={() => navigate('/admin/events')}
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

            {isEdit && existingImages.length > 0 && (
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
                            Keep existing image files
                        </label>
                    </div>
                    {keepExistingFiles && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                            {existingImages.map((image, index) => (
                                <div key={index} className="relative">
                                    <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border">
                                        {typeof image === 'string' && (image.startsWith('http') || image.startsWith('data:')) ? (
                                            <img
                                                src={image}
                                                alt={`Existing image ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xs text-gray-500 text-center p-1">{image}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {(!isEdit || (isEdit && !keepExistingFiles)) && (
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
            )}


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


    if (isLoading) {
        return (
            <div className="flex-1 bg-gray-50 flex items-center justify-center">
                <div className="flex items-center">
                    <Loader2 className="w-6 h-6 mr-2 animate-spin text-teal-600" />
                    <span className="text-gray-600">Loading event details...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-gray-50">
            <Header title={isEdit ? "Edit Event" : "Add Event"} showBack={true} />
            <div className="p-8">
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
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
                                    value={eventData.name}
                                    onChange={handleInputChange}
                                    placeholder="Type here..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Event Type *
                                </label>
                                <select
                                    name="jenis"
                                    value={eventData.jenis}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                                    required
                                >
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={eventData.description}
                                onChange={handleInputChange}
                                placeholder="Type here..."
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
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
                                    name="start_date"
                                    value={eventData.start_date}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Time *
                                </label>
                                <input
                                    type="time"
                                    name="start_time"
                                    value={eventData.start_time}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
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
                                    name="end_date"
                                    value={eventData.end_date}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Time *
                                </label>
                                <input
                                    type="time"
                                    name="end_time"
                                    value={eventData.end_time}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location *
                            </label>
                            <select
                                name="beach_id"
                                value={eventData.beach_id}
                                onChange={handleBeachChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                                required
                            >
                                <option value="">Select a beach...</option>
                                {beaches.map((beach) => (
                                    <option key={beach.id} value={beach.id}>
                                        {beach.beach_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/events')}
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

export default EventForm;