"use strict";
// src/utils/currency.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeParseNumber = exports.formatNumber = exports.formatCurrency = void 0;
/**
 * تنسيق المبلغ المالي إلى صيغة العملة المحلية
 * @param amount - المبلغ (رقم)
 * @param currency - العملة (افتراضي: USD)
 * @param locale - اللغة المفضلة (افتراضي: ar-EG)
 * @returns سلسلة نصية منسقة (مثال: ١٬٢٣٤٫٥٦ ر.س)
 */
const formatCurrency = (amount, currency = "USD", locale = "ar-EG") => {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};
exports.formatCurrency = formatCurrency;
/**
 * تنسيق المبلغ إلى صيغة مبسطة (بدون رمز العملة)
 * @param amount - المبلغ (رقم)
 * @param locale - اللغة المفضلة
 * @returns سلسلة نصية منسقة (مثال: ١٬٢٣٤٫٥٦)
 */
const formatNumber = (amount, locale = "ar-EG") => {
    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};
exports.formatNumber = formatNumber;
/**
 * تحويل النص إلى رقم بأمان
 * @param value - القيمة (سلسلة نصية أو رقم)
 * @returns رقم صحيح، أو 0 إذا كانت القيمة غير صالحة
 */
const safeParseNumber = (value) => {
    if (value === null || value === undefined)
        return 0;
    const num = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(num) ? 0 : num;
};
exports.safeParseNumber = safeParseNumber;
