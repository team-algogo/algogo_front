import type { SubmissionDetailProps } from "@api/code/reviewSubmit";
import HistoryItem from "./HistoryItem";

interface HistoryBoxProps {
  history: SubmissionDetailProps[];
  submissionId: number;
}

const HistoryBox = ({ history, submissionId }: HistoryBoxProps) => {
  return (
    <div className="flex h-[380px] w-[300px] flex-col rounded border border-[#d0d7de] bg-white">
      {/* Header - GitHub PR Sidebar 스타일 */}
      <div className="flex items-center justify-between border-b border-[#d0d7de] bg-[#f6f8fa] px-4 py-2.5">
        <h3 className="text-sm font-semibold text-[#1f2328]">
          Submission History
        </h3>
        <span className="rounded-full bg-[#e6e9ed] px-2 py-0.5 text-xs font-medium text-[#656d76]">
          {history.length}개
        </span>
      </div>

      {/* History List - 플랫한 리스트 */}
      <div className="flex flex-1 flex-col overflow-y-auto px-3 pt-2 pb-3">
        <div className="flex flex-col gap-1.5">
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
