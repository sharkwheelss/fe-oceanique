import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, MapPin, Star, Calendar, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define the Filters type
type Filters = {
    province: string;
    city: string;
    subdistrict: string;
    priceRange: string;
};

const Events = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        province: '',
        city: '',
        subdistrict: '',
        status: ''
    });

    // Dummy events data
    const events = [
        {
            id: 1,
            title: 'Event Mid Sea Shore',
            dateRange: '26 April - 3 May 2025',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard...',
            status: 'ongoing',
            isPublic: true,
            image: '/api/placeholder/300/180'
        },
        {
            id: 2,
            title: 'Event Mid Sea Shore',
            dateRange: '26 April - 3 May 2025',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard...',
            status: 'ended',
            isPublic: false,
            image: '/api/placeholder/300/180'
        },
        {
            id: 3,
            title: 'Event Mid Sea Shore',
            dateRange: '26 April - 3 May 2025',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard...',
            status: 'ongoing',
            isPublic: true,
            image: '/api/placeholder/300/180'
        },
        {
            id: 4,
            title: 'Event Mid Sea Shore',
            dateRange: '26 April - 3 May 2025',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard...',
            status: 'ongoing',
            isPublic: true,
            image: '/api/placeholder/300/180'
        },
        {
            id: 5,
            title: 'Event Mid Sea Shore',
            dateRange: '26 April - 3 May 2025',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard...',
            status: 'ended',
            isPublic: false,
            image: '/api/placeholder/300/180'
        },
        {
            id: 6,
            title: 'Event Mid Sea Shore',
            dateRange: '26 April - 3 May 2025',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard...',
            status: 'ongoing',
            isPublic: true,
            image: '/api/placeholder/300/180'
        }
    ];

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


    const FilterDropdown: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => {
        const [isOpen, setIsOpen] = useState(false);

        // Sample options for the dropdown
        const options = ['Option 1adwd', 'Option 2', 'Option 3'];

        // Toggle dropdown open/close
        const toggleDropdown = () => {
            setIsOpen(!isOpen);
        };

        // Handle option selection
        const handleSelect = (option: string): void => {
            onChange(option);
            setIsOpen(false);
        };

        return (
            <div>
                <button
                    onClick={toggleDropdown}
                    className="bg-gray-200 text-gray-700 px-4 py-3 rounded-md min-w-36 flex items-center justify-between"
                >
                    <span className="truncate">{value || label}</span>
                    <ChevronDown />
                </button>

                {isOpen && (
                    <div
                        className={`absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                            }`}
                        style={{ width: `${Math.max(...options.map(option => option.length)) * 10 + 20}px` }}
                    >
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
    }
    const [currentIndex, setCurrentIndex] = useState(0);

    function handlePrev(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }

    function handleNext(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, events.length - 1));
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
                            placeholder="Search..."
                            className="pl-10 pr-4 py-3 bg-gray-200 rounded-md w-full outline-none"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <FilterDropdown label="Province" value={filters.province} onChange={(val: string) => handleFilterChange('province', val)} />
                    <FilterDropdown label="City" value={filters.city} onChange={(val: string) => handleFilterChange('city', val)} />
                    <FilterDropdown label="Subdistrict" value={filters.subdistrict} onChange={(val: string) => handleFilterChange('subdistrict', val)} />
                    <FilterDropdown label="Estimate Price" value={filters.status} onChange={(val: string) => handleFilterChange('priceRange', val)} />

                    <button className="bg-teal-500 text-white px-8 py-3 rounded-md font-medium hover:bg-teal-600 transition-colors">
                        Filter
                    </button>
                </div>
            </div>

            {/* Section Template Component */}
            {[{ title: 'Near You' }, { title: 'Sabang to Merauke' }].map((section, idx) => (
                <section key={idx} className="container mx-auto px-4 pt-4 pb-8">
                    <h2 className="text-2xl font-bold mb-4 text-center">{section.title}</h2>
                    <div className="border-t border-gray-200 pt-4">
                        <div className="relative">
                            <div className="flex justify-center overflow-hidden">
                                <div
                                    className="flex gap-6 transition-transform duration-300"
                                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                                >
                                    {events.map((beach) => (
                                        <div
                                            key={beach.id}
                                            className="w-full sm:w-1/2 md:w-1/3 flex-shrink-0 cursor-pointer"
                                            onClick={() => navigate(`/event-detail/${beach.id}`)}
                                        >
                                            <EventCard beach={beach} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={handlePrev}
                                className="absolute left-0 top-1/2 -translate-y-1/2 bg-teal-500 text-white rounded-md p-2 hover:bg-teal-600 transition-colors"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-0 top-1/2 -translate-y-1/2 bg-teal-500 text-white rounded-md p-2 hover:bg-teal-600 transition-colors"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>
                </section>
            ))}
        </div>
    );

}



// ChevronDown icon component (simplified)
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
}

// Beach card component
type Beach = {
    id: number;
    name: string;
    price: string;
    rating: number;
    reviews: number;
    location: string;
    distance: number;
    image: string;
    hasEvent: boolean;
};

const EventCard: React.FC<{ beach: Beach }> = ({ beach }) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden w-80 flex flex-col">
            <div className="relative h-48">
                <img
                    src='https://picsum.photos/id/20/3670/2462'
                    alt={beach.name}
                    className="h-full w-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-white bg-opacity-80 rounded-full px-3 py-1 flex items-center">
                    <span className="text-sm">{beach.distance} km</span>
                </div>
            </div>

            <div className="p-4 flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{beach.name}</h3>
                    <span className="text-gray-700">{beach.price}</span>
                </div>

                <div className="flex items-center mb-2">
                    <Star size={16} className="text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm">{beach.rating} ({beach.reviews} reviews)</span>
                </div>

                <div className="flex items-start">
                    <MapPin size={16} className="text-red-500 mt-1 flex-shrink-0" />
                    <span className="ml-1 text-sm text-gray-600">{beach.location}</span>
                </div>
            </div>

            <div className="p-4 border-t border-gray-100">
                {beach.hasEvent ? (
                    <div className="flex items-center justify-center text-green-600">
                        <Calendar size={16} className="mr-1" />
                        <span className="text-sm">Event Available</span>
                    </div>
                ) : (
                    <div className="flex items-center justify-center text-red-500">
                        <XCircle size={16} className="mr-1" />
                        <span className="text-sm">No Event</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Events