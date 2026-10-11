import { CheckoutForm } from "@/app/checkout/CheckoutForm";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Checkout",
  description: "Secure checkout for TechmasterCY products.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return (
    <Container className="min-w-0 py-8 sm:py-12 lg:py-16">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Cart", href: "/cart" },
          { name: "Checkout" },
        ]}
      />
      <SectionHeading
        eyebrow="Checkout"
        title="Checkout"
        description="Product prices and totals are validated on the server. A browser redirect alone is never treated as payment proof."
      />
      <div className="mt-8">
        <CheckoutForm />
      </div>
    </Container>
  );
}
