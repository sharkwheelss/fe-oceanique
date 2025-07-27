import { useI18n } from "../../context/I18nContext";

const AboutContent = (data: any) => {
    const { t } = useI18n();
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">{data.beachData.beach_name}</h2>
            <p className="text-gray-700 mb-8">
                {data.beachData.descriptions}
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 className="text-lg font-semibold mb-4">{t('beachDetail.contactPerson')}</h3>
                    <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <span className="text-gray-600">👤</span>
                        </div>
                        <span>{data.beachData.cp_name || ' - '}</span>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">{t('beachDetail.officialWebsite')}</h3>
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <span className="text-gray-600">🌐</span>
                        </div>
                        <a
                            href={data.beachData.official_website
                                ? `https://${data.beachData.official_website.replace(/^https?:\/\//, "")}`
                                : "#"} // Fallback to "#" if null
                            className="text-blue-600 hover:underline"
                            target="_blank" // Opens in a new tab/window
                        >
                            {data.beachData.official_website || "-"}
                        </a>

                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">{t('beachDetail.activity')}</h3>

                {data.beachData.activities.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                        {data.beachData.activities.map((activity: any, index: number) => (
                            <ActivityItem key={index} text={activity.name} />

                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No activities recorded for this beach.</p>
                )}
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