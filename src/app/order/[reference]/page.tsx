import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/site/Button";
import { Container } from "@/components/site/Container";
import { prisma } from "@/lib/db";
import { formatEur } from "@/lib/money";
import { createMetadata } from "@/lib/seo";

type Params = Promise<{ reference: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { reference } = await params;
  return createMetadata({
    title: `Order ${reference}`,
    description: "Order status for your TechmasterCY purchase.",
    path: `/order/${reference}`,
    noIndex: true,
  });
}

export default async function OrderPage({ params }: { params: Params }) {
  const { reference } = await params;
  const order = await prisma.order.findUnique({
    where: { reference },
    include: {
      items: true,
      downloadTokens: {
        include: { downloadFile: true },
      },
    },
  });
  if (!order) notFound();

  const paid = order.paymentStatus === "CAPTURED" || order.status === "PAID";

  return (
    <Container className="min-w-0 py-8 sm:py-12 lg:py-16">
      <p className="text-xs uppercase tracking-[0.18em] text-accent">Order status</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">{order.reference}</h1>
      <p className="mt-2 text-foreground-muted">
        Status: <span className="text-white">{order.status}</span> · Payment:{" "}
        <span className="text-white">{order.paymentStatus}</span>
      </p>

      <div className="surface mt-8 max-w-2xl rounded-lg p-6">
        <h2 className="font-display text-lg font-semibold">Items</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4">
              <span className="text-foreground-muted">
                {item.productName}
                {item.licenceName ? ` (${item.licenceName})` : ""} × {item.quantity}
              </span>
              <span>{formatEur(item.lineTotalCents)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-white/10 pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground-muted">Total</span>
            <span className="font-semibold">{formatEur(order.totalCents)}</span>
          </div>
        </div>
      </div>

      {paid ? (
        <div className="mt-6 max-w-2xl space-y-3 text-sm text-foreground-muted">
          <p className="text-success">Payment verified. Thank you.</p>
          {order.downloadTokens.length > 0 ? (
            <p>
              Digital download access was issued for this order. Use the secure download links from
              your fulfilment email or admin-issued tokens. Links expire and have download limits.
            </p>
          ) : (
            <p>
              If this order includes physical goods, fulfilment details will follow by email when
              configured. Digital files are only attached when product archives exist and are linked
              in admin.
            </p>
          )}
        </div>
      ) : order.status === "AWAITING_PAYMENT" || order.paymentStatus === "REQUIRES_ACTION" ? (
        <div className="mt-6 max-w-2xl space-y-3 text-sm text-foreground-muted">
          {order.paymentProvider === "revolut_link" &&
          order.notes?.includes("revolut_link:deferred") ? (
            <>
              <p className="text-foreground">
                Thanks — your order is reserved. This cart needed a custom Revolut payment link.
              </p>
              <p>
                We will send the payment link to{" "}
                <span className="text-white">{order.customerEmail}</span>
                {order.customerPhone ? (
                  <>
                    {" "}
                    or <span className="text-white">{order.customerPhone}</span>
                  </>
                ) : null}
                . After you pay in Revolut, we confirm the order manually.
              </p>
            </>
          ) : order.paymentProvider === "revolut_link" ? (
            <p>
              If you were redirected to Revolut, complete payment there. This page updates after we
              confirm the payment (Revolut Pro links do not auto-notify the shop).
            </p>
          ) : (
            <p>
              Waiting for payment confirmation from the provider. Refresh this page after completing
              checkout. A redirect alone does not mark the order paid.
            </p>
          )}
        </div>
      ) : (
        <p className="mt-6 text-sm text-danger">
          This order is not paid ({order.status}). Contact support if you were charged unexpectedly.
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/shop" variant="secondary">
          Back to shop
        </Button>
        <Link href="/contact" className="text-sm text-accent-soft hover:underline">
          Need help with this order?
        </Link>
      </div>
    </Container>
  );
}
