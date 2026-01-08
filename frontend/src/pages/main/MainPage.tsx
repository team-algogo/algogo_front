import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Banner from "@components/banner/Banner";

// import MainCampaignCard from "@components/cards/main/MainCampaignCard";
import ReviewRequestCard from "@components/cards/main/ReviewRequestCard";
import ReviewCard from "@components/cards/main/ReviewCard";
import EmptyState from "@components/empty/EmptyState";
import TextLink from "@components/textLink/TextLink";
import MainProblemSetCard from "@components/cards/main/MainProblemSetCard";
import AlertModal from "@components/modal/alarm/AlertModal";

import img2 from "@assets/images/MainCard/MainCard2.jpg";

import BasePage from "@pages/BasePage";

import { useModalStore } from "@store/useModalStore";
import useAuthStore from "@store/useAuthStore";
import { getPopularSubmissionList } from "@api/main/getPopularProblem";
import type { GroupItem } from "@type/group/group";
import { fetchGroupList, type GroupListParams } from "@api/group/groupApi";
import {
  getRecieveReview,
  getRequireReview,
  type ReceiveReviewList,
  type RequiredCodeReviewList,
} from "@api/review/manageReview";
import type { ProblemSetListResponse } from "@type/problemset/problemSet";
import { getProblemSetList } from "@api/problemset/getProblemSetList";
import MainSubmissionCard from "@components/cards/main/MainSubmissionCard";
import MainProblemCard from "@components/cards/main/MainProblemCard";
import {
  getSubmissionDetail,
  type SubmissionDetailProps,
} from "@api/code/reviewSubmit";
import { getProblemInfo, type ProgramProblemProps } from "@api/code/codeSubmit";

// Temporary mock data for list items
const MOCK_LIST_ITEMS = Array(5).fill(null).map((_, i) => ({
  id: i,
  title: "알고리즘 캠페인 시즌 " + (i + 1),
  count: 10 + i
}));

const MainPage = () => {
  const [reviewRequire, setReviewRequire] =
    useState<RequiredCodeReviewList | null>(null);
  const [reviewReceive, setReviewReceive] = useState<ReceiveReviewList | null>(
    null,
  );

  const [recommendProblemSet, setRecommendProblemSet] =
    useState<ProblemSetListResponse | null>(null);

  const [groupList, setGroupList] = useState<GroupItem[] | null>(null);

  const { state, pathname } = useLocation();
  const navigate = useNavigate();
  const { openModal, closeModal } = useModalStore();
  const { userType } = useAuthStore();

  /* Refactored states for dynamic cards & carousel */
  const [hotList, setHotList] = useState<number[]>([]);
  const [recentList, setRecentList] = useState<number[]>([]);
  const [joinInList, setJoinInList] = useState<number[]>([]);

  const [currentHotSubmission, setCurrentHotSubmission] =
    useState<SubmissionDetailProps | null>(null);
  const [currentRecentSubmission, setCurrentRecentSubmission] =
    useState<SubmissionDetailProps | null>(null);
  const [currentPopularProblem, setCurrentPopularProblem] =
    useState<ProgramProblemProps | null>(null);

  const [currentHotPlatform, setCurrentHotPlatform] = useState<string>("");
  const [currentRecentPlatform, setCurrentRecentPlatform] =
    useState<string>("");

  // Helper to fetch details + platform
  const fetchSubmissionData = async (submissionId: number) => {
    try {
      const detail = await getSubmissionDetail(submissionId.toString());
      // Also fetch problem info to get platform
      const problemInfo = await getProblemInfo(
        detail.programProblemId.toString(),
      );
      return { detail, platform: problemInfo.platformType };
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const getPopularLists = async () => {
    try {
      // 1. Get Lists (IDs)
      const hotResponse = await getPopularSubmissionList("hot");
      const recentResponse = await getPopularSubmissionList("recent");
      const joinInResponse = await getPopularSubmissionList("join-in");

      let hotIds: number[] = [];
      let recentIds: number[] = [];
      let joinInIds: number[] = [];

      if (hotResponse && "submissionIdList" in hotResponse) {
        hotIds = hotResponse.submissionIdList;
      }

      if (recentResponse && "submissionIdList" in recentResponse) {
        recentIds = recentResponse.submissionIdList;
      }

      if (joinInResponse && "programProblemIdList" in joinInResponse) {
        joinInIds = joinInResponse.programProblemIdList;
      }

      setHotList(hotIds);
      setRecentList(recentIds);
      setJoinInList(joinInIds);
    } catch (err) {
      console.log(err);
    }
  };

  // Effect: Fetch Detail when Hot List changes
  useEffect(() => {
    const fetchHot = async () => {
      if (hotList.length > 0) {
        // Fetch a random item
        const randomIndex = Math.floor(Math.random() * hotList.length);
        const id = hotList[randomIndex];
        const result = await fetchSubmissionData(id);
        if (result) {
          setCurrentHotSubmission(result.detail);
          setCurrentHotPlatform(result.platform);
        }
      }
    };
    fetchHot();
  }, [hotList]);

  // Effect: Fetch Detail when Recent List changes
  useEffect(() => {
    const fetchRecent = async () => {
      if (recentList.length > 0) {
        // Always fetch the first item
        const id = recentList[0];
        const result = await fetchSubmissionData(id);
        if (result) {
          setCurrentRecentSubmission(result.detail);
          setCurrentRecentPlatform(result.platform);
        }
      }
    };
    fetchRecent();
  }, [recentList]);

  // Effect: Fetch Problem when Join List changes
  useEffect(() => {
    const fetchJoin = async () => {
      if (joinInList.length > 0) {
        // Always fetch the first item
        const id = joinInList[0];
        try {
          const detail = await getProblemInfo(id.toString());
          setCurrentPopularProblem(detail);
        } catch (err) {
          console.log(err);
        }
      }
    };
    fetchJoin();
  }, [joinInList]);

  const getReviewList = async () => {
    try {
      const requireReviews = await getRequireReview();
      const recieveReviews = await getRecieveReview(3, 0);
      setReviewRequire(requireReviews.data);
      setReviewReceive(recieveReviews.data);
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
  const [activeTab, setActiveTab] = useState<"All" | "Groups" | "Campaigns">(
    "All",
  );

  useEffect(() => {
    getPopularLists();
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

  return (
    <BasePage>
      {/* Banner Section */}
      <section className="w-full">
        <Banner />
      </section>

      {/* Featured Reviews Section (로그인 여부에 따라 다른 컨텐츠 표시) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="flex justify-between items-end mb-8">
          <div className="relative">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              {isLoggedIn ? "도착한 리뷰 요청" : "지금 뜨고 있는 "}
              {!isLoggedIn && (
                <span className="text-primary-600 relative inline-block">
                  리뷰
                  <svg className="absolute w-full h-2 bottom-1 left-0 -z-10 text-primary-200" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" opacity="0.6" />
                  </svg>
                </span>
              )}
            </h2>
            <p className="text-gray-500 mt-2">
              {isLoggedIn
                ? "다른 사람의 코드를 리뷰하고 함께 성장해보세요!"
                : "개발자들의 열띤 토론이 진행되고 있어요"
              }
            </p>
          </div>
          <TextLink src={isLoggedIn ? "/mypage" : "/reviews"} variant="secondary" className="text-sm font-medium hover:text-primary-600 transition-colors">전체보기 →</TextLink>
        </div>

        {/* Content Area */}
        {isLoggedIn ? (
          // 로그인 시: 리뷰 요청 카드 리스트
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviewRequire && reviewRequire.requiredCodeReviews.length > 0 ? (
              reviewRequire.requiredCodeReviews.slice(0, 3).map((review, index) => (
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
        ) : (
          // 비로그인 시: Hot/Recent 카드
          <div className="flex flex-wrap justify-center gap-6">
            {/* Hot Submission */}
            {currentHotSubmission && (
              <MainSubmissionCard
                data={currentHotSubmission}
                icon="🔥"
                title="지금 가장 핫한 코드"
                subtitle="댓글이 가장 많이 달렸어요"
                platform={currentHotPlatform}
                badges={[{ text: "HOT", variant: "orange" }]}
              />
            )}

            {/* Popular Problem */}
            {currentPopularProblem && (
              <MainProblemCard
                data={currentPopularProblem}
                icon="😎"
                title="인기 급상승 문제"
                subtitle="많은 사람들이 도전 중!"
                badges={[{ text: "HOT", variant: "orange" }]}
              />
            )}

            {/* Recent Submission */}
            {currentRecentSubmission && (
              <MainSubmissionCard
                data={currentRecentSubmission}
                icon="🆕"
                title="최근 올라온 코드"
                subtitle="따끈따끈한 새 코드 리뷰"
                platform={currentRecentPlatform}
                badges={[{ text: "NEW", variant: "green" }]}
              />
            )}
          </div>
        )}
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
            {recommendProblemSet?.problemSetList.slice(0, 4).map((item) => (
              <MainProblemSetCard
                key={item.programId}
                programId={item.programId}
                img={img2}
                title={item.title}
                count={item.problemCount}
              />
            ))}
            {!recommendProblemSet && (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-full h-[220px] rounded-xl bg-gray-200 animate-pulse relative overflow-hidden">
                    <div className="absolute bottom-0 w-full p-5 flex flex-col gap-2">
                      <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
                      <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </>
            )}
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
              <EmptyState icon="🦥" title="아직 캠페인은 준비가 되지 않았어요!" />
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
              {groupList && groupList.length > 0 ? (
                groupList.slice(0, 5).map((group, index) => (
                  <a key={index} href={`/group/${group.programId}`} className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-teal-200 transition-all duration-300 group">
                    <span className="text-gray-700 font-medium text-lg group-hover:text-teal-600 transition-colors">{group.title}</span>
                    <div className="flex items-center gap-2 text-gray-400 text-sm bg-gray-50 px-3 py-1 rounded-full group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                      <img src="/icons/groupIcon.svg" className="size-4 opacity-60" />
                      <span>{group.capacity}명</span>
                    </div>
                  </a>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">그룹 정보를 불러오는 중...</div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 회원가입 성공 모달 */}
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
