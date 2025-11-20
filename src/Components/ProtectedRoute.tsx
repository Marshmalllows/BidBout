import { useContext } from "react";
import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { AuthContext } from "../Context/AuthContext";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const auth = useContext(AuthContext);

  if (!auth) return null;

  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
