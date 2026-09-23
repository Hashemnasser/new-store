// server/src/payments/payment-provider.factory.ts

import { createError } from "../errors/app-error";
import type { PaymentProvider } from "./payment-provider.interface";
import { StripeProvider } from "./providers/stripe.provider";

// ============================================================
// 🏭 مصنع مزودي الدفع
// ============================================================

class PaymentProviderFactory {
  private providers: Map<string, PaymentProvider> = new Map();

  constructor() {
    // ✅ تسجيل البوابات المتاحة
    this.register(new StripeProvider());

    // 🔮 مستقبلاً:
    // this.register(new ShamCashProvider());
    // this.register(new TapProvider());
    // this.register(new PayPalProvider());
  }

  register(provider: PaymentProvider): void {
    if (!provider.isEnabled()) {
      console.warn(`⚠️ Provider "${provider.name}" disabled (missing config).`);
      return;
    }
    this.providers.set(provider.name, provider);
    console.log(`✅ Payment provider registered: ${provider.name}`);
  }

  get(name: string): PaymentProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw createError(
        "BAD_REQUEST",
        `بوابة الدفع "${name}" غير مدعومة أو غير مُهيّأة`
      );
    }
    return provider;
  }

  getAll(): PaymentProvider[] {
    return Array.from(this.providers.values());
  }

  getEnabledNames(): string[] {
    return Array.from(this.providers.keys());
  }
}

export const paymentProviderFactory = new PaymentProviderFactory();
