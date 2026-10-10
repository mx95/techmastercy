# Architecture notes

## Stack

- **Next.js 16 App Router** for storefront, admin UI, and Route Handlers
- **Prisma + SQLite** for persistence
- **Adapter-based payments** (mock / JCC)
- **Docker + nginx** for self-hosting on a small Hetzner VPS

## Why SQLite

The deployment target is a low-RAM VPS. SQLite keeps operational cost and moving parts minimal (no managed Postgres), while remaining sufficient for catalogue, orders, enquiries, rate-limit buckets, and download tokens at TechmasterCY’s expected volume. The database file lives on a Docker volume (`/data`) for backups and upgrades.

If write concurrency or reporting needs grow later, migrate the Prisma schema to Postgres with the same models.

## Payment adapter

Checkout creates an order first (`AWAITING_PAYMENT`), then asks the configured provider for a session. Webhooks call `parseNotification` → `applyPaymentNotification`, which:

- verifies signature validity
- enforces amount match when provided
- records `PaymentEvent` rows with a unique `(provider, providerEventId)` for idempotency
- issues digital download tokens only after capture

## Security boundaries

- Admin session: HTTP-only JWT cookie (`jose` + `bcryptjs` password hashes)
- Contact form: Zod validation, honeypot (`websiteConfirm`), IP rate limit
- Digital goods: opaque download tokens hashed at rest; files served from `PRIVATE_FILES_DIR` with path traversal checks (never directory listing)
- Proxy (`src/proxy.ts`): baseline security headers; static assets excluded via matcher
- Prices and stock: mutated only through admin-authenticated APIs

## Next.js 16 notes

- `cookies()` and route `params` are async
- Middleware is renamed to **Proxy** (`src/proxy.ts`)
- `output: 'standalone'` for slim Docker images
- Dynamic admin/shop data uses `force-dynamic` where needed; Cache Components are left off to avoid surprising static shells around session-bound pages
