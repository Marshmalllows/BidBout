import axios, { type AxiosRequestConfig } from "axios";
import { useAuth } from "../Hooks/useAuth.tsx";
import { useMemo } from "react";

const baseURL = import.meta.env.VITE_API_BASE_URL;

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
        if (!error.response) return Promise.reject(error);

        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        if (
          error.response.status === 401 &&
          !originalRequest._retry &&
          originalRequest.url !== "/auth/refresh"
        ) {
          originalRequest._retry = true;

          if (!user) {
            logout();
            window.location.href = "/login";
            return Promise.reject(new Error("User is not authenticated"));
          }

          try {
            const refreshResponse = await axiosInstance.post(
              "/auth/refresh",
              {},
              { withCredentials: true },
            );

            const newToken = refreshResponse.data.token;
            login(user, newToken);

            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${newToken}`,
            };

            return axiosInstance(originalRequest);
          } catch (err) {
            logout();
            window.location.href = "/login";
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      },
    );

    return axiosInstance;
  }, [token, withAuth, login, logout, user]);
};
