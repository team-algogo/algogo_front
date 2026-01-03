import client from "@api/client";
import getResponse from "@api/getResponse";

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
  const response = await getResponse("/api/v1/auths/me");
  return response;
};

// 회원가입
export const postSignUp = async (
  email: string,
  password: string,
  nickname: string
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
