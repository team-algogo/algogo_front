import type { FC } from "react";

interface AiReviewCardProps {
  score: number;
  reason: string;
}

const AiReviewCard: FC<AiReviewCardProps> = ({ score, reason }) => {
  return (
    <div className="flex flex-col gap-5 rounded-xl border border-gray-200/80 bg-white p-6 shadow-lg">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
          <span className="text-base font-bold text-white">AI</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-lg font-bold text-gray-900">AI 코드 평가</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-medium text-gray-500">종합 점수</span>
            <span className="text-xl font-bold text-indigo-600">{score}점</span>
          </div>
        </div>
      </div>
      <div className="text-sm leading-relaxed whitespace-pre-line text-gray-700">
        {reason}
      </div>
    </div>
  );
};

export default AiReviewCard;
