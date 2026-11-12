# TechmasterCY — Editorial plan (Phase 4)

Twelve **draft** technical articles for review. They are stored in `src/content/articles.ts` with `status: "draft"` (noIndex, excluded from sitemap and the public listing until approved).

Do **not** auto-publish. Approve individually, then flip `status` to `"published"` and set `publishedAt`.

| # | Working title | Target query / angle | Links to | Slug |
| --- | --- | --- | --- | --- |
| 1 | Stripe Checkout vs Payment Intents for custom apps | When to use Checkout Session vs Intents | `/stripe-integration` | `stripe-checkout-vs-payment-intents` |
| 2 | Designing idempotent payment webhook receivers | Duplicate / delayed provider events | `/payment-webhooks` | `designing-idempotent-payment-webhooks` |
| 3 | What “3DS authenticated” actually means in your order state | Mapping ACS outcomes to fulfilment | `/3ds-integration` | `3ds-authenticated-order-state` |
| 4 | Reconciling paid amounts before fulfilment | Amount mismatch and partial capture risks | `/payment-integration` | `reconcile-paid-amounts-before-fulfilment` |
| 5 | JCC hosted checkout: staging checklist beyond credentials | Practical Cyprus merchant prep | `/jcc-integration` | `jcc-hosted-checkout-staging-checklist` |
| 6 | WooCommerce payment plugins vs custom gateway code | When a plugin is enough | `/woocommerce-payment-integration` | `woocommerce-plugin-vs-custom-gateway` |
| 7 | Debugging “customer paid but order still pending” | Operational troubleshooting playbook | `/services/payment-troubleshooting` | `paid-but-order-pending-playbook` |
| 8 | Safe retries: client redirects are not webhooks | Why browser return URLs fail as source of truth | `/payment-integration` | `redirects-are-not-webhooks` |
| 9 | Mapping provider statuses to your domain model | Paid / failed / cancelled / refunded | `/api-development` | `map-provider-statuses-to-domain` |
| 10 | Signing and verifying payment webhooks without brittle secrets handling | Operational security patterns | `/payment-webhooks` | `verify-payment-webhook-signatures` |
| 11 | Building a thin payment orchestration API in front of a gateway | When a façade helps multi-channel checkout | `/api-development` | `thin-payment-orchestration-api` |
| 12 | Test matrices for card payments: declines, 3DS, timeouts | Go-live quality bar | `/3ds-integration` | `payment-test-matrix-3ds-timeouts` |

Existing **published** articles (keep):

- `server-side-payment-verification`
- `idempotent-payment-webhooks`
- `jcc-integration-checklist-cyprus`
