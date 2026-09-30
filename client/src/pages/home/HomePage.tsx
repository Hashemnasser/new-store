// client/src/pages/home/HomePage.tsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ROUTES } from "../../app/router/route.constants";
import { PageContainer } from "../../components/layout/PageContainer";
import { Seo } from "../../components/seo/Seo";
import { useCart } from "../../features/cart/hooks/useCart";
import { ProductCard } from "../../features/products/components/ProductCard";
import { ProductCardSkeleton } from "../../features/products/components/ProductCardSkeleton";
import {
  useFeaturedProducts,
  useTopSellingProducts,
} from "../../features/products/hooks/useProducts";
import type { Product } from "../../features/products/types/product.types";
import { useWishlist } from "../../features/wishlist/hooks/useWishlist";

export const HomePage = () => {
  const { data: featured, isLoading: featuredLoading } = useFeaturedProducts(8);
  const { data: topSelling, isLoading: topSellingLoading } =
    useTopSellingProducts(8);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  console.log("featured.......:::", featured);
  console.log("topSelling.......:::", topSelling);
  const handleAddToCart = (product: Product) => {
    const variantId = product.variants[0]?.id;
    if (!variantId) {
      toast.error("هذا المنتج لا يحتوي على متغيرات متاحة");
      return;
    }
    addToCart({
      productId: product.id,
      variantId: variantId,
      quantity: 1,
    });
  };

  const handleToggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({ productId: product.id });
    }
  };

  // دالة لعرض شبكة المنتجات
  const ProductGrid = ({
    products,
    loading,
  }: // title,
  // linkText = "عرض الكل",
  any) => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (!products || products.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Seo
            title="ProStore - الرئيسية"
            description="أكبر متجر إلكتروني في العالم العربي. تسوق الآن أحدث المنتجات بأفضل الأسعار."
          />
          لا توجد منتجات في هذا القسم حالياً.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Seo
          title="ProStore - الرئيسية"
          description="أكبر متجر إلكتروني في العالم العربي. تسوق الآن أحدث المنتجات بأفضل الأسعار."
        />
        {products.slice(0, 4).map((product: Product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isInWishlist={isInWishlist(product.id)}
          />
        ))}
      </div>
    );
  };

  return (
    <PageContainer>
      <Seo
        title="ProStore - الرئيسية"
        description="أكبر متجر إلكتروني في العالم العربي. تسوق الآن أحدث المنتجات بأفضل الأسعار."
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section (كما هو) */}
        <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl overflow-hidden mb-12 text-amber-50">
          <div className="relative z-10 px-6 py-16 sm:py-20 lg:py-24 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              مرحباً بك في ProStore
            </h1>
            <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto opacity-90 mb-6">
              اكتشف أفضل المنتجات بأفضل الأسعار
            </p>
            <Link
              to={ROUTES.PRODUCTS}
              className="inline-block text-blue-600 font-semibold px-6 py-3 rounded-lg bg-amber-50 hover:bg-gray-200 transition shadow-lg"
            >
              استكشف المنتجات
            </Link>
          </div>
          <div className="absolute inset-0 opacity-10 bg-[url('/pattern.svg')] bg-repeat" />
        </section>

        {/* أقسام المنتجات الديناميكية */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🔥 المنتجات المميزة
            </h2>
            <Link
              to={ROUTES.PRODUCTS}
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              عرض الكل →
            </Link>
          </div>
          <ProductGrid
            products={featured}
            loading={featuredLoading}
            title="المنتجات المميزة"
          />
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              📈 الأكثر مبيعاً
            </h2>
            <Link
              to={ROUTES.PRODUCTS}
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              عرض الكل →
            </Link>
          </div>
          <ProductGrid
            products={topSelling}
            loading={topSellingLoading}
            title="الأكثر مبيعاً"
          />
        </section>

        {/* Features Section (كما هو) */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center">
            <div className="text-4xl mb-3">🚚</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              توصيل مجاني
            </h3>
            <p className="text-sm text-gray-500">لجميع الطلبات فوق 100 ₪</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center">
            <div className="text-4xl mb-3">🛡️</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              ضمان الجودة
            </h3>
            <p className="text-sm text-gray-500">منتجات أصلية 100%</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center">
            <div className="text-4xl mb-3">↩️</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              إرجاع خلال 14 يوم
            </h3>
            <p className="text-sm text-gray-500">إذا لم تكن راضياً</p>
          </div>
        </section>
      </motion.div>
    </PageContainer>
  );
};

// // src/pages/home/HomePage.tsx

// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { ROUTES } from "../../app/router/route.constants";
// import { PageContainer } from "../../components/layout/PageContainer";

// export const HomePage = () => {
//   return (
//     <PageContainer>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         {/* Hero Section */}
//         <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl overflow-hidden mb-12 text-amber-50">
//           <div className="relative z-10 px-6 py-16 sm:py-20 lg:py-24 text-center">
//             <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
//               مرحباً بك في ProStore
//             </h1>
//             <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto opacity-90 mb-6">
//               اكتشف أفضل المنتجات بأفضل الأسعار
//             </p>
//             <Link
//               to={ROUTES.PRODUCTS}
//               className="inline-block  text-blue-600 font-semibold px-6 py-3 rounded-lg bg-amber-50 hover:bg-gray-200 transition shadow-lg"
//             >
//               استكشف المنتجات
//             </Link>
//           </div>
//           {/* Decorative background */}
//           <div className="absolute inset-0 opacity-10 bg-[url('/pattern.svg')] bg-repeat" />
//         </section>

//         {/* Features Section */}
//         <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
//           <div className=" p-6 rounded-xl shadow-lg text-center">
//             <div className="text-4xl mb-3">🚚</div>
//             <h3 className="text-lg font-semibold  ">توصيل مجاني</h3>
//             <p className="text-sm text-gray-500">لجميع الطلبات فوق 100 ₪</p>
//           </div>
//           <div className=" p-6 rounded-xl shadow-lg text-center">
//             <div className="text-4xl mb-3">🛡️</div>
//             <h3 className="text-lg font-semibold">ضمان الجودة</h3>
//             <p className="text-sm   text-gray-500">منتجات أصلية 100%</p>
//           </div>
//           <div className=" p-6 rounded-xl shadow-lg text-center ">
//             <div className="text-4xl mb-3">↩️</div>
//             <h3 className="text-lg font-semibold ">إرجاع خلال 14 يوم</h3>
//             <p className="text-sm  text-gray-500 ">إذا لم تكن راضياً</p>
//           </div>
//         </section>
//       </motion.div>
//     </PageContainer>
//   );
// };
