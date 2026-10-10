export type Article = {
  slug: string;
  title: string;
  description: string;
  body: string[];
};

export const articles: Article[] = [
  {
    slug: "server-side-payment-verification",
    title: "Why a thank-you page is not proof of payment",
    description:
      "Explain why payment success must be verified on the server before fulfilling orders.",
    body: [
      "When a customer returns from a hosted payment page, it is tempting to mark the order paid immediately. That redirect can be replayed, bookmarked, or reached after a cancelled attempt.",
      "A reliable integration creates the order and amount on the server, sends the customer to the provider, then waits for a verified callback or an authenticated status check before granting fulfilment or downloads.",
      "TechmasterCY designs checkouts this way for client systems and for this shop: browser success is a UX signal, not an authorization decision.",
    ],
  },
  {
    slug: "idempotent-payment-webhooks",
    title: "Handling duplicate and delayed payment webhooks",
    description:
      "How to process payment notifications safely when events arrive more than once or out of order.",
    body: [
      "Payment providers retry webhooks. Networks delay packets. Your receiver must tolerate the same paid event arriving twice without shipping twice or issuing two download grants.",
      "Store a provider event identifier, ignore duplicates after successful processing, and compare paid amounts to the trusted order total before changing state.",
      "These patterns are also the foundation of the planned Webhook Reliability Kit for Java and Spring Boot developers.",
    ],
  },
  {
    slug: "jcc-integration-checklist-cyprus",
    title: "JCC integration checklist for Cyprus merchants",
    description:
      "A practical checklist before starting a JCC payment integration project in Cyprus.",
    body: [
      "Confirm you have merchant access and the official documentation for the specific JCC product enabled on your account. Integration details vary; undocumented endpoints should not be invented.",
      "Prepare staging credentials, callback URLs that reach your server, and a clear map of order statuses for success, decline, cancellation and refund.",
      "TechmasterCY can implement and harden the technical flow as an independent integrator. No official JCC partnership or certification is claimed.",
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}
