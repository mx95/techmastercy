# TechmasterCY

Self-hosted Next.js storefront and admin for [techmaster.com.cy](https://techmaster.com.cy): payment integration services, physical products, and digital downloads.

Stack: **Next.js 16 (App Router)**, **Prisma + SQLite**, payment adapters (mock / JCC), Docker + nginx on Hetzner.

## 1. Implemented functionality

- Premium public site: home, services (8 detail pages), about, contact, FAQ, legal drafts, articles
- Interactive shop: listing, filters, search, sort, product detail, cart drawer + cart page, checkout
- Seeded catalogue from current Shopify prices:
  - Ottocast Cabin Care — €89.99 (was €124.99), stock 0 (sold out on Shopify)
  - Mini AirTag Finder — €4.99
  - Webhook Reliability Kit — draft/unpublished (€49 / €149 licence options)
- Server-priced checkout + quote verification; mock payments (dev), Revolut Pro static payment links, and JCC adapter skeleton
- Idempotent payment webhooks; tokenised digital downloads from a private directory
- Contact enquiries with honeypot + rate limit + optional SMTP
- Admin login, product publish/price/stock, orders & enquiries
- SEO: metadata, Open Graph, sitemap, robots, JSON-LD
- Security headers via Next.js 16 `src/proxy.ts`
- Docker Compose + nginx deploy assets and operator docs
- Automated tests (15 passing) and production build verified

## 2. Project structure

```
prisma/                 Schema + seed
src/app/api/            Route Handlers (health, contact, checkout, payments, downloads, admin)
src/app/admin/          Admin UI (noindex)
src/lib/                Shared domain (auth, checkout, orders, payments, money, …)
src/content/            Service/FAQ content
storage/private/        Private digital files (not committed)
deploy/                 nginx + DEPLOY.md
docs/                   ARCHITECTURE.md, PAYMENTS.md
```

## 3. Local development

```bash
cp .env.example .env
# set SESSION_SECRET (32+ chars), ADMIN_PASSWORD, keep PAYMENT_PROVIDER=mock

npm install
npx prisma db push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

Useful scripts:

| Script | Purpose |
|--------|---------|
| `npm run dev` | Next.js dev server |
| `npm run build` / `npm start` | Production build & serve |
| `npm test` | Vitest |
| `npm run db:push` | Sync Prisma schema to SQLite |
| `npm run db:seed` | Seed admin + catalogue |

## 4. Required environment variables

See `.env.example`. Minimum for local:

- `DATABASE_URL` — e.g. `file:./dev.db`
- `SESSION_SECRET` — long random string
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — seed bootstrap only
- `APP_URL` / `SITE_URL`
- `PAYMENT_PROVIDER=mock` and (dev) `ALLOW_MOCK_PAYMENTS=true`

Optional: `SMTP_*`, `BUSINESS_EMAIL`, `JCC_*`, `MOCK_WEBHOOK_SECRET`, tax and download tuning vars.

## 5. Database setup

SQLite via Prisma. No separate DB server.

```bash
npx prisma db push          # create/update tables
npm run db:seed             # admin user + sample products
```

Production Docker uses `DATABASE_URL=file:/data/techmastercy.db` on a named volume. Prefer `db push` (or future migrations) as part of deploy; back up `/data` before schema changes.

## 6. Configure and test JCC payments

Documented in [docs/PAYMENTS.md](docs/PAYMENTS.md). Summary:

1. Obtain official JCC merchant docs + sandbox credentials.
2. Implement the three methods in `src/lib/payments/jcc-provider.ts` from those docs.
3. Set `PAYMENT_PROVIDER=jcc` and `JCC_*` on staging.
4. Run a full checkout + webhook + duplicate-webhook test.
5. Never enable `ALLOW_MOCK_PAYMENTS` on the live host.

Local mock path: checkout → `/api/payments/mock/complete` → order paid → `/order/[reference]`.

## 7. Add, publish, and manage products

1. Sign in at `/admin/login`.
2. Open **Products**.
3. Edit price (EUR) and stock, click **Save** (stored as euro cents server-side).
4. Use **Publish** / **Unpublish** to toggle `PUBLISHED` vs `DRAFT`.
5. Digital files: place archives under `storage/private/` (or `PRIVATE_FILES_DIR`), create `DownloadFile` rows (seed/Prisma) with `storagePath` relative to that directory. Tokens are issued only after payment capture.

Catalogue seed currently includes physical Shopify-parity products and a draft digital webhook kit.

## 8. Deploy to Hetzner

Follow [deploy/DEPLOY.md](deploy/DEPLOY.md) and [deploy/GITHUB_ACTIONS.md](deploy/GITHUB_ACTIONS.md).

Summary:

1. Review and run `deploy/provision-server.sh` as root (installs Docker, nginx, `tmcdeploy`, restricted `techmastercy-ctl`).
2. Configure GitHub Actions secrets (deploy user SSH key + host fingerprint).
3. Merge to `main` to deploy, or use `workflow_dispatch`.
4. Health: `curl http://127.0.0.1:3000/api/health`

Actions never SSH as `root`. The deploy user is not added to the `docker` group.

## 9. DNS and HTTPS

- Point A/AAAA (and `www`) to the VPS **only when ready** — this repo never changes DNS for you.
- As of inspection, `techmaster.com.cy` still resolves to Shopify, not the Hetzner IP.
- Use Certbot + `deploy/nginx-https.conf` only after DNS points here — see [deploy/DEPLOY.md](deploy/DEPLOY.md).

## 10. Backup and restore

- Back up the Docker `/data` volume (SQLite DB + `private/` files) on a schedule.
- Restore by stopping the app, replacing `/data`, and starting again; verify health + a known order.
- Sample cron notes are in `deploy/DEPLOY.md`.

## 11. Outstanding items needing credentials or approval

- **JCC live credentials + official API mapping** (adapter is intentionally incomplete)
- **SMTP** for enquiry email delivery (enquiries still save without it)
- **DNS cut-over** from Shopify (manual)
- **TLS certificates** via Certbot once DNS points here
- **Production `SESSION_SECRET` / admin password** rotation after seed

## 12. Not yet ready for production

- JCC provider methods throw until implemented against merchant docs
- Digital product file packaging (webhook kit remains `DRAFT` without downloadable archives)
- Ottocast Cabin Care is seeded as sold out (stock 0) to match Shopify — update stock in admin when available
- Legal draft pages require professional review before launch
- Automated off-site backup/restore drill should be run once on the real VPS
- Do not point DNS away from Shopify until staging checkout and HTTPS are verified

## Architecture & payments

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/PAYMENTS.md](docs/PAYMENTS.md)

## License

Private — TechmasterCY.
