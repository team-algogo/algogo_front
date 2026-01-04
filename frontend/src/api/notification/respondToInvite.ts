
import client from "@api/client";

interface RespondToInviteParams {
    programId: number;
    inviteId: number;
    isAccepted: "ACCEPTED" | "DENIED";
}

export const respondToInvite = async ({ programId, inviteId, isAccepted }: RespondToInviteParams) => {
    const response = await client.put(`/api/v1/groups/${programId}/invite/${inviteId}`, {
        isAccepted,
    });
    return response.data;
};
