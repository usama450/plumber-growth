import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("Missing STRIPE_SECRET_KEY environment variable");
    _stripe = new Stripe(key, {
      apiVersion: "2024-12-18.acacia" as never,
    });
  }
  return _stripe;
}

// Named export for backwards compat
export const stripe = {
  checkout: {
    sessions: {
      create: (...args: Parameters<Stripe["checkout"]["sessions"]["create"]>) =>
        getStripe().checkout.sessions.create(...args),
      retrieve: (...args: Parameters<Stripe["checkout"]["sessions"]["retrieve"]>) =>
        getStripe().checkout.sessions.retrieve(...args),
    },
  },
  webhooks: {
    constructEvent: (...args: Parameters<Stripe["webhooks"]["constructEvent"]>) =>
      getStripe().webhooks.constructEvent(...args),
  },
  coupons: {
    retrieve: (...args: Parameters<Stripe["coupons"]["retrieve"]>) =>
      getStripe().coupons.retrieve(...args),
    create: (...args: Parameters<Stripe["coupons"]["create"]>) =>
      getStripe().coupons.create(...args),
  },
};

export const FREE_SHIPPING_THRESHOLD = 125;
export const FLAT_SHIPPING_RATE = 15;

export function calculateShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE;
}

export function calculateTax(subtotal: number, province: string = "ON"): number {
  const taxRates: Record<string, number> = {
    AB: 0.05, BC: 0.12, MB: 0.12, NB: 0.15, NL: 0.15,
    NS: 0.15, NT: 0.05, NU: 0.05, ON: 0.13, PE: 0.15,
    QC: 0.1498, SK: 0.11, YT: 0.05,
  };
  return subtotal * (taxRates[province.toUpperCase()] ?? 0.13);
}
