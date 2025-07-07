    import React, { useState, useEffect, useRef } from 'react';
    import { MapPin, Sun, CloudRain, Cloud, CloudSnow, Zap } from 'lucide-react';

    const LocationContent = () => {
        const mapRef = useRef(null);
        const [weatherData, setWeatherData] = useState(null);
        const [nearbyPlaces, setNearbyPlaces] = useState([]);
        const [loading, setLoading] = useState(true);
        const [mapLoaded, setMapLoaded] = useState(false);

        const WEATHER_API_KEY = '89874db7e434075c5a64fe1cc32842dc';

        // Location coordinates for Cungkil, Surabaya
        const location = {
            lat: -7.3115,
            lng: 112.7721,
            name: 'Cungkil, Surabaya, Jawa Timur'
        };

        // Initialize OpenStreetMap with Leaflet
        useEffect(() => {
            loadLeafletAndInitMap();
        }, []);

        const loadLeafletAndInitMap = async () => {
            // Load Leaflet CSS
            if (!document.querySelector('link[href*="leaflet"]')) {
                const css = document.createElement('link');
                css.rel = 'stylesheet';
                css.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
                document.head.appendChild(css);
            }

            // Load Leaflet JS
            if (!window.L) {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
                script.onload = initializeMap;
                document.head.appendChild(script);
            } else {
                initializeMap();
            }
        };

        const initializeMap = () => {
            if (mapRef.current && window.L && !mapRef.current._leaflet_id) {
                // Initialize map
                const map = window.L.map(mapRef.current).setView([location.lat, location.lng], 15);

                // Add OpenStreetMap tiles
                window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                    maxZoom: 19
                }).addTo(map);

                // Custom red marker icon
                const redIcon = window.L.divIcon({
                    html: `<div style="
                        background-color: #ef4444;
                        width: 20px;
                        height: 20px;
                        border-radius: 50% 50% 50% 0;
                        transform: rotate(-45deg);
                        border: 2px solid white;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    "></div>`,
                    className: 'custom-marker',
                    iconSize: [20, 20],
                    iconAnchor: [10, 20]
                });

                // Add marker
                window.L.marker([location.lat, location.lng], { icon: redIcon })
                    .addTo(map)
                    .bindPopup(location.name);

                setMapLoaded(true);

                // Load mock nearby places (since we don't have Google Places API)
                setTimeout(() => {
                    setNearbyPlaces(getMockNearbyPlaces());
                }, 1000);
            }
        };

        // Mock nearby places for Indonesia context
        const getMockNearbyPlaces = () => [
            { name: 'Toko Sari Roti', type: '🏪', distance: '0.2 km' },
            { name: 'Warung Pecel Lele', type: '🍽️', distance: '0.3 km' },
            { name: 'Apotek K24', type: '💊', distance: '0.5 km' },
            { name: 'Indomaret', type: '🛍️', distance: '0.4 km' }
        ];

        // Fetch weather data
        useEffect(() => {
            fetchWeatherData();
        }, []);

        const fetchWeatherData = async () => {
            try {
                // Using OpenWeatherMap as Weather.io alternative (more accessible)
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lng}&appid=${WEATHER_API_KEY}&units=metric`
                );

                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
                    const processedWeather = processWeatherData(data);
                    setWeatherData(processedWeather);
                } else {
                    // Fallback to mock data if API fails
                    // setWeatherData(getMockWeatherData());
                }
            } catch (error) {
                console.error('Weather API error:', error);
                // Use mock data as fallback
                // setWeatherData(getMockWeatherData());
            } finally {
                setLoading(false);
            }
        };

        const processWeatherData = (data) => {
            const today = new Date().toDateString();
            const todayForecasts = data.list.filter(item =>
                new Date(item.dt * 1000).toDateString() === today
            ).slice(0, 4);

            return todayForecasts.map((forecast, index) => {
                const date = new Date(forecast.dt * 1000);
                const timeRanges = [
                    '00:00 - 06:00',
                    '06:00 - 12:00',
                    '12:00 - 18:00',
                    '18:00 - 00:00'
                ];

                return {
                    time: timeRanges[index] || `${date.getHours()}:00`,
                    condition: forecast.weather[0].main,
                    description: forecast.weather[0].description,
                    temp: Math.round(forecast.main.temp),
                    icon: getWeatherIcon(forecast.weather[0].main)
                };
            });
        };

        const getMockWeatherData = () => [
            { time: '00:00 - 06:00', condition: 'Clear', description: 'Sunny', temp: 28, icon: Sun },
            { time: '06:00 - 12:00', condition: 'Rain', description: 'Light rain', temp: 26, icon: CloudRain },
            { time: '12:00 - 18:00', condition: 'Clouds', description: 'Cloudy', temp: 30, icon: Cloud },
            { time: '18:00 - 00:00', condition: 'Clouds', description: 'Partly cloudy', temp: 27, icon: Cloud }
        ];

        const getWeatherIcon = (condition) => {
            const iconMap = {
                'Clear': Sun,
                'Clouds': Cloud,
                'Rain': CloudRain,
                'Drizzle': CloudRain,
                'Snow': CloudSnow,
                'Thunderstorm': Zap
            };
            return iconMap[condition] || Cloud;
        };

        const getPlaceIcon = (type) => {
            const iconMap = {
                'shopping_mall': '🛍️',
                'store': '🏪',
                'restaurant': '🍽️',
                'hospital': '🏥',
                'school': '🏫',
                'gas_station': '⛽',
                'bank': '🏦'
            };
            return iconMap[type] || '📍';
        };

        const calculateDistance = (pos1, pos2) => {
            const lat1 = typeof pos1.lat === 'function' ? pos1.lat() : pos1.lat;
            const lng1 = typeof pos1.lng === 'function' ? pos1.lng() : pos1.lng;
            const lat2 = typeof pos2.lat === 'function' ? pos2.lat() : pos2.lat;
            const lng2 = typeof pos2.lng === 'function' ? pos2.lng() : pos2.lng;

            const R = 6371; // Earth's radius in km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLng = (lng2 - lng1) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c;
            return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
        };

        return (
            <div className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* OpenStreetMap Integration */}
                    <div className="rounded-lg overflow-hidden shadow-lg">
                        <div
                            ref={mapRef}
                            className="w-full h-80 bg-gray-200 rounded-lg"
                            style={{ minHeight: '320px' }}
                        >
                            {!mapLoaded && (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-2"></div>
                                        <p className="text-gray-600">Loading map...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-start mb-6">
                            <MapPin className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                            <div className="ml-2">
                                <span className="text-xl font-medium">{location.name}</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Nearby Places */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">What's around</h3>
                                <p className="text-xs text-gray-500 mb-4">(powered by OpenStreetMap)</p>

                                {nearbyPlaces.length > 0 ? (
                                    nearbyPlaces.map((place, index) => (
                                        <div key={index} className="flex items-center justify-between mb-3 p-2 rounded hover:bg-gray-50">
                                            <div className="flex items-center">
                                                <div className="w-6 h-6 bg-red-100 flex items-center justify-center mr-3 rounded">
                                                    <span className="text-sm">{place.type}</span>
                                                </div>
                                                <span className="text-sm font-medium">{place.name}</span>
                                            </div>
                                            <span className="text-gray-600 text-sm">{place.distance}</span>
                                        </div>
                                    ))
                                ) : (
                                    [...Array(4)].map((_, index) => (
                                        <div key={index} className="flex items-center justify-between mb-3 p-2">
                                            <div className="flex items-center">
                                                <div className="w-6 h-6 bg-gray-200 animate-pulse mr-3 rounded"></div>
                                                <div className="w-20 h-4 bg-gray-200 animate-pulse rounded"></div>
                                            </div>
                                            <div className="w-12 h-4 bg-gray-200 animate-pulse rounded"></div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Weather Forecast */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Weather forecast</h3>
                                <p className="text-xs text-gray-500 mb-4">(powered by OpenWeather API)</p>

                                {loading ? (
                                    [...Array(4)].map((_, index) => (
                                        <div key={index} className="flex items-center justify-between mb-3 p-2">
                                            <div className="flex items-center">
                                                <div className="w-6 h-6 bg-gray-200 animate-pulse mr-3 rounded"></div>
                                                <div className="w-16 h-4 bg-gray-200 animate-pulse rounded"></div>
                                            </div>
                                            <div className="w-24 h-4 bg-gray-200 animate-pulse rounded"></div>
                                        </div>
                                    ))
                                ) : weatherData ? (
                                    weatherData.map((weather, index) => {
                                        const IconComponent = weather.icon;
                                        return (
                                            <div key={index} className="flex items-center justify-between mb-3 p-2 rounded hover:bg-gray-50">
                                                <div className="flex items-center">
                                                    <IconComponent className={`w-6 h-6 mr-3 ${weather.condition === 'Clear' ? 'text-yellow-500' :
                                                        weather.condition === 'Rain' || weather.condition === 'Drizzle' ? 'text-blue-500' :
                                                            weather.condition === 'Thunderstorm' ? 'text-purple-500' :
                                                                'text-gray-500'
                                                        }`} />
                                                    <div>
                                                        <span className="text-sm font-medium block">{weather.description}</span>
                                                        <span className="text-xs text-gray-500">{weather.temp}°C</span>
                                                    </div>
                                                </div>
                                                <span className="text-gray-600 text-sm">{weather.time}</span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-gray-500 text-sm">Weather data unavailable</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* API Key Notice */}
                {WEATHER_API_KEY === 'YOUR_OPENWEATHER_API_KEY' && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Setup Instructions</h4>
                        <div className="text-sm text-blue-700 space-y-2">
                            <div>
                                <p className="font-medium">✅ Map: Ready to use (OpenStreetMap - Free)</p>
                                <p className="text-xs text-blue-600">No API key needed for the map</p>
                            </div>
                            <div>
                                <p className="font-medium">🌤️ Weather: Setup needed</p>
                                <p className="text-xs text-blue-600">
                                    1. Sign up at <a href="https://openweathermap.org/api" className="underline" target="_blank" rel="noopener noreferrer">OpenWeatherMap</a> (FREE - 1,000 calls/day)<br />
                                    2. Get your API key<br />
                                    3. Replace <code className="bg-blue-100 px-1 rounded">YOUR_OPENWEATHER_API_KEY</code>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    export default LocationContent;