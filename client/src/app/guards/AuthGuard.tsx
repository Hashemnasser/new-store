// // src/app/guards/AuthGuard.tsx

// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../../features/auth/hooks/useAuth";
// import { ROUTES } from "../router/route.constants";

// export const AuthGuard = () => {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return <Navigate to={ROUTES.LOGIN} replace />;
//   }

//   return <Outlet />;
// };
// src/app/guards/AuthGuard.tsx

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { ROUTES } from "../router/route.constants";

export const AuthGuard = () => {
  const { isAuthenticated, isLoading } = useAuth();

  console.log("🔍 AuthGuard - isAuthenticated:", isAuthenticated);
  console.log("🔍 AuthGuard - isLoading:", isLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("❌ AuthGuard - Not authenticated, redirecting to login");
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  console.log("✅ AuthGuard - Authenticated, allowing access");
  return <Outlet />;
};
