import { useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth.tsx";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const useAutoLogin = () => {
  const { login, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (!isInitialLoad.current) return;

    const refreshSession = async () => {
      try {
        const response = await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        const { token, user } = response.data;
        login(user, token);
      } catch {
        logout();
      } finally {
        setLoading(false);
        isInitialLoad.current = false;
      }
    };

    refreshSession().catch(console.error);
  }, [login, logout]);

  return loading;
};
