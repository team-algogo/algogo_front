interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-end gap-[7px] self-stretch">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`flex w-[30px] h-[30px] flex-col justify-center items-center rounded-[15px] transition-colors ${
            currentPage === page ? 'bg-[#0D6EFD]' : 'hover:bg-[#E8F0FF]'
          }`}
        >
          <span
            className={`text-sm font-medium leading-[130%] tracking-[0.14px] ${
              currentPage === page ? 'text-white' : 'text-[#333]'
            }`}
            style={{ fontFamily: 'IBM Plex Sans KR' }}
          >
            {page}
          </span>
        </button>
      ))}
      {totalPages > 5 && (
        <div className="flex w-[30px] h-[30px] items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.64645 1.64645C3.84171 1.45118 4.15829 1.45118 4.35355 1.64645L10.3536 7.64645C10.5488 7.84171 10.5488 8.15829 10.3536 8.35355L4.35355 14.3536C4.15829 14.5488 3.84171 14.5488 3.64645 14.3536C3.45118 14.1583 3.45118 13.8417 3.64645 13.6464L9.29289 8L3.64645 2.35355C3.45118 2.15829 3.45118 1.84171 3.64645 1.64645Z"
              fill="#333333"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.64645 1.64645C7.84171 1.45118 8.15829 1.45118 8.35355 1.64645L14.3536 7.64645C14.5488 7.84171 14.5488 8.15829 14.3536 8.35355L8.35355 14.3536C8.15829 14.5488 7.84171 14.5488 7.64645 14.3536C7.45118 14.1583 7.45118 13.8417 7.64645 13.6464L13.2929 8L7.64645 2.35355C7.45118 2.15829 7.45118 1.84171 7.64645 1.64645Z"
              fill="#333333"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Pagination;
