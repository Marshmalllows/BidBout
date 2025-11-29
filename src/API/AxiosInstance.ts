import axios, { type AxiosRequestConfig } from "axios";
import { useAuth } from "../Hooks/useAuth.tsx";
import { useMemo } from "react";

const baseURL = import.meta.env.VITE_API_BASE_URL;

interface QueueItem {
  resolve: (value: string | null) => void;
  reject: (reason?: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const useAxios = (withAuth = true) => {
  const { token, login, logout, user } = useAuth();

  return useMemo(() => {
    const axiosInstance = axios.create({
      baseURL,
      withCredentials: true,
      headers: withAuth && token ? { Authorization: `Bearer ${token}` } : {},
    });

    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        if (
          !error.response ||
          error.response.status !== 401 ||
          originalRequest._retry
        ) {
          return Promise.reject(error);
        }

        if (
          originalRequest.url?.includes("/auth/login") ||
          originalRequest.url?.includes("/auth/refresh")
        ) {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise<string | null>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((newToken) => {
              if (originalRequest.headers && newToken) {
                originalRequest.headers["Authorization"] = "Bearer " + newToken;
              }
              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshResponse = await axiosInstance.post(
            "/auth/refresh",
            {},
            { withCredentials: true },
          );

          const newToken = refreshResponse.data.token;
          const userToSet = user || refreshResponse.data.user;

          login(userToSet, newToken);

          if (axiosInstance.defaults.headers.common) {
            axiosInstance.defaults.headers.common["Authorization"] =
              "Bearer " + newToken;
          }

          processQueue(null, newToken);

          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken}`,
          };

          return axiosInstance(originalRequest);
        } catch (err) {
          processQueue(err, null);
          logout();
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      },
    );

    return axiosInstance;
  }, [token, withAuth, login, logout, user]);
};
