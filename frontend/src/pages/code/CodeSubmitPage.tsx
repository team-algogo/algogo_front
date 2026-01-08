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
  const [algorithmList, setAlgorithmList] = useState<{ id: number; name: string }[]>([]);
  const [problemInfo, setProblemInfo] = useState<ProgramProblemProps | null>(null);
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

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing.current) {
        const newWidth =
          (mouseMoveEvent.clientX / window.innerWidth) * 100;
        if (newWidth > 20 && newWidth < 80) {
          setLeftWidth(newWidth);
        }
      }
    },
    []
  );

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
    <div className="flex flex-col h-screen w-full bg-[#1E1E1E] text-[#D4D4D4] overflow-hidden font-sans">
      {/* Top Header */}
      <header className="h-12 bg-[#262626] border-b border-[#333333] flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm font-medium">
              {problemInfo?.problemNo || "Loading..."}
            </span>
            <span className="text-gray-400 mx-1">|</span>
            <h1 className="text-white font-medium text-sm truncate max-w-[300px]">
              {problemInfo?.title || "Loading Problem..."}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Split Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Pane: Submission Form & Problem Info */}
        <div
          className="bg-white flex flex-col overflow-hidden"
          style={{ width: `${leftWidth}%` }}
        >
          {/* Left Pane Header */}
          <div className="h-10 border-b border-gray-200 bg-gray-50 flex items-center px-4 shrink-0">
            <span className="text-gray-700 font-semibold text-sm flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              제출 정보 입력
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 text-gray-800 flex flex-col">
            {/* Problem Link Card */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{problemInfo?.title}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <span className="font-medium">{problemInfo?.platformType || "Platform"}</span>
                  {/* Difficulty or other tags can go here */}
                </div>
              </div>
              {problemInfo?.problemLink && (
                <a
                  href={problemInfo.problemLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white border border-blue-200 hover:border-blue-300 text-blue-600 font-medium rounded-md text-sm transition-colors shadow-sm whitespace-nowrap flex items-center gap-2"
                >
                  문제 확인하기
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              )}
            </div>

            {/* Form Inputs */}
            <div className="flex flex-col gap-6 flex-1">

              {/* 1. Status */}
              <div className="flex flex-col gap-2 shrink-0">
                <label className="text-sm font-semibold text-gray-700">채점 결과</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsSuccess(true)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-all ${isSuccess ? "bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500 font-bold" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${isSuccess ? "bg-green-600" : "bg-gray-300"}`}></div>
                    Pass (성공)
                  </button>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-all ${!isSuccess ? "bg-red-50 border-red-500 text-red-700 ring-1 ring-red-500 font-bold" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${!isSuccess ? "bg-red-600" : "bg-gray-300"}`}></div>
                    Fail (실패)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 shrink-0">
                {/* 2. Exec Time */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">실행 시간 (ms)</label>
                  <input
                    type="number"
                    value={execTime}
                    onChange={(e) => setExecTime(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder-gray-400"
                    placeholder="0"
                  />
                </div>
                {/* 3. Memory */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">메모리 (KB)</label>
                  <input
                    type="number"
                    value={memory}
                    onChange={(e) => setMemory(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder-gray-400"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* 4. Algorithm */}
              <div className="flex flex-col gap-2 shrink-0">
                <label className="text-sm font-semibold text-gray-700">알고리즘 분류</label>
                <SearchInput
                  selectedItems={algorithmList}
                  onItemsChange={setAlgorithmList}
                  className="w-full !p-0"
                />
              </div>

              {/* 5. Strategy */}
              <div className="flex flex-col gap-2 flex-1 min-h-[200px]">
                <label className="text-sm font-semibold text-gray-700">접근 방식 / 메모</label>
                <textarea
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value)}
                  placeholder="문제를 해결하기 위해 사용한 전략이나 메모를 남겨주세요."
                  className="w-full flex-1 p-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder-gray-400 resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Left Footer: Submit Button */}
          <div className="p-4 border-t border-gray-200 bg-white shrink-0">
            <button
              onClick={handleSubmit}
              disabled={!execTime || !memory || !strategy}
              className={`w-full py-3 rounded-lg text-base font-bold text-white transition-all shadow-md flex items-center justify-center gap-2
                   ${(!execTime || !memory || !strategy) ? "bg-gray-300 cursor-not-allowed text-gray-500" : "bg-[#007FD4] hover:bg-[#006BB3] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-0.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              제출하기
            </button>
          </div>
        </div>

        {/* Resizer */}
        <div
          className="w-3 bg-[#1E1E1E] hover:bg-[#007FD4] cursor-col-resize flex items-center justify-center z-10 transition-colors group border-l border-[#333333] border-r border-[#333333]"
          onMouseDown={startResizing}
        >
          <div className="w-0.5 h-8 bg-[#444444] group-hover:bg-white rounded-full"></div>
        </div>

        {/* Right Pane: Editor */}
        <div
          className="flex flex-col bg-[#1E1E1E] overflow-hidden"
          style={{ width: `${100 - leftWidth}%` }}
        >
          {/* Editor Toolbar */}
          <div className="h-10 bg-[#252526] border-b border-[#333333] flex items-center justify-between px-4 shrink-0">
            <span className="text-[#CCCCCC] text-xs font-medium flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
              Code Editor
            </span>
            <div className="flex items-center gap-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-[#3C3C3C] text-[#CCCCCC] text-xs px-2 py-1 rounded border border-[#3C3C3C] outline-none hover:border-[#555555] focus:border-[#007FD4]"
              >
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
              </select>

              <button
                onClick={() => setCode("")}
                className="text-white text-xs hover:text-white flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                초기화
              </button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 overflow-hidden relative">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(val) => setCode(val || "")}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
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
