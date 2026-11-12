# Google Search Console & GA4 setup notes (Phase 7)

## Search Console

1. Verify `https://techmaster.com.cy/` (apex) as the preferred property.
2. After www→apex consolidation ships, leave www as a redirect-only host.
3. Submit `https://techmaster.com.cy/sitemap.xml`.
4. Request indexing for new commercial landers once deployed:
   - `/payment-integration`, `/stripe-integration`, `/jcc-integration`, `/payment-webhooks`, `/3ds-integration`, `/api-development`, `/woocommerce-payment-integration`

## GA4

1. Create a GA4 property for TechmasterCY.
2. Set production env `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXX`.
3. Until that variable is set, the consent banner does not render and no gtag loads.
4. Events implemented in code (only after analytics consent = granted):
   - `generate_lead` — fired after `/api/contact` returns success (not on button mousedown)
   - `cta_click` — commercial CTA buttons
   - `email_click` — mailto in footer (and other TrackedMailto usages)
   - `phone_click` — ready via `TrackedTel` when a public phone is added
   - `service_page_view` — commercial lander mounts

## Consent

Analytics storage defaults to **denied**. Accepting the banner updates consent and loads gtag. Declining stores the choice locally and loads nothing.
