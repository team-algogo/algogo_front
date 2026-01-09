import type { SubmissionDetailProps } from "@api/code/reviewSubmit";
import HistoryItem from "./HistoryItem";

interface HistoryBoxProps {
  history: SubmissionDetailProps[];
  submissionId: number;
}

const HistoryBox = ({ history, submissionId }: HistoryBoxProps) => {
  return (
    <div className="flex h-[380px] w-full max-w-[400px] flex-col rounded-xl border border-gray-200/80 bg-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200/60 bg-gradient-to-r from-gray-50 to-gray-50/50 px-5 py-3.5">
        <h3 className="text-sm font-bold text-gray-900">제출 히스토리</h3>
        <span className="rounded-full bg-gray-200/60 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
          {history.length}개
        </span>
      </div>

      {/* History List */}
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-3">
        <div className="flex flex-col gap-2.5">
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
