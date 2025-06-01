import { useState, useEffect } from 'react';

interface PersonalityConfirmDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    currentPersonality: string;
    name: string;
    profileDescription: string;
    img_path: string;
    isExistingPersonality?: boolean;
}

// ProfileCard component with TypeScript props
interface ProfileCardProps {
    type: string;
    description: string;
    img_path: string;
}

function ProfileCard({ type, description, img_path }: ProfileCardProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    <img
                        src={img_path}
                        alt={type}
                        className="w-20 h-20 rounded-full object-cover"
                    />
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold">{type}</h3>
                    <p className="text-gray-600 mt-1">{description}</p>
                </div>
            </div>
        </div>
    );
}

// Success Animation Component
function SuccessAnimation({ personalityName }: { personalityName: string }) {
    return (
        <div className="text-center animate-fade-in">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <svg
                    className="w-12 h-12 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            </div>

            {/* Success Message */}
            <h2 className="text-3xl font-bold text-green-600 mb-4">
                Perfect!
            </h2>
            <p className="text-xl text-gray-700 mb-2">
                Your personality has been confirmed!
            </p>
            <p className="text-lg text-teal-600 font-medium">
                "{personalityName}"
            </p>

            {/* Loading indicator */}
            <div className="mt-8">
                <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Taking you to preferences...</p>
            </div>
        </div>
    );
}

export function PersonalityConfirmDialog({
    isOpen,
    onConfirm,
    onCancel,
    currentPersonality,
    name,
    profileDescription,
    img_path,
    isExistingPersonality = false
}: PersonalityConfirmDialogProps) {
    const [showSuccess, setShowSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConfirm = async () => {
        setIsProcessing(true);

        // Show success animation
        setShowSuccess(true);

        // Wait a moment then call the actual onConfirm
        setTimeout(() => {
            onConfirm();
        }, 2500); // 2.5 seconds to show success animation
    };

    // Reset states when dialog closes
    useEffect(() => {
        if (!isOpen) {
            setShowSuccess(false);
            setIsProcessing(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Dynamic content based on whether it's existing or new personality
    const dialogContent = {
        existing: {
            subtitle: "Still the same person as before?",
            confirmButton: "Yep, that's me!",
            cancelButton: "No, I'm different now"
        },
        new: {
            subtitle: "Are you sure this matches your vibe?",
            confirmButton: "Yes, that's me!",
            cancelButton: "Let me choose again"
        }
    };

    const content = isExistingPersonality ? dialogContent.existing : dialogContent.new;

    return (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
            <div className="w-full max-w-lg p-4">
                {showSuccess ? (
                    /* Success View */
                    <SuccessAnimation personalityName={currentPersonality} />
                ) : (
                    /* Confirmation View */
                    <>
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-4xl font-bold">
                                Hello! <span className="text-teal-500">{name}</span>
                            </h1>
                            <h2 className="text-2xl font-medium mt-6 text-center">
                                {content.subtitle}
                            </h2>
                        </div>

                        {/* Using the ProfileCard component */}
                        <ProfileCard
                            type={currentPersonality}
                            description={profileDescription}
                            img_path={img_path}
                        />

                        {/* Dynamic Action Buttons */}
                        <div className="flex justify-center gap-4 mt-10">
                            <button
                                onClick={onCancel}
                                disabled={isProcessing}
                                className="px-6 py-3 bg-red-500 text-white font-medium rounded-full text-lg hover:bg-red-600 transition-all transform hover:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {content.cancelButton}
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isProcessing}
                                className="px-6 py-3 bg-teal-500 text-white font-medium rounded-full text-lg hover:bg-teal-600 transition-all transform hover:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isProcessing && (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                )}
                                {content.confirmButton}
                            </button>
                        </div>
                    </>
                )}
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }
            `}</style>
        </div>
    );
}