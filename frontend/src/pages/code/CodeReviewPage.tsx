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
import AiReviewCard from "@components/review/AiReviewCard";
import CommentItem from "@components/review/CommentItem";
import CommentInput from "@components/review/CommentInput";
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

const CodeReviewPage = () => {
  const param = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
      if (e.target.type === monaco.editor.MouseTargetType.CONTENT_TEXT) {
        const lineNumber = e.target.position?.lineNumber;
        if (lineNumber) {
          shouldScrollRef.current = true;
          setSelectedLine(lineNumber);
        }
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

  const handleDeleteReview = async (reviewId: number) => {
    if (!submissionDetail?.submissionId) return;
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteReview(reviewId);
      await queryClient.invalidateQueries({
        queryKey: ["review", submissionDetail.submissionId],
      });
    } catch (err) {
      console.log(err);
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
        {/* Header Section - 통계 페이지와 동일한 레이아웃 */}
        <div className="flex w-full flex-row items-end justify-between border-b border-gray-200 pb-6">
          <div className="flex flex-col gap-2">
            <div className="mb-1 flex items-center gap-3 text-gray-500">
              <button
                onClick={() => {
                  if (submissionDetail?.programProblemId) {
                    navigate(
                      `/statistics/${submissionDetail.programProblemId}`,
                    );
                  }
                }}
                className="flex items-center gap-1 text-sm transition-colors hover:text-[#333333]"
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
              <h1 className="flex items-center gap-3 text-[28px] font-bold text-[#333333]">
                {problemInfo?.problemNo}. {problemInfo?.title}
              </h1>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-gray-700">
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
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                문제 접근 방식
              </h2>
              <div className="flex flex-wrap gap-2">
                {submissionDetail?.algorithmList?.map((algo) => (
                  <span
                    key={algo.id}
                    className="inline-flex items-center rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100/50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md"
                  >
                    {algo.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex h-[380px] flex-1 flex-col overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-lg">
              <div className="flex-1 overflow-y-auto p-6">
                <p className="text-sm leading-7 whitespace-pre-wrap text-gray-700">
                  {submissionDetail?.strategy || (
                    <span className="text-gray-400 italic">
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

        {/* Code Editor Section */}
        <div className="w-full overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-lg">
          <div className="border-b border-gray-200/60 bg-gradient-to-r from-gray-50 to-gray-50/50 px-5 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-700"
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
                <span className="text-sm font-bold text-gray-800">
                  제출 코드
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Success/Failure Badge */}
                {submissionDetail && (
                  <span
                    className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                      submissionDetail.isSuccess
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {submissionDetail.isSuccess ? "성공" : "실패"}
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
                        className={`inline-flex items-center rounded-md border ${style.border} ${style.bg} px-2.5 py-1 text-xs font-semibold ${style.text}`}
                      >
                        {lang}
                      </span>
                    );
                  })()}
                {/* Copy Button */}
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white p-1.5 text-gray-500 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                  title="코드 복사"
                >
                  {isCopied ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
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
            height={300}
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

        {/* Comment Section */}
        <div className="flex w-full flex-col gap-6">
          {/* Existing Comments */}
          <div className="flex w-full flex-col overflow-hidden rounded-xl border border-gray-200/80 bg-white p-6 shadow-lg">
            <div className="flex flex-col gap-4">
              {Array.isArray(comments) &&
                comments.map((comment, index) => (
                  <CommentItem
                    key={comment.reviewId}
                    {...comment}
                    onReply={handleReply}
                    currentUserId={currentUser?.userId}
                    onDelete={handleDeleteReview}
                    onUpdate={handleUpdateReview}
                    onLike={handleAddLike}
                    onUnlike={handleDeleteLike}
                    hasNextSibling={index < comments.length - 1}
                  />
                ))}
            </div>
          </div>

          {/* Write Comment */}
          <div ref={commentInputRef}>
            <CommentInput
              initSelectedLine={initSelectedLine}
              onSubmit={handleAddComment}
              selectedLine={selectedLine}
            />
          </div>
        </div>
      </div>
    </BasePage>
  );
};

export default CodeReviewPage;
