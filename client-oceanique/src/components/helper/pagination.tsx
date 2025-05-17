import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';


// Pagination component
type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    // Generate page numbers
    const getPageNumbers = () => {
        let pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            // If total pages is less than or equal to maxPagesToShow, show all pages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page, last page, current page, and pages adjacent to current page
            if (currentPage <= 3) {
                // If current page is near the beginning
                for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                }
            } else if (currentPage >= totalPages - 2) {
                // If current page is near the end
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // Current page is in the middle
                for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    pages.push(i);
                }
            }
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex justify-end mt-8">
            <div className="flex items-center">
                {/* First page */}
                <PageButton onClick={() => onPageChange(1)} disabled={currentPage === 1}>
                    <ChevronsLeft size={16} />
                </PageButton>

                {/* Previous page */}
                <PageButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                    <ChevronLeft size={16} />
                </PageButton>

                {/* Page numbers */}
                {pageNumbers.map(page => (
                    <PageButton
                        key={page}
                        active={currentPage === page}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </PageButton>
                ))}

                {/* Next page */}
                <PageButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    <ChevronRight size={16} />
                </PageButton>

                {/* Last page */}
                <PageButton onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
                    <ChevronsRight size={16} />
                </PageButton>
            </div>
        </div>
    );
}

// Page button component
type PageButtonProps = {
    children: React.ReactNode;
    active?: boolean;
    disabled?: boolean;
    onClick: () => void;
};

function PageButton({ children, active = false, disabled = false, onClick }: PageButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        w-8 h-8 mx-1 flex items-center justify-center rounded-md
        ${active
                    ? 'bg-teal-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
        >
            {children}
        </button>
    );
}

export default Pagination;