import { useUser } from "@/hooks";
import { Loader2 } from "lucide-react";
import React, { FC } from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute: FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { isAuthenticated, loading } = useUser();
  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center text-lg">
        <span>Loading</span> <Loader2 className="animate-spin" />
      </div>
    );
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

export const AuthRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useUser();
  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center text-lg">
        <span>Loading</span> <Loader2 className="animate-spin" />
      </div>
    );
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};
