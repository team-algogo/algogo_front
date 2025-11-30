import HistoryItem from "./HistoryItem";

const HistoryBox = () => {
  return (
    <div className="flex flex-col w-[280px] h-[380px] px-4 py-3 gap-y-3 border border-grayscale-warm-gray rounded-lg">
      <p className="font-headline">제출 히스토리</p>
      <div className="flex-1 overflow-y-auto">
        <HistoryItem isPassed={true} />
        <HistoryItem isPassed={true} />
        <HistoryItem isPassed={false} />
        <HistoryItem isPassed={true} />
        <HistoryItem isPassed={false} />
        <HistoryItem isPassed={false} />
      </div>
    </div>
  );
};

export default HistoryBox;
