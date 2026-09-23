// src/components/layout/Navbar.tsx

import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Moon, ShoppingCart, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../app/router/route.constants";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useCart } from "../../features/cart/hooks/useCart";
import { useWishlist } from "../../features/wishlist/hooks/useWishlist";
import { useLanguage } from "../../providers/LanguageProvider";
import { useTheme } from "../../providers/ThemeProvider";
import { cn } from "../../utils/helpers";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const { items } = useWishlist();
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  const isFoundWishlist = items.length > 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <nav
      dir="ltr"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-1/10",
        scrolled ? "backdrop-blur-md shadow-lg" : "bg-transparent shadow-lg",
        window.scrollY > 20 ? "backdrop-blur-md" : ""
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between p-2">
          {/* Logo */}
          <Link
            to={ROUTES.HOME}
            className={cn(
              "text-2xl font-bold bg-clip-text text-transparent drop-shadow-lg text-shadow-lg",
              scrolled
                ? "bg-purple-800 font-extrabold"
                : "bg-linear-to-r from-blue-600 to-purple-600"
            )}
          >
            ProStore
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8  drop-shadow-md text-shadow-lg">
            <Link to={ROUTES.HOME} className="hover:text-blue-600 transition">
              {t("common.home")}
            </Link>
            <Link
              to={ROUTES.PRODUCTS}
              className="hover:text-blue-600 transition"
            >
              {t("common.products")}
            </Link>
            {user?.role === "ADMIN" && (
              <Link
                to={ROUTES.ADMIN}
                className="hover:text-blue-600 transition"
              >
                {t("common.dashboard")}
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full transition"
              aria-label={t("common.toggleTheme")}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-amber-200" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full transition text-sm font-medium hover:text-blue-600"
              aria-label={t("common.toggleLanguage")}
            >
              {language === "ar" ? "EN" : "عربي"}
            </button>

            {/* Wishlist */}
            <Link
              to={ROUTES.WISHLIST}
              className="relative p-2 rounded-full transition"
              aria-label={t("common.wishlist")}
            >
              <Heart
                className={cn(
                  "w-5 h-5",
                  isFoundWishlist ? "fill-red-500 text-red-500" : ""
                )}
              />
            </Link>

            {/* Cart */}
            <Link
              to={ROUTES.CART}
              className="relative p-2 rounded-full transition"
              aria-label={t("common.cart")}
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  to={ROUTES.PROFILE}
                  className="w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-purple-500 text-amber-50 flex items-center justify-center text-sm font-bold"
                >
                  {user.name?.[0]?.toUpperCase() || "U"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:underline hidden lg:block"
                >
                  {t("common.logout")}
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to={ROUTES.LOGIN}
                  className="px-4 py-2 text-sm font-medium text-blue-600 rounded-lg transition"
                >
                  {t("common.login")}
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  {t("common.register")}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg transition"
              aria-label={isOpen ? t("common.closeMenu") : t("common.openMenu")}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden shadow-lg"
          >
            <div className="px-4 py-4 space-y-3">
              <Link
                to={ROUTES.HOME}
                onClick={() => setIsOpen(false)}
                className="block hover:text-blue-600 transition"
              >
                {t("common.home")}
              </Link>
              <Link
                to={ROUTES.PRODUCTS}
                onClick={() => setIsOpen(false)}
                className="block hover:text-blue-600 transition"
              >
                {t("common.products")}
              </Link>
              {user?.role === "ADMIN" && (
                <Link
                  to={ROUTES.ADMIN}
                  onClick={() => setIsOpen(false)}
                  className="block hover:text-blue-600 transition"
                >
                  {t("common.dashboard")}
                </Link>
              )}
              {user ? (
                <>
                  <Link
                    to={ROUTES.PROFILE}
                    onClick={() => setIsOpen(false)}
                    className="block hover:text-blue-600 transition"
                  >
                    {t("common.profile")}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left text-red-600 hover:underline drop-shadow-lg text-shadow-lg"
                  >
                    {t("common.logout")}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={ROUTES.LOGIN}
                    onClick={() => setIsOpen(false)}
                    className="block text-blue-600 hover:underline"
                  >
                    {t("common.login")}
                  </Link>
                  <Link
                    to={ROUTES.REGISTER}
                    onClick={() => setIsOpen(false)}
                    className="block text-blue-600 hover:underline"
                  >
                    {t("common.register")}
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsOpen(false);
                }}
                className="block w-full text-left hover:text-blue-600 transition"
              >
                {language === "ar" ? "English" : "العربية"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
