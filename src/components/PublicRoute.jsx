import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PublicLayout = () => {
  const { token } = useSelector((state) => state.auth);

  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicLayout;
