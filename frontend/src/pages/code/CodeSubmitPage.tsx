import { useEffect, useState, useRef, useCallback } from "react";
import SearchInput from "@components/form/input/SearchInput";
import { Editor } from "@monaco-editor/react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProblemInfo,
  postCodeSubmit,
  type ProgramProblemProps,
} from "@api/code/codeSubmit";

const CodeSubmitPage = () => {
  const param = useParams();
  const navigate = useNavigate();

  // Layout State
  const [leftWidth, setLeftWidth] = useState(40); // Percentage
  const isResizing = useRef(false);

  // Templates
  const BOILERPLATE = {
    java: `public class Main {
    public static void main(String[] args) {
        // Your code here
    }
}`,
    python: `import sys

# Your code here`,
    cpp: `#include <iostream>
using namespace std;

int main() {
    // Your code here
    return 0;
}`,
  };

  const [language, setLanguage] = useState<"java" | "python" | "cpp">("java");
  const [code, setCode] = useState(BOILERPLATE["java"]);

  // Form State
  const [algorithmList, setAlgorithmList] = useState<
    { id: number; name: string }[]
  >([]);
  const [problemInfo, setProblemInfo] = useState<ProgramProblemProps | null>(
    null,
  );
  const [isSuccess, setIsSuccess] = useState(true);
  const [execTime, setExecTime] = useState("");
  const [memory, setMemory] = useState("");
  const [strategy, setStrategy] = useState("");

  // Fetch Problem Info
  useEffect(() => {
    if (!param.programProblemId) return;
    const getProblem = async (id: string) => {
      try {
        const response = await getProblemInfo(id);
        setProblemInfo(response);
      } catch (err) {
        console.log(err);
      }
    };
    getProblem(param.programProblemId);
  }, [param]);

  // Language Change -> Reset Code
  useEffect(() => {
    setCode(BOILERPLATE[language]);
  }, [language]);

  // Resizing Logic
  const startResizing = useCallback(() => {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = "default";
    document.body.style.userSelect = "auto";
  }, []);

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing.current) {
      const newWidth = (mouseMoveEvent.clientX / window.innerWidth) * 100;
      if (newWidth > 20 && newWidth < 80) {
        setLeftWidth(newWidth);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  // Clear time/memory when switching to failed status
  useEffect(() => {
    if (!isSuccess) {
      setExecTime("");
      setMemory("");
    }
  }, [isSuccess]);

  const handleSubmit = async () => {
    if (!problemInfo) return;
    try {
      const response = await postCodeSubmit(
        Number(param.programProblemId),
        language,
        code,
        strategy,
        Number(execTime),
        Number(memory),
        isSuccess,
        algorithmList.map((value) => value.id),
      );

      if (response.status === 200) {
        navigate(`/statistics/${param.programProblemId}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const isFormValid = isSuccess
    ? !!execTime && !!memory && !!strategy && code.trim().length > 0
    : !!strategy && code.trim().length > 0;

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden bg-[#1E1E1E] font-sans text-gray-200">
      {/* Top Header */}
      <header className="z-20 flex h-12 shrink-0 items-center justify-between border-b border-[#333333] bg-[#262626] px-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-gray-400 transition-colors hover:text-white"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span className="text-sm">뒤로가기</span>
          </button>

          <div className="h-4 w-[1px] bg-gray-600"></div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-400">
              {problemInfo?.problemNo}
            </span>
            <h1 className="max-w-[200px] truncate text-sm font-bold text-white sm:max-w-[400px]">
              {problemInfo?.title || "Loading Problem..."}
            </h1>
            {problemInfo?.problemLink && (
              <a
                href={problemInfo.problemLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded bg-[#333] px-2 py-1 text-xs text-blue-400 hover:bg-[#444] hover:text-blue-300"
                title="문제 보러가기"
              >
                <span>Link</span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            )}
            
            {/* Difficulty Badge */}
            {problemInfo && (() => {
               const { difficultyViewType, difficultyType, userDifficultyType } = problemInfo;
                if (difficultyViewType === "PROBLEM_DIFFICULTY") {
                  return (
                    <span className="inline-flex items-center justify-center rounded-[4px] bg-[#333] border border-[#444] px-1.5 py-0.5 text-[11px] font-semibold text-gray-300">
                      {difficultyType}
                    </span>
                  );
                } else {
                  let style = "text-gray-400 bg-[#333] border border-[#444]";
                  const diff = userDifficultyType?.toLowerCase();
                  // Dark mode styles
                  if (diff === "easy") style = "text-green-400 bg-green-900/30 border border-green-800";
                  else if (diff === "medium") style = "text-yellow-400 bg-yellow-900/30 border border-yellow-800";
                  else if (diff === "hard") style = "text-red-400 bg-red-900/30 border border-red-800";
                  return (
                    <span className={`inline-flex items-center justify-center rounded-[4px] px-1.5 py-0.5 text-[11px] font-semibold ${style}`}>
                      {userDifficultyType}
                    </span>
                  );
                }
            })()}
          </div>
        </div>
      </header>

      {/* Main Split Content */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Left Pane: Submission Form & Problem Info */}
        <div
          className="flex flex-col overflow-hidden bg-white"
          style={{ width: `${leftWidth}%` }}
        >
          {/* Left Pane Header */}
          <div className="flex h-10 shrink-0 items-center border-b border-gray-100 bg-white px-4">
            <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-50 text-primary-main text-xs">1</span>
              제출 정보 입력
            </span>
          </div>

          <div className="animate-fade-in-up flex flex-1 flex-col overflow-y-auto px-4 py-4 scrollbar-hide">

            {/* Form Inputs Container */}
            <div className="flex flex-col gap-3 h-full">

              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  제출 정보
                </h2>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {problemInfo?.platformType || "Platform"}
                </span>
              </div>

              {/* Row 1: Status & Algorithm */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Status */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-600">채점 결과</label>
                  <div className="flex rounded-lg bg-gray-100 p-1">
                    <button
                      onClick={() => setIsSuccess(true)}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-1 text-xs font-bold transition-all ${isSuccess ? "bg-white text-green-600 shadow-sm border border-gray-100" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${isSuccess ? "bg-green-500" : "bg-gray-300"}`} />
                      성공
                    </button>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-1 text-xs font-bold transition-all ${!isSuccess ? "bg-white text-red-500 shadow-sm border border-gray-100" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${!isSuccess ? "bg-red-500" : "bg-gray-300"}`} />
                      실패
                    </button>
                  </div>
                </div>

                {/* Algorithm */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-600">알고리즘</label>
                  <div className="min-h-[32px]">
                    <SearchInput
                      selectedItems={algorithmList}
                      onItemsChange={setAlgorithmList}
                      className="w-full !p-0 !text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-600">시간 (ms)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={execTime}
                      onChange={(e) => setExecTime(e.target.value)}
                      disabled={!isSuccess}
                      className={`w-full h-8 rounded-lg border px-3 text-sm font-medium placeholder-gray-500 outline-none transition-all ${
                        !isSuccess
                          ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "border-gray-200 bg-gray-50 text-gray-800 focus:border-primary-main focus:bg-white focus:ring-2 focus:ring-primary-100"
                      }`}
                      placeholder="0"
                    />
                    <span className={`absolute right-3 top-2 text-xs font-medium ${
                      !isSuccess ? "text-gray-300" : "text-gray-400"
                    }`}>ms</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-600">메모리 (KB)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={memory}
                      onChange={(e) => setMemory(e.target.value)}
                      disabled={!isSuccess}
                      className={`w-full h-8 rounded-lg border px-3 text-sm font-medium placeholder-gray-400 outline-none transition-all ${
                        !isSuccess
                          ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "border-gray-200 bg-gray-50 text-gray-800 focus:border-primary-main focus:bg-white focus:ring-2 focus:ring-primary-100"
                      }`}
                      placeholder="0"
                    />
                    <span className={`absolute right-3 top-2 text-xs font-medium ${
                      !isSuccess ? "text-gray-300" : "text-gray-400"
                    }`}>KB</span>
                  </div>
                </div>
              </div>

              {/* Row 3: Strategy */}
              <div className="flex flex-col flex-1 min-h-[0] gap-1">
                <label className="text-xs font-bold text-gray-600">접근 방식 / 메모</label>
                <textarea
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value)}
                  placeholder="풀이 전략을 간단히 기록해보세요..."
                  className="w-full h-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-800 placeholder-gray-500 focus:border-primary-main focus:bg-white focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                />
              </div>

            </div>
          </div>

          {/* Left Footer: Submit Button */}
          <div className="shrink-0 border-t border-gray-100 bg-white px-4 py-3">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold shadow-sm transition-all duration-300
                ${isFormValid
                  ? "bg-primary-main text-white hover:bg-primary-600 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
            >
              {isFormValid ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  제출하기
                </>
              ) : (
                "모든 정보를 입력해주세요"
              )}
            </button>
          </div>
        </div>

        {/* Resizer */}
        <div
          className="group z-10 flex w-1 cursor-col-resize items-center justify-center bg-[#2b2b2b] hover:bg-primary-main transition-colors"
          onMouseDown={startResizing}
        />

        {/* Right Pane: Editor */}
        <div
          className="flex flex-col overflow-hidden bg-[#1E1E1E]"
          style={{ width: `${100 - leftWidth}%` }}
        >
          {/* Editor Toolbar */}
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#333333] bg-[#252526] px-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#3c3c3c] text-[#cccccc] text-xs font-bold">2</span>
              <span className="text-xs font-semibold text-[#CCCCCC]">
                코드 작성
              </span>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="h-7 rounded-md border border-[#3C3C3C] bg-[#333333] px-2 text-xs font-medium text-[#E0E0E0] outline-none transition-colors hover:border-[#555555] focus:border-primary-main"
              >
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
              </select>

              <button
                onClick={() => setCode(BOILERPLATE[language])}
                className="h-7 flex items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-[#AAAAAA] transition-colors hover:bg-[#3C3C3C] hover:text-white"
                title="초기화"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                초기화
              </button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="relative flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(val) => setCode(val || "")}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                roundedSelection: true,
                padding: { top: 20, bottom: 20 },
                cursorBlinking: "smooth",
                smoothScrolling: true,
                renderLineHighlight: "all",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeSubmitPage;
