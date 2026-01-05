import { useState } from 'react';
import ParticipationStatus from './ParticipationStatus';
import ActivityHistory from './ActivityHistory';

type ViewMode = '참여 현황' | '활동 내역';

const ContentArea = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('참여 현황');

    return (
        <div className="flex flex-col items-stretch gap-8 flex-1 max-w-[763px] w-full">
            <div className="flex flex-col items-stretch gap-10 self-stretch">
                {/* Segmented Control */}
                <div className="flex flex-col items-start">
                    <div className="flex w-[383px] flex-col items-start gap-1">
                        <div className="flex justify-between items-center self-stretch rounded-[100px] bg-[#F2F2F2] p-1">
                            <button
                                onClick={() => setViewMode('참여 현황')}
                                className={`flex flex-1 justify-center items-center gap-2 rounded-[100px] py-2 px-4 transition-colors ${
                                    viewMode === '참여 현황' ? 'bg-[#0D6EFD]' : 'bg-transparent'
                                }`}
                            >
                                <span
                                    className={`flex-1 overflow-hidden text-center text-ellipsis text-sm font-medium leading-[130%] tracking-[0.14px] line-clamp-1 ${
                                        viewMode === '참여 현황' ? 'text-white' : 'text-[#333]'
                                    }`}
                                    style={{ fontFamily: 'IBM Plex Sans KR' }}
                                >
                                    참여 현황
                                </span>
                            </button>
                            <button
                                onClick={() => setViewMode('활동 내역')}
                                className={`flex flex-1 justify-center items-center gap-2 rounded-[100px] py-2 px-4 transition-colors ${
                                    viewMode === '활동 내역' ? 'bg-[#0D6EFD]' : 'bg-transparent'
                                }`}
                            >
                                <span
                                    className={`flex-1 overflow-hidden text-center text-ellipsis text-sm font-medium leading-[130%] tracking-[0.14px] line-clamp-1 ${
                                        viewMode === '활동 내역' ? 'text-white' : 'text-[#333]'
                                    }`}
                                    style={{ fontFamily: 'IBM Plex Sans KR' }}
                                >
                                    활동 내역
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dynamic Content */}
                <div className="w-full">
                    {viewMode === '참여 현황' ? <ParticipationStatus /> : <ActivityHistory />}
                </div>
            </div>
        </div>
    );
};

export default ContentArea;
