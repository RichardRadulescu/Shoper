import { Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth"; // your hook

export function ProtectedRoute({ allowedRoles, children }: {allowedRoles: string, children: React.ReactNode }) {
  const { role } = useAuth(); // e.g. "admin", "user", null

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/products" replace />;
  }

  return children;
}
