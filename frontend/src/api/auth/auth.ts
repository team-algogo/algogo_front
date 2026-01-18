import client from "@api/client";
import getResponse from "@api/getResponse";

export interface UserDetailProps {
  userId: number;
  email: string;
  description: string;
  nickname: string;
  profileImage?: string | null;
  createdAt: string;
  modifiedAt: string;
}

export interface MeResponse {
  userId: number;
  email: string;
  description: string;
  nickname: string;
  profileImage?: string | null;
  createAt: string;
  modifiedAt: string;
  userRole: "USER" | "ADMIN";
}

// 로그인
export const postLogin = async (email: string, password: string) => {
  const response = await client.post("/api/v1/auths/login", {
    email: email,
    password: password,
  });

  return response;
};

// 로그아웃
export const postLogout = async () => {
  const response = await client.post("/api/v1/auths/logout");
  return response;
};

// 유저 확인
export const getCheckUser = async () => {
  const response = await getResponse<MeResponse>("/api/v1/auths/me");
  return response;
};

// 회원가입
export const postSignUp = async (
  email: string,
  password: string,
  nickname: string,
) => {
  const response = await client.post("/api/v1/users/signup", {
    email: email,
    password: password,
    nickname: nickname,
  });

  return response;
};

// 이메일 중복 확인
export const postCheckEmail = async (email: string) => {
  const response = await client.post("/api/v1/users/check/emails", {
    email: email,
  });

  return response.data;
};

// 닉네임 중복 확인
export const postCheckNickname = async (nickname: string) => {
  const response = await client.post("/api/v1/users/check/nicknames", {
    nickname: nickname,
  });

  return response.data;
};

// 이메일 인증 요청
export const postEmailVerificationRequest = async (email: string) => {
  const response = await client.post("/api/v1/users/emails/verification/request", {
    email: email,
  });
  return response.data;
};

// 이메일 인증 확인
export const postEmailVerification = async (email: string, code: string) => {
  const response = await client.post("/api/v1/users/emails/verification", {
    email: email,
    code: code,
  });
  return response.data;
};

export const getUserDetail = async () => {
  const response = await getResponse<UserDetailProps>("/api/v1/users/profiles");
  return response.data;
};

export const getUserDetailById = async (userId: number) => {
  const response = await getResponse<UserDetailProps>(
    `/api/v1/users/profiles/${userId}`,
  );
  return response.data;
};
