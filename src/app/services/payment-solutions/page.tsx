import { ServicePillarLanding } from "@/components/services/ServicePillarLanding";
import { getServicePillar } from "@/content/service-pillars";
import { createMetadata } from "@/lib/seo";

const pillar = getServicePillar("payment-solutions")!;

export const metadata = createMetadata({
  title: "Payment Solutions — gateway integration Cyprus",
  description:
    "Payment gateway integration for Cyprus and international merchants: JCC, Stripe, Viva.com, Revolut Pay, webhooks, 3DS and payment troubleshooting.",
  path: "/services/payment-solutions",
});

export default function PaymentSolutionsPage() {
  return <ServicePillarLanding pillar={pillar} />;
}
