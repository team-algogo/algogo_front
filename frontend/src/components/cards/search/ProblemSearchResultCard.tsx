import { useNavigate } from "react-router-dom";

interface ProblemSearchResultCardProps {
  programId: number;
  title: string;
  description: string;
  problemCount: number;
  categories: string[];
  searchKeyword?: string;
  matchedProblems?: string[];
}

const ProblemSearchResultCard = ({
  programId,
  title,
  description,
  problemCount,
  categories,
  searchKeyword = "",
  matchedProblems = [],
}: ProblemSearchResultCardProps) => {
  const navigate = useNavigate();

  // Highlight search keyword in text
  const highlightText = (text: string, keyword: string) => {
    if (!keyword) return text;
    const parts = text.split(new RegExp(`(${keyword})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <span key={i} className="bg-primary-100 text-primary-700 font-bold px-0.5 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div
      onClick={() => navigate(`/problemset/${programId}`)}
      className="group relative flex h-auto min-h-[220px] w-full transform flex-col justify-between overflow-hidden rounded-2xl bg-white border-2 border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary-100"
    >
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-50 to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* Header: Title & Description */}
        <div className="mb-4">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-primary-600 line-clamp-1">
              {highlightText(title, searchKeyword)}
            </h3>
            <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-lg shrink-0 ml-2">
              문제집
            </span>
          </div>
          <p className="mt-3 text-sm text-gray-500 line-clamp-2 min-h-[2.5em] leading-relaxed">
            {highlightText(description, searchKeyword)}
          </p>
        </div>

        {/* Content: Matched Problems OR Categories */}
        <div className="flex-1">
          {matchedProblems && matchedProblems.length > 0 ? (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="text-xs font-semibold text-gray-400 mb-2.5 flex items-center gap-1.5 uppercase tracking-wider">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                검색된 문제
              </div>
              <ul className="space-y-2">
                {matchedProblems.slice(0, 3).map((problem, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2.5 line-clamp-1 font-medium">
                    <span className="text-primary-400 mt-[0.4rem] w-1.5 h-1.5 rounded-full bg-current shrink-0"></span>
                    <span className="flex-1 truncate hover:text-gray-900 transition-colors">
                      {highlightText(problem, searchKeyword)}
                    </span>
                  </li>
                ))}
                {matchedProblems.length > 3 && (
                  <li className="text-xs text-gray-400 pl-4 font-medium">
                    + {matchedProblems.length - 3}개 더보기
                  </li>
                )}
              </ul>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {categories && categories.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {categories.slice(0, 5).map((cat, i) => (
                    <span key={i} className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md transition-colors group-hover:bg-primary-50 group-hover:text-primary-600">
                      #{cat}
                    </span>
                  ))}
                  {categories.length > 5 && <span className="text-xs text-gray-400 px-1 pt-1">...</span>}
                </div>
              ) : (
                <div className="text-xs text-gray-400 italic mt-2">
                  태그 없음
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer: Stats */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
            <div className="bg-gray-100 p-1.5 rounded-full group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <span>총 {problemCount}문제</span>
          </div>
          {/* Enter Arrow Icon */}
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 group-hover:bg-primary-600 group-hover:text-white transition-all transform group-hover:-rotate-45 duration-300 shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSearchResultCard;
