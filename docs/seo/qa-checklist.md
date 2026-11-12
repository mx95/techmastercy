# SEO workstream QA checklist (Phase 8)

Run before merge review. **Do not deploy from this branch automatically.**

## Build & automated

- [ ] `npm test`
- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run build` (with `DATABASE_URL=file:./dev.db`)

## Routes & metadata

- [ ] `/payment-integration`, `/stripe-integration`, `/jcc-integration`, `/payment-webhooks`, `/3ds-integration`, `/api-development`, `/woocommerce-payment-integration` return 200 with unique title, description, single H1, canonical self-URL
- [ ] Unknown path shows 404 with `noindex` (not homepage canonical)
- [ ] Draft article URLs open with draft banner and `noindex`; absent from `/articles` listing and `/sitemap.xml`
- [ ] Published articles expose Article JSON-LD

## Technical

- [ ] `/robots.txt` disallows admin/cart/checkout/order/api; sitemap URL is apex
- [ ] `/sitemap.xml` includes commercial landers; shop priority below payment landers
- [ ] Organization schema `areaServed` includes CY + Worldwide
- [ ] www host 308 → apex (after deploy; also configure Nginx if possible)

## Conversion

- [ ] Contact success fires `generate_lead` only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set **and** consent accepted
- [ ] Declining consent loads no gtag script
- [ ] CTA clicks on landers use `cta_click`

## Content review outstanding

- [ ] Approve/reject each of the 12 draft articles in `src/content/articles.ts`
- [ ] Legal review of privacy analytics paragraph
- [ ] Add production `NEXT_PUBLIC_GA_MEASUREMENT_ID` when GA4 property exists
- [ ] GSC property verify + sitemap submit (see `gsc-ga4-setup.md`)
