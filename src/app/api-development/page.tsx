import {
  CommercialLanderPage,
  landerMetadata,
} from "@/components/services/CommercialLanderPage";

export const metadata = landerMetadata("api-development");

export default function Page() {
  return <CommercialLanderPage slug="api-development" />;
}
