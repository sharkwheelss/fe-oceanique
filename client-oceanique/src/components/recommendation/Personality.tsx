import { useState } from 'react';

// Main App component
export default function OceaniquePersonalityPage() {
    // State to track which personality has been selected
    const [selectedPersonality, setSelectedPersonality] = useState(null);

    // User information - in a real app this would come from authentication/user context
    const user = {
        name: "Ryyan Ramadhan",
        avatar: "/api/placeholder/40/40"
    };

    // Personality types data
    const personalityTypes = [
        {
            id: "adventurer",
            title: "The Adventurer",
            description: "Love action and exploring new places? This one's for you!",
            icon: "adventurer.png"
        },
        {
            id: "social",
            title: "The Social Explorer",
            description: "You're all about fun, music, and good company.",
            icon: "social-explorer.png"
        },
        {
            id: "relaxer",
            title: "The Relaxer",
            description: "Want to just chill and enjoy the view? We got you.",
            icon: "relaxer.png"
        },
        {
            id: "scenic",
            title: "The Scenic Soul",
            description: "You appreciate beauty, sunsets, and meaningful moments.",
            icon: "scenic-soul.png"
        }
    ];

    /**
     * Handles the selection of a personality type
     * @param {string} personalityId - ID of the selected personality
     */
    const handlePersonalitySelect = (personalityId) => {
        setSelectedPersonality(personalityId);
        // In a real app, you might want to save this preference to a backend
        console.log(`Selected personality: ${personalityId}`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            
            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-6">
                        Hello! <span className="text-teal-500">{user.name}</span>
                    </h1>
                    <p className="text-xl">What's your vibe? Let's match your personality!</p>
                </div>

                {/* Personality Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {personalityTypes.map((personality) => (
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

// NavLink component for navigation items
function NavLink({ children, active = false }) {
    return (
        <a
            href="#"
            className={`px-2 py-1 ${active ? 'text-teal-500 font-medium' : 'text-gray-600'} hover:text-teal-700`}
        >
            {children}
        </a>
    );
}

// PersonalityCard component for each personality option
function PersonalityCard({ personality, isSelected, onSelect }) {
    return (
        <div
            className={`p-6 shadow-sm rounded-xl border cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg
        ${isSelected ? 'border-teal-500 bg-teal-50' : 'border-transparent hover:border-gray-300'}`}
            onClick={() => onSelect(personality.id)}
        >
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    <img
                        src={personality.icon}
                        alt={personality.title}
                        className="w-20 h-20 rounded-full object-cover"
                    />
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold">{personality.title}</h3>
                    <p className="text-gray-600 mt-1">{personality.description}</p>
                </div>
            </div>
        </div>
    );
}