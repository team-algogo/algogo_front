export interface InviteGroupRoom {
    programId: number;
    title: string;
    description: string;
    createdAt: string;
    modifiedAt: string;
    capacity: number;
    memberCount: number;
    programProblemCount: number;
    isMember: boolean;
    groupRole?: string;
}

export interface Invite {
    inviteId: number;
    inviteStatus: string;
    groupRoom: InviteGroupRoom;
}

export interface Join {
    joinId: number;
    joinStatus: string;
    groupRoom: InviteGroupRoom;
}

export interface InvitesResponseData {
    invites: Invite[];
}

export interface JoinsResponseData {
    joins: Join[];
}
