// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {Button} from '@chakra-ui/react'
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  "pk_test_51IUqMCJ2iOysJZvP3vrQpEoV2l1SpF9PzkycqVdKjmC3RYuDC3AqTvRfBDcsDwDmtxJlkUyip4GQOb8Akt0lF3O100RSHVPfch"
);

export default function Stripe() {
  const handleClick = async (event) => {
    const stripe = await stripePromise;
    stripe
      .redirectToCheckout({
        lineItems: [{ price: "price_1IUx1FJ2iOysJZvP1LD3EzTR", quantity: 1 }],
        mode: "payment",
        successUrl: window.location.protocol + "//juli.sh/success",
        cancelUrl: window.location.protocol + "//juli.sh/canceled",
        submitType: "donate",

      })
      .then(function (result) {
        if (result.error) {
         console.log(error)
        }
      });
  };

  return <Button onClick={handleClick} >Test</Button>;
}

