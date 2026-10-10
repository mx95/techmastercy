/**
 * Configurable introductory packages for AI & technical support.
 * Prices are proposals — not validated market rates.
 */
export type SupportPackage = {
  id: string;
  name: string;
  priceLabel: string;
  priceEur: number;
  priceSuffix?: string;
  summary: string;
  included: string[];
  excluded: string[];
  notes: string[];
};

export const supportPackages: SupportPackage[] = [
  {
    id: "ai-discovery",
    name: "AI Discovery",
    priceLabel: "€149",
    priceEur: 149,
    summary:
      "A short, practical consultation to identify where AI or automation can help one real workflow—without selling generic prompt packs.",
    included: [
      "Initial consultation (remote)",
      "Review of one business workflow",
      "Identification of suitable AI or automation opportunities",
      "Written recommendations and suggested next steps",
    ],
    excluded: [
      "Implementation or coding work",
      "Unlimited follow-up support",
      "Third-party AI API usage charges",
      "Licences for third-party software",
    ],
    notes: [
      "Proposed introductory price — confirm in your quote.",
      "Recommendations may conclude that AI is not the right fit yet.",
    ],
  },
  {
    id: "ai-implementation",
    name: "AI Implementation",
    priceLabel: "from €399",
    priceEur: 399,
    summary:
      "Implementation of one clearly defined AI or automation workflow, tested and handed over with documentation.",
    included: [
      "Implementation of one agreed workflow",
      "Integration with an agreed system where feasible",
      "Basic testing against agreed scenarios",
      "Handover documentation for your team",
    ],
    excluded: [
      "Unlimited scope changes",
      "Ongoing monthly support (available separately)",
      "Third-party API or model usage fees",
      "Guarantees of model accuracy for every input",
    ],
    notes: [
      "Final price depends on systems involved and access available.",
      "Human approval steps are recommended for consequential actions.",
    ],
  },
  {
    id: "technical-support",
    name: "Technical Support",
    priceLabel: "€99/month",
    priceEur: 99,
    priceSuffix: "/month",
    summary:
      "A limited monthly allowance of remote technical assistance for agreed integration, automation or website issues.",
    included: [
      "Limited allowance of remote technical assistance (hours defined in the proposal)",
      "Investigation of agreed integration or automation issues",
      "Monthly summary of work completed",
      "Clear quotes for work beyond the allowance",
    ],
    excluded: [
      "Unlimited support or on-demand 24/7 coverage",
      "Immediate response guarantees",
      "Work outside business hours unless separately agreed",
      "Third-party hosting, API or software charges",
    ],
    notes: [
      "Business-hour availability is confirmed in the proposal.",
      "This is not an unlimited support retainer.",
    ],
  },
];

export function getSupportPackage(id: string): SupportPackage | undefined {
  return supportPackages.find((p) => p.id === id);
}
