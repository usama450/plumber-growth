import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-12-18.acacia" as never });

async function main() {
  // Check for existing webhook endpoints pointing to our app
  const existing = await stripe.webhookEndpoints.list();
  const ourUrl = "https://cranky-jemison-f6ee82.vercel.app/api/webhooks/stripe";

  for (const ep of existing.data) {
    if (ep.url === ourUrl) {
      console.log("Webhook endpoint already exists, deleting to recreate...");
      await stripe.webhookEndpoints.del(ep.id);
    }
  }

  const endpoint = await stripe.webhookEndpoints.create({
    url: ourUrl,
    enabled_events: [
      "checkout.session.completed",
      "payment_intent.succeeded",
      "payment_intent.payment_failed",
    ],
    description: "Khwab production webhook",
  });

  console.log("✅ Webhook endpoint created");
  console.log("Signing secret:", endpoint.secret);
  console.log("\nAdd this to Vercel and .env as STRIPE_WEBHOOK_SECRET=", endpoint.secret);
}

main().catch(console.error);
