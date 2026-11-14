// client/src/lib/stripe.ts

import type { StripeElementsOptions } from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { env } from "../config/env";

const stripeKey = env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripeKey) {
  throw new Error(
    "❌ VITE_STRIPE_PUBLISHABLE_KEY is missing. Check your .env file."
  );
}

// ✅ Promise واحد للتطبيق كله
export const stripePromise = loadStripe(stripeKey);

// ✅ المظهر الثابت (يُستخدم في <Elements options>)
export const stripeAppearance: StripeElementsOptions["appearance"] = {
  theme: "stripe",
  variables: {
    colorPrimary: "#2563eb",
    fontFamily: "Cairo, system-ui, sans-serif",
    borderRadius: "8px",
  },
};
