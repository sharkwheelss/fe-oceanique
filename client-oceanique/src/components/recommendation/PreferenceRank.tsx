import { useNavigate } from "react-router-dom";

function PreferenceRankingStep() {
    const navigate = useNavigate();

    const preferences = [
        { id: 'accessibility', label: 'Accessibility', icon: '/api/placeholder/40/40' },
        { id: 'activity', label: 'Activity', icon: '/api/placeholder/40/40' },
        { id: 'beachType', label: 'Beach Type', icon: '/api/placeholder/40/40' },
        { id: 'facility', label: 'Facility', icon: '/api/placeholder/40/40' },
        { id: 'cleanliness', label: 'Cleanliness', icon: '/api/placeholder/40/40' },
        { id: 'budget', label: 'Budget', icon: '/api/placeholder/40/40' },
        { id: 'weather', label: 'Weather', icon: '/api/placeholder/40/40' },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            {/* Title and Skip option */}
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-bold max-w-xl">
                    Your beach, your rules! Rank what you care about the most.
                </h1>
                <button className="text-teal-500 font-medium flex items-center">
                    Skip for now <span className="ml-2">→</span>
                </button>
            </div>

            {/* Preference ranking cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                {preferences.map((pref, index) => {
                    const rank = preferences[pref.id] || index + 1;

                    return (
                        <div key={pref.id} className="flex items-center p-4 bg-white rounded-full shadow-md">
                            <div className="flex items-center flex-1">
                                <img
                                    src={pref.icon}
                                    alt={pref.label}
                                    className="w-10 h-10 mr-4 rounded-full"
                                />
                                <span className="text-xl font-medium">{pref.label}</span>
                            </div>
                            <div className="relative">
                                <button className="flex items-center justify-center w-16 h-10 rounded-full border border-gray-300 font-medium">
                                    {rank} <span className="ml-2">▼</span>
                                </button>
                                {/* Dropdown would be implemented here in a real app */}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between">
                <button
                    className="bg-red-500 text-white py-3 px-10 rounded-full font-medium"
                    onClick={() => window.history.back()}
                >
                    Back
                </button>
                <button
                    className="bg-teal-500 text-white py-3 px-10 rounded-full font-medium flex items-center"
                    onClick={() => navigate('/accessibility')}
                >
                    Next <span className="ml-2">→</span>
                </button>
            </div>
        </div>
    );
}

export default PreferenceRankingStep;