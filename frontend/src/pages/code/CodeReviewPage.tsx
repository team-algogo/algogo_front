import { useEffect, useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import BasePage from "@pages/BasePage";
import { useParams } from "react-router-dom";
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

  const [problemInfo, setProblemInfo] = useState<ProgramProblemProps | null>(
    null,
  );
  const [submissionDetail, setSubmissionDetail] =
    useState<SubmissionDetailProps | null>(null);
  const [submissionUserDetail, setSubmissionUserDetail] =
    useState<UserDetailProps | null>(null);
  const [currentUser, setCurrentUser] = useState<UserDetailProps | null>(null);

  const [code, setCode] = useState("");
  const [codeHeight, setCodeHeight] = useState(400);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);

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

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
  ) => {
    editorRef.current = editor;

    const model = editor.getModel();
    if (!model) return;

    const contentHeight = editor.getContentHeight();

    const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);

    const padding = 20; // 위아래 여백
    const height = contentHeight + padding + lineHeight;

    setCodeHeight(height);

    editor.onDidChangeCursorPosition((e) => {
      const lineNumber = e.position.lineNumber;
      setSelectedLine(lineNumber);
    });
  };

  const initSelectedLine = () => {
    setSelectedLine(null);
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

  return (
    <BasePage>
      <div className="flex max-w-7xl flex-col gap-6 px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col gap-1">
          <div className="flex">
            <div className="text-grayscale-warm-gray mr-2 flex items-end font-bold">
              {problemInfo?.problemNo}.
            </div>
            <a
              target="_blank"
              href={problemInfo?.problemLink}
              className="font-headline text-primary-main text-3xl font-bold"
            >
              {problemInfo?.title}
            </a>
          </div>
          <div className="text-grayscale-warm-gray flex items-center gap-1 font-light">
            <span>{submissionUserDetail?.nickname}</span>
            <span>님의 코드</span>
          </div>
        </div>

        {/* Top Section: Approach & History */}
        <div className="flex w-full gap-6">
          {/* Left: Approach */}
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-grayscale-dark-gray font-headline text-lg">
                문제 접근 방식
              </label>
              <div className="flex gap-2">
                {submissionDetail?.algorithmList?.map((algo) => (
                  <span
                    key={algo.id}
                    className="text-grayscale-dark-gray rounded-full bg-gray-100 px-3 py-1 text-sm font-medium"
                  >
                    {algo.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-grayscale-default max-h-75 min-h-[200px] flex-1 rounded-lg border border-gray-200 p-4">
              <p className="text-grayscale-dark-gray whitespace-pre-wrap">
                {submissionDetail?.strategy ||
                  "문제를 어떻게 접근했는지 작성해주세요!"}
              </p>
            </div>
          </div>

          {/* Right: History */}
          <div className="shrink-0">
            {!!submissionHistory?.length && (
              <HistoryBox
                history={submissionHistory}
                submissionId={submissionDetail!.submissionId}
              />
            )}
          </div>
        </div>

        {/* Code Editor Section */}
        <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 font-bold text-gray-700">
            Write
          </div>
          <Editor
            height={codeHeight + 10}
            language={submissionDetail?.language || "java"}
            value={code || "// Code Loading..."}
            theme="light"
            onMount={handleEditorDidMount}
            options={{
              fontFamily: "Menlo, Monaco, 'Courier New', monospace",
              fontSize: 14,
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
        <div className="flex flex-col gap-4">
          {/* Existing Comments */}
          <div className="flex flex-col overflow-hidden rounded-lg bg-white">
            {Array.isArray(comments) &&
              comments.map((comment) => (
                <CommentItem
                  key={comment.reviewId}
                  {...comment}
                  onReply={handleReply}
                  currentUserId={currentUser?.userId}
                  onDelete={handleDeleteReview}
                  onUpdate={handleUpdateReview}
                  onLike={handleAddLike}
                  onUnlike={handleDeleteLike}
                />
              ))}
          </div>

          {/* Write Comment */}
          <CommentInput
            initSelectedLine={initSelectedLine}
            onSubmit={handleAddComment}
            selectedLine={selectedLine}
          />
        </div>
      </div>
    </BasePage>
  );
};

export default CodeReviewPage;
