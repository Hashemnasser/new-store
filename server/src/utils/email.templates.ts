// server/src/utils/email.templates.ts

import {
  Order,
  OrderItem,
  Product,
  ProductVariant,
} from "@/generated/prisma/client";
import { formatCurrency } from "./currency"; // سننشئ دالة مساعدة للعملات

/**
 * توليد محتوى HTML لتأكيد الطلب للمستخدم
 */
export const getOrderConfirmationTemplate = (
  order: Order & {
    items: (OrderItem & { variant: ProductVariant & { product: Product } })[];
  },
  user: { name: string; email: string }
): string => {
  const itemsHtml = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${
            item.variant.product.title
          }</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${
            item.quantity
          }</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(
            Number(item.price)
          )}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(
            Number(item.price) * item.quantity
          )}</td>
        </tr>
      `
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 12px;">
      <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">✅ تم تأكيد طلبك!</h1>
      </div>
      <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <p style="font-size: 16px; color: #1f2937;">مرحباً <strong>${
          user.name
        }</strong>،</p>
        <p style="font-size: 16px; color: #1f2937;">شكراً لتسوقك من <strong>ProStore</strong>. تم استلام طلبك وسيتم معالجته قريباً.</p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #374151;"><strong>رقم الطلب:</strong> #${order.id.slice(
            0,
            8
          )}</p>
          <p style="margin: 0; color: #374151;"><strong>تاريخ الطلب:</strong> ${new Date(
            order.createdAt
          ).toLocaleDateString("ar-EG")}</p>
          <p style="margin: 0; color: #374151;"><strong>حالة الطلب:</strong> ${
            order.status
          }</p>
        </div>
        <h3 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">تفاصيل الطلب</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="padding: 10px; text-align: right;">المنتج</th>
              <th style="padding: 10px; text-align: center;">الكمية</th>
              <th style="padding: 10px; text-align: right;">السعر</th>
              <th style="padding: 10px; text-align: right;">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: left; font-weight: bold;">الإجمالي الكلي</td>
              <td style="padding: 10px; text-align: right; font-weight: bold; color: #2563eb;">${formatCurrency(
                Number(order.totalAmount)
              )}</td>
            </tr>
          </tfoot>
        </table>
        <div style="margin-top: 30px; padding: 20px; background: #ecfdf5; border-radius: 8px; border-right: 4px solid #10b981;">
          <p style="margin: 0; color: #065f46; font-size: 14px;">📦 سيتم إرسال تحديثات الطلب إلى بريدك الإلكتروني.</p>
        </div>
        <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px;">© 2025 ProStore. جميع الحقوق محفوظة.</p>
      </div>
    </div>
  `;
};

/**
 * توليد محتوى HTML لإشعار المدير بطلب جديد
 */
export const getAdminOrderNotificationTemplate = (
  order: Order & {
    items: (OrderItem & { variant: ProductVariant & { product: Product } })[];
  },
  user: { name: string; email: string }
): string => {
  const itemsList = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${
            item.variant.product.title
          }</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${
            item.quantity
          }</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(
            Number(item.price)
          )}</td>
        </tr>
      `
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 12px;">
      <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">🛒 طلب جديد!</h1>
      </div>
      <div style="background: white; padding: 25px; border-radius: 0 0 12px 12px;">
        <p style="font-size: 15px; color: #1f2937;"><strong>رقم الطلب:</strong> #${order.id.slice(
          0,
          8
        )}</p>
        <p style="font-size: 15px; color: #1f2937;"><strong>العميل:</strong> ${
          user.name
        } (${user.email})</p>
        <p style="font-size: 15px; color: #1f2937;"><strong>الإجمالي:</strong> ${formatCurrency(
          Number(order.totalAmount)
        )}</p>
        <h4 style="margin-top: 20px;">المنتجات:</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="padding: 8px; text-align: right;">المنتج</th>
              <th style="padding: 8px; text-align: center;">الكمية</th>
              <th style="padding: 8px; text-align: right;">السعر</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
        </table>
        <p style="font-size: 12px; color: #6b7280; text-align: center; margin-top: 20px;">تم إرسال هذا الإشعار تلقائياً من ProStore.</p>
      </div>
    </div>
  `;
};
