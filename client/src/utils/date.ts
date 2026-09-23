// src/utils/date.ts

/**
 * تنسيق التاريخ إلى صيغة قابلة للقراءة
 * @param date - التاريخ (كائن Date، سلسلة نصية، أو طابع زمني)
 * @param locale - اللغة المفضلة (افتراضي: ar-EG)
 * @param options - خيارات التنسيق الإضافية
 * @returns سلسلة نصية منسقة (مثال: ٢٠٢٤-٠٧-٠٨)
 */
export const formatDate = (
  date: string | Date | number,
  locale: string = "ar-EG",
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : new Date(date);
  if (isNaN(dateObj.getTime())) return "تاريخ غير صالح";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...options,
  }).format(dateObj);
};

/**
 * تنسيق التاريخ مع الوقت
 * @param date - التاريخ
 * @param locale - اللغة المفضلة
 * @returns سلسلة نصية منسقة (مثال: ٢٠٢٤-٠٧-٠٨ ١٠:٣٠ ص)
 */
export const formatDateTime = (
  date: string | Date | number,
  locale: string = "ar-EG"
): string => {
  return formatDate(date, locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * حساب الوقت المنقضي منذ التاريخ المحدد (Relative Time)
 * @param date - التاريخ
 * @param locale - اللغة المفضلة
 * @returns سلسلة نصية (مثال: "منذ ٣ أيام")
 */
export const timeAgo = (
  date: string | Date | number,
  locale: string = "ar-EG"
): string => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (diffMins < 1) return "الآن";
  if (diffMins < 60) return rtf.format(-diffMins, "minute");
  if (diffMins < 1440) return rtf.format(-Math.floor(diffMins / 60), "hour");
  if (diffMins < 43200) return rtf.format(-Math.floor(diffMins / 1440), "day");
  if (diffMins < 525600)
    return rtf.format(-Math.floor(diffMins / 43200), "month");
  return rtf.format(-Math.floor(diffMins / 525600), "year");
};
