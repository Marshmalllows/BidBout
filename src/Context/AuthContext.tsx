import { createContext } from "react";

type User = {
  id: number;
  email: string;
} | null;

export type AuthContextType = {
  user: User;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
