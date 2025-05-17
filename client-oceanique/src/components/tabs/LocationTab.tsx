import {MapPin, Sun, CloudRain, Cloud} from 'lucide-react';

const LocationContent = () => {
    return (
        <div>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="rounded-lg overflow-hidden">
                    {/* Map would be integrated here, using placeholder for now */}
                    <div className="bg-gray-200 h-80 w-full rounded-lg"></div>
                </div>

                <div>
                    <div className="flex items-start mb-6">
                        <MapPin className="w-6 h-6 text-red-500 mt-1" />
                        <div className="ml-2">
                            <span className="text-xl font-medium">Cungkil, Surabaya, Jawa Timur</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">What's around</h3>
                            <p className="text-xs text-gray-500 mb-4">(powered by google maps)</p>

                            {[...Array(4)].map((_, index) => (
                                <div key={index} className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-red-100 flex items-center justify-center mr-2">
                                            <span className="text-red-500">🛍️</span>
                                        </div>
                                        <span>Shop center</span>
                                    </div>
                                    <span className="text-gray-600">0,3 km</span>
                                </div>
                            ))}
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Weather forecast</h3>
                            <p className="text-xs text-gray-500 mb-4">(powered by weather.io)</p>

                            <div className="mb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Sun className="w-6 h-6 text-yellow-500 mr-2" />
                                        <span>Sunny</span>
                                    </div>
                                    <span className="text-gray-600">00.00 AM - 06.00 AM</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <CloudRain className="w-6 h-6 text-blue-500 mr-2" />
                                        <span>Rainy</span>
                                    </div>
                                    <span className="text-gray-600">06.00 AM - 12.00 PM</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Cloud className="w-6 h-6 text-gray-500 mr-2" />
                                        <span>Cloudy</span>
                                    </div>
                                    <span className="text-gray-600">12.00 PM - 18.00 PM</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Cloud className="w-6 h-6 text-gray-500 mr-2" />
                                        <span>Cloudy</span>
                                    </div>
                                    <span className="text-gray-600">18.00 PM - 00.00 AM</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationContent;