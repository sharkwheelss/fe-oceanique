import { useNavigate } from "react-router-dom";

function RideSelectionStep() {
    const navigate = useNavigate();

    const rideOptions = [
        { id: 'walk', label: 'Walk', image: 'walk.png' },
        { id: 'bicycle', label: 'Bicycle', image: 'bicycle.png' },
        { id: 'bike', label: 'Bike', image: 'bike.png' },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            {/* Back button and progress indicator */}
            <div className="flex justify-between items-center mb-8">
                <button
                    className="flex items-center text-teal-500 font-medium"
                    onClick={() => window.history.back()}
                >
                    <span className="mr-2">←</span> Back
                </button>
                <div className="text-gray-500">1 of 8 questions</div>
            </div>

            {/* Question */}
            <h1 className="text-3xl font-bold text-center mb-12">What's your ride?</h1>

            {/* Ride options */}
            <div className="relative flex justify-center items-center mb-12">
                {/* Previous button */}
                <button className="absolute left-0 bg-teal-500 text-white p-4 rounded-md">
                    ←
                </button>

                {/* Ride cards */}
                <div className="flex gap-8 justify-center">
                    {rideOptions.map(ride => (
                        <div key={ride.id} className="flex flex-col items-center">
                            <div className="bg-white rounded-3xl shadow-md overflow-hidden mb-4 w-48">
                                <img
                                    src={ride.image}
                                    alt={ride.label}
                                    className="w-full h-64 object-cover"
                                />
                            </div>
                            <div className="text-center text-xl font-medium mb-2">{ride.label}</div>
                            <button
                                className={`h-8 w-8 rounded-full flex items-center justify-center ${(ride.id)
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200'
                                    }`}
                                onClick={() => (ride.id)}
                            >
                                {/* {userSelections.rides.includes(ride.id) && '✓'} */}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Next button */}
                <button className="absolute right-0 bg-teal-500 text-white p-4 rounded-md"
                >
                    →
                </button>
            </div>

            {/* Next button */}
            <div className="flex justify-center">
                <button
                    className="bg-teal-500 text-white py-4 px-6 rounded-full w-full max-w-xl flex items-center justify-center text-lg font-medium"
                    onClick={() => navigate('/recommendation-result')}
                >
                    Next <span className="ml-2">→</span>
                </button>
            </div>
        </div>
    );
}

export default RideSelectionStep;