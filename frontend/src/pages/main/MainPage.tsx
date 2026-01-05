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
    <>
      <Banner />
      <BasePage>
        {/* 로그인 전: 지금 이런 코드들이 리뷰되고 있어요! */}
        {!isLoggedIn && (
          <div className="flex flex-col gap-6 py-8">
            <div className="font-title px-6 text-xl">
              지금 이런 코드들이 리뷰되고 있어요!
            </div>
            <div className="flex justify-center gap-6">
              {/* Hot Submission */}
              {/* Hot Submission */}
              {currentHotSubmission && (
                <MainSubmissionCard
                  data={currentHotSubmission}
                  icon="🔥"
                  title="지금 가장 많은 코멘트가 달린 코드"
                  subtitle="코드 몇 줄로 메모리 단축!"
                  platform={currentHotPlatform}
                  badges={[{ text: "HOT", variant: "orange" }]}
                />
              )}

              {/* Popular Problem (Join In) */}
              {currentPopularProblem && (
                <MainProblemCard
                  data={currentPopularProblem}
                  icon="😎"
                  title="지금 뜨고 있는 문제"
                  subtitle="너도 나도 도전 중!"
                  badges={[{ text: "HOT", variant: "orange" }]}
                />
              )}

              {/* Recent Submission */}
              {currentRecentSubmission && (
                <MainSubmissionCard
                  data={currentRecentSubmission}
                  icon="🆕"
                  title="최근 올라온 코드"
                  subtitle="따끈따끈한 새 코드!"
                  platform={currentRecentPlatform}
                  badges={[{ text: "NEW", variant: "green" }]}
                />
              )}
            </div>
          </div>
        )}

        {/* 로그인 후: 탭 + 리뷰 요청 + 내 코드 리뷰 */}
        {isLoggedIn && (
          <>
            {/* 탭 */}
            <div className="border-grayscale-default flex gap-6 border-b px-6 py-4">
              {(["All", "Groups", "Campaigns"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-sm font-medium transition-colors ${activeTab === tab
                    ? "text-primary-main border-primary-main border-b-2"
                    : "text-grayscale-warm-gray hover:text-grayscale-dark"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* 리뷰 요청 + 내 코드 리뷰 */}
            <div className="flex gap-6 px-6 py-6">
              {/* 리뷰 요청이 왔어요! */}
              <div className="flex flex-1 flex-col">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📢</span>
                    <span className="font-headline text-lg">
                      리뷰요청이 왔어요!
                    </span>
                    <span className="bg-primary-main rounded-full px-2 py-0.5 text-xs text-white">
                      {reviewRequire
                        ? reviewRequire.requiredCodeReviews.length
                        : 0}
                    </span>
                  </div>
                  <TextLink src="#" className="font-body text-base">
                    전체보기 →
                  </TextLink>
                </div>
                <div className="min-h-[300px] flex-1 rounded-lg">
                  {reviewRequire ? (
                    <div className="divide-grayscale-default flex flex-col divide-y">
                      {reviewRequire.requiredCodeReviews.map(
                        (review, index) => (
                          <ReviewRequestCard key={index} {...review} />
                        ),
                      )}
                    </div>
                  ) : (
                    <EmptyState
                      icon="📭"
                      title="아직 도착한 리뷰 요청이 없어요"
                      description="다른 사람의 코드를 리뷰하고 실력을 키워보세요!"
                    />
                  )}
                </div>
              </div>

              {/* 내 코드에 달린 리뷰 */}
              <div className="flex flex-1 flex-col">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👀</span>
                    <span className="font-title text-lg">
                      내 코드에 달린 리뷰를 확인해보세요!
                    </span>
                    <span className="bg-primary-main rounded-full px-2 py-0.5 text-xs text-white">
                      {reviewReceive ? reviewReceive.pageInfo.totalElements : 0}
                    </span>
                  </div>
                  <TextLink src="#" className="font-body text-base">
                    전체보기 →
                  </TextLink>
                </div>
                <div className="min-h-[300px] flex-1 rounded-lg">
                  {reviewReceive ? (
                    <div className="divide-grayscale-default flex flex-col divide-y">
                      {reviewReceive.receiveCodeReviews.map((review, index) => (
                        <ReviewCard key={index} {...review} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon="🏃"
                      title="아직 코드에 달린 리뷰가 없어요"
                      description="지금 핫한 리뷰들을 먼저 구경해 볼까요?"
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* 추천 문제집 */}
        <div className="flex flex-col gap-4 py-6">
          <div className="flex items-center justify-between px-6">
            <div className="font-title text-xl">추천 문제집</div>
            <TextLink src="/problemset" className="font-body text-base">
              전체보기 →
            </TextLink>
          </div>
          <div className="flex gap-4 overflow-x-auto px-6 pb-2">
            {recommendProblemSet?.problemSetList.map((item) => (
              <MainProblemSetCard
                programId={item.programId}
                img={img2}
                title={item.title}
                count={item.problemCount}
              />
            ))}
          </div>
        </div>

        {/* 캠페인 & 그룹현황 */}
        <div className="flex gap-8 px-6 py-6">
          {/* 캠페인 */}
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="font-title text-xl">캠페인</div>
              <TextLink src="#">전체보기 →</TextLink>
            </div>
            <EmptyState icon="🦥" title="아직 캠페인은 준비가 되지 않았어요!" />
          </div>

          {/* 그룹현황 */}
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="font-title text-xl">그룹현황</div>
              <TextLink src="/group">전체보기 →</TextLink>
            </div>
            <div className="flex flex-col">
              {!!groupList?.length &&
                groupList.map((group, index) => (
                  <a
                    key={index}
                    href="#"
                    className="border-grayscale-light hover:bg-grayscale-lighter flex items-center justify-between border-b py-3 transition-colors"
                  >
                    <div className="text-sm">{group.title}</div>
                    <div className="text-grayscale-warm-gray flex items-center gap-2 text-sm">
                      <img src="/icons/groupIcon.svg" className="h-4 w-4" />
                      <span>{group.capacity}</span>
                    </div>
                  </a>
                ))}
            </div>
          </div>
        </div>

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
    </>
  );
};

export default MainPage;
