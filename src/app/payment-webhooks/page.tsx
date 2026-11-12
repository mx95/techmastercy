import {
  CommercialLanderPage,
  landerMetadata,
} from "@/components/services/CommercialLanderPage";

export const metadata = landerMetadata("payment-webhooks");

export default function Page() {
  return <CommercialLanderPage slug="payment-webhooks" />;
}
