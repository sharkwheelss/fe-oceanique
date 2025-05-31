interface PersonalityConfirmDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    currentPersonality: string;
    name: string;
    profileDescription: string;
    img_path: string;
    isExistingPersonality?: boolean; // New prop to differentiate between scenarios
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
                        className="px-6 py-3 bg-red-500 text-white font-medium rounded-full text-lg hover:bg-red-600 transition-all transform hover:scale-95"
                    >
                        {content.cancelButton}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-3 bg-teal-500 text-white font-medium rounded-full text-lg hover:bg-teal-600 transition-all transform hover:scale-95"
                    >
                        {content.confirmButton}
                    </button>
                </div>
            </div>
        </div>
    );
}