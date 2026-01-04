export interface PageInfo {
    number: number;
    totalPages: number;
    // We only strictly need these for pagination, but can include others if needed
    size?: number;
    totalElements?: number;
}

interface PaginationProps {
    pageInfo: PageInfo;
    onPageChange: (page: number) => void;
    // Allow overriding current page if the parent manages state differently than pageInfo.number
    // (e.g. 1-based vs 0-based differences)
    currentPage?: number;
}

export default function Pagination({ pageInfo, onPageChange, currentPage }: PaginationProps) {
    // If currentPage is provided, use it. Otherwise use pageInfo.number + 1 (assuming API is 0-indexed) or pageInfo.number?
    // Let's assume passed in PageInfo matches the logic needed.
    // In ProblemSetList, we were managing 'page' state (1-based).
    // API response 'pageInfo' likely comes from Spring Page, which is 0-indexed for 'number'.
    // If we rely purely on pageInfo.number, we might be off by one if we don't handle it.
    // However, the previous code passed `page` prop which was 1-based state.
    // Let's use `currentPage` prop as primary if derived from state, or fallback to pageInfo.

    // Actually, to fully refactor, best to stick to one source.
    // If we pass `pageInfo`, we should rely on it.
    // BUT, simple manual pages usage often relies on client state 'page'.
    // Let's rely on the explicit 'currentPage' prop if passed (for 1-based control), 
    // or fallback to pageInfo.number + 1?

    // User asked to "write PageInfo", suggesting passing that object.

    const { totalPages } = pageInfo;
    const current = currentPage ?? (pageInfo.number + 1); // Fallback to 0-index conversion
    if (totalPages <= 0) return null;

    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, current - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex flex-row justify-center items-center gap-[8px] w-full h-[30px] mt-4">
            <button
                onClick={() => onPageChange(current - 1)}
                disabled={current === 1}
                className="w-[30px] h-[30px] flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-[#333333]"
            >
                <img src="/icons/leftArrow.svg" alt="prev" className="w-[16px] h-[16px]" />
            </button>

            {pageNumbers.map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`w-[30px] h-[30px] flex flex-col justify-center items-center rounded-full transition-colors
                    ${current === p
                            ? "bg-[#0D6EFD] text-white"
                            : "bg-transparent hover:bg-gray-100 text-[#333333]"
                        }`}
                >
                    <span className="text-[14px] font-medium font-ibm">
                        {p}
                    </span>
                </button>
            ))}

            <button
                onClick={() => onPageChange(current + 1)}
                disabled={current === totalPages}
                className="w-[30px] h-[30px] flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-[#333333]"
            >
                <img src="/icons/rightArrow.svg" alt="next" className="w-[16px] h-[16px]" />
            </button>
        </div>
    );
}
