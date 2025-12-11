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
