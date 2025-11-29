import { useEffect, useState, useRef } from "react";
import { useAuth } from "./useAuth.tsx";
import axios from "axios";

const envURL = import.meta.env.VITE_API_BASE_URL;
const baseURL = envURL.endsWith("/") ? envURL.slice(0, -1) : envURL;

export const useAutoLogin = () => {
  const { login, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  const requestSent = useRef(false);

  useEffect(() => {
    if (requestSent.current) return;
    requestSent.current = true;

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
      }
    };

    refreshSession().catch(console.error);
  }, [login, logout]);

  return loading;
};
