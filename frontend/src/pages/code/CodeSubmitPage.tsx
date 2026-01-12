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

  // Form State
  const [code, setCode] = useState("// 풀이한 코드를 작성해주세요");
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
  const [language, setLanguage] = useState("java");

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

  // Language Comment Style
  useEffect(() => {
    if (language === "python") {
      setCode((prev) => prev.replaceAll("//", "#"));
    } else {
      setCode((prev) => prev.replaceAll("#", "//"));
    }
  }, [language]);

  // Resizing Logic
  const startResizing = useCallback(() => {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none"; // Prevent text selection
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

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#1E1E1E] font-sans text-[#D4D4D4]">
      {/* Top Header */}
      <header className="z-20 flex h-12 shrink-0 items-center justify-between border-b border-[#333333] bg-[#262626] px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 transition-colors hover:text-white"
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
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">
              {problemInfo?.problemNo || "Loading..."}
            </span>
            <span className="mx-1 text-gray-400">|</span>
            <h1 className="max-w-[300px] truncate text-sm font-medium text-white">
              {problemInfo?.title || "Loading Problem..."}
            </h1>
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
          <div className="flex h-12 shrink-0 items-center border-b border-gray-200 bg-[#F9FAFB] px-6">
            <span className="text-sm font-semibold text-gray-700">
              제출 정보 입력
            </span>
          </div>

          <div className="flex flex-1 flex-col overflow-y-auto p-6 text-gray-800">
            {/* Problem Link Card */}
            <div className="mb-6 flex shrink-0 flex-col items-center justify-between gap-4 rounded-lg border border-blue-100 bg-blue-50 p-4 sm:flex-row">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {problemInfo?.title}
                </h2>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">
                    {problemInfo?.platformType || "Platform"}
                  </span>
                </div>
              </div>
              {problemInfo?.problemLink && (
                <a
                  href={problemInfo.problemLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-[35px] items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 text-sm font-medium whitespace-nowrap text-blue-600 shadow-sm transition-colors hover:border-blue-300"
                >
                  문제 확인하기
                  <svg
                    width="12"
                    height="12"
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
            </div>

            {/* Form Inputs */}
            <div className="flex flex-1 flex-col gap-6">
              {/* 1. Status */}
              <div className="flex shrink-0 flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  채점 결과
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsSuccess(true)}
                    className={`flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 text-sm font-medium transition-all ${isSuccess ? "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                  >
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${isSuccess ? "bg-green-600" : "bg-gray-300"}`}
                    ></div>
                    성공
                  </button>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className={`flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 text-sm font-medium transition-all ${!isSuccess ? "border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                  >
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${!isSuccess ? "bg-red-600" : "bg-gray-300"}`}
                    ></div>
                    실패
                  </button>
                </div>
              </div>

              <div className="grid shrink-0 grid-cols-2 gap-4">
                {/* 2. Exec Time */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    실행 시간 (ms)
                  </label>
                  <input
                    type="number"
                    value={execTime}
                    onChange={(e) => setExecTime(e.target.value)}
                    className="h-9 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 transition-all outline-none focus:border-[#0D6EFD] focus:ring-1 focus:ring-[#0D6EFD]"
                    placeholder="0"
                  />
                </div>
                {/* 3. Memory */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    메모리 (KB)
                  </label>
                  <input
                    type="number"
                    value={memory}
                    onChange={(e) => setMemory(e.target.value)}
                    className="h-9 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 transition-all outline-none focus:border-[#0D6EFD] focus:ring-1 focus:ring-[#0D6EFD]"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* 4. Algorithm */}
              <div className="flex shrink-0 flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  알고리즘 분류
                </label>
                <div className="min-h-[36px]">
                  <SearchInput
                    selectedItems={algorithmList}
                    onItemsChange={setAlgorithmList}
                    className="w-full !p-0"
                  />
                </div>
              </div>

              {/* 5. Strategy */}
              <div className="flex min-h-[200px] flex-1 flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  접근 방식 / 메모
                </label>
                <textarea
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value)}
                  placeholder="문제를 해결하기 위해 사용한 전략이나 메모를 남겨주세요."
                  className="w-full flex-1 resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm leading-relaxed placeholder-gray-400 transition-all outline-none focus:border-[#0D6EFD] focus:ring-1 focus:ring-[#0D6EFD]"
                />
              </div>
            </div>
          </div>

          {/* Left Footer: Submit Button */}
          <div className="shrink-0 border-t border-gray-200 bg-white p-6">
            <button
              onClick={handleSubmit}
              disabled={!execTime || !memory || !strategy}
              className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all ${!execTime || !memory || !strategy ? "cursor-not-allowed bg-gray-300 text-gray-500" : "bg-[#0D6EFD] shadow-sm hover:bg-[#0B5ED7] hover:shadow-md active:bg-[#0A56C2]"}`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              제출하기
            </button>
          </div>
        </div>

        {/* Resizer */}
        <div
          className="group z-10 flex w-3 cursor-col-resize items-center justify-center border-r border-l border-[#333333] bg-[#1E1E1E] transition-colors hover:bg-[#007FD4]"
          onMouseDown={startResizing}
        >
          <div className="h-8 w-0.5 rounded-full bg-[#444444] group-hover:bg-white"></div>
        </div>

        {/* Right Pane: Editor */}
        <div
          className="flex flex-col overflow-hidden bg-[#1E1E1E]"
          style={{ width: `${100 - leftWidth}%` }}
        >
          {/* Editor Toolbar */}
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#333333] bg-[#252526] px-6">
            <span className="text-xs font-medium text-[#CCCCCC]">
              코드 에디터
            </span>
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-lg border border-[#3C3C3C] bg-[#3C3C3C] px-3 py-1.5 text-xs text-[#CCCCCC] transition-colors outline-none hover:border-[#555555] focus:border-[#007FD4]"
              >
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
              </select>

              <button
                onClick={() => setCode("")}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-[#CCCCCC] transition-colors hover:bg-[#3C3C3C] hover:text-white"
                title="코드 초기화"
              >
                <svg
                  width="14"
                  height="14"
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
                fontFamily:
                  "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                padding: { top: 16, bottom: 16 },
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
