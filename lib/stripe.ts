// import Stripe from "stripe";

// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


// import Stripe from "stripe";

// export function getStripe() {
//   const key = process.env.STRIPE_SECRET_KEY;

//   if (!key) {
//     throw new Error("STRIPE_SECRET_KEY is missing");
//   }

//   return new Stripe(key);
// }


import Stripe from "stripe";

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;

    if (!key) {
      throw new Error("Stripe not configured");
    }

    stripe = new Stripe(key);
  }

  return stripe;
}