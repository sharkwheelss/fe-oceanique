import { useState, useEffect, useContext } from 'react';
import { Search, MapPin, Star, Calendar, XCircle, ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBeaches } from '../context/BeachContext'
import { useI18n } from '../context/I18nContext';

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
    distance?: number;
    event_count?: number;
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
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const navigate = useNavigate();
    const [filters, setFilters] = useState<Filters>({
        province: '',
        city: '',
        subdistrict: '',
        priceRange: ''
    });

    const { getAllBeaches } = useBeaches();
    const { t } = useI18n();

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

    // Sort beaches by distance
    const sortBeachesByDistance = (beaches: Beach[], order: 'asc' | 'desc'): Beach[] => {
        return [...beaches].sort((a, b) => {
            const aDistance = a.distance || 999999; // Put beaches without distance at the end
            const bDistance = b.distance || 999999;

            return order === 'asc' ? aDistance - bDistance : bDistance - aDistance;
        });
    };

    // Filter and sort beaches
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

        // Sort the filtered results by distance
        const sorted = sortBeachesByDistance(filtered, sortOrder);
        setFilteredBeaches(sorted);
    }, [searchQuery, filters, beaches, sortOrder]);

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

    // Handler for sort order toggle
    const toggleSortOrder = (): void => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
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
        setSortOrder('asc');
    };

    // Get beaches for "Near You" section (sorted by distance, within 50km)
    const nearYouBeaches = filteredBeaches.filter(beach =>
        beach.distance !== undefined && beach.distance !== -1 && beach.distance <= 50
    );

    // Get beaches for "All Beaches" section
    const allBeaches = filteredBeaches;

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

    const SortButton: React.FC = () => {
        return (
            <button
                onClick={toggleSortOrder}
                className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors bg-teal-500 text-white hover:bg-teal-600"
            >
                <span>{t('beaches.sortBy')}</span>
                <ArrowUpDown size={16} />
                <span className="text-xs">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
            </button>
        );
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
                <div className="flex flex-wrap justify-center gap-4 mb-4">
                    <div className="relative flex-grow max-w-lg">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder={t('beaches.search')}
                            className="pl-10 pr-4 py-3 bg-gray-200 rounded-md w-full outline-none"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <FilterDropdown
                        label={t('beaches.province')}
                        value={filters.province}
                        onChange={(val: string) => handleFilterChange('province', val)}
                        options={getUniqueProvinces()}
                    />
                    <FilterDropdown
                        label={t('beaches.city')}
                        value={filters.city}
                        onChange={(val: string) => handleFilterChange('city', val)}
                        options={getUniqueCities()}
                    />
                    <FilterDropdown
                        label={t('beaches.subdistrict')}
                        value={filters.subdistrict}
                        onChange={(val: string) => handleFilterChange('subdistrict', val)}
                        options={getUniqueSubdistricts()}
                    />
                    <FilterDropdown
                        label={t('beaches.priceRange')}
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

                {/* Sort by Distance */}
                <div className="flex justify-center">
                    <SortButton />
                </div>
            </div>

            {/* Near You Section */}
            <section className="container mx-auto px-4 py-4">
                <h2 className="text-2xl font-bold mb-4 text-center">{t('beaches.near')}</h2>
                <div className="border-t border-gray-200 pt-4">
                    {nearYouBeaches.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {nearYouBeaches.map((beach) => (
                                <div
                                    key={beach.id}
                                    className="cursor-pointer"
                                    onClick={() => {
                                        console.log(`Navigate to beach detail: ${beach.id}`);
                                        navigate(`/beach-detail/${beach.id}`);
                                    }}
                                >
                                    <BeachCard beach={beach} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No beaches found near you within 50km</p>
                        </div>
                    )}
                </div>
            </section>

            {/* All Beaches Section */}
            <section className="container mx-auto px-4 py-4">
                <h2 className="text-2xl font-bold mb-4 text-center">{t('beaches.all')}</h2>
                <div className="border-t border-gray-200 pt-4">
                    {allBeaches.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {allBeaches.map((beach) => (
                                <div
                                    key={beach.id}
                                    className="cursor-pointer"
                                    onClick={() => {
                                        console.log(`Navigate to beach detail: ${beach.id}`);
                                        navigate(`/beach-detail/${beach.id}`);
                                    }}
                                >
                                    <BeachCard beach={beach} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No beaches found</p>
                        </div>
                    )}
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
        <div className="bg-white rounded-xl shadow-md overflow-hidden w-full flex flex-col">
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
                    <span className="text-sm">
                        {beach.distance !== undefined && beach.distance !== -1
                            ? `${beach.distance} km`
                            : 'Distance N/A'
                        }
                    </span>
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
                {beach.event_count > 0 ? (
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