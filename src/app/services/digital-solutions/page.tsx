import { ServicePillarLanding } from "@/components/services/ServicePillarLanding";
import { getServicePillar } from "@/content/service-pillars";
import { createMetadata } from "@/lib/seo";

const pillar = getServicePillar("digital-solutions")!;

export const metadata = createMetadata({
  title: "Digital Solutions & Smart Technology",
  description:
    "Website and e-commerce support, scoped technical maintenance, and smart technology consulting from TechmasterCY.",
  path: "/services/digital-solutions",
});

export default function DigitalSolutionsPage() {
  return <ServicePillarLanding pillar={pillar} />;
}
