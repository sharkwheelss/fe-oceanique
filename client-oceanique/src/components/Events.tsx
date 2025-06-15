import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { useNavigate } from 'react-router-dom';

// Event type based on API response
interface Event {
    id: number;
    name: string;
    description: string;
    is_active: number;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    jenis: string;
    beaches_id: number;
    users_id: number;
    beach_name: string;
    province: string;
    city: string;
    subdistrict: string;
    path: string;
    status: string;
    img_path: string;
}

// Define the Filters type
interface Filters {
    province: string;
    city: string;
    subdistrict: string;
    status: string;
}

const EventsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [events, setEvents] = useState<Event[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<Filters>({
        province: '',
        city: '',
        subdistrict: '',
        status: ''
    });

    const navigate = useNavigate();
    const { getAllEvents } = useEvents();

    // Fetch events on component mount
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const eventsResponse = await getAllEvents();

                if (eventsResponse && eventsResponse) {
                    setEvents(eventsResponse);
                    setFilteredEvents(eventsResponse);
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Filter events based on search and filters
    useEffect(() => {
        let filtered = events;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(event =>
                event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.beach_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.province.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Province filter
        if (filters.province) {
            filtered = filtered.filter(event => event.province === filters.province);
        }

        // City filter
        if (filters.city) {
            filtered = filtered.filter(event => event.city === filters.city);
        }

        // Subdistrict filter
        if (filters.subdistrict) {
            filtered = filtered.filter(event => event.subdistrict === filters.subdistrict);
        }

        // Status filter
        if (filters.status) {
            filtered = filtered.filter(event => event.status === filters.status);
        }

        setFilteredEvents(filtered);
    }, [searchQuery, filters, events]);

    // Get unique values for filter dropdowns
    const getUniqueProvinces = () => [...new Set(events.map(event => event.province))];
    const getUniqueCities = () => [...new Set(events.map(event => event.city))];
    const getUniqueSubdistricts = () => [...new Set(events.map(event => event.subdistrict))];
    const getUniqueStatuses = () => [...new Set(events.map(event => event.status))];

    // Handler for search input changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchQuery(e.target.value);
    };

    // Handler for filter changes
    const handleFilterChange = (filterName: keyof Filters, value: string): void => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            province: '',
            city: '',
            subdistrict: '',
            status: ''
        });
        setSearchQuery('');
    };

    const FilterDropdown: React.FC<{
        label: string;
        value: string;
        onChange: (value: string) => void;
        options: string[];
    }> = ({ label, value, onChange, options }) => {
        const [isOpen, setIsOpen] = useState(false);

        const toggleDropdown = () => setIsOpen(!isOpen);

        const handleSelect = (option: string): void => {
            onChange(option);
            setIsOpen(false);
        };

        return (
            <div className="relative">
                <button
                    onClick={toggleDropdown}
                    className="bg-gray-200 text-gray-700 px-4 py-3 rounded-md min-w-36 flex items-center justify-between"
                >
                    <span className="truncate">{value || label}</span>
                    <ChevronDown />
                </button>

                {isOpen && (
                    <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        <div
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelect('')}
                        >
                            All
                        </div>
                        {options.map((option) => (
                            <div
                                key={option}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelect(option)}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ongoing':
                return 'bg-green-500 text-white';
            case 'ended soon':
                return 'bg-yellow-500 text-white';
            case 'ended':
                return 'bg-red-500 text-white';
            case 'upcoming':
                return 'bg-blue-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'ongoing':
                return 'Ongoing';
            case 'ended soon':
                return 'Ended Soon';
            case 'ended':
                return 'Ended';
            case 'upcoming':
                return 'Ongoing';
            default:
                return 'Unknown';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading events...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Search and Filters */}
            <div className="container sticky top-[72px] z-40 bg-white mx-auto px-4 py-6">
                <div className="flex flex-wrap justify-center gap-4">
                    <div className="relative flex-grow max-w-lg">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="pl-10 pr-4 py-3 bg-gray-200 rounded-md w-full outline-none"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <FilterDropdown
                        label="Province"
                        value={filters.province}
                        onChange={(val: string) => handleFilterChange('province', val)}
                        options={getUniqueProvinces()}
                    />
                    <FilterDropdown
                        label="City"
                        value={filters.city}
                        onChange={(val: string) => handleFilterChange('city', val)}
                        options={getUniqueCities()}
                    />
                    <FilterDropdown
                        label="Subdistrict"
                        value={filters.subdistrict}
                        onChange={(val: string) => handleFilterChange('subdistrict', val)}
                        options={getUniqueSubdistricts()}
                    />
                    <FilterDropdown
                        label="Status"
                        value={filters.status}
                        onChange={(val: string) => handleFilterChange('status', val)}
                        options={getUniqueStatuses()}
                    />

                    <button
                        className="bg-red-500 text-white px-6 py-3 rounded-md font-medium hover:bg-red-600 transition-colors"
                        onClick={clearFilters}
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* Events Grid */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">All Available Events</h2>

                {filteredEvents.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                                onClick={() => { navigate(`/event-detail/${event.id}`); }}>
                                {/* Event Image */}
                                <div className="relative h-48">
                                    <img
                                        src={event.img_path}
                                        alt={event.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Event Content */}
                                <div className="p-4">
                                    {/* Event Title */}
                                    <h3 className="font-bold text-lg mb-2 text-gray-900">
                                        {event.name}
                                        <span className={`ml-2 top-3 left-3 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                                            {getStatusText(event.status)}
                                        </span>
                                    </h3>


                                    {/* Date and Time */}
                                    <div className="flex items-center text-sm text-gray-600 mb-2">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span>{formatDate(event.start_date)} - {formatDate(event.end_date)}</span>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center text-sm text-gray-600 mb-3">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>{event.beach_name}</span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {event.description}
                                    </p>

                                    {/* Action Button */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-sm">
                                            <Users className="w-4 h-4 mr-1 text-gray-400" />
                                            <span className={`px-2 py-1 rounded text-xs ${event.jenis === 'public' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {event.jenis === 'public' ? 'Public' : 'Private'}
                                            </span>
                                        </div>
                                        <button className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors duration-200">
                                            See Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// ChevronDown icon component
const ChevronDown = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
};

export default EventsPage;