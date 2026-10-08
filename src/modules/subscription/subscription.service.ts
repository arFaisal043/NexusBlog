import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { date, email } from "zod";
import { stripe } from "../../lib/stripe";
import { config } from "../../config";
import { SubscriptionStatus } from "../../../generated/prisma/enums";
import {
  handleChangeSubscription,
  handleCheckoutCompleted,
} from "./subscription.utils";

const createCheckoutSession = async (userId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    // user exist or not?
    const user = await tx.user.findFirstOrThrow({
      where: {
        id: userId,
      },
      include: {
        subscription: true,
      },
    });

    // _________ check customer id
    // old subscriber
    let stripeCustomerId = user.subscription?.stripeCustomerId;

    // if not exist then create new
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      });

      stripeCustomerId = customer.id;
    }

    // checkout session create
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: config.stripe_product_price_id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      success_url: `${config.app_url}/premium?success=true`, // go frontend
      cancel_url: `${config.app_url}/payment?success=false`,
      metadata: { userId: user.id },
    });

    return session.url;
  });

  return {
    paymentUrl: transactionResult, // where we payment
  };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret;

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );

  // __________ Handle the event

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object);
      break;
    case "customer.subscription.updated":
      await handleChangeSubscription(event.data.object);
      break;
    case "customer.subscription.deleted":
      await handleChangeSubscription(event.data.object);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
      break;
  }
};

const getSubscriptionStatus = async (userId: string) => {
  const isSubscriptionExist = await prisma.subscription.findUniqueOrThrow({
    where: {
      userId,
    },
  });

  // check subscription is Active or not?
  const isActive =
    isSubscriptionExist.status === "ACTIVE" &&
    isSubscriptionExist.currentPeriodEnd &&
    new Date(isSubscriptionExist.currentPeriodEnd) > new Date();

  return {
    status: isSubscriptionExist.status,
    isSubscribed: isActive,
    currentPeriodEnd: isSubscriptionExist.currentPeriodEnd
  }
};

const cancelSubscription = async (userId: string) => {
  const subscription = await prisma.subscription.findUnique({
    where: {
      userId,
    },
  });

  if (!subscription) {
    throw new Error("No active subscription found to cancel.");
  }

  console.log(subscription.stripeSubscriptionId)

  if (!subscription.stripeSubscriptionId) {
    throw new Error("No Stripe subscription found for this user.");
  }

  // We can cancel the subscription immediately via Stripe
  const canceledSubscription = await stripe.subscriptions.cancel(
    subscription.stripeSubscriptionId
  );

  return canceledSubscription;
};

export const subscriptionServices = {
  createCheckoutSession,
  handleWebhook,
  getSubscriptionStatus,
  cancelSubscription,
};
