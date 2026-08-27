type StripeCardElement = {
  mount: (element: HTMLElement) => void;
  unmount: () => void;
};

type StripeClient = {
  elements: () => { create: (type: 'card', options?: object) => StripeCardElement };
  confirmCardPayment: (
    clientSecret: string,
    data: { payment_method: { card: StripeCardElement; billing_details: { name: string } } },
  ) => Promise<{ error?: { message?: string }; paymentIntent?: { status: string } }>;
};

declare global {
  interface Window {
    Stripe?: (publicKey: string) => StripeClient;
  }
}

let stripePromise: Promise<StripeClient> | null = null;

export function loadStripe(): Promise<StripeClient> {
  if (stripePromise) return stripePromise;
  stripePromise = new Promise((resolve, reject) => {
    const publicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    if (!publicKey) {
      reject(new Error('VITE_STRIPE_PUBLIC_KEY nao foi configurada.'));
      return;
    }

    const createClient = () => {
      const client = window.Stripe?.(publicKey);
      if (client) {
        resolve(client);
      } else {
        reject(new Error('Stripe.js nao foi carregado.'));
      }
    };
    if (window.Stripe) {
      createClient();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = createClient;
    script.onerror = () => reject(new Error('Nao foi possivel carregar a Stripe.'));
    document.head.appendChild(script);
  });
  return stripePromise;
}

export type { StripeCardElement, StripeClient };
