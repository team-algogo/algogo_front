import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "@components/button/Button";
import Toast, { type ToastType } from "@components/toast/Toast";
import DateTimePicker from "@components/common/DateTimePicker";
import { postGroupProblems } from "../../api/group/groupApi";
import { searchProblems, type ProblemSearchResult } from "../../api/problem/problemApi";
import type { ProblemItem } from "../../type/group/group";

interface AddGroupProblemModalProps {
    programId: number;
    onClose: () => void;
}

interface SelectedProblemConfig {
    startDate: string;
    endDate: string;
    userDifficultyType: "EASY" | "MEDIUM" | "HARD";
    difficultyViewType: "USER_DIFFICULTY" | "PROBLEM_DIFFICULTY";
}

const AddGroupProblemModal = ({ programId, onClose }: AddGroupProblemModalProps) => {
    // --- 상태 관리 ---

    // 1. 검색 관련
    const [keyword, setKeyword] = useState("");
    const [searchResults, setSearchResults] = useState<ProblemSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // 2. 선택된 문제 및 설정 관리
    // Map<problemId, Config> 형태는 아니고, selectedProblems 리스트와 config 맵을 따로 두거나 합칩니다.
    // 여기서는 선택된 원본 문제 리스트와, 설정값을 담는 Map을 사용합니다.
    const [selectedProblems, setSelectedProblems] = useState<ProblemSearchResult[]>([]);
    const [problemConfigs, setProblemConfigs] = useState<Record<number, SelectedProblemConfig>>({});

    // 3. UI/Toast
    const [toastConfig, setToastConfig] = useState<{ message: string; type: ToastType } | null>(null);
    const queryClient = useQueryClient();

    // --- API Mutation ---
    const mutation = useMutation({
        mutationFn: (data: { problems: ProblemItem[] }) => postGroupProblems(programId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groupProblems", programId] });
            // setToastConfig({ message: "선택한 문제들이 추가되었습니다!", type: "success" });
            setTimeout(() => onClose(), 50);
        },
        onError: (error: any) => {
            const errorMsg = error.response?.data?.message || "문제 추가에 실패했습니다.";
            setToastConfig({ message: errorMsg, type: "error" });
        },
    });

    // --- 핸들러 ---

    // 검색 핸들러
    const handleSearch = async () => {
        if (!keyword.trim()) {
            setToastConfig({ message: "검색어를 입력해주세요.", type: "error" });
            return;
        }
        setIsSearching(true);
        try {
            const response = await searchProblems(keyword);
            // response.data 가 { problems: [...] } 형태임
            setSearchResults(response.data?.problems || []);
        } catch (error) {
            console.error(error);
            setToastConfig({ message: "문제 검색 중 오류가 발생했습니다.", type: "error" });
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch();
    };

    // 문제 선택 토글
    const toggleSelectProblem = (problem: ProblemSearchResult) => {
        if (selectedProblems.find((p) => p.id === problem.id)) {
            // 이미 선택됨 -> 제거
            setSelectedProblems((prev) => prev.filter((p) => p.id !== problem.id));
            setProblemConfigs((prev) => {
                const next = { ...prev };
                delete next[problem.id];
                return next;
            });
        } else {
            // 선택 -> 추가 및 기본 설정 초기화
            setSelectedProblems((prev) => [...prev, problem]);
            setProblemConfigs((prev) => ({
                ...prev,
                [problem.id]: {
                    startDate: "",
                    endDate: "",
                    userDifficultyType: "MEDIUM",
                    difficultyViewType: "PROBLEM_DIFFICULTY", // Default change requested
                },
            }));
        }
    };

    // 설정 변경 핸들러
    const updateConfig = (problemId: number, field: keyof SelectedProblemConfig, value: string) => {
        setProblemConfigs((prev) => ({
            ...prev,
            [problemId]: {
                ...prev[problemId],
                [field]: value,
            },
        }));
    };

    // 최종 제출
    const handleSubmit = () => {
        if (selectedProblems.length === 0) {
            setToastConfig({ message: "추가할 문제를 선택해주세요.", type: "error" });
            return;
        }

        const itemsPayload: ProblemItem[] = [];

        // 유효성 검사 및 페이로드 구성
        for (const problem of selectedProblems) {
            const config = problemConfigs[problem.id];
            if (!config.startDate || !config.endDate) {
                setToastConfig({ message: `"${problem.title}"의 기간을 설정해주세요.`, type: "error" });
                return;
            }
            const start = new Date(config.startDate);
            const end = new Date(config.endDate);
            const now = new Date();

            if (start > end) {
                setToastConfig({ message: `"${problem.title}"의 종료일이 시작일보다 빠릅니다.`, type: "error" });
                return;
            }

            // 종료일은 미래만 가능 (현재보다 뒤여야 함)
            if (end <= now) {
                setToastConfig({ message: `"${problem.title}"의 종료일은 현재 시간 이후여야 합니다.`, type: "error" });
                return;
            }

            itemsPayload.push({
                problemId: problem.id,
                // Send local time string (YYYY-MM-DDTHH:mm:ss) to match KST digits exactly
                // This prevents the server from shifting time by 9 hours (UTC->KST)
                startDate: formatToLocalISOString(new Date(config.startDate)),
                endDate: formatToLocalISOString(new Date(config.endDate)),
                userDifficultyType: config.userDifficultyType,
                difficultyViewType: config.difficultyViewType,
            });
        }

        mutation.mutate({ problems: itemsPayload });
    };

    // Helper to format Date to "YYYY-MM-DDTHH:mm:ss" (Local Time)
    const formatToLocalISOString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };


    return (
        <>
            {toastConfig && (
                <Toast
                    message={toastConfig.message}
                    type={toastConfig.type}
                    onClose={() => setToastConfig(null)}
                />
            )}

            {/* 모달 배경 */}
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                {/* 모달 컨텐츠 (크기 고정: w-[1200px], h-[850px]) */}
                <div className="bg-white w-[1200px] h-[850px] rounded-2xl flex flex-col shadow-2xl overflow-hidden relative">

                    {/* 헤더 */}
                    <div className="p-4 border-b border-grayscale-warm-gray flex justify-between items-center bg-gray-50">
                        <div>
                            <h2 className="font-headline text-2xl text-grayscale-dark-gray">문제 추가</h2>
                            <p className="text-grayscale-warm-gray text-sm mt-1">
                                키워드로 문제를 검색하고, 원하는 문제를 선택하여 기간과 난이도를 설정하세요.
                            </p>
                        </div>
                        <button onClick={onClose} className="text-grayscale-warm-gray hover:text-grayscale-dark-gray">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* 바디: 2단 레이아웃 (검색 결과 VS 선택된 문제 설정) */}
                    <div className="flex flex-1 overflow-hidden">

                        {/* 좌측: 검색 영역 (40%) */}
                        <div className="w-[40%] flex flex-col border-r border-grayscale-warm-gray bg-white">
                            <div className="p-4 border-b border-grayscale-warm-gray">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="문제 제목 검색"
                                        className="flex-1 bg-grayscale-default rounded-lg px-3 py-2 text-sm outline-none border border-transparent focus:border-primary-main"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <Button variant="default" onClick={handleSearch} disabled={isSearching} className="px-3 py-2 text-sm">
                                        {isSearching ? "..." : "검색"}
                                    </Button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-2">
                                {searchResults.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-grayscale-warm-gray text-sm">
                                        <p>검색 결과가 없습니다.</p>
                                    </div>
                                ) : (
                                    <ul className="flex flex-col gap-1">
                                        {searchResults.map((problem) => {
                                            const isSelected = selectedProblems.some(p => p.id === problem.id);
                                            return (
                                                <li
                                                    key={problem.id}
                                                    className={`
                                                        flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border
                                                        ${isSelected ? 'bg-primary-light border-primary-main' : 'hover:bg-gray-50 border-transparent'}
                                                    `}
                                                    onClick={() => toggleSelectProblem(problem)}
                                                >
                                                    <div className={`
                                                        w-5 h-5 rounded border flex items-center justify-center flex-shrink-0
                                                        ${isSelected ? 'bg-primary-main border-primary-main' : 'bg-white border-gray-300'}
                                                    `}>
                                                        {isSelected && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className={`text-sm truncate font-medium ${isSelected ? 'text-primary-dark' : 'text-gray-800'}`}>
                                                            {problem.title}
                                                        </span>
                                                        <div className="flex items-center gap-2 text-xs text-grayscale-warm-gray">
                                                            <span>{problem.platformType}</span>
                                                            <span>•</span>
                                                            <span>{problem.difficultyType}</span>
                                                            <span>•</span>
                                                            <span>{problem.problemNo}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* 우측: 설정 영역 (60%) */}
                        <div className="w-[60%] flex flex-col bg-gray-50/50">
                            <div className="p-4 border-b border-grayscale-warm-gray bg-white sticky top-0 z-10">
                                <h3 className="font-bold text-grayscale-dark-gray flex items-center gap-2">
                                    <span className="bg-primary-main text-white text-xs px-2 py-0.5 rounded-full">{selectedProblems.length}</span>
                                    선택된 문제 설정
                                </h3>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {selectedProblems.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-grayscale-warm-gray text-sm">
                                        <p>좌측에서 추가할 문제를 선택해주세요.</p>
                                    </div>
                                ) : (
                                    selectedProblems.map((problem, index) => (
                                        <div
                                            key={problem.id}
                                            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm animate-fadeIn"
                                            style={{ zIndex: selectedProblems.length - index, position: 'relative' }}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{problem.platformType}</span>
                                                        <span className="text-[10px] text-gray-400">#{problem.problemNo}</span>
                                                    </div>
                                                    <h4 className="font-bold text-gray-800 text-sm">{problem.title}</h4>
                                                </div>
                                                <button
                                                    onClick={() => toggleSelectProblem(problem)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 mb-3">
                                                <div className="flex flex-col gap-1">
                                                    <DateTimePicker
                                                        label="시작일"
                                                        value={problemConfigs[problem.id]?.startDate || ""}
                                                        onChange={(val) => updateConfig(problem.id, "startDate", val)}
                                                        placeholder="시작 날짜 선택"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <DateTimePicker
                                                        label="종료일"
                                                        value={problemConfigs[problem.id]?.endDate || ""}
                                                        onChange={(val) => updateConfig(problem.id, "endDate", val)}
                                                        minDate={new Date()} // End Date must be in future (relative to absolute now, but practically user might pick today later time)
                                                        placeholder="종료 날짜 선택"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-xs font-bold text-gray-500">표시 난이도</label>
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => {
                                                                const dropdown = document.getElementById(`difficulty-view-dropdown-${problem.id}`);
                                                                if (dropdown) {
                                                                    dropdown.classList.toggle('hidden');
                                                                }
                                                            }}
                                                            className="w-full appearance-none bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:border-primary-main focus:ring-2 focus:ring-primary-100 transition-all cursor-pointer hover:border-gray-300 hover:shadow-sm flex items-center justify-between gap-2"
                                                        >
                                                            <span>{problemConfigs[problem.id]?.difficultyViewType === "USER_DIFFICULTY" ? "커스텀 난이도" : "문제 난이도"}</span>
                                                            <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </button>
                                                        <div
                                                            id={`difficulty-view-dropdown-${problem.id}`}
                                                            className="hidden absolute top-full mt-1 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <button
                                                                onClick={() => {
                                                                    updateConfig(problem.id, "difficultyViewType", "PROBLEM_DIFFICULTY");
                                                                    document.getElementById(`difficulty-view-dropdown-${problem.id}`)?.classList.add('hidden');
                                                                }}
                                                                className={`w-full px-3 py-2.5 text-left text-xs font-bold transition-colors flex items-center gap-2 ${
                                                                    problemConfigs[problem.id]?.difficultyViewType === "PROBLEM_DIFFICULTY"
                                                                        ? "bg-gray-100 text-gray-900"
                                                                        : "text-gray-700 hover:bg-gray-50"
                                                                }`}
                                                            >
                                                                <span>문제 난이도</span>
                                                                {problemConfigs[problem.id]?.difficultyViewType === "PROBLEM_DIFFICULTY" && (
                                                                    <svg className="w-4 h-4 ml-auto text-primary-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    updateConfig(problem.id, "difficultyViewType", "USER_DIFFICULTY");
                                                                    document.getElementById(`difficulty-view-dropdown-${problem.id}`)?.classList.add('hidden');
                                                                }}
                                                                className={`w-full px-3 py-2.5 text-left text-xs font-bold transition-colors flex items-center gap-2 ${
                                                                    problemConfigs[problem.id]?.difficultyViewType === "USER_DIFFICULTY"
                                                                        ? "bg-gray-100 text-gray-900"
                                                                        : "text-gray-700 hover:bg-gray-50"
                                                                }`}
                                                            >
                                                                <span>커스텀 난이도</span>
                                                                {problemConfigs[problem.id]?.difficultyViewType === "USER_DIFFICULTY" && (
                                                                    <svg className="w-4 h-4 ml-auto text-primary-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-xs font-bold text-gray-500">커스텀 난이도</label>
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => {
                                                                if (problemConfigs[problem.id]?.difficultyViewType !== "PROBLEM_DIFFICULTY") {
                                                                    const dropdown = document.getElementById(`user-difficulty-dropdown-${problem.id}`);
                                                                    if (dropdown) {
                                                                        dropdown.classList.toggle('hidden');
                                                                    }
                                                                }
                                                            }}
                                                            disabled={problemConfigs[problem.id]?.difficultyViewType === "PROBLEM_DIFFICULTY"}
                                                            className={`w-full appearance-none bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg px-3 py-2 outline-none transition-all flex items-center justify-between gap-2 ${
                                                                problemConfigs[problem.id]?.difficultyViewType === "PROBLEM_DIFFICULTY"
                                                                    ? "opacity-50 cursor-not-allowed"
                                                                    : "focus:border-primary-main focus:ring-2 focus:ring-primary-100 cursor-pointer hover:border-gray-300 hover:shadow-sm"
                                                            }`}
                                                        >
                                                            <span>{problemConfigs[problem.id]?.userDifficultyType}</span>
                                                            <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </button>
                                                        <div
                                                            id={`user-difficulty-dropdown-${problem.id}`}
                                                            className="hidden absolute top-full mt-1 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {["EASY", "MEDIUM", "HARD"].map((difficulty) => (
                                                                <button
                                                                    key={difficulty}
                                                                    onClick={() => {
                                                                        updateConfig(problem.id, "userDifficultyType", difficulty as "EASY" | "MEDIUM" | "HARD");
                                                                        document.getElementById(`user-difficulty-dropdown-${problem.id}`)?.classList.add('hidden');
                                                                    }}
                                                                    className={`w-full px-3 py-2.5 text-left text-xs font-bold transition-colors flex items-center gap-2 ${
                                                                        problemConfigs[problem.id]?.userDifficultyType === difficulty
                                                                            ? "bg-gray-100 text-gray-900"
                                                                            : "text-gray-700 hover:bg-gray-50"
                                                                    }`}
                                                                >
                                                                    <span>{difficulty}</span>
                                                                    {problemConfigs[problem.id]?.userDifficultyType === difficulty && (
                                                                        <svg className="w-4 h-4 ml-auto text-primary-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    )}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 푸터 */}
                    <div className="p-4 border-t border-grayscale-warm-gray bg-white flex justify-end gap-3">
                        <Button variant="default" onClick={onClose} className="px-6">취소</Button>
                        <Button variant="primary" onClick={handleSubmit} disabled={mutation.isPending || selectedProblems.length === 0} className="px-8">
                            {mutation.isPending ? "추가 중..." : `${selectedProblems.length}개 문제 추가하기`}
                        </Button>
                    </div>

                </div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
        </>
    );
};

export default AddGroupProblemModal;
