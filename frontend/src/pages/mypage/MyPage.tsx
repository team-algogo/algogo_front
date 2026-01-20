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
  const [viewMode, setViewMode] = useState<
    "참여 현황" | "활동 내역" | "작성 리뷰"
  >("참여 현황");

  const [initialSubTab, setInitialSubTab] = useState<"문제집" | "캠페인" | "그룹방" | undefined>(undefined);

  // URL 쿼리 파라미터 확인 (tab=group)
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "group") {
      setViewMode("참여 현황");
      setInitialSubTab("그룹방");
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
          setViewMode={setViewMode}
          initialSubTab={initialSubTab}
        />
      </div>
    </BasePage>
  );
};

export default MyPage;
