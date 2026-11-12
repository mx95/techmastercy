# TechmasterCY — Keyword strategy (Phase 2)

**Scope:** English-language commercial and technical queries for payment engineering and software services. Shopify storefront SEO is out of scope.  
**Method:** Intent mapping from service offerings and observed search phrasing. **No invented search-volume or competition figures.**

## Positioning

- **Primary commercial theme:** Payment integration engineering (gateways, APIs, webhooks, 3DS, troubleshooting).
- **Secondary:** Custom software / API development; AI & automation; digital solutions.
- **Geography:** Cyprus-based company; projects served locally and internationally. Prefer keywords that do not force a single country unless the query is explicitly Cyprus-local (e.g. JCC).

## Priority clusters

### A — Payment gateway & integration (highest commercial intent)

| Seed / theme | Example long-tail / variants | Intent | Primary URL |
| --- | --- | --- | --- |
| Payment gateway integration services | payment gateway integration for website; hire payment integration developer | Hire / buy | `/payment-integration` |
| Payment integration developer | freelance payment API developer; payment systems engineer | Hire | `/payment-integration` |
| Stripe integration services | Stripe Checkout integration; Stripe webhooks setup; Stripe for SaaS | Hire | `/stripe-integration` |
| JCC payment gateway integration | JCC Cyprus payment integration; JCC hosted payment page | Hire (Cyprus-heavy) | `/jcc-integration` + `/services/jcc-payment-integration` |
| WooCommerce payment integration | WooCommerce gateway setup; WooCommerce card payments Cyprus | Hire | `/woocommerce-payment-integration` |
| Payment troubleshooting services | payment callback not updating order; checkout paid but order pending | Fix / hire | `/services/payment-troubleshooting` |

### B — Payment engineering depth

| Seed / theme | Example long-tail | Intent | Primary URL |
| --- | --- | --- | --- |
| Payment webhook development | idempotent payment webhooks; duplicate webhook handling | Hire / learn | `/payment-webhooks` |
| 3DS integration | 3-D Secure authentication integration; challenge flow checkout | Hire / learn | `/3ds-integration` |
| Payment API development | custom payment API; server-side payment session | Hire | `/payment-integration`, `/api-development` |

### C — Broader engineering

| Seed / theme | Example long-tail | Intent | Primary URL |
| --- | --- | --- | --- |
| API integration services | REST API integration partner; third-party API developer | Hire | `/api-development` |
| Custom software development | custom business software; application development Cyprus / remote | Hire | `/services/software-api-development` |
| AI / automation | business process automation; AI workflow integration | Hire | `/services/ai-automation` |

## Intent notes

- **Transactional:** “integration services”, “developer”, “agency”, “hire”, “setup”, “implementation” → landers + contact CTA.
- **Commercial investigation:** “checklist”, “how to verify payment”, “webhook retries” → articles that hand off to a lander.
- **Local modifiers:** Keep “Cyprus” / “JCC” pages honest; do not spam Cyprus onto every international Stripe/API page.
- **Avoid:** Ranking the hardware `/shop` catalogue for these service queries; do not build country microsites.

## Internal linking rules

1. Articles → one primary commercial lander → contact with `?service=`.
2. Commercial landers → related `/services/*` detail pages (delivery depth) and Payment Solutions pillar.
3. Homepage / services hub → Payment Solutions first, then short commercial URLs for Stripe, 3DS, webhooks.

## Measurement (after GA4)

Watch landing-page engagement and **successful** enquiry events (not button clicks alone) for the URLs above. Use Search Console queries once property + sitemap are verified—validate real query data there rather than guessing volumes.
