import { NextRequest, NextResponse } from "next/server";
import { stripe, calculateShipping, calculateTax } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import type { CartItem } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const { items, couponCode, discount = 0 } = body as {
      items: CartItem[];
      couponCode?: string;
      discount?: number;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = calculateShipping(subtotal - discount);

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "cad",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
          metadata: {
            productId: item.productId,
            variantId: item.variantId,
            size: item.size ?? "",
            color: item.color ?? "",
            sku: item.sku,
          },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: session?.user?.email ?? undefined,
      shipping_address_collection: { allowed_countries: ["CA"] },
      shipping_options: shipping === 0
        ? [{ shipping_rate_data: { type: "fixed_amount", fixed_amount: { amount: 0, currency: "cad" }, display_name: "Free Shipping", delivery_estimate: { minimum: { unit: "business_day", value: 3 }, maximum: { unit: "business_day", value: 7 } } } }]
        : [{ shipping_rate_data: { type: "fixed_amount", fixed_amount: { amount: 1500, currency: "cad" }, display_name: "Standard Shipping", delivery_estimate: { minimum: { unit: "business_day", value: 3 }, maximum: { unit: "business_day", value: 7 } } } }],
      // automatic_tax requires Stripe Tax account configuration — disabled until configured
      // automatic_tax: { enabled: true },
      ...(discount > 0 && couponCode && {
        discounts: [{
          coupon: await getOrCreateStripeCoupon(couponCode, discount, subtotal),
        }],
      }),
      metadata: {
        userId: session?.user?.id ?? "guest",
        couponCode: couponCode ?? "",
        cartItems: JSON.stringify(items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
          price: i.price,
          name: i.name,
          image: i.image,
          size: i.size,
          color: i.color,
        }))),
      },
      success_url: `${process.env.NEXTAUTH_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("POST /api/checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}

async function getOrCreateStripeCoupon(code: string, discountAmount: number, subtotal: number): Promise<string> {
  try {
    const existing = await stripe.coupons.retrieve(code);
    return existing.id;
  } catch {
    const pct = Math.round((discountAmount / subtotal) * 100);
    const coupon = await stripe.coupons.create({
      id: code,
      percent_off: pct,
      duration: "once",
      name: code,
    });
    return coupon.id;
  }
}
