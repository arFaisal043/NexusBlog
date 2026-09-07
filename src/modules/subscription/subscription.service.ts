import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { email } from "zod";
import { stripe } from "../../lib/stripe";
import { config } from "../../config";

const createCheckoutSession = async (userId: string) => {
    const transactionResult = await prisma.$transaction(async (tx) => {

        // user exist or not?
        const user = await tx.user.findFirstOrThrow({
            where: {
                id: userId
            },
            include: {
                subscription: true
            }
        })

        // _________ check customer id
        // old subscriber
        let stripeCustomerId = user.subscription?.stripeCustomerId;

        // if not exist then create new
        if(!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {userId: user.id}
            })

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
    })

    return {
        paymentUrl: transactionResult
    }
}

export const subscriptionServices = {
  createCheckoutSession,
};