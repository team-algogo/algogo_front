import type { FC } from "react";

interface AiReviewCardProps {
  score: number;
  reason: string;
}

const AiReviewCard: FC<AiReviewCardProps> = ({ score, reason }) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-gray-50 p-6">
      <div className="flex items-center gap-3">
        <div className="text-primary-main bg-primary-600 flex h-10 w-10 items-center justify-center rounded-full font-bold">
          AI
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-900">AI 코드 평가</span>
          <span className="text-sm text-gray-500">
            종합 점수{" "}
            <span className="text-primary-300 font-bold">{score}점</span>
          </span>
        </div>
      </div>
      <div className="text-sm leading-relaxed whitespace-pre-line text-gray-700">
        {reason}
      </div>
    </div>
  );
};

export default AiReviewCard;
