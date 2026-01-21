
interface MainGroupListCardProps {
    title: string;
    memberCount: number;
    url: string;
}

const MainGroupListCard = ({ title, memberCount, url }: MainGroupListCardProps) => {
    return (
        <a
            href={url}
            className="group relative flex items-center justify-between w-full p-4 rounded-xl bg-white border-2 border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-teal-200"
        >
            {/* Left Content */}
            <div className="flex flex-col gap-1 pr-4">
                <h3 className="text-base font-bold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-1">
                    {title}
                </h3>
                <span className="text-xs text-gray-400 group-hover:text-teal-500 transition-colors flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                    모집중
                </span>
            </div>

            {/* Right Content */}
            <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 text-gray-500 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span className="text-xs font-semibold">{memberCount}명</span>
                </div>

                {/* Arrow */}
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-50 text-gray-300 group-hover:bg-teal-500 group-hover:text-white transition-all transform group-hover:-rotate-45">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </div>
            </div>
        </a>
    );
};

export default MainGroupListCard;
