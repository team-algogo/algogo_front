import { useQuery } from "@tanstack/react-query";
import { getProblemSetList } from "@api/problemset/getProblemSetList";
import ProblemSetCard from "./ProblemSetCard";
import Pagination from "@components/pagination/Pagination";

interface ProblemSetListProps {
  category: string;
  sortBy: string;
  sortDirection: string;
  keyword: string;
  page: number; // Page prop still passed from parent state
  onPageChange: (page: number) => void;
  isAdmin?: boolean; // ADMIN 여부
  onEdit?: (programId: number) => void; // 수정 핸들러
  onDelete?: (programId: number) => void; // 삭제 핸들러
}

export default function ProblemSetList({
  category,
  sortBy,
  sortDirection,
  keyword,
  page,
  onPageChange,
  isAdmin = false,
  onEdit,
  onDelete,
}: ProblemSetListProps) {
  const itemsPerPage = 10;
  const { data, isLoading } = useQuery({
    queryKey: ["problemSets", category, sortBy, sortDirection, keyword, page],
    queryFn: () =>
      getProblemSetList(
        category,
        sortBy,
        sortDirection,
        keyword,
        page,
        itemsPerPage,
      ),
    placeholderData: (previousData) => previousData,
  });

  const listData = data?.problemSetList || [];
  const pageInfo = data?.page;

  const pageCount = pageInfo?.totalPages || 1;

  if (isLoading && !data) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        <div className="border-primary-main h-10 w-10 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  const safePage = Math.min(Math.max(1, page), pageCount);

  return (
    <div className="flex w-full flex-col gap-12">
      {/* List Container - Grid Layout */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {listData.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-400">
            등록된 문제집이 없습니다.
          </div>
        ) : (
          listData.map((problemSet) => (
            <ProblemSetCard
              key={problemSet.programId}
              {...problemSet}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {listData.length > 0 && pageInfo && (
        <div className="flex justify-center">
          <Pagination
            pageInfo={pageInfo}
            currentPage={safePage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
