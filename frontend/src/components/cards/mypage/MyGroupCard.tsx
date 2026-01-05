
interface MyGroupCardProps {
    title: string;
    description: string;
    memberCount: number;
    capacity: number;
    programProblemCount: number;
    thumbnailUrl?: string;
    onClick?: () => void;
}

const MyGroupCard = ({
    title,
    description,
    memberCount,
    capacity,
    programProblemCount,
    thumbnailUrl,
    onClick,
}: MyGroupCardProps) => {
    return (
        <div className="flex w-full flex-col items-start rounded-lg border border-[#EBEDF1] overflow-hidden hover:shadow-[0_1px_5px_0_rgba(0,0,0,0.10)] transition-shadow">
            {/* Thumbnail */}
            <div
                className="flex h-[180px] px-4 py-4 flex-col items-start gap-2 self-stretch bg-cover bg-center bg-no-repeat bg-[#F0F2F5]"
                style={thumbnailUrl ? { backgroundImage: `url(${thumbnailUrl})` } : {}}
            >
                {/* Placeholder Badge or Overlay if needed */}
            </div>

            {/* Content */}
            <div className="flex flex-col items-start gap-3 self-stretch p-4">
                {/* Title */}
                <div className="flex flex-col items-start gap-2 self-stretch">
                    <div className="self-stretch overflow-hidden text-ellipsis text-[#050505] text-base font-semibold leading-[140%] line-clamp-1" style={{ fontFamily: 'IBM Plex Sans KR' }}>
                        {title}
                    </div>
                    <div className="self-stretch overflow-hidden text-ellipsis text-[#333] text-sm font-normal leading-[140%] line-clamp-1" style={{ fontFamily: 'IBM Plex Sans KR' }}>
                        {description}
                    </div>
                </div>

                {/* Info */}
                <div className="flex flex-col items-start gap-4 self-stretch">
                    {/* Stats */}
                    <div className="flex items-start gap-3 self-stretch">
                        {/* Members */}
                        <div className="flex items-center gap-1">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M15 14C15 14 16 14 16 13C16 12 15 9 11 9C7 9 6 12 6 13C6 14 7 14 7 14H15ZM7.02235 13C7.01888 12.9996 7.01403 12.999 7.00815 12.998C7.00538 12.9975 7.00266 12.997 7.00001 12.9965C7.00146 12.7325 7.16687 11.9669 7.75926 11.2758C8.31334 10.6294 9.28269 10 11 10C12.7173 10 13.6867 10.6294 14.2407 11.2758C14.8331 11.9669 14.9985 12.7325 15 12.9965C14.9973 12.997 14.9946 12.9975 14.9919 12.998C14.986 12.999 14.9811 12.9996 14.9777 13H7.02235Z" fill="#777A80" />
                                <path d="M11 7C12.1046 7 13 6.10457 13 5C13 3.89543 12.1046 3 11 3C9.89543 3 9 3.89543 9 5C9 6.10457 9.89543 7 11 7ZM14 5C14 6.65685 12.6569 8 11 8C9.34315 8 8 6.65685 8 5C8 3.34315 9.34315 2 11 2C12.6569 2 14 3.34315 14 5Z" fill="#777A80" />
                                <path d="M6.93593 9.27996C6.56813 9.16232 6.15954 9.07679 5.70628 9.03306C5.48195 9.01141 5.24668 9 5 9C1 9 0 12 0 13C0 13.6667 0.333333 14 1 14H5.21636C5.07556 13.7159 5 13.3791 5 13C5 11.9897 5.37724 10.958 6.08982 10.0962C6.33327 9.80174 6.61587 9.52713 6.93593 9.27996ZM4.92004 10.0005C4.32256 10.9136 4 11.9547 4 13H1C1 12.7393 1.16424 11.97 1.75926 11.2758C2.30468 10.6395 3.25249 10.0197 4.92004 10.0005Z" fill="#777A80" />
                                <path d="M1.5 5.5C1.5 3.84315 2.84315 2.5 4.5 2.5C6.15685 2.5 7.5 3.84315 7.5 5.5C7.5 7.15685 6.15685 8.5 4.5 8.5C2.84315 8.5 1.5 7.15685 1.5 5.5ZM4.5 3.5C3.39543 3.5 2.5 4.39543 2.5 5.5C2.5 6.60457 3.39543 7.5 4.5 7.5C5.60457 7.5 6.5 6.60457 6.5 5.5C6.5 4.39543 5.60457 3.5 4.5 3.5Z" fill="#777A80" />
                            </svg>
                            <span className="text-[#777A80] text-sm font-normal leading-[130%]" style={{ fontFamily: 'IBM Plex Sans KR' }}>
                                {memberCount}/{capacity}명
                            </span>
                        </div>

                        {/* Problems */}
                        <div className="flex items-center gap-1">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M1 2.82763C1.88498 2.45786 3.1539 2.05951 4.38768 1.93506C5.71799 1.80088 6.8464 1.99815 7.5 2.68677V12.4326C6.56511 11.9026 5.38065 11.8298 4.28732 11.9401C3.10693 12.0592 1.91771 12.4012 1 12.7511V2.82763ZM8.5 2.68677C9.1536 1.99815 10.282 1.80088 11.6123 1.93506C12.8461 2.05951 14.115 2.45786 15 2.82763V12.7511C14.0823 12.4012 12.8931 12.0592 11.7127 11.9401C10.6194 11.8298 9.43489 11.9026 8.5 12.4326V2.68677ZM8 1.78312C7.01509 0.936527 5.58683 0.809035 4.28732 0.94011C2.77322 1.09283 1.24459 1.61241 0.293099 2.0449C0.114601 2.12604 0 2.30401 0 2.50009V13.5001C0 13.6701 0.0863761 13.8284 0.229307 13.9205C0.372238 14.0125 0.55214 14.0256 0.706901 13.9553C1.58875 13.5544 3.01012 13.074 4.38768 12.9351C5.79565 12.793 6.97747 13.0223 7.60957 13.8124C7.70445 13.931 7.84811 14.0001 8 14.0001C8.15189 14.0001 8.29555 13.931 8.39043 13.8124C9.02253 13.0223 10.2043 12.793 11.6123 12.9351C12.9899 13.074 14.4113 13.5544 15.2931 13.9553C15.4479 14.0256 15.6278 14.0125 15.7707 13.9205C15.9136 13.8284 16 13.6701 16 13.5001V2.50009C16 2.30401 15.8854 2.12604 15.7069 2.0449C14.7554 1.61241 13.2268 1.09283 11.7127 0.94011C10.4132 0.809035 8.98491 0.936527 8 1.78312Z" fill="#777A80" />
                            </svg>
                            <span className="text-[#777A80] text-sm font-normal leading-[130%]" style={{ fontFamily: 'IBM Plex Sans KR' }}>
                                문제 {programProblemCount}개
                            </span>
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        onClick={onClick}
                        className="flex justify-center items-center gap-2 self-stretch rounded-lg py-3 transition-colors bg-[#0D6EFD] hover:bg-[#0B5ED7]"
                    >
                        <span
                            className="text-sm font-bold leading-4 tracking-[0.14px] text-white"
                            style={{ fontFamily: 'IBM Plex Sans KR' }}
                        >
                            입장하기
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyGroupCard;
