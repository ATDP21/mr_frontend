import { loadStripe } from "@stripe/stripe-js";

export const stripePromise = loadStripe(
    "pk_test_51TZCFqJ94S5Ke5YLrqeQGUyXBsSU3DqzafIn0tqooOoAbjH9PJZPWcJUFrup3vat5xPMlfFVVZSR9s5rJ3KaSpfQ00bHEt72Md"
);