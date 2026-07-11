import { Navigate } from "react-router";
import { useSelector } from "react-redux";

function RoleRoute({ children, allowedRoles = [] }) {
  const { userData } = useSelector((state) => state.auth);

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(userData?.role?.toLowerCase())
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default RoleRoute;
