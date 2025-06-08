import Pagination from "../helper/pagination";
import { useState } from "react";

interface Content {
    id: number;
    path: string;
    beaches_id: number;
    reviews_id: number;
    img_path: string;
}
interface PhotoVideoContentProps {
    beachData: Content[];
}

const PhotoVideoContent = ({ beachData  }: PhotoVideoContentProps) => {
    // State for current page
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMedia, setSelectedMedia] = useState<Content | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Items per page
    const itemsPerPage = 8;

    // Calculate pagination
    const totalPages = Math.ceil(beachData .length / itemsPerPage);
    console.log(beachData )
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = beachData.slice(startIndex, endIndex);

    // Handler for pagination
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Check if file is video
    const isVideo = (path: string) => {
        const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
        return videoExtensions.some(ext => path.toLowerCase().endsWith(ext));
    };

    // Handle media click
    const handleMediaClick = (content: Content) => {
        setSelectedMedia(content);
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMedia(null);
    };

    // Handle modal backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {currentItems.map((content) => (
                    <div
                        key={content.id}
                        className="rounded-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                        onClick={() => handleMediaClick(content)}
                    >
                        <div className="relative">
                            {isVideo(content.path) ? (
                                <>
                                    <video
                                        src={content.img_path}
                                        className="w-full h-40 object-cover"
                                        preload="metadata"
                                    />
                                    {/* Video play button overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                                        <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-70 transition-all">
                                            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <img
                                    src={content.img_path}
                                    alt={`Beach content ${content.id}`}
                                    className="w-full h-40 object-cover"
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Show message if no content */}
            {beachData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No photos or videos available
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            {/* Modal for enlarged view */}
            {isModalOpen && selectedMedia && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
                    onClick={handleBackdropClick}
                >
                    <div className="relative max-w-4xl max-h-full">
                        {/* Close button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 flex items-center justify-center text-white transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Media content */}
                        <div className="bg-white rounded-lg overflow-hidden max-h-[90vh]">
                            {isVideo(selectedMedia.path) ? (
                                <video
                                    src={selectedMedia.img_path}
                                    controls
                                    autoPlay
                                    className="max-w-full max-h-[80vh] object-contain"
                                >
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <img
                                    src={selectedMedia.img_path}
                                    alt={`Beach content ${selectedMedia.id}`}
                                    className="max-w-full max-h-[80vh] object-contain"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotoVideoContent;