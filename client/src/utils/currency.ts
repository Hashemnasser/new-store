// src/utils/currency.ts

/**
 * تنسيق المبلغ المالي إلى صيغة العملة المحلية
 * @param amount - المبلغ (رقم)
 * @param currency - العملة (افتراضي: USD)
 * @param locale - اللغة المفضلة (افتراضي: ar-EG)
 * @returns سلسلة نصية منسقة (مثال: ١٬٢٣٤٫٥٦ ر.س)
 */
export const formatCurrency = (
  amount: number,
  currency: string = "USD",
  locale: string = "ar-EG"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * تنسيق المبلغ إلى صيغة مبسطة (بدون رمز العملة)
 * @param amount - المبلغ (رقم)
 * @param locale - اللغة المفضلة
 * @returns سلسلة نصية منسقة (مثال: ١٬٢٣٤٫٥٦)
 */
export const formatNumber = (
  amount: number,
  locale: string = "ar-EG"
): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * تحويل النص إلى رقم بأمان
 * @param value - القيمة (سلسلة نصية أو رقم)
 * @returns رقم صحيح، أو 0 إذا كانت القيمة غير صالحة
 */
export const safeParseNumber = (
  value: string | number | null | undefined
): number => {
  if (value === null || value === undefined) return 0;
  const num = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(num) ? 0 : num;
};
