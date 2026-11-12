import { ServicePillarLanding } from "@/components/services/ServicePillarLanding";
import { getServicePillar } from "@/content/service-pillars";
import { createMetadata } from "@/lib/seo";

const pillar = getServicePillar("software-api-development")!;

export const metadata = createMetadata({
  title: "Software & API Development Cyprus",
  description:
    "Custom software, backend development, REST APIs, third-party integrations and technical consulting from TechmasterCY in Cyprus.",
  path: "/services/software-api-development",
});

export default function SoftwareApiDevelopmentPage() {
  return <ServicePillarLanding pillar={pillar} />;
}
