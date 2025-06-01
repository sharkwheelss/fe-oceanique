import { useNavigate } from "react-router-dom";
import { useState } from "react";

function PreferenceRankingStep() {
    const navigate = useNavigate();
    const [rankings, setRankings] = useState<{ [key: string]: number }>({});
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const preferences = [
        { id: 1, label: 'Accessibility', icon: '/api/placeholder/40/40' },
        { id: 2, label: 'Activity', icon: '/api/placeholder/40/40' },
        { id: 3, label: 'Beach Type', icon: '/api/placeholder/40/40' },
        { id: 4, label: 'Facility', icon: '/api/placeholder/40/40' },
        { id: 5, label: 'Cleanliness', icon: '/api/placeholder/40/40' },
        { id: 6, label: 'Budget', icon: '/api/placeholder/40/40' },
        { id: 7, label: 'Weather', icon: '/api/placeholder/40/40' },
    ];

    const handleRankSelect = (prefId: string, rank: number) => {
        setRankings(prev => ({ ...prev, [prefId]: rank }));
        setOpenDropdown(null);
    };

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
                {preferences.map((pref) => (
                    <div key={pref.id} className="flex items-center p-4 bg-white rounded-full shadow-md">
                        <div className="flex items-center flex-1">
                            <img
                                src={`preference-icons/${pref.id}.png`}
                                alt={pref.label}
                                className="w-10 h-10 mr-4 rounded-full"
                            />
                            <span className="text-xl font-medium">{pref.label}</span>
                        </div>
                        <div className="relative">
                            <button
                                className="flex items-center justify-center w-16 h-10 rounded-full border border-gray-300 font-medium"
                                onClick={() => setOpenDropdown(openDropdown === pref.id ? null : pref.id)}
                            >
                                {rankings[pref.id] || '-'} <span className="ml-2">▼</span>
                            </button>

                            {/* Dropdown menu */}
                            {openDropdown === pref.id && (
                                <div className="absolute right-0 mt-2 w-16 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    {[1, 2, 3, 4, 5].map((rank) => (
                                        <button
                                            key={rank}
                                            className="block w-full px-4 py-2 text-center hover:bg-gray-100"
                                            onClick={() => handleRankSelect(pref.id, rank)}
                                        >
                                            {rank}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
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