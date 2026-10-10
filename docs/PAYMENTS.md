# Payments

TechmasterCY uses a small payment adapter interface (`src/lib/payments/types.ts`) so checkout and webhooks stay provider-agnostic.

## Providers

| Provider | Env | When to use |
|----------|-----|-------------|
| `mock` | `PAYMENT_PROVIDER=mock` | Local development and staging demos |
| `jcc` | `PAYMENT_PROVIDER=jcc` | Live Cyprus card payments via JCC merchant credentials |

Factory: `getPaymentProvider()` in `src/lib/payments/index.ts`.

## Mock payments

- Creates a checkout session that redirects to `/api/payments/mock/complete`.
- That route marks the order paid (via `applyPaymentNotification`) and redirects to `/order/[reference]`.
- Webhook-style notifications can also be posted to `/api/payments/webhook/mock` with header `x-mock-signature` (or body `secret`) equal to `MOCK_WEBHOOK_SECRET` (default `mock-dev-secret`).
- **Production guard:** mock is refused when `NODE_ENV=production` unless `ALLOW_MOCK_PAYMENTS=true`. Do not enable that flag on the live shop.

## JCC payments

`JccPaymentProvider` is a deliberate skeleton. It validates that merchant configuration exists, then throws until wired to **official JCC merchant documentation** for your specific product (hosted page, API, signature scheme, and callback payload).

Required env (see `.env.example`):

- `JCC_MERCHANT_ID`
- `JCC_API_KEY`
- `JCC_API_SECRET`
- `JCC_BASE_URL`
- `JCC_WEBHOOK_SECRET`

### How to configure and test JCC (when credentials arrive)

1. Obtain merchant docs + sandbox credentials from JCC / your acquiring bank.
2. Implement `createCheckoutSession`, `parseNotification`, and `verifyPayment` in `src/lib/payments/jcc-provider.ts` exactly as documented (do not invent endpoints).
3. Set `PAYMENT_PROVIDER=jcc` and the `JCC_*` variables on staging.
4. Place a small test order end-to-end:
   - Cart → `/api/checkout` → provider redirect → return URL
   - Confirm webhook hits `/api/payments/webhook/jcc`
   - Confirm order becomes `PAID` / `CAPTURED` once
5. Replay the same webhook payload and confirm idempotent `200` with `alreadyProcessed: true`.
6. Only then switch production env to `jcc` and cut over DNS.

## Server-trusted amounts

Checkout never trusts browser prices. `/api/checkout` and `/api/checkout/quote` re-load products from SQLite and compute totals with `validateCheckoutLines` + `calculateOrderTotals`. Paid notifications that include `amountCents` must match the stored order total.
