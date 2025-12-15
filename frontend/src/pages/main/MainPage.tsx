import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Banner from "@components/banner/Banner";
import MainGroupCard from "@components/cards/main/MainGroupCard";
import TextLink from "@components/textLink/TextLink";
import MainProblemSetCard from "@components/cards/main/MainProblemSetCard";
import AlertModal from "@components/modal/alarm/AlertModal";

import img from "@assets/images/MainCard/MainCard1.jpg";

import BasePage from "@pages/BasePage";

import { useModalStore } from "@store/useModalStore";

const MainPage = () => {
  const { state, pathname } = useLocation();
  const navigate = useNavigate();
  const { openModal, closeModal } = useModalStore();

  // 회원가입 성공 후 모달 표시
  useEffect(() => {
    if (state?.showModal) {
      openModal("alert");

      // state 제거 (새로고침 시 모달 다시 안 뜨도록)
      navigate(pathname, {
        replace: true,
        state: null,
      });
    }
  }, [state, openModal, navigate, pathname]);

  return (
    <BasePage>
      <Banner />
      <div className="flex flex-col gap-6">
        <div className="font-title text-2xl px-6 py-8">
          지금 이런 코드들이 리뷰되고 있어요!
        </div>
        <div className="flex justify-center gap-15">
          <MainGroupCard />
          <MainGroupCard />
          <MainGroupCard />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between px-6 py-3">
          <div className="font-title text-2xl">추천 문제집</div>
          <TextLink src="#">전체보기 →</TextLink>
        </div>
        <div className="flex gap-12 pl-8">
          <MainProblemSetCard img={img} />
          <MainProblemSetCard img={img} />
          <MainProblemSetCard img={img} />
          <MainProblemSetCard img={img} />
        </div>
      </div>

      <div className="flex justify-between">
        {/* 캠페인 선택 */}
        <div className="w-[650px] flex flex-col gap-2 px-6">
          <div className="flex justify-between">
            <div className="font-title text-2xl p-2">캠페인</div>
            <TextLink src="#">전체보기 →</TextLink>
          </div>
          <div className="flex flex-col px-1">
            <a href="#" className="flex justify-between">
              <div className="flex items-center">캠페인 제목</div>
              <div className="flex px-3.5 py-3 gap-2">
                <img src="/icons/groupIcon.svg" />
                <div>10</div>
              </div>
            </a>
            <a href="#" className="flex justify-between">
              <div className="flex items-center">캠페인 제목</div>
              <div className="flex px-3.5 py-3 gap-2">
                <img src="/icons/groupIcon.svg" />
                <div>10</div>
              </div>
            </a>
            <a href="#" className="flex justify-between">
              <div className="flex items-center">캠페인 제목</div>
              <div className="flex px-3.5 py-3 gap-2">
                <img src="/icons/groupIcon.svg" />
                <div>10</div>
              </div>
            </a>
            <a href="#" className="flex justify-between">
              <div className="flex items-center">캠페인 제목</div>
              <div className="flex px-3.5 py-3 gap-2">
                <img src="/icons/groupIcon.svg" />
                <div>10</div>
              </div>
            </a>
            <a href="#" className="flex justify-between">
              <div className="flex items-center">캠페인 제목</div>
              <div className="flex px-3.5 py-3 gap-2">
                <img src="/icons/groupIcon.svg" />
                <div>10</div>
              </div>
            </a>
          </div>
        </div>
        {/* 그룹 선택 */}
        <div className="w-[650px] flex flex-col gap-2 px-6">
          <div className="flex justify-between">
            <div className="font-title text-2xl p-2">그룹현황</div>
            <TextLink src="#">전체보기 →</TextLink>
          </div>
          <div className="flex flex-col px-1">
            <a href="#" className="flex justify-between">
              <div className="flex items-center">그룹 제목</div>
              <div className="flex px-3.5 py-3 gap-2">
                <img src="/icons/groupIcon.svg" />
                <div>10</div>
              </div>
            </a>
            <a href="#" className="flex justify-between">
              <div className="flex items-center">그룹 제목</div>
              <div className="flex px-3.5 py-3 gap-2">
                <img src="/icons/groupIcon.svg" />
                <div>10</div>
              </div>
            </a>
            <a href="#" className="flex justify-between">
              <div className="flex items-center">그룹 제목</div>
              <div className="flex px-3.5 py-3 gap-2">
                <img src="/icons/groupIcon.svg" />
                <div>10</div>
              </div>
            </a>
            <a href="#" className="flex justify-between">
              <div className="flex items-center">캠페인 제목</div>
              <div className="flex px-3.5 py-3 gap-2">
                <img src="/icons/groupIcon.svg" />
                <div>10</div>
              </div>
            </a>
            <a href="#" className="flex justify-between">
              <div className="flex items-center">캠페인 제목</div>
              <div className="flex px-3.5 py-3 gap-2">
                <img src="/icons/groupIcon.svg" />
                <div>10</div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* 회원가입 성공 모달 */}
      <AlertModal.Content autoCloseDelay={0}>
        <div className="text-4xl mb-4">🥳</div>
        <AlertModal.Message className="font-semibold text-lg">
          성공적으로 회원가입이 되었습니다!
        </AlertModal.Message>
        <button
          onClick={() => {
            closeModal();
            navigate("/login");
          }}
          className="mt-4 px-6 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          로그인하기
        </button>
      </AlertModal.Content>
    </BasePage>
  );
};

export default MainPage;
