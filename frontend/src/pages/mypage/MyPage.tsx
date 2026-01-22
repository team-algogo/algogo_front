import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "@store/useAuthStore";
import BasePage from "../BasePage";
import Sidebar from "@components/mypage/Sidebar";
import ContentArea from "@components/mypage/ContentArea";

const MyPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const authorization = useAuthStore((state) => state.authorization);

  // Initialize viewMode from location state if available, otherwise default to "참여 현황"
  const [viewMode, setViewMode] = useState<
    "참여 현황" | "내가 푼 문제" | "리뷰 요청" | "받은 리뷰" | "작성 리뷰" | "초대/신청 현황"
  >("참여 현황");

  const [initialSubTab, setInitialSubTab] = useState<"문제집" | "캠페인" | "그룹방" | undefined>(undefined);

  // URL 쿼리 파라미터 확인 (tab=group)
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "group") {
      setViewMode("참여 현황");
      setInitialSubTab("그룹방");
    } else if (tab === "invite") {
      setViewMode("초대/신청 현황");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authorization) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login", { replace: true });
    }
  }, [authorization, navigate]);

  if (!authorization) return null;

  return (
    <BasePage>
      <div className="grid grid-cols-[280px_1fr] items-start gap-10">
        <Sidebar setViewMode={setViewMode} />
        <ContentArea
          viewMode={viewMode}
          initialSubTab={initialSubTab}
        />
      </div>
    </BasePage>
  );
};

export default MyPage;
