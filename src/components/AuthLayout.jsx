import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import LoadingState from "./LoadingState";

function ProtectedRoute({ children, requireAuth = true }) {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <LoadingState color="--color-coral" />;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
