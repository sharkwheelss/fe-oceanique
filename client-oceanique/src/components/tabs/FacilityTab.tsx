interface ActivityItemProps {
    text: string;
}

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

/**
 * Facility tab content
 */
const FacilityContent = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">All Facilities in Pantai Pasir Putih</h2>

            <div className="grid md:grid-cols-4 gap-6">
                <FacilityCategory
                    title="General"
                    image="https://picsum.photos/id/8/5000/3333"
                    items={["Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum"]}
                />

                <FacilityCategory
                    title="Kids"
                    image="https://picsum.photos/id/8/5000/3333"
                    items={["Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum"]}
                />

                <FacilityCategory
                    title="Public"
                    image="https://picsum.photos/id/8/5000/3333"
                    items={["Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum"]}
                />

                <FacilityCategory
                    title="Private"
                    image="https://picsum.photos/id/8/5000/3333"
                    items={["Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum"]}
                />
            </div>
        </div>
    );
};

/**
 * Facility category component with image and list of items
 */
interface FacilityCategoryProps {
    title: string;
    image: string;
    items?: string[];
}

const FacilityCategory = ({ title, image, items = [] }: FacilityCategoryProps) => {
    return (
        <div>
            <div className="rounded-lg overflow-hidden mb-4">
                <img src={image} alt={title} className="w-full h-48 object-cover" />
            </div>
            <h3 className="text-lg font-semibold mb-3">{title}</h3>
            <ul>
                {items.map((item, index) => (
                    <ActivityItem key={index} text={item} />
                ))}
            </ul>
        </div>
    );
};

export default FacilityContent;