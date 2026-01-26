import { useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";

// import Banner from "@components/banner/Banner";
import { HeroSection } from "@components/main/landing/HeroSection";

// import MainCampaignCard from "@components/cards/main/MainCampaignCard";
import ReviewRequestCard from "@components/cards/main/ReviewRequestCard";
import MainGroupListCard from "@components/cards/main/MainGroupListCard";

import EmptyState from "@components/empty/EmptyState";
import TextLink from "@components/textLink/TextLink";

import ProblemSetCard from "@components/problemset/ProblemSetCard";
import AlertModal from "@components/modal/alarm/AlertModal";

import BasePage from "@pages/BasePage";

import { useModalStore } from "@store/useModalStore";
import useAuthStore from "@store/useAuthStore";
import {
  getRequireReview,
  type RequiredCodeReviewList,
} from "@api/review/manageReview";
import type { ProblemSetListResponse } from "@type/problemset/problemSet";
import { getProblemSetList } from "@api/problemset/getProblemSetList";
import type { GroupItem } from "@type/group/group";
import { fetchGroupList, type GroupListParams } from "@api/group/groupApi";




const MainPage = () => {
  const [reviewRequire, setReviewRequire] =
    useState<RequiredCodeReviewList | null>(null);

  const [recommendProblemSet, setRecommendProblemSet] =
    useState<ProblemSetListResponse | null>(null);

  const [groupList, setGroupList] = useState<GroupItem[] | null>(null);
  const [showLoginRequiredBanner, setShowLoginRequiredBanner] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);

  const { state, pathname } = useLocation();
  const navigate = useNavigate();
  const { openModal, closeModal } = useModalStore();
  const { userType } = useAuthStore();



  const getReviewList = async () => {
    try {
      const requireReviews = await getRequireReview();
      setReviewRequire(requireReviews.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getProblemSet = async () => {
    try {
      const response = await getProblemSetList(
        "전체",
        "popular",
        "desc",
        "",
        1,
        10,
      );
      setRecommendProblemSet(response);
    } catch (err) {
      console.log(err);
    }
  };

  const getGroupList = async (param: GroupListParams) => {
    const response = await fetchGroupList(param);
    setGroupList(response.data.groupLists);
  };

  const isLoggedIn = userType === "User";

  useEffect(() => {
    getProblemSet();
    getGroupList({ size: 5, sortBy: "createdAt", sortDirection: "desc" });
  }, []);

  useEffect(() => {
    if (userType == "User") getReviewList();
  }, [userType]);

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

  // 로그인 필요 배너 표시
  useEffect(() => {
    if (state?.requireLogin) {
      setShowLoginRequiredBanner(true);
      setBannerVisible(true);
      // Clear state so banner doesn't show on refresh
      window.history.replaceState({}, document.title);

      // 3초 후 배너 fade-out 시작
      const fadeTimer = setTimeout(() => {
        setBannerVisible(false);
      }, 3000);

      // fade-out 애니메이션 후 완전히 제거
      const removeTimer = setTimeout(() => {
        setShowLoginRequiredBanner(false);
      }, 3500);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [state]);


  // Landing Page for non-logged-in users
  // Redirect to Intro Page for non-logged-in users
  if (!isLoggedIn) {
    return <Navigate to="/intro" replace />;
  }

  // Dashboard for logged-in users
  return (
    <>
      {/* 로그인 필요 안내 배너 - fixed position으로 레이아웃 shift 방지 */}
      {showLoginRequiredBanner && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-[420px] px-4 transition-opacity duration-500 ${bannerVisible ? "opacity-100" : "opacity-0"
            }`}
        >
          <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 shadow-lg">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-blue-600 flex-shrink-0"
            >
              <path
                d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm font-medium text-blue-900">
              로그인이 필요한 서비스입니다.
            </p>
          </div>
        </div>
      )}

      {/* Banner Section - Full Width, outside BasePage */}
      <section className="w-full">
        <HeroSection />
      </section>

      <BasePage>
        {/* Featured Reviews Section */}
        <section className="mx-auto w-full max-w-7xl pt-4 pb-6">
          <div className="mb-8 flex items-end justify-between">
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                도착한 리뷰 요청
              </h2>
              <p className="mt-2 text-gray-500">
                다른 사람의 코드를 리뷰하고 함께 성장해보세요!
              </p>
            </div>
            <TextLink
              src="/mypage"
              variant="secondary"
              state={{ viewMode: "활동 내역" }}
              className="hover:text-primary-600 text-sm font-medium transition-colors"
            >
              전체보기 →
            </TextLink>
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviewRequire && reviewRequire.requiredCodeReviews.length > 0 ? (
              reviewRequire.requiredCodeReviews
                .slice(0, 3)
                .map((review, index) => (
                  <ReviewRequestCard key={index} {...review} />
                ))
            ) : (
              <div className="col-span-full w-full">
                <EmptyState
                  icon="📭"
                  title="아직 도착한 리뷰 요청이 없어요"
                  description="다른 활동을 하며 기다려보세요!"
                />
              </div>
            )}
          </div>
        </section>

        {/* Recommended Problem Sets Section */}
        <section className="relative w-full overflow-hidden pt-6 pb-20">
          {/* Removed Grid Background */}

          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">
                  추천 문제집
                </h2>
                <p className="text-gray-500">
                  실력 향상을 위한 엄선된 문제집들입니다
                </p>
              </div>
              <TextLink
                src="/problemset"
                variant="secondary"
                className="hover:text-primary-600 text-sm font-medium transition-colors"
              >
                전체보기 →
              </TextLink>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recommendProblemSet?.problemSetList.slice(0, 4).map((item) => (
                <ProblemSetCard
                  key={item.programId}
                  programId={item.programId}
                  title={item.title}
                  description={item.description}
                  thumbnail={item.thumbnail}
                  categories={item.categories}
                  totalParticipants={item.totalParticipants}
                  problemCount={item.problemCount}
                  isLoggedIn={isLoggedIn}
                />
              ))}
              {!recommendProblemSet && (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="relative h-[220px] w-full animate-pulse overflow-hidden rounded-xl bg-gray-200"
                    >
                      <div className="absolute bottom-0 flex w-full flex-col gap-2 p-5">
                        <div className="h-6 w-3/4 rounded bg-gray-300"></div>
                        <div className="h-4 w-1/2 rounded bg-gray-300"></div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Campaign & Group Status Section */}
        <section className="mx-auto mb-12 w-full max-w-7xl py-10">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            {/* Campaign Column */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b-2 border-gray-100 pb-4">
                <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                  <span className="bg-primary-500 h-8 w-2 rounded-full"></span>
                  캠페인
                </h3>
                <TextLink
                  src="#"
                  variant="secondary"
                  className="hover:text-primary-600 text-sm font-medium text-gray-400"
                >
                  더보기
                </TextLink>
              </div>
              <div className="flex flex-col gap-3">
                <EmptyState
                  icon="🦥"
                  title="아직 캠페인은 준비가 되지 않았어요!"
                />
              </div>
            </div>

            {/* Group Column */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b-2 border-gray-100 pb-4">
                <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                  <span className="h-8 w-2 rounded-full bg-teal-500"></span>
                  그룹현황
                </h3>
                <TextLink
                  src="/group"
                  variant="secondary"
                  className="text-sm font-medium text-gray-400 hover:text-teal-600"
                >
                  더보기
                </TextLink>
              </div>
              <div className="flex flex-col gap-3">
                {groupList && groupList.length > 0 ? (
                  groupList.slice(0, 5).map((group, index) => (
                    <MainGroupListCard
                      key={index}
                      title={group.title}
                      memberCount={group.memberCount}
                      url={`/group/${group.programId}`}
                    />
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-400">
                    그룹 정보를 불러오는 중...
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 회원가입 성공 모달 - Also included here for logged in user scenario if applicable */}
        <AlertModal.Content autoCloseDelay={0}>
          <div className="mb-4 text-4xl">🥳</div>
          <AlertModal.Message className="text-lg font-semibold">
            성공적으로 회원가입이 되었습니다!
          </AlertModal.Message>
          <button
            onClick={() => {
              closeModal();
              navigate("/login");
            }}
            className="bg-primary-main hover:bg-primary-dark mt-4 rounded-lg px-6 py-2 text-white transition-colors"
          >
            로그인하기
          </button>
        </AlertModal.Content>
      </BasePage>
    </>
  );
};

export default MainPage;
