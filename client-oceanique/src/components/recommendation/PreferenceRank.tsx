import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useRecommendation } from '../../context/RecommendationContext';

interface PreferenceCategory {
    id: number;
    name: string;
    default_score: number;
    information: string;
}

function PreferenceRankingStep() {
    const navigate = useNavigate();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [rankings, setRankings] = useState<{ [key: string]: number }>({});
    const [preferences, setPreferences] = useState<PreferenceCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { getPreferenceCategories } = useRecommendation();

    useEffect(() => {
        const fetchPreferences = async () => {
            setLoading(true);
            try {
                const response = await getPreferenceCategories();
                setPreferences(response);
                console.log('Fetched preferences:', response);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch preferences');
            } finally {
                setLoading(false);
            }
        };
        fetchPreferences();
    }, []);

    const handleRankSelect = (prefId: string, rank: number) => {
        setRankings(prev => ({ ...prev, [prefId]: rank }));
        setOpenDropdown(null);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

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
                                src={`/preference-icons/${pref.id}.png`}
                                alt={pref.name}
                                className="w-10 h-10 mr-4 rounded-full"
                            />
                            <span className="text-xl font-medium">{pref.name}</span>
                            <div className="relative ml-2 group">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="absolute left-0 w-48 p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-20">
                                    {pref.information}
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <button
                                className="flex items-center justify-center w-16 h-10 rounded-full border border-gray-300 font-medium"
                                onClick={() => setOpenDropdown(openDropdown === String(pref.id) ? null : String(pref.id))}
                            >
                                {rankings[pref.id] || pref.default_score} <span className="ml-2">▼</span>
                            </button>

                            {/* Dropdown menu */}
                            {openDropdown === String(pref.id) && (
                                <div className="absolute right-0 mt-2 w-16 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    {[1, 2, 3, 4, 5].map((rank) => (
                                        <button
                                            key={rank}
                                            className="block w-full px-4 py-2 text-center hover:bg-gray-100"
                                            onClick={() => handleRankSelect(String(pref.id), rank)}
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
