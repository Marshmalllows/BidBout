import { useState, type ReactNode } from "react";
import { AuthContext, type AuthContextType } from "./AuthContext.tsx";

type User = {
  id: number;
  email: string;
} | null;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);

  const login: AuthContextType["login"] = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
  };

  const logout: AuthContextType["logout"] = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
