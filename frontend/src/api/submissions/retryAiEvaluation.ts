import client from "../client";

export const retryAiEvaluation = async (submissionId: number) => {
    const response = await client.post(
        `/api/v1/submissions/${submissionId}/ai-evaluation/retry`
    );
    return response.data;
};
