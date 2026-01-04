import type { SubmissionDetailProps } from "@api/code/reviewSubmit";
import HistoryItem from "./HistoryItem";

interface HistoryBoxProps {
  history: SubmissionDetailProps[];
  submissionId: number;
}

const HistoryBox = ({ history, submissionId }: HistoryBoxProps) => {
  return (
    <div className="border-grayscale-default inline-flex max-h-80 flex-col gap-y-3 rounded-lg border px-4 py-3 shadow-lg">
      <p className="font-headline text-grayscale-dark-gray">제출 히스토리</p>
      <div className="flex-1 overflow-y-auto">
        {history.map((item) => (
          <HistoryItem
            key={item.submissionId}
            submissionId={item.submissionId}
            isSuccess={item.isSuccess}
            language={item.language}
            execTime={item.execTime}
            createdAt={item.createAt}
            memory={item.memory}
            isCurrent={item.submissionId === submissionId}
          />
        ))}
      </div>
    </div>
  );
};

export default HistoryBox;
