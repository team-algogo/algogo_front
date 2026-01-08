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

// Temporary mock data for list items
const MOCK_LIST_ITEMS = Array(5).fill(null).map((_, i) => ({
  id: i,
  title: "알고리즘 캠페인 시즌 " + (i + 1),
  count: 10 + i
}));

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
      {/* Banner Section */}
      <section className="w-full">
        <Banner />
      </section>

      {/* Featured Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="flex justify-between items-end mb-8">
          <div className="relative">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              지금 뜨고 있는 <span className="text-primary-600 relative inline-block">
                리뷰
                <svg className="absolute w-full h-2 bottom-1 left-0 -z-10 text-primary-200" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" opacity="0.6" />
                </svg>
              </span>
            </h2>
            <p className="text-gray-500 mt-2">개발자들의 열띤 토론이 진행되고 있어요</p>
          </div>
          <TextLink src="/reviews" variant="secondary" className="text-sm font-medium hover:text-primary-600 transition-colors">전체보기 →</TextLink>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          <MainGroupCard />
          <MainGroupCard />
          <MainGroupCard />
          <MainGroupCard />
        </div>
      </section>

      {/* Recommended Problem Sets Section */}
      <section className="relative py-20 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gray-100/50 -skew-y-2 transform origin-top-left scale-110 z-[-1]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">추천 문제집</h2>
              <p className="text-gray-500">실력 향상을 위한 엄선된 문제집들입니다</p>
            </div>
            <TextLink src="/problemset" variant="secondary" className="text-sm font-medium hover:text-primary-600 transition-colors">전체보기 →</TextLink>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MainProblemSetCard img={img} />
            <MainProblemSetCard img={img} />
            <MainProblemSetCard img={img} />
            <MainProblemSetCard img={img} />
          </div>
        </div>
      </section>

      {/* Campaign & Group Status Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Campaign Column */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center border-b-2 border-gray-100 pb-4">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-2 h-8 bg-primary-500 rounded-full"></span>
                캠페인
              </h3>
              <TextLink src="#" variant="secondary" className="text-sm font-medium text-gray-400 hover:text-primary-600">더보기</TextLink>
            </div>
            <div className="flex flex-col gap-3">
              {MOCK_LIST_ITEMS.map((item) => (
                <a key={`campaign-${item.id}`} href="#" className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-primary-200 transition-all duration-300 group">
                  <span className="text-gray-700 font-medium text-lg group-hover:text-primary-600 transition-colors">{item.title}</span>
                  <div className="flex items-center gap-2 text-gray-400 text-sm bg-gray-50 px-3 py-1 rounded-full group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    <img src="/icons/groupIcon.svg" className="size-4 opacity-60 group-hover:opacity-100 group-hover:filter group-hover:invert-[.5] group-hover:sepia group-hover:saturate-[50] group-hover:hue-rotate-[200deg]" />
                    <span>{item.count}명 참여중</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Group Column */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center border-b-2 border-gray-100 pb-4">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-2 h-8 bg-teal-500 rounded-full"></span>
                그룹현황
              </h3>
              <TextLink src="/group" variant="secondary" className="text-sm font-medium text-gray-400 hover:text-teal-600">더보기</TextLink>
            </div>
            <div className="flex flex-col gap-3">
              {MOCK_LIST_ITEMS.map((item) => (
                <a key={`group-${item.id}`} href="#" className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-teal-200 transition-all duration-300 group">
                  <span className="text-gray-700 font-medium text-lg group-hover:text-teal-600 transition-colors">알고리즘 스터디 그룹 {item.id + 1}</span>
                  <div className="flex items-center gap-2 text-gray-400 text-sm bg-gray-50 px-3 py-1 rounded-full group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                    <img src="/icons/groupIcon.svg" className="size-4 opacity-60" />
                    <span>{item.count}명</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 회원가입 성공 모달 */}
      <AlertModal.Content autoCloseDelay={0}>
        <div className="text-4xl mb-4">🥳</div>
        <AlertModal.Message className="font-semibold text-lg text-gray-900">
          성공적으로 회원가입이 되었습니다!
        </AlertModal.Message>
        <button
          onClick={() => {
            closeModal();
            navigate("/login");
          }}
          className="mt-6 px-6 py-2.5 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors font-medium w-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
        >
          로그인하기
        </button>
      </AlertModal.Content>
    </BasePage>
  );
};

export default MainPage;
