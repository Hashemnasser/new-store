"use strict";
// server/src/payments/payment-provider.factory.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentProviderFactory = void 0;
const app_error_1 = require("../errors/app-error");
const stripe_provider_1 = require("./providers/stripe.provider");
// ============================================================
// 🏭 مصنع مزودي الدفع
// ============================================================
class PaymentProviderFactory {
    providers = new Map();
    constructor() {
        // ✅ تسجيل البوابات المتاحة
        this.register(new stripe_provider_1.StripeProvider());
        // 🔮 مستقبلاً:
        // this.register(new ShamCashProvider());
        // this.register(new TapProvider());
        // this.register(new PayPalProvider());
    }
    register(provider) {
        if (!provider.isEnabled()) {
            console.warn(`⚠️ Provider "${provider.name}" disabled (missing config).`);
            return;
        }
        this.providers.set(provider.name, provider);
        console.log(`✅ Payment provider registered: ${provider.name}`);
    }
    get(name) {
        const provider = this.providers.get(name);
        if (!provider) {
            throw (0, app_error_1.createError)("BAD_REQUEST", `بوابة الدفع "${name}" غير مدعومة أو غير مُهيّأة`);
        }
        return provider;
    }
    getAll() {
        return Array.from(this.providers.values());
    }
    getEnabledNames() {
        return Array.from(this.providers.keys());
    }
}
exports.paymentProviderFactory = new PaymentProviderFactory();
