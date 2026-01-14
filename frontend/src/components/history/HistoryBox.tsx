import type { SubmissionDetailProps } from "@api/code/reviewSubmit";
import HistoryItem from "./HistoryItem";

interface HistoryBoxProps {
  history: SubmissionDetailProps[];
  submissionId: number;
}

const HistoryBox = ({ history, submissionId }: HistoryBoxProps) => {
  return (
    <div className="flex h-[380px] w-[340px] flex-col rounded border border-[#d0d7de] bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#d0d7de] bg-[#f6f8fa] px-4 py-2.5">
        <h3 className="text-sm font-semibold text-[#1f2328]">제출 히스토리</h3>
        <span className="text-xs font-medium text-[#656d76]">
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
