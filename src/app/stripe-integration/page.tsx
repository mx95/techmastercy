import {
  CommercialLanderPage,
  landerMetadata,
} from "@/components/services/CommercialLanderPage";

export const metadata = landerMetadata("stripe-integration");

export default function Page() {
  return <CommercialLanderPage slug="stripe-integration" />;
}
