import {
  CommercialLanderPage,
  landerMetadata,
} from "@/components/services/CommercialLanderPage";

export const metadata = landerMetadata("payment-integration");

export default function Page() {
  return <CommercialLanderPage slug="payment-integration" />;
}
