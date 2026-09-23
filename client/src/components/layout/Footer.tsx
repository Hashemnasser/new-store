// src/components/layout/Footer.tsx
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ROUTES } from "../../app/router/route.constants";

export const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {year} ProStore. {t("common.copyRight")}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <Link to={ROUTES.HOME} className="hover:text-gray-900 transition">
              {t("common.home")}
            </Link>
            <Link
              to={ROUTES.PRODUCTS}
              className="hover:text-gray-900 transition"
            >
              {t("common.products")}
            </Link>
            <Link to="/about" className="hover:text-gray-900 transition">
              {t("common.about")}
            </Link>
            <Link to="/contact" className="hover:text-gray-900 transition">
              {t("common.contact")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
