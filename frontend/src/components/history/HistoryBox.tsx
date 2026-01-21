import type { SubmissionDetailProps } from "@api/code/reviewSubmit";
import HistoryItem from "./HistoryItem";

interface HistoryBoxProps {
  history: SubmissionDetailProps[];
  submissionId: number;
}

const HistoryBox = ({ history, submissionId }: HistoryBoxProps) => {
  return (
    <div className="flex h-[380px] w-[340px] flex-col rounded-xl border border-gray-200/60 bg-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200/60 bg-gradient-to-r from-gray-50 via-white to-gray-50/50 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-800">제출 히스토리</h3>
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
          {history.length}개
        </span>
      </div>

      {/* History List - 카드 형태 */}
      <div className="flex flex-1 flex-col overflow-y-auto px-3 pt-3 pb-3">
        <div className="flex flex-col gap-2">
          {history.map((item) => (
            <HistoryItem
              key={item.submissionId}
              submissionId={item.submissionId}
              isSuccess={item.isSuccess}
              execTime={item.execTime}
              createdAt={item.createAt}
              memory={item.memory}
              isCurrent={item.submissionId === submissionId}
              algorithmList={item.algorithmList || []}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryBox;
