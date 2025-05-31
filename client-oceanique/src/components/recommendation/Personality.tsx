import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecommendation } from '../../context/RecommendationContext';
import { useAuth } from '../../context/AuthContext';

interface Personality {
    id: number;
    name: string;
    description: string;
    img_path: string;
}

export default function OceaniquePersonalityPage() {
    const [selectedPersonality, setSelectedPersonality] = useState<number | null>(null);
    const navigate = useNavigate();

    const { user } = useAuth();
    const { getAllPersonalities, personalities, loading } = useRecommendation();

    useEffect(() => {
        getAllPersonalities();
    }, []);

    const handlePersonalitySelect = (personalityId: number) => {
        setSelectedPersonality(personalityId);
        navigate('/preference', { state: { personalityId } });
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-6">
                        Hello! <span className="text-teal-500">{user?.username}</span>
                    </h1>
                    <p className="text-xl">What's your vibe? Let's match your personality!</p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {loading
                        ? Array.from({ length: 4 }).map((_, index) => (
                            <PersonalityCardSkeleton key={index} />
                        ))
                        : personalities.map((personality) => (
                            <PersonalityCard
                                key={personality.id}
                                personality={personality}
                                isSelected={selectedPersonality === personality.id}
                                onSelect={handlePersonalitySelect}
                            />
                        ))}
                </div>
            </main>
        </div>
    );
}

function PersonalityCard({
    personality,
    isSelected,
    onSelect,
}: {
    personality: Personality;
    isSelected: boolean;
    onSelect: (id: number) => void;
}) {
    return (
        <div
            className={`p-6 shadow-sm rounded-xl border cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg
            ${isSelected ? 'border-teal-500 bg-teal-50' : 'border-transparent hover:border-gray-300'}`}
            onClick={() => onSelect(personality.id)}
        >
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    <img
                        src={personality.img_path}
                        alt={personality.name}
                        className="w-20 h-20 rounded-full object-cover"
                    />
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold">{personality.name}</h3>
                    <p className="text-gray-600 mt-1">{personality.description}</p>
                </div>
            </div>
        </div>
    );
}

// Skeleton loader for personality card
function PersonalityCardSkeleton() {
    return (
        <div className="p-6 shadow-sm rounded-xl border border-gray-200 animate-pulse bg-gray-50">
            <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-300 rounded-full" />
                <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-300 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
            </div>
        </div>
    );
}
