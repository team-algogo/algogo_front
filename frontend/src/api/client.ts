import useAuthStore from "@store/useAuthStore";
import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.PROD
    ? import.meta.env.VITE_API_BASE_URL
    : import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// 요청 인터셉터
client.interceptors.request.use((config) => {
  const authorization = useAuthStore.getState().authorization;
  if (authorization) {
    config.headers.Authorization = "Bearer " + authorization;
  }
  return config;
});

// 응답 인터셉터
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // refreshToken까지 만료되었거나 인증 불가 → userType / AT 초기화
    if (status === 401 || status === 403) {
      useAuthStore.getState().setUserType(null);
      useAuthStore.getState().setAuthorization("");
    }

    return Promise.reject(error);
  }
);

export default client;
