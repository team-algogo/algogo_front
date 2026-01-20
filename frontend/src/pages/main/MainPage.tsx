import { useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";

// import Banner from "@components/banner/Banner";
import { HeroSection } from "@components/main/landing/HeroSection";

// import MainCampaignCard from "@components/cards/main/MainCampaignCard";
import ReviewRequestCard from "@components/cards/main/ReviewRequestCard";
import EmptyState from "@components/empty/EmptyState";
import TextLink from "@components/textLink/TextLink";

import ProblemSearchResultCard from "@components/cards/search/ProblemSearchResultCard";
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


  // Landing Page for non-logged-in users
  // Redirect to Intro Page for non-logged-in users
  if (!isLoggedIn) {
    return <Navigate to="/intro" replace />;
  }

  // Dashboard for logged-in users
  return (
    <BasePage>
      {/* Banner Section */}
      <section className="w-full">
        <HeroSection />
      </section>

      {/* Featured Reviews Section */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-16 pb-6 sm:px-6 lg:px-8">
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
        <div className="absolute inset-0 z-[-1] origin-top-left scale-110 -skew-y-2 transform bg-gray-100/50"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
              <ProblemSearchResultCard
                key={item.programId}
                programId={item.programId}
                title={item.title}
                description={item.description}
                problemCount={item.problemCount}
                categories={item.categories}
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
      <section className="mx-auto mb-12 w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
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
                  <a
                    key={index}
                    href={`/group/${group.programId}`}
                    className="group flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 transition-all duration-300 hover:border-teal-200 hover:shadow-md"
                  >
                    <span className="text-lg font-medium text-gray-700 transition-colors group-hover:text-teal-600">
                      {group.title}
                    </span>
                    <div className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-sm text-gray-400 transition-colors group-hover:bg-teal-50 group-hover:text-teal-600">
                      <img
                        src="/icons/groupIcon.svg"
                        className="size-4 opacity-60"
                      />
                      <span>{group.memberCount}명</span>
                    </div>
                  </a>
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
  );
};

export default MainPage;
