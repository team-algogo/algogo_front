import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@components/pagination/Pagination";
import { getReceivedReviews, getRequiredReviews } from "../../api/mypage";
import ReceivedReviews from "./ReceivedReviews";
import ReviewRequests from "./ReviewRequests";

const ActivityHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const { data } = useQuery({
    queryKey: ["receivedReviews", currentPage],
    queryFn: () => getReceivedReviews(currentPage - 1, pageSize),
  });

  const { data: requiredData } = useQuery({
    queryKey: ["requiredReviews"],
    queryFn: getRequiredReviews,
  });

  const reviews = data?.receiveCodeReviews || [];
  const totalPages = data?.pageInfo.totalPages || 1;
  const totalElements = data?.pageInfo.totalElements || 0;

  const requiredReviews = requiredData?.requiredCodeReviews || [];

  return (
    <div className="flex w-full flex-col items-start gap-10">
      {/* Review Requests Section */}
      <ReviewRequests
        requests={requiredReviews}
        totalCount={requiredReviews.length}
      />

      <div className="h-px w-full bg-[#F2F2F2]"></div>

      <ReceivedReviews reviews={reviews} totalElements={totalElements} />

      <Pagination
        pageInfo={{ number: currentPage - 1, totalPages }}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ActivityHistory;
