
import client from "@api/client";

interface RespondToJoinRequestParams {
    programId: number;
    joinId: number;
    isAccepted: "ACCEPTED" | "DENIED";
}

export const respondToJoinRequest = async ({ programId, joinId, isAccepted }: RespondToJoinRequestParams) => {
    const response = await client.put(`/api/v1/groups/${programId}/join/${joinId}`, {
        isAccepted,
    });
    return response.data;
};
