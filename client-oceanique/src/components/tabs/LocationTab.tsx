    import { useState, useEffect, useRef } from 'react';
    import { MapPin, Sun, CloudRain, Cloud, CloudSnow, Zap } from 'lucide-react';

    const LocationContent = (beachData: any) => {
        const mapRef = useRef(null);
        const [weatherData, setWeatherData] = useState(null);
        const [loading, setLoading] = useState(true);
        const [mapLoaded, setMapLoaded] = useState(false);

        const WEATHER_API_KEY = '89874db7e434075c5a64fe1cc32842dc';

        const location = {
            lat: beachData.beachData.latitude,
            lng: beachData.beachData.longitude,
            name: `${beachData.beachData.kecamatan}, ${beachData.beachData.kota}, ${beachData.beachData.province}`
        };
        console.log(beachData.beachData)

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
            }
        };

        // Fetch weather data
        useEffect(() => {
            fetchWeatherData();
        }, []);

        const fetchWeatherData = async () => {
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lng}&appid=${WEATHER_API_KEY}&units=metric`
                );

                if (response.ok) {
                    const data = await response.json();
                    // console.log(data)
                    const processedWeather = processWeatherData(data);
                    console.log(processedWeather)
                    setWeatherData(processedWeather);
                }
            } catch (error) {
                console.error('Weather API error:', error);
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
            </div>
        );
    };

    export default LocationContent;