import axios, { type AxiosRequestConfig } from "axios";
import { useAuth } from "../Hooks/UseAuth.tsx";

const baseURL = "http://localhost:5148/api";

export const useAxios = () => {
  const { token, login, logout, user } = useAuth();

  const instance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (!error.response) {
        return Promise.reject(error);
      }

      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (!user) {
          logout();
          window.location.href = "/login";
          return Promise.reject(new Error("User is not authenticated"));
        }

        try {
          const refreshResponse = await instance.post("/auth/refresh", {
            accessToken: token,
          });

          const newToken = refreshResponse.data.token;
          login(user, newToken);

          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken}`,
          };

          return instance(originalRequest);
        } catch (err) {
          logout();
          window.location.href = "/login";
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
};
