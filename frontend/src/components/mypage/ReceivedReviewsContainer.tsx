import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@components/pagination/Pagination";
import { getReceivedReviews } from "../../api/mypage";
import ReceivedReviews from "./ReceivedReviews";

const ReceivedReviewsContainer = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const { data } = useQuery({
        queryKey: ["receivedReviews", currentPage],
        queryFn: () => getReceivedReviews(currentPage - 1, pageSize),
    });

    const reviews = data?.receiveCodeReviews || [];
    const totalPages = data?.pageInfo.totalPages || 1;
    const totalElements = data?.pageInfo.totalElements || 0;

    return (
        <div className="flex w-full flex-col gap-4">
            <ReceivedReviews reviews={reviews} totalElements={totalElements} />

            <Pagination
                pageInfo={{ number: currentPage - 1, totalPages }}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default ReceivedReviewsContainer;
