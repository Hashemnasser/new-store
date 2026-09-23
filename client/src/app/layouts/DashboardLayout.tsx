// src/app/layouts/DashboardLayout.tsx

import {
  LayoutDashboard,
  LogOut,
  Moon,
  Package,
  Settings,
  ShoppingBag,
  Star,
  StepBack,
  Sun,
  Tags,
  Users,
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useTheme } from "../../providers/ThemeProvider";
import { ROUTES } from "../router/route.constants";

const navItems = [
  { icon: LayoutDashboard, label: "لوحة التحكم", path: ROUTES.ADMIN_DASHBOARD },
  { icon: Package, label: "المنتجات", path: ROUTES.ADMIN_PRODUCTS },
  { icon: ShoppingBag, label: "الطلبات", path: ROUTES.ADMIN_ORDERS },
  { icon: Users, label: "المستخدمين", path: ROUTES.ADMIN_USERS },
  { icon: Star, label: "التقييمات", path: ROUTES.ADMIN_REVIEWS },
  { icon: Tags, label: "التصنيفات", path: ROUTES.ADMIN_CATEGORIES },
  { icon: Settings, label: "الإعدادات", path: ROUTES.ADMIN_SETTINGS },
  { icon: Star, label: "العروضات", path: ROUTES.ADMIN_COUPONS },
  { icon: StepBack, label: "العودة للرئيسية", path: "/" },
];

export const DashboardLayout = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toggleTheme, theme } = useTheme();
  return (
    <div className="flex min-h-screen ">
      {/* Sidebar */}
      <aside className="w-64  border-r   border-gray-200 dark:border-gray-700 fixed h-full overflow-y-auto">
        <div className="p-4 flex gap-3">
          <h1 className="text-xl font-bold shadow-lg text-blue-500 rounded-md p-2 drop-shadow-md ">
            ProStore Admin
          </h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-yellow-50 shadow-lg drop-shadow-lg  transition"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-amber-300 " />
            ) : (
              <Moon className="w-5 h-5 text-olive-500" />
            )}
          </button>
        </div>

        <nav className="px-2 space-y-1  ">
          {navItems.map((item, index) => {
            //
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex  ${
                  theme === "dark" ? "text-blue-300" : "text-gray-400"
                }  items-center gap-3 px-4 py-2.5 rounded-lg transition  ${
                  index === navItems.length - 1
                    ? "my-10 underline underline-offset-4"
                    : ""
                } ${
                  isActive
                    ? "bg-blue-50! dark:bg-blue-900/20! text-blue-600! dark:text-blue-400!"
                    : " hover:bg-gray-100! dark:hover:bg-gray-700!"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="flex items-center gap-3 w-full px-4 py-2.5  text-red-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
