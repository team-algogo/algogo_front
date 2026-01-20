import { useQuery } from "@tanstack/react-query";
import { getRequiredReviews } from "../../api/mypage";
import ReviewRequests from "./ReviewRequests";

const ReviewRequestsContainer = () => {
    const { data: requiredData } = useQuery({
        queryKey: ["requiredReviews"],
        queryFn: getRequiredReviews,
    });

    const requiredReviews = requiredData?.requiredCodeReviews || [];

    return (
        <ReviewRequests
            requests={requiredReviews}
            totalCount={requiredReviews.length}
        />
    );
};

export default ReviewRequestsContainer;
