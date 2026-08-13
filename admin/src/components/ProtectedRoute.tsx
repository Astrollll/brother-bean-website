import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";
import Layout from "./Layout";
import { Spinner } from "./ui";

export default function ProtectedRoute() {
  const { sessionUser, profileLoading, isAdmin } = useAuth();
  const location = useLocation();

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner label="Checking session..." />
      </div>
    );
  }

  if (!sessionUser || !isAdmin) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Layout />;
}
