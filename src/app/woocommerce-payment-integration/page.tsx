import {
  CommercialLanderPage,
  landerMetadata,
} from "@/components/services/CommercialLanderPage";

export const metadata = landerMetadata("woocommerce-payment-integration");

export default function Page() {
  return <CommercialLanderPage slug="woocommerce-payment-integration" />;
}
