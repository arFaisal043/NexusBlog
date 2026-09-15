import Stripe from "stripe";
import { SubscriptionStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

// current period end calc fn
export const getPeriodEnd = (payload: Stripe.Subscription) => {
  // current_period_end might be on the root or on the first subscription item depending on Stripe API version
  const currentPeriodEndInSeconds = (payload as any).current_period_end || (payload as any).items?.data?.[0]?.current_period_end;

  // convert into a Date object
  const currentPeriodEndDate = new Date(currentPeriodEndInSeconds * 1000);

  return currentPeriodEndDate;
};

// ___________ for checkout session completed ______________________

export const handleCheckoutCompleted = async (
  session: Stripe.Checkout.Session,
) => {
  // const session: Stripe.Checkout.Session = event.data.object as any;

  const userId = session.metadata?.userId;
  const stripeCustomerId = session.customer as string;
  const stripeSubscriptionId = session.subscription as string;

  // console.log("Extracted Info:", { userId, stripeCustomerId, stripeSubscriptionId });
  // output:
  // Extracted Info: {
  //   userId: '02bd4e7a-60b9-4893-964f-9e90e6943ce1',
  //   stripeCustomerId: 'cus_VFpBLdBovo2BFL',
  //   stripeSubscriptionId: 'sub_1UFJYsFXgUvR8oNAjrBbWK0R'
  // }

  if (!userId || !stripeCustomerId || !stripeSubscriptionId) {
    console.log(`Webhook Failed: Missing required information from session`);

    return;
  }

  // ____________ Get Subscription Information, When subscription start and when subscription will end
  const stripeSubscription =
    await stripe.subscriptions.retrieve(stripeSubscriptionId);
  // console.log( "Subscription Information:", stripeSubscription.items.data[0]);

  // current_period_end fn call
  const currentPeriodEndDate = getPeriodEnd(stripeSubscription);

  // upsert() --> if not exist then create/insert or if exist then update
  await prisma.subscription.upsert({
    where: {
      userId,
    },

    create: {
      userId,
      stripeCustomerId,
      stripeSubscriptionId,
      status: "ACTIVE",
      currentPeriodEnd: currentPeriodEndDate,
    },

    update: {
      stripeCustomerId,
      stripeSubscriptionId,
      status: "ACTIVE",
      currentPeriodEnd: currentPeriodEndDate,
    },
  });
};

// ____________ for Update / Delete checkout session ______________________

export const handleChangeSubscription = async (
  payload: Stripe.Subscription,
) => {
  const stripeSubscriptionId = payload.id;

  // stripe subscription status
  const status =
    payload.status === "active" || payload.status === "trialing"
      ? SubscriptionStatus.ACTIVE
      : payload.status === "canceled"
        ? SubscriptionStatus.CANCELED
        : SubscriptionStatus.EXPIRED;

  const currentPeriodEnd = getPeriodEnd(payload);

  const isSubscriptionExist = await prisma.subscription.findUnique({
    where: {
      stripeSubscriptionId,
    },
  });

  // check subscription is exist or not?
  if (!isSubscriptionExist) {
    console.log(
      `Webhook: No subscription found for subscription id : ${stripeSubscriptionId}`,
    );
  }

  await prisma.subscription.update({
    where: {
      stripeSubscriptionId,
    },
    data: {
      status,
      currentPeriodEnd,
    },
  });
};
