import { useContext } from "react";
import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { AuthContext } from "../Context/AuthContext";

function ProtectedRoute({
  children,
  loading,
}: {
  children: JSX.Element;
  loading: boolean;
}) {
  const auth = useContext(AuthContext);

  if (!auth) return null;

  if (!auth.token && !loading) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
