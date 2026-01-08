import type { Dispatch, SetStateAction } from "react";
import ParticipationStatus from "./ParticipationStatus";
import ActivityHistory from "./ActivityHistory";
import WrittenReviews from "./WrittenReviews";

type ViewMode = "참여 현황" | "활동 내역" | "작성 리뷰";

interface ContentAreaProps {
  viewMode: ViewMode;
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
}

const ContentArea = ({ viewMode, setViewMode }: ContentAreaProps) => {
  // Local state removed

  return (
    <div className="flex w-full max-w-[763px] flex-1 flex-col items-stretch gap-8">
      <div className="flex flex-col items-stretch gap-10 self-stretch">
        {/* Segmented Control */}
        <div className="flex flex-col items-start">
          <div className="flex w-[383px] flex-col items-start gap-1">
            <div className="flex items-center justify-between self-stretch rounded-[100px] bg-[#F2F2F2] p-1">
              <button
                onClick={() => setViewMode("참여 현황")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-[100px] px-4 py-2 transition-colors ${
                  viewMode === "참여 현황" ? "bg-[#0D6EFD]" : "bg-transparent"
                }`}
              >
                <span
                  className={`line-clamp-1 flex-1 overflow-hidden text-center text-sm leading-[130%] font-medium tracking-[0.14px] text-ellipsis ${
                    viewMode === "참여 현황" ? "text-white" : "text-[#333]"
                  }`}
                  style={{ fontFamily: "IBM Plex Sans KR" }}
                >
                  참여 현황
                </span>
              </button>
              <button
                onClick={() => setViewMode("활동 내역")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-[100px] px-4 py-2 transition-colors ${
                  viewMode === "활동 내역" ? "bg-[#0D6EFD]" : "bg-transparent"
                }`}
              >
                <span
                  className={`line-clamp-1 flex-1 overflow-hidden text-center text-sm leading-[130%] font-medium tracking-[0.14px] text-ellipsis ${
                    viewMode === "활동 내역" ? "text-white" : "text-[#333]"
                  }`}
                  style={{ fontFamily: "IBM Plex Sans KR" }}
                >
                  활동 내역
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="w-full">
          {viewMode === "참여 현황" && <ParticipationStatus />}
          {viewMode === "활동 내역" && <ActivityHistory />}
          {viewMode === "작성 리뷰" && <WrittenReviews />}
        </div>
      </div>
    </div>
  );
};

export default ContentArea;
