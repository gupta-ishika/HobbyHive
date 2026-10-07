import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Inverse of ProtectedRoute: keeps authenticated users out of
// login/signup so one account can't silently replace another.
export default function GuestRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" aria-label="Loading">
        <span className="w-10 h-10 rounded-full border-[3px] border-border border-t-primary animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) return <Navigate to="/feed" replace />;
  return <Outlet />;
}
