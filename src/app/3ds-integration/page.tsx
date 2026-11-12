import {
  CommercialLanderPage,
  landerMetadata,
} from "@/components/services/CommercialLanderPage";

export const metadata = landerMetadata("3ds-integration");

export default function Page() {
  return <CommercialLanderPage slug="3ds-integration" />;
}
