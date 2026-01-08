import React from 'react';
import Button from '../../button/Button';
import Badge from '../../badge/Badge';

interface MyPageCardProps {
    type: 'problem' | 'group';
    title: string;
    progress: number;
    stats: {
        count: number;
        members?: number;
    };
    imageContent?: React.ReactNode;
    onClick: () => void;
}

const MyPageCard = ({ type, title, progress, stats, imageContent, onClick }: MyPageCardProps) => {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-0 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group h-full">
            <div className="h-40 bg-gray-50 overflow-hidden relative">
                {imageContent}
                <div className="absolute top-3 left-3">
                    <Badge variant="white">
                        {type === 'problem' ? '기업대비' : '그룹방'}
                    </Badge>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <h4 className="font-bold text-grayscale-dark-gray text-lg mb-3">{title}</h4>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2 relative">
                    <div
                        className="bg-primary-main h-2 rounded-full"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="flex justify-between items-center text-xs text-grayscale-warm-gray mb-6">
                    <div className="flex gap-3">
                        <span>{type === 'problem' ? '📄' : '📖'} {stats.count}개</span>
                        <span>👥 {stats.members || 0}명</span>
                    </div>
                    <span className="font-medium text-primary-main">{progress}%</span>
                </div>

                <div className="mt-auto">
                    <Button variant="primary" onClick={onClick} style={{ height: '3rem', fontSize: '0.95rem', borderRadius: '0.5rem', width: '100%' }}>
                        {type === 'problem' ? '문제 풀기' : '입장하기'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MyPageCard;
