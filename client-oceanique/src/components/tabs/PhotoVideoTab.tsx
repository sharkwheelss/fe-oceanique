import Pagination from "../helper/pagination";
import { useState } from "react";

const PhotoVideoContent = () => {
    // State for current page
    const [currentPage, setCurrentPage] = useState(1);

    // Handler for pagination
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="rounded-lg overflow-hidden">
                        {/* Some items have play button overlay for videos */}
                        <div className="relative">
                            <img
                                src="https://picsum.photos/id/14/2500/1667"
                                alt={`Beach photo ${index + 1}`}
                                className="w-full h-40 object-cover"
                            />
                            {(index === 1 || index === 2 || index === 4) && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center bg-white bg-opacity-30">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={10}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default PhotoVideoContent;