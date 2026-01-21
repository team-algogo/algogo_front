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
import AiReviewCard from "@components/review/AiReviewCard";
import ConfirmModal from "@components/modal/ConfirmModal";
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
} from "@api/code/reviewSubmit";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@store/useAuthStore";

const CodeReviewPage = () => {
  const param = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { userType, authorization } = useAuthStore();

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

  const getLanguageBadgeStyle = (lang: string) => {
    const normalized = normalizeLanguage(lang);
    const styles: Record<string, { bg: string; text: string; border: string }> =
    {
      JAVA: {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
      },
      PYTHON: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
      },
      "C++": {
        bg: "bg-slate-50",
        text: "text-slate-700",
        border: "border-slate-200",
      },
      JAVASCRIPT: {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        border: "border-yellow-200",
      },
      TYPESCRIPT: {
        bg: "bg-indigo-50",
        text: "text-indigo-700",
        border: "border-indigo-200",
      },
      KOTLIN: {
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200",
      },
      SWIFT: {
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-200",
      },
      GO: {
        bg: "bg-cyan-50",
        text: "text-cyan-700",
        border: "border-cyan-200",
      },
      RUST: {
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-200",
      },
    };
    return (
      styles[normalized] || {
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
      }
    );
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

  // 비로그인 유저 체크 및 리다이렉트 (로그인한 사용자는 제외)
  useEffect(() => {
    // 로그인한 사용자는 리다이렉트하지 않음
    if (userType === "User" && authorization) {
      return;
    }

    // 비로그인 사용자만 리다이렉트
    if (!authorization && !userType) {
      navigate("/login", {
        state: {
          requireLogin: true,
          redirectTo: `/review/${param.submissionId}`,
        },
        replace: true,
      });
    }
  }, [authorization, userType, navigate, param.submissionId]);

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

  return (
    <BasePage>
      <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col items-start gap-8 bg-white p-[40px_0px_80px]">
        {/* Header Section - 세련된 헤더 */}
        <div className="flex w-full flex-row items-end justify-between pb-6">
          <div className="flex flex-col gap-3">
            <div className="mb-1 flex items-center gap-3">
              <button
                onClick={() => {
                  if (submissionDetail?.programProblemId) {
                    navigate(
                      `/statistics/${submissionDetail.programProblemId}`,
                    );
                  }
                }}
                className="group flex items-center gap-1.5 text-sm text-gray-600 transition-all duration-200 hover:gap-2 hover:text-blue-600"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-transform duration-200 group-hover:-translate-x-0.5"
                >
                  <path
                    d="M10 12L6 8L10 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-medium">통계로 돌아가기</span>
              </button>
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-baseline gap-3">
                {problemInfo?.problemLink ? (
                  <a
                    href={problemInfo.problemLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-[28px] font-bold text-gray-900 transition-all duration-200 hover:text-blue-600"
                  >
                    <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text group-hover:from-blue-600 group-hover:via-blue-500 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-200">
                      {problemInfo?.problemNo}. {problemInfo?.title}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    >
                      <path
                        d="M6 4L10 8L6 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                ) : (
                  <h1 className="text-[28px] font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    {problemInfo?.problemNo}. {problemInfo?.title}
                  </h1>
                )}
                {problemInfo?.platformType && (
                  <span className="inline-flex items-center rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 px-2.5 py-1 text-xs font-bold text-blue-700 shadow-sm backdrop-blur-sm">
                    {problemInfo.platformType}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-xs font-bold text-white shadow-sm">
                  {submissionUserDetail?.nickname?.charAt(0) || "U"}
                </div>
                <span className="font-semibold text-gray-800">
                  {submissionUserDetail?.nickname}
                </span>
                <span className="text-gray-500">님의 코드</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Section: Approach & History */}
        <div className="flex w-full gap-6">
          {/* Left: Approach */}
          <div className="flex flex-1 flex-col gap-4 min-w-0">
            <div className="flex w-full flex-row items-end justify-between border-b border-gradient-to-r from-gray-100 via-gray-200 to-gray-100 pb-6 shadow-sm">
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                문제 접근 방식
              </h2>
              {submissionDetail?.algorithmList && submissionDetail.algorithmList.length > 0 && (
                <div className="min-w-0 flex-1">
                  <AlgorithmTagList
                    algorithms={submissionDetail.algorithmList}
                  />
                </div>
              )}
            </div>
            <div className="flex h-[380px] flex-1 flex-col overflow-hidden">
              <div className="flex-1 overflow-auto pt-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <p className="text-sm leading-7 whitespace-pre-wrap text-gray-700">
                  {submissionDetail?.strategy ? (
                    submissionDetail.strategy
                  ) : (
                    <span className="flex items-center gap-2 text-gray-400 italic">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="opacity-50"
                      >
                        <path
                          d="M8 2.5C5.5 2.5 3.5 4.5 3.5 7C3.5 9.5 5.5 11.5 8 11.5C10.5 11.5 12.5 9.5 12.5 7C12.5 4.5 10.5 2.5 8 2.5Z"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                        <path
                          d="M8 5V7M8 9H8.01"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                        />
                      </svg>
                      문제를 어떻게 접근했는지 작성해주세요!
                    </span>
                  )}
                </p>
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

        {/* Code Editor Section - 세련된 카드 스타일 */}
        <div className="w-full overflow-hidden rounded-xl border border-gray-200/60 bg-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
          <div className="border-b border-gray-200/60 bg-gradient-to-r from-gray-50 via-white to-gray-50/50 px-5 py-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    className="text-white"
                  >
                    <path
                      d="M4.5 2.25H13.5C13.9142 2.25 14.25 2.58579 14.25 3V15C14.25 15.4142 13.9142 15.75 13.5 15.75H4.5C4.08579 15.75 3.75 15.4142 3.75 15V3C3.75 2.58579 4.08579 2.25 4.5 2.25Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.75 5.25H11.25M6.75 7.5H11.25M6.75 9.75H9.75"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-sm font-bold text-gray-800">
                  제출 코드
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                {/* Success/Failure Badge */}
                {submissionDetail && (
                  <span
                    className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-bold shadow-sm transition-all duration-200 ${
                      submissionDetail.isSuccess
                        ? "bg-gradient-to-br from-emerald-50 to-emerald-100/80 text-emerald-700 border border-emerald-200/50"
                        : "bg-gradient-to-br from-red-50 to-red-100/80 text-red-700 border border-red-200/50"
                    }`}
                  >
                    {submissionDetail.isSuccess ? "✓ 성공" : "✗ 실패"}
                  </span>
                )}
                {/* Language Badge */}
                {submissionDetail?.language &&
                  (() => {
                    const lang = normalizeLanguage(submissionDetail.language);
                    const style = getLanguageBadgeStyle(
                      submissionDetail.language,
                    );
                    return (
                      <span
                        className={`inline-flex items-center rounded-lg border ${style.border} ${style.bg} px-3 py-1.5 text-xs font-bold ${style.text} shadow-sm`}
                      >
                        {lang}
                      </span>
                    );
                  })()}
                {/* Copy Button */}
                <button
                  onClick={handleCopyCode}
                  className={`group inline-flex items-center justify-center rounded-lg border p-2 transition-all duration-200 ${
                    isCopied
                      ? "border-emerald-300 bg-emerald-50 text-emerald-600"
                      : "border-gray-200 bg-white text-gray-500 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                  title="코드 복사"
                >
                  {isCopied ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="transition-transform duration-200"
                    >
                      <path
                        d="M13.3333 4L6 11.3333L2.66667 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="transition-transform duration-200 group-hover:scale-110"
                    >
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
              padding: { top: 16 },
            }}
          />
        </div>

        {/* AI Evaluation Section */}
        {submissionDetail?.aiScoreReason && (
          <AiReviewCard
            score={submissionDetail.aiScore}
            reason={submissionDetail.aiScoreReason || ""}
          />
        )}

        {/* Review Conversation Section - 세련된 섹션 */}
        <div className="w-full border-t border-gray-200/60 pt-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-md">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="text-white"
              >
                <path
                  d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM10 16C6.69 16 4 13.31 4 10C4 6.69 6.69 4 10 4C13.31 4 16 6.69 16 10C16 13.31 13.31 16 10 16Z"
                  fill="currentColor"
                />
                <path
                  d="M10 6V10M10 12H10.01"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Review Conversation
            </h3>
          </div>

          <div className="flex flex-col gap-0">
            {/* Existing Comments */}
            {Array.isArray(comments) &&
              comments.map((comment, index) => (
                <div
                  key={comment.reviewId}
                  className={index > 0 ? "pt-6 border-t border-gray-100" : ""}
                >
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

            {/* Write Comment */}
            <div ref={commentInputRef} className="mt-6">
              <CommentInput
                initSelectedLine={initSelectedLine}
                onSubmit={handleAddComment}
                selectedLine={selectedLine}
              />
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="리뷰 삭제"
        message="정말 이 리뷰를 삭제하시겠습니까?"
        onConfirm={confirmDeleteReview}
        onCancel={cancelDeleteReview}
        confirmLabel="삭제"
        cancelLabel="취소"
      />
    </BasePage>
  );
};

export default CodeReviewPage;
