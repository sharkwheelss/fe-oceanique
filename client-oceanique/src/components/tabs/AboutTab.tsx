const AboutContent = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Pantai Pasir Putih</h2>
            <p className="text-gray-700 mb-8">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                when an unknown printer took a galley of type and scrambled it to make a type
                specimen book. It has survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 className="text-lg font-semibold mb-4">Contact Person</h3>
                    <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <span className="text-gray-600">👤</span>
                        </div>
                        <span>Pak Adiguana Patilasa</span>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Official Website</h3>
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <span className="text-gray-600">🌐</span>
                        </div>
                        <a
                            href="http://www.pantaipasirputih.com"
                            className="text-blue-600 hover:underline"
                        >
                            www.pantaipasirputih.com
                        </a>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Activities</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <ActivityItem text="Lorem Ipsum" />
                    <ActivityItem text="Lorem Ipsum" />
                    <ActivityItem text="Lorem Ipsum" />
                    <ActivityItem text="Lorem Ipsum" />
                    <ActivityItem text="Lorem Ipsum" />
                    <ActivityItem text="Lorem Ipsum" />
                    <ActivityItem text="Lorem Ipsum" />
                </div>
            </div>
        </div>
    );
};

/**
 * Activity item with checkmark icon
 */
type ActivityItemProps = {
    text: string;
};

const ActivityItem = ({ text }: ActivityItemProps) => {
    return (
        <div className="flex items-center mb-2">
            <div className="w-6 h-6 rounded-full bg-green-100 text-green-500 flex items-center justify-center mr-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
            </div>
            <span className="text-gray-600">{text}</span>
        </div>
    );
};

export default AboutContent;