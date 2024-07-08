import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../provider/auth.provider";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Dashboard() {
  const { token } = useAuth();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
