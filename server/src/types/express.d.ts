// تمديد نوع Request ليشمل user

declare global {
  namespace Express {
    interface Request {
      user?: User;
      validatedQuery?: GetProductsInput; // ← عرفنا الحقل الجديد
    }
  }
}
//في TypeScript، أي ملف إنت بتكتبه بيصنف لواحد من نوعين:

//Script (سكريبت): ملف عادي، كل المتغيرات اللي فيه بتعتبر Global (عالمية) تلقائياً.

//Module (وحدة): ملف فيه import أو export. المتغيرات اللي فيه معزولة (Scoped).
export {}; // لتحويل الملف الى موديول  بدونه يكون سكربت عادي ولا يستطيع تايب سكربت دمج التعديل الحاصل هنا
