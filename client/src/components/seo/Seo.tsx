// client/src/components/seo/Seo.tsx
import { Helmet } from "react-helmet-async";

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string;
}

export const Seo = ({
  title = "ProStore - أفضل متجر إلكتروني",
  description = "تسوق أفضل المنتجات بأفضل الأسعار. اكتشف مجموعة واسعة من المنتجات الأصلية مع ضمان الجودة والتوصيل المجاني.",
  image = "/images/og-image.png",
  url = window.location.href,
  keywords = "تسوق, منتجات, إلكترونيات, ملابس, عروض, تخفيضات",
}: SeoProps) => {
  return (
    <Helmet>
      {/* الأساسيات */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph (Facebook, LinkedIn) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="ProStore" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* روبوتات البحث */}
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
};
