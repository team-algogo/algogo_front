import { useEffect, useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import BasePage from "@pages/BasePage";
import { useParams, useNavigate } from "react-router-dom";
import { getProblemInfo, type ProgramProblemProps } from "@api/code/codeSubmit";
import {
  getSubmissionDetail,
  getSubmissionHistory,
  getSubmissionReview,
  postReview,
  type SubmissionDetailProps,
  type SubmissionReviewProps,
} from "@api/code/reviewSubmit";
import HistoryBox from "@components/history/HistoryBox";
import CommentItem from "@components/review/CommentItem";
import CommentInput from "@components/review/CommentInput";
import AlgorithmTagList from "@components/review/AlgorithmTagList";
import ConfirmBanner from "@components/banner/ConfirmBanner";
import {
  getUserDetail,
  getUserDetailById,
  type UserDetailProps,
} from "@api/auth/auth";
import {
  postLikeReview,
  deleteLikeReview,
  deleteReview,
  updateReview,
  deleteSubmission,
} from "@api/code/reviewSubmit";
import { retryAiEvaluation } from "@api/submissions/retryAiEvaluation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@store/useAuthStore";

const CodeReviewPage = () => {
  const param = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { userType } = useAuthStore();

  useEffect(() => {
    if (!userType) {
      navigate("/intro", { state: { requireLogin: true } });
    }
  }, [userType, navigate]);

  const [problemInfo, setProblemInfo] = useState<ProgramProblemProps | null>(
    null,
  );
  const [submissionDetail, setSubmissionDetail] =
    useState<SubmissionDetailProps | null>(null);
  const [submissionUserDetail, setSubmissionUserDetail] =
    useState<UserDetailProps | null>(null);
  const [currentUser, setCurrentUser] = useState<UserDetailProps | null>(null);

  const [code, setCode] = useState("");
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [editorHeight, setEditorHeight] = useState(400);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    reviewId: number | null;
  }>({ isOpen: false, reviewId: null });
  const [deleteSubmissionConfirm, setDeleteSubmissionConfirm] = useState(false);
  const [isRetryingAi, setIsRetryingAi] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 80, left: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(false);

  const [submissionHistory, setSubmissionHistory] = useState<
    SubmissionDetailProps[] | null
  >(null);

  const { data: comments } = useQuery<SubmissionReviewProps[]>({
    queryKey: ["review", submissionDetail?.submissionId],
    queryFn: async () =>
      await getSubmissionReview(submissionDetail!.submissionId),
    enabled: !!submissionDetail?.submissionId,
  });

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const commentInputRef = useRef<HTMLDivElement | null>(null);

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
  ) => {
    editorRef.current = editor;

    // requestAnimationFrame(() => {
    //   updateEditorHeight();
    // });

    editor.onDidChangeCursorPosition(() => {
      // Don't set selectedLine on cursor change, only on mouse click
    });

    // Handle line click to scroll to comment input
    editor.onMouseDown((e) => {
      // 줄 번호 영역, 줄 전체, 또는 코드 텍스트 영역 클릭 시 모두 처리
      const lineNumber = e.target.position?.lineNumber;
      if (lineNumber) {
        // 줄 번호 영역, 코드 텍스트, 빈 공간 등 모든 영역에서 클릭 가능
        shouldScrollRef.current = true;
        setSelectedLine(lineNumber);
      }
    });
  };

  const initSelectedLine = () => {
    shouldScrollRef.current = false;
    setSelectedLine(null);
  };

  const handleCopyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const normalizeLanguage = (lang: string): string => {
    if (!lang) return "";
    const normalized = lang.toLowerCase();
    if (normalized.includes("javascript") || normalized.includes("js"))
      return "JAVASCRIPT";
    if (normalized.includes("typescript") || normalized.includes("ts"))
      return "TYPESCRIPT";
    if (normalized.includes("cpp") || normalized.includes("c++")) return "C++";
    if (normalized.includes("java")) return "JAVA";
    if (normalized.includes("python")) return "PYTHON";
    if (normalized.includes("kotlin")) return "KOTLIN";
    if (normalized.includes("swift")) return "SWIFT";
    if (normalized.includes("go")) return "GO";
    if (normalized.includes("rust")) return "RUST";
    return lang.toUpperCase();
  };

  const handleAddComment = async (content: string) => {
    if (!submissionDetail?.submissionId) return;
    try {
      await postReview(
        submissionDetail.submissionId,
        content,
        null,
        selectedLine,
      );

      await queryClient.invalidateQueries({
        queryKey: ["review", submissionDetail.submissionId],
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleReply = async (parentId: number, content: string) => {
    if (!submissionDetail?.submissionId) return;
    try {
      await postReview(
        submissionDetail.submissionId,
        content,
        parentId,
        selectedLine,
      );

      await queryClient.invalidateQueries({
        queryKey: ["review", submissionDetail.submissionId],
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteReview = (reviewId: number) => {
    if (!submissionDetail?.submissionId) return;
    setDeleteConfirm({ isOpen: true, reviewId });
  };

  const confirmDeleteReview = async () => {
    if (!submissionDetail?.submissionId || !deleteConfirm.reviewId) return;
    try {
      await deleteReview(deleteConfirm.reviewId);
      await queryClient.invalidateQueries({
        queryKey: ["review", submissionDetail.submissionId],
      });
      setDeleteConfirm({ isOpen: false, reviewId: null });
    } catch (err) {
      console.log(err);
      setDeleteConfirm({ isOpen: false, reviewId: null });
    }
  };

  const cancelDeleteReview = () => {
    setDeleteConfirm({ isOpen: false, reviewId: null });
  };

  const handleDeleteSubmission = () => {
    setDeleteSubmissionConfirm(true);
    // 초기 위치를 상단(0)과 중간(50%) 사이의 가운데(25%)로 설정
    const initialTop = window.innerHeight * 0.1; // 화면 높이의 10% 위치
    setModalPosition({ top: initialTop, left: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (modalRef.current) {
      setIsDragging(true);
      const rect = modalRef.current.getBoundingClientRect();
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newTop = e.clientY - dragStart.y;
      const newLeft = e.clientX - dragStart.x;

      // 화면 경계 내에서만 이동 가능
      const maxTop = window.innerHeight - (modalRef.current?.offsetHeight || 0);
      const maxLeft = window.innerWidth - (modalRef.current?.offsetWidth || 0);

      setModalPosition({
        top: Math.max(0, Math.min(newTop, maxTop)),
        left: Math.max(0, Math.min(newLeft, maxLeft)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const confirmDeleteSubmission = async () => {
    if (!submissionDetail?.submissionId) return;
    try {
      await deleteSubmission(submissionDetail.submissionId);
      // 삭제 성공 시 통계 페이지로 리다이렉트
      if (submissionDetail.programProblemId) {
        navigate(`/statistics/${submissionDetail.programProblemId}`);
      } else {
        navigate(-1); // 통계 페이지로 갈 수 없으면 뒤로가기
      }
    } catch (err) {
      console.error("Failed to delete submission:", err);
      setDeleteSubmissionConfirm(false);
    }
  };

  const cancelDeleteSubmission = () => {
    setDeleteSubmissionConfirm(false);
  };

  const handleRetryAiEvaluation = async () => {
    if (!submissionDetail?.submissionId || isRetryingAi) return;
    setIsRetryingAi(true);
    try {
      await retryAiEvaluation(submissionDetail.submissionId);
      // 성공 시 약간의 딜레이 후 페이지 새로고침하여 결과 확인
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error("AI 평가 재시도 실패:", err);
      setIsRetryingAi(false);
    }
  };

  const handleUpdateReview = async (reviewId: number, content: string) => {
    if (!submissionDetail?.submissionId) return;
    try {
      await updateReview(reviewId, content);
      await queryClient.invalidateQueries({
        queryKey: ["review", submissionDetail.submissionId],
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddLike = async (reviewId: number) => {
    if (!submissionDetail?.submissionId) return;
    try {
      const response = await postLikeReview(reviewId);
      if (response?.data?.message === "이미 좋아요가 반영된 상태입니다.") {
        // Already liked, just invalidate queries to sync state
        await queryClient.invalidateQueries({
          queryKey: ["review", submissionDetail!.submissionId],
        });
        return;
      }
      await queryClient.invalidateQueries({
        queryKey: ["review", submissionDetail.submissionId],
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteLike = async (reviewId: number) => {
    if (!submissionDetail?.submissionId) return;
    try {
      await deleteLikeReview(reviewId);
      await queryClient.invalidateQueries({
        queryKey: ["review", submissionDetail.submissionId],
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getSubmission = async (id: string) => {
    try {
      const response = await getSubmissionDetail(id);
      setSubmissionDetail(response);
    } catch (err) {
      console.log(err);
    }
  };

  const getProblem = async (id: string) => {
    try {
      const response = await getProblemInfo(id);
      setProblemInfo(response);
    } catch (err) {
      console.log(err);
    }
  };

  const getSubmissionUser = async (id: number) => {
    try {
      const response = await getUserDetailById(id);
      setSubmissionUserDetail(response);
    } catch (err) {
      console.log(err);
    }
  };

  const getHistory = async (id: string) => {
    try {
      const response = await getSubmissionHistory(id);
      setSubmissionHistory(response.submissions);
    } catch (err) {
      console.log(err);
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await getUserDetail();
      setCurrentUser(response);
    } catch (err) {
      console.log(err);
    }
  };

  const loadTxtFile = async (url: string) => {
    try {
      const response = await fetch(url);
      const text = await response.text();
      setCode(text);
    } catch (err) {
      console.log(err);
    }
  };



  useEffect(() => {
    getCurrentUser();
    if (!param.submissionId) return;
    try {
      getSubmission(param.submissionId);
      getHistory(param.submissionId);
    } catch (err) {
      console.log(err);
    }
  }, [param]);

  useEffect(() => {
    if (!submissionDetail) return;

    try {
      getProblem(submissionDetail.programProblemId.toString());
      getSubmissionUser(submissionDetail.userId);
      loadTxtFile(submissionDetail.code);
    } catch (err) {
      console.log(err);
    }
  }, [submissionDetail]);

  // 코드 줄 수에 따라 에디터 높이 조정
  useEffect(() => {
    if (!code) {
      setEditorHeight(400);
      return;
    }

    const lines = code.split("\n").length;
    const lineHeight = 19; // Monaco Editor 기본 라인 높이 (fontSize 14 기준)
    const padding = 24; // 상하 패딩 (12px * 2)
    const minHeight = 100; // 최소 높이
    const maxHeight = 400; // 최대 높이

    const calculatedHeight = lines * lineHeight + padding;
    const finalHeight = Math.max(
      minHeight,
      Math.min(maxHeight, calculatedHeight),
    );

    setEditorHeight(finalHeight);
  }, [code]);

  // Scroll to comment input when a line is selected by user
  useEffect(() => {
    if (
      selectedLine !== null &&
      commentInputRef.current &&
      shouldScrollRef.current
    ) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        commentInputRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        shouldScrollRef.current = false;
      }, 100);
    }
  }, [selectedLine]);

  // ESC 키로 제출 삭제 확인 취소
  useEffect(() => {
    if (!deleteSubmissionConfirm) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cancelDeleteSubmission();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [deleteSubmissionConfirm]);

  // 난이도 뱃지 렌더링 (GroupProblemCard와 동일 로직)
  const renderDifficultyBadge = () => {
    if (!problemInfo) return null;
    const { difficultyViewType, difficultyType, userDifficultyType } =
      problemInfo;

    if (difficultyViewType === "PROBLEM_DIFFICULTY") {
      // Problem Difficulty (Tier)
      return (
        <span className="inline-flex items-center justify-center rounded-[4px] border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600">
          {difficultyType}
        </span>
      );
    } else {
      // User Difficulty (Generic)
      let style = "text-gray-600 bg-gray-50 border border-gray-200";
      const diff = userDifficultyType?.toLowerCase();
      if (diff === "easy")
        style = "text-green-600 bg-green-50 border border-green-200";
      else if (diff === "medium")
        style = "text-yellow-600 bg-yellow-50 border border-yellow-200";
      else if (diff === "hard")
        style = "text-red-600 bg-red-50 border border-red-200";

      return (
        <span
          className={`inline-flex items-center justify-center rounded-[4px] border px-1.5 py-0.5 text-[11px] font-semibold ${style}`}
        >
          {userDifficultyType}
        </span>
      );
    }
  };

  return (
    <BasePage>
      <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col items-start gap-8 bg-white p-[40px_0px_80px]">
        {/* Header Section - 플랫한 헤더 */}
        <div className="flex w-full flex-row items-end justify-between border-b border-[#d0d7de] pb-6">
          <div className="flex flex-col gap-2">
            <div className="mb-1 flex items-center gap-3">
              <button
                onClick={() => {
                  if (submissionDetail?.programProblemId) {
                    navigate(
                      `/statistics/${submissionDetail.programProblemId}`,
                    );
                  }
                }}
                className="flex items-center gap-1 text-sm text-[#656d76] transition-colors hover:text-[#0969da]"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 12L6 8L10 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                통계로 돌아가기
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline gap-3">
                {problemInfo?.problemLink ? (
                  <a
                    href={problemInfo.problemLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer text-[24px] leading-tight font-semibold text-[#1f2328] transition-colors hover:text-[#0969da]"
                  >
                    {problemInfo.problemNo}. {problemInfo.title}
                  </a>
                ) : (
                  <h1 className="text-[24px] leading-tight font-semibold text-[#1f2328]">
                    {problemInfo?.problemNo}. {problemInfo?.title}
                  </h1>
                )}
                {/* 플랫폼 정보 */}
                {problemInfo?.platformType && (
                  <span className="inline-flex items-center justify-center rounded-[4px] border border-[#d0d7de] bg-[#eff1f3] px-1.5 py-0.5 text-[11px] font-semibold text-[#1f2328]">
                    {problemInfo.platformType}
                  </span>
                )}
                {/* 난이도 정보 */}
                {renderDifficultyBadge()}
              </div>
              <div className="flex items-center gap-2 text-sm text-[#656d76]">
                <span className="font-medium text-[#1f2328]">
                  {submissionUserDetail?.nickname}
                </span>
                <span>님의 코드</span>
              </div>
            </div>
          </div>

          {/* 삭제 버튼 - 내 제출인 경우에만 표시 */}
          {submissionDetail &&
            currentUser &&
            submissionDetail.userId === currentUser.userId && (
              <div className="flex items-center">
                <button
                  onClick={handleDeleteSubmission}
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:border-red-300"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.5 2C5.22386 2 5 2.22386 5 2.5V3H2.5C2.22386 3 2 3.22386 2 3.5C2 3.77614 2.22386 4 2.5 4H3V13.5C3 14.3284 3.67157 15 4.5 15H11.5C12.3284 15 13 14.3284 13 13.5V4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H11V2.5C11 2.22386 10.7761 2 10.5 2H5.5ZM4 4H12V13.5C12 13.7761 11.7761 14 11.5 14H4.5C4.22386 14 4 13.7761 4 13.5V4ZM6 6.5C6 6.22386 6.22386 6 6.5 6C6.77614 6 7 6.22386 7 6.5V11.5C7 11.7761 6.77614 12 6.5 12C6.22386 12 6 11.7761 6 11.5V6.5ZM9.5 6C9.22386 6 9 6.22386 9 6.5V11.5C9 11.7761 9.22386 12 9.5 12C9.77614 12 10 11.7761 10 11.5V6.5C10 6.22386 9.77614 6 9.5 6Z"
                      fill="currentColor"
                    />
                  </svg>
                  제출 삭제
                </button>
              </div>
            )}
        </div>

        {/* Top Section: Approach & History */}
        <div className="flex w-full gap-6">
          {/* Left: Approach - 플랫한 문서 스타일 (박스 제거) */}
          <div className="flex flex-1 flex-col gap-4 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <h2 className="shrink-0 text-lg font-semibold text-[#1f2328]">
                Problem Approach
              </h2>
              {/* 알고리즘 태그 리스트 - 1줄 고정, 넘치면 +N 표시 */}
              {submissionDetail?.algorithmList &&
                submissionDetail.algorithmList.length > 0 && (
                  <div className="min-w-0 flex-1">
                    <AlgorithmTagList
                      algorithms={submissionDetail.algorithmList}
                    />
                  </div>
                )}
            </div>
            {/* 전략 영역: 히스토리와 동일한 높이(380px), 내용이 길면 스크롤 */}
            <div className="flex h-[335px] flex-col border-t border-b border-[#d0d7de]">
              <div className="flex-1 overflow-y-auto overflow-x-auto px-0 py-4">
                <div className="text-sm leading-6 whitespace-pre-wrap text-[#1f2328]">
                  {submissionDetail?.strategy ? (
                    submissionDetail.strategy
                  ) : (
                    <span className="text-[#656d76] italic">
                      문제를 어떻게 접근했는지 작성해주세요!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: History */}
          <div className="flex shrink-0">
            {!!submissionHistory?.length &&
              submissionUserDetail?.userId === submissionHistory[0].userId && (
                <HistoryBox
                  history={submissionHistory}
                  submissionId={submissionDetail!.submissionId}
                />
              )}
          </div>
        </div>

        {/* Code Editor Section - GitHub 코드 블록 스타일 (radius 최소, shadow 제거) */}
        <div className="w-full overflow-hidden rounded border border-[#d0d7de] bg-white">
          {/* 얇은 헤더 바 */}
          <div className="border-b border-[#d0d7de] bg-[#f6f8fa] px-4 py-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[#656d76]">
                  제출 정보
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Language Badge */}
                {submissionDetail?.language && (
                  <span className="inline-flex items-center rounded-md border border-[#d0d7de] bg-white px-2.5 py-1 font-mono text-xs font-semibold text-[#0969da]">
                    {normalizeLanguage(submissionDetail.language)}
                  </span>
                )}
                {/* Success/Failure Badge */}
                {submissionDetail && (
                  <span
                    className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${submissionDetail.isSuccess
                      ? "border-[#1a7f37]/30 bg-[#dafbe1] text-[#1a7f37]"
                      : "border-[#cf222e]/30 bg-[#ffebe9] text-[#cf222e]"
                      }`}
                  >
                    {submissionDetail.isSuccess ? "Success" : "Failed"}
                  </span>
                )}
                {/* Copy Button */}
                <button
                  onClick={handleCopyCode}
                  className="inline-flex h-7 w-7 items-center justify-center rounded border border-[#d0d7de] bg-white text-[#656d76] transition-colors hover:bg-[#f6f8fa]"
                  title="코드 복사"
                >
                  {isCopied ? (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M13.3333 4L6 11.3333L2.66667 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M5.33333 2.66667H11.3333C11.7015 2.66667 12 2.96514 12 3.33333V12.6667C12 13.0349 11.7015 13.3333 11.3333 13.3333H5.33333C4.96514 13.3333 4.66667 13.0349 4.66667 12.6667V3.33333C4.66667 2.96514 4.96514 2.66667 5.33333 2.66667Z"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.6667 2.66667V1.33333C10.6667 0.965143 10.3682 0.666667 10 0.666667H2.66667C2.29848 0.666667 2 0.965143 2 1.33333V10C2 10.3682 2.29848 10.6667 2.66667 10.6667H4"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <Editor
            height={editorHeight}
            language={submissionDetail?.language.toLowerCase() || "java"}
            value={code || "// Code Loading..."}
            theme="light"
            onMount={handleEditorDidMount}
            options={{
              automaticLayout: true,
              fontFamily: "Menlo, Monaco, 'Courier New', monospace",
              fontSize: 16,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              readOnly: true,
              lineNumbers: "on",
              padding: { top: 12, bottom: 12 },
            }}
          />
        </div>

        {/* AI Evaluation Section - 플랫한 섹션 (박스 제거) */}
        {submissionDetail?.aiScoreReason && (
          <div className="w-full border-t border-[#d0d7de] pt-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0969da]">
                <span className="text-xs font-semibold text-white">AI</span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#1f2328]">
                  AI 코드 평가
                </h3>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs text-[#656d76]">종합 점수</span>
                  <span className="text-base font-semibold text-[#0969da]">
                    {submissionDetail.aiScore}점
                  </span>
                </div>
              </div>
            </div>
            <div className="text-sm leading-6 whitespace-pre-line text-[#1f2328]">
              {submissionDetail.aiScoreReason}
            </div>
          </div>
        )}

        {/* AI 측정 중 또는 에러 상태 - 재평가 버튼 표시 */}
        {submissionDetail &&
          !submissionDetail.aiScoreReason &&
          currentUser &&
          submissionDetail.userId === currentUser.userId && (
            <div className="w-full border-t border-[#d0d7de] pt-8">
              <div className="flex items-center justify-between rounded-lg border border-[#d0d7de] bg-[#f6f8fa] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-400">
                    <span className="text-xs font-semibold text-white">AI</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#656d76]">
                      AI 평가를 생성하지 못했습니다
                    </h3>
                    <p className="text-xs text-[#656d76]">재평가를 시도해보세요</p>
                  </div>
                </div>
                <button
                  onClick={handleRetryAiEvaluation}
                  disabled={isRetryingAi}
                  className="flex items-center gap-1.5 rounded-lg border border-[#0969da] bg-white px-3 py-1.5 text-sm font-medium text-[#0969da] transition-colors hover:bg-[#0969da]/5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={isRetryingAi ? "animate-spin" : ""}
                  >
                    <path
                      d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8 2L8 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8 2L11 2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  {isRetryingAi ? "재평가 중..." : "재평가"}
                </button>
              </div>
            </div>
          )}

        {/* Review Conversation Section - 플랫한 타임라인 (박스 제거) */}
        <div className="w-full border-t border-[#d0d7de] pt-8">
          <h3 className="mb-4 text-base font-semibold text-[#1f2328]">
            Review Conversation
          </h3>
          <div className="flex flex-col gap-0">
            {/* Existing Comments - 플랫한 타임라인 */}
            {Array.isArray(comments) &&
              comments.map((comment, index) => (
                <div key={comment.reviewId} className={index > 0 ? "pt-6" : ""}>
                  <CommentItem
                    {...comment}
                    onReply={handleReply}
                    currentUserId={currentUser?.userId}
                    onDelete={handleDeleteReview}
                    onUpdate={handleUpdateReview}
                    onLike={handleAddLike}
                    onUnlike={handleDeleteLike}
                    hasNextSibling={index < comments.length - 1}
                  />
                </div>
              ))}

            {/* Write Comment - 컴팩트한 GitHub PR 스타일 */}
            <div ref={commentInputRef} className="mt-4">
              <CommentInput
                initSelectedLine={initSelectedLine}
                onSubmit={handleAddComment}
                selectedLine={selectedLine}
              />
            </div>
          </div>
        </div>

        {/* Delete Review Confirm Banner */}
        <ConfirmBanner
          isOpen={deleteConfirm.isOpen}
          message="정말 삭제하시겠습니까?"
          onConfirm={confirmDeleteReview}
          onCancel={cancelDeleteReview}
          confirmLabel="삭제"
          cancelLabel="취소"
        />

        {/* Delete Submission Confirm Banner */}
        {deleteSubmissionConfirm && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center p-4">
            <div
              ref={modalRef}
              className="w-full max-w-md animate-slideDown"
              style={{
                position: "absolute",
                top: `${modalPosition.top}px`,
                left: modalPosition.left === 0 ? "50%" : `${modalPosition.left}px`,
                transform: modalPosition.left === 0 ? "translateX(-50%)" : "none",
                cursor: isDragging ? "grabbing" : "default",
              }}
            >
              <div className="rounded-lg border border-[#d0d7de] bg-white shadow-lg">
                {/* Header - 드래그 가능 영역 */}
                <div
                  onMouseDown={handleMouseDown}
                  className="flex items-center justify-between border-b border-[#d0d7de] bg-[#f6f8fa] px-4 py-2 cursor-grab active:cursor-grabbing select-none"
                >
                  <span className="text-sm font-semibold text-[#1f2328]">
                    삭제 확인
                  </span>
                  <button
                    onClick={cancelDeleteSubmission}
                    className="inline-flex h-7 w-7 items-center justify-center rounded text-[#656d76] transition-colors hover:bg-[#e6e9ed] hover:text-[#1f2328]"
                    title="닫기"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
                    </svg>
                  </button>
                </div>

                {/* Body with Buttons */}
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="flex-1">
                    <p className="text-sm leading-6 text-[#1f2328]">
                      정말 이 제출을 삭제하시겠습니까?
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#656d76]">
                      삭제된 제출은 복구할 수 없습니다.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={cancelDeleteSubmission}
                      className="inline-flex h-8 items-center justify-center rounded-md border border-[#d0d7de] bg-white px-4 text-sm font-medium text-[#1f2328] transition-colors hover:bg-[#f6f8fa]"
                    >
                      취소
                    </button>
                    <button
                      onClick={confirmDeleteSubmission}
                      className="inline-flex h-8 items-center justify-center rounded-md bg-[#cf222e] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#a40e26]"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </BasePage>
  );
};

export default CodeReviewPage;
