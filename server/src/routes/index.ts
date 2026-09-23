import { Router } from "express";
import adminRoutes from "./admin.routes";
import authRoutes from "./auth.routes";
import cartRoutes from "./cart.routes";
import categoryRoutes from "./category.routes";
import couponRoutes from "./coupon.routes";
import orderRoutes from "./order.routes";
import productRoutes from "./product.routes";
import reviewRoutes from "./review.routes";
import userRoutes from "./user.routes";
import wishlistRoutes from "./wishlist.routes";
const router = Router();

router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/product", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/reviews", reviewRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);
router.use("/admin/coupons", couponRoutes);
router.use("/coupons", couponRoutes);

export default router;

// // ✅ عند إضافة مسارات جديدة
// import authRoutes from "./auth.routes";
// import orderRoutes from "./order.routes";
// import cartRoutes from "./cart.routes";
// import wishlistRoutes from "./wishlist.routes";
// import reviewRoutes from "./review.routes";
// import userRoutes from "./user.routes";
// import adminRoutes from "./admin.routes";

// router.use("/auth", authRoutes);
// router.use("/orders", orderRoutes);
// router.use("/cart", cartRoutes);
// router.use("/wishlist", wishlistRoutes);
// router.use("/reviews", reviewRoutes);
// router.use("/users", userRoutes);
// router.use("/admin", adminRoutes);
