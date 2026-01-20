import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "@store/useAuthStore";
import BasePage from "../BasePage";
import Sidebar from "@components/mypage/Sidebar";
import ContentArea from "@components/mypage/ContentArea";

const MyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authorization = useAuthStore((state) => state.authorization);

  // Initialize viewMode from location state if available, otherwise default to "참여 현황"
  const [viewMode, setViewMode] = useState<
<<<<<<< HEAD
    "참여 현황" | "리뷰 요청" | "받은 리뷰" | "작성 리뷰" | "초대/신청 현황"
  >("참여 현황");
=======
    "참여 현황" | "활동 내역" | "작성 리뷰"
  >((location.state as any)?.viewMode || "참여 현황");
>>>>>>> e11f884af6a711d3502668fd3859b33c9dcefc57

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
        <ContentArea viewMode={viewMode} />
      </div>
    </BasePage>
  );
};

export default MyPage;
