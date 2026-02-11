import { Navigate, Outlet } from "react-router-dom";
import { loadStoredData, hasValidKeys } from "../../utils/storage";

export function MainLayout() {
  const data = loadStoredData();
  if (!data || !hasValidKeys(data.apiKeys)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
