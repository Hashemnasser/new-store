// src/features/products/components/ProductGrid.tsx

import type { Product } from "../types/product.types";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./ProductCardSkeleton";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isInWishlist?: (productId: string) => boolean;
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export const ProductGrid = ({
  products,
  loading = false,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
  columns = { default: 1, sm: 2, md: 3, lg: 4, xl: 4 },
}: ProductGridProps) => {
  const gridCols = [
    `grid-cols-${columns.default || 1}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
  ]
    .filter(Boolean) //عندما تكتب .filter(Boolean)، فأنت تقول: "يا جافا سكريبت، مر على كل عنصر في المصفوفة، وحوله إلى قيمة منطقية (true أو false) باستخدام دالة Boolean. إذا كانت النتيجة true، احتفظ بالعنصر في المصفوفة الجديدة. وإذا كانت false، اطرحه في سلة المهملات."
    .join(" ");

  if (loading) {
    return (
      <div className={`grid gap-4 sm:gap-6 ${gridCols} `}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">لا توجد منتجات</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 sm:gap-6 ${gridCols}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          isInWishlist={isInWishlist ? isInWishlist(product.id) : false}
        />
      ))}
    </div>
  );
};
