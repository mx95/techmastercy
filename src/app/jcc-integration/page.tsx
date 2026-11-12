import {
  CommercialLanderPage,
  landerMetadata,
} from "@/components/services/CommercialLanderPage";

export const metadata = landerMetadata("jcc-integration");

export default function Page() {
  return <CommercialLanderPage slug="jcc-integration" />;
}
