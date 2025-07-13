import { useState, useEffect, useContext } from 'react';
import { ChevronLeft, ChevronRight, Search, MapPin, Star, Calendar, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBeaches } from '../context/BeachContext'

// Beach type based on API response
type Beach = {
    id: number;
    beach_name: string;
    descriptions: string;
    cp_name: string;
    official_website: string;
    rating_average: number;
    estimate_price: string;
    latitude: number;
    longitude: number;
    kecamatan: string;
    kota: string;
    province: string;
    path: string;
    img_path: string;
    distance?: number; // This would be calculated based on user location
    hasEvent?: boolean; // This would come from events API
};

// Define the Filters type
type Filters = {
    province: string;
    city: string;
    subdistrict: string;
    priceRange: string;
};

interface Coordinates {
    lat: number;
    lng: number;
}

const Beaches = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [beaches, setBeaches] = useState<Beach[]>([]);
    const [filteredBeaches, setFilteredBeaches] = useState<Beach[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [filters, setFilters] = useState<Filters>({
        province: '',
        city: '',
        subdistrict: '',
        priceRange: ''
    });

    const { getAllBeaches } = useBeaches();

    // Separate slider states for each section
    const [nearYouIndex, setNearYouIndex] = useState(0);
    const [sabangMeraukeIndex, setSabangMeraukeIndex] = useState(0);

    const calculateDistance = (beach: Beach, userLocation: Coordinates | null): number => {
        if (!userLocation) return -1; // Return -1 if location isn't available yet

        const toRadians = (degrees: number) => degrees * (Math.PI / 180);

        const earthRadiusKm = 6371; // Earth's radius in km

        const dLat = toRadians(beach.latitude - userLocation.lat);
        const dLng = toRadians(beach.longitude - userLocation.lng);

        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRadians(userLocation.lat)) *
            Math.cos(toRadians(beach.latitude)) *
            Math.sin(dLng / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return Math.round(earthRadiusKm * c); // Distance in km
    };

    // Mock function to check if beach has events (replace with actual events API call)
    const checkHasEvent = (beachId: number): boolean => {
        // Mock event checking - replace with actual events API
        return Math.random() > 0.5;
    };

    const useCurrentLocation = () => {
        const [location, setLocation] = useState<Coordinates | null>(null);
        const [error, setError] = useState<string | null>(null);

        useEffect(() => {
            if (!navigator.geolocation) {
                setError("Geolocation is not supported by your browser.");
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (err) => {
                    setError("Unable to retrieve your location.");
                    console.error(err);
                }
            );
        }, []);

        return { location, error };
    };

    const { location } = useCurrentLocation();
    // Fetch beaches data
    useEffect(() => {
        if (!location) return; // Prevent fetch from running when location is null

        const fetchBeaches = async () => {
            try {
                const response = await getAllBeaches();
                console.log('beaches: ', response);

                const beachesWithExtras = response.map((beach: Beach) => ({
                    ...beach,
                    distance: calculateDistance(beach, location),
                    hasEvent: checkHasEvent(beach.id)
                }));

                console.log('Retrieve info location: ', location);

                setBeaches(beachesWithExtras);
                setFilteredBeaches(beachesWithExtras);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching beaches:', error);
                setLoading(false);
            }
        };

        fetchBeaches();
    }, [location]); // Runs only when location updates

    // Filter beaches based on search and filters
    useEffect(() => {
        let filtered = beaches;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(beach =>
                beach.beach_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                beach.kota.toLowerCase().includes(searchQuery.toLowerCase()) ||
                beach.province.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Province filter
        if (filters.province) {
            filtered = filtered.filter(beach => beach.province === filters.province);
        }

        // City filter
        if (filters.city) {
            filtered = filtered.filter(beach => beach.kota === filters.city);
        }

        // Subdistrict filter
        if (filters.subdistrict) {
            filtered = filtered.filter(beach => beach.kecamatan === filters.subdistrict);
        }

        // Price range filter (basic implementation)
        if (filters.priceRange) {
            filtered = filtered.filter(beach => beach.estimate_price.includes(filters.priceRange));
        }

        setFilteredBeaches(filtered);
    }, [searchQuery, filters, beaches]);

    // Get unique values for filter dropdowns
    const getUniqueProvinces = () => [...new Set(beaches.map(beach => beach.province))];
    const getUniqueCities = () => [...new Set(beaches.map(beach => beach.kota))];
    const getUniqueSubdistricts = () => [...new Set(beaches.map(beach => beach.kecamatan))];
    const getUniquePriceRanges = () => [...new Set(beaches.map(beach => beach.estimate_price))];

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
            priceRange: ''
        });
        setSearchQuery('');
    };

    // Get beaches for "Near You" section (sorted by distance)
    const nearYouBeaches = filteredBeaches
        .filter(beach => beach.distance && beach.distance <= 10)
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));

    // Get beaches for "Sabang to Merauke" section (all beaches)
    const sabangMeraukeBeaches = filteredBeaches;

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

    // Slider navigation handlers
    const handleNearYouPrev = () => {
        setNearYouIndex(prev => Math.max(prev - 1, 0));
    };

    const handleNearYouNext = () => {
        setNearYouIndex(prev => Math.min(prev + 1, Math.max(0, nearYouBeaches.length - 3)));
    };

    const handleSabangMeraukePrev = () => {
        setSabangMeraukeIndex(prev => Math.max(prev - 1, 0));
    };

    const handleSabangMeraukeNext = () => {
        setSabangMeraukeIndex(prev => Math.min(prev + 1, Math.max(0, sabangMeraukeBeaches.length - 3)));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading beaches...</div>
            </div>
        );
    }

    return (
        <div className="max-h-screen">
            {/* Search and Filters */}
            <div className="container sticky top-[72px] z-40 bg-white mx-auto px-4 py-6">
                <div className="flex flex-wrap justify-center gap-4">
                    <div className="relative flex-grow max-w-lg">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search beaches..."
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
                        label="Price Range"
                        value={filters.priceRange}
                        onChange={(val: string) => handleFilterChange('priceRange', val)}
                        options={getUniquePriceRanges()}
                    />

                    <button
                        className="bg-red-500 text-white px-6 py-3 rounded-md font-medium hover:bg-red-600 transition-colors"
                        onClick={clearFilters}
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* Near You Section */}
            <section className="container mx-auto px-4 py-4">
                <h2 className="text-2xl font-bold mb-4 text-center">Near You</h2>
                <div className="border-t border-gray-200 pt-4">
                    <div className="relative flex items-center justify-center">
                        <button
                            onClick={handleNearYouPrev}
                            className="z-10 absolute left-0 top-1/2 -translate-y-1/2 bg-teal-500 text-white rounded-md p-2 hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={nearYouIndex === 0}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div className="w-full px-12 overflow-hidden">
                            <div
                                className="flex gap-6 transition-transform duration-500 ease-in-out"
                                style={{
                                    transform: `translateX(-${nearYouIndex * (320 + 24)}px)`,
                                }}
                            >
                                {nearYouBeaches.length > 0 ? (
                                    nearYouBeaches.map((beach) => (
                                        <div
                                            key={beach.id}
                                            className="w-80 flex-shrink-0 cursor-pointer"
                                            onClick={() => {
                                                console.log(`Navigate to beach detail: ${beach.id}`);
                                                navigate(`/beach-detail/${beach.id}`);
                                            }}
                                        >
                                            <BeachCard beach={beach} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-full text-center py-8">
                                        <p className="text-gray-500">No beaches found near you</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handleNearYouNext}
                            className="z-10 absolute right-0 top-1/2 -translate-y-1/2 bg-teal-500 text-white rounded-md p-2 hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={nearYouIndex >= Math.max(0, nearYouBeaches.length - 3)}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Sabang to Merauke Section */}
            <section className="container mx-auto px-4 py-4">
                <h2 className="text-2xl font-bold mb-4 text-center">Sabang to Merauke</h2>
                <div className="border-t border-gray-200 pt-4">
                    <div className="relative flex items-center justify-center">
                        <button
                            onClick={handleSabangMeraukePrev}
                            className="z-10 absolute left-0 top-1/2 -translate-y-1/2 bg-teal-500 text-white rounded-md p-2 hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={sabangMeraukeIndex === 0}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div className="w-full px-12 overflow-hidden">
                            <div
                                className="flex gap-6 transition-transform duration-500 ease-in-out"
                                style={{
                                    transform: `translateX(-${sabangMeraukeIndex * (320 + 24)}px)`,
                                }}
                            >
                                {sabangMeraukeBeaches.length > 0 ? (
                                    sabangMeraukeBeaches.map((beach) => (
                                        <div
                                            key={beach.id}
                                            className="w-80 flex-shrink-0 cursor-pointer"
                                            onClick={() => {
                                                console.log(`Navigate to beach detail: ${beach.id}`);
                                                navigate(`/beach-detail/${beach.id}`);
                                            }}
                                        >
                                            <BeachCard beach={beach} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-full text-center py-8">
                                        <p className="text-gray-500">No beaches found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handleSabangMeraukeNext}
                            className="z-10 absolute right-0 top-1/2 -translate-y-1/2 bg-teal-500 text-white rounded-md p-2 hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={sabangMeraukeIndex >= Math.max(0, sabangMeraukeBeaches.length - 3)}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </section>
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

// Beach card component
const BeachCard: React.FC<{ beach: Beach }> = ({ beach }) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden w-80 flex flex-col">
            <div className="relative h-48">
                <img
                    src={beach.img_path || 'https://picsum.photos/id/16/2500/1667'}
                    alt={beach.beach_name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                        e.currentTarget.src = 'https://picsum.photos/id/16/2500/1667';
                    }}
                />
                <div className="absolute top-3 left-3 bg-white bg-opacity-80 rounded-full px-3 py-1 flex items-center">
                    <span className="text-sm">{beach.distance} km</span>
                </div>
            </div>

            <div className="p-4 flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{beach.beach_name}</h3>
                    <span className="text-gray-700">Rp{beach.estimate_price}</span>
                </div>

                <div className="flex items-center mb-2">
                    <Star size={16} className="text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm">
                        {beach.rating_average > 0 ? beach.rating_average.toFixed(1) : 'No rating'}
                        {beach.rating_average > 0 && ' / 5.0'}
                    </span>
                </div>

                <div className="flex items-start">
                    <MapPin size={16} className="text-red-500 mt-1 flex-shrink-0" />
                    <span className="ml-1 text-sm text-gray-600">
                        {beach.kecamatan}, {beach.kota}, {beach.province}
                    </span>
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
};

export default Beaches;