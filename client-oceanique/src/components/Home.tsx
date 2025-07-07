import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WishlistEventsSection from './HomeEvents';
import { useBeaches } from '../context/BeachContext';

const Home = () => {
    const navigate = useNavigate();
    const [wishlistBeachIds, setWishlistBeachIds] = useState<number[]>([]);
    const { getWishlist } = useBeaches();

    // Example: Fetch user's wishlist beach IDs
    // Replace this with your actual wishlist fetching logic
    useEffect(() => {
        const fetchWishlistBeaches = async () => {
            try {
                const wishlistData = await getWishlist();
                setWishlistBeachIds(wishlistData.map(item => item.beaches_id));
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            }
        };

        fetchWishlistBeaches();
    }, []);

    console.log(wishlistBeachIds)

    return (
        <>
            <section className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center">
                {/* Left side with illustration */}
                <div className="md:w-1/2 mb-8 md:mb-0">
                    <img
                        src="/cust-home.png"
                        alt="Person browsing beaches"
                        className="max-w-full h-auto"
                    />
                </div>

                {/* Right side with text and recommendation features */}
                <div className="md:w-1/2 md:pl-12">
                    <h1 className="text-5xl font-bold text-teal-500 mb-4">HI!</h1>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">
                        Looking for beach that suits you the most?
                    </h2>

                    <div className="mb-10">
                        <h3 className="text-xl text-gray-700 mb-6">Try our recommendation!</h3>

                        {/* Features List */}
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="h-6 w-6 rounded-full flex items-center justify-center mr-3">
                                    <img src="/home-approve.png" alt="approve" />
                                </div>
                                <span className="text-gray-600">Based on Preferences</span>
                            </div>

                            <div className="flex items-center">
                                <div className="h-6 w-6 rounded-full flex items-center justify-center mr-3">
                                    <img src="/home-approve.png" alt="approve" />
                                </div>
                                <span className="text-gray-600">Matches Your Personality</span>
                            </div>

                            <div className="flex items-center">
                                <div className="h-6 w-6 rounded-full flex items-center justify-center mr-3">
                                    <img src="/home-approve.png" alt="approve" />
                                </div>
                                <span className="text-gray-600">Updated Reviews</span>
                            </div>
                        </div>
                    </div>

                    {/* Try Now Button */}
                </div>
            </section>

            <button className="w-full py-4 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors flex items-center justify-center font-medium text-sm md:text-base lg:text-lg"
                onClick={() => navigate(`/personality`)} >
                <span className="mr-2">Try now</span>
                <img src="/home-trynow.png" alt="trynow" className='h-6 w-6 ml-1' />
            </button>

            {/* Why Oceanique Section */}
            <WhyOceaniqueSection />

            {/* Wishlist Events Section */}
            <WishlistEventsSection wishlistBeachIds={wishlistBeachIds} />
        </>
    );
}

interface FeaturedCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ icon, title, description }) => {
    return (
        <div className="flex flex-col items-center text-center bg-white shadow-lg rounded-xl p-6">
            <div className="mb-6">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}

const WhyOceaniqueSection = () => {
    return (
        <section className='pt-20'>
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-16">Why Oceanique?</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <FeaturedCard
                        icon={
                            <img
                                src="/home-mapicon.png"
                                alt="map icon"
                                className="animate-bounce-slow"
                                style={{ animationDelay: '0s' }}
                            />
                        }
                        title="Sabang to Merauke"
                        description="Find the beach all over Indonesia"
                    />

                    <FeaturedCard
                        icon={
                            <img
                                src="/home-beachicon.png"
                                alt="recommendation icon"
                                className="animate-bounce-slow"
                                style={{ animationDelay: '0.4s' }}
                            />
                        }
                        title="Beach Recommendation"
                        description="Find the beach that suits you the most"
                    />

                    <FeaturedCard
                        icon={
                            <img
                                src="/home-eventicon.png"
                                alt="event icon"
                                className="animate-bounce-slow"
                                style={{ animationDelay: '0.8s' }}
                            />
                        }
                        title="Event Booking"
                        description="Level up your vibe with epic beach events!"
                    />
                </div>

                <style>{`
                    @keyframes bounce-slow {
                        0%, 100% {
                            transform: translateY(0);
                        }
                        50% {
                            transform: translateY(-10px);
                        }
                    }
                    .animate-bounce-slow {
                        animation: bounce-slow 2s infinite;
                    }
                `}</style>
            </div>

            {/* Decorative wave */}
            <div className="mt-40 relative">
                <svg className="w-full text-teal-200" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M985.66 92.83C906.67 72 823.78 31 743.84 14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84 11.73-114 31.07-172 41.86A600.21 600.21 0 0132.78 84.67C15.16 88.63 0 96.08 0 96.08V120h1200V96.08s-15.16-7.45-32.78-11.41c-39.63-8.79-82.14-14.15-126.68-15.64-86.23-2.88-168.13 9.18-234.63 51.49-66.5 42.3-120.25-28.69-220.25-2.69z" fill="currentColor"></path>
                </svg>
            </div>
        </section>
    );
}

export { Home, WhyOceaniqueSection };