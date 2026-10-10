import { supportPackages } from "@/content/support-packages";

export const aiAutomationLanding = {
  slug: "ai-automation",
  title: "AI, Automation & Technical Consulting",
  shortTitle: "AI & Automation",
  summary:
    "Practical AI adoption, business process automation and remote technical support—focused on real workflows, not generic prompts.",
  problems: [
    "Teams try consumer AI tools but cannot connect them safely to existing systems.",
    "Repetitive admin work still depends on copy-paste between websites, CRMs and spreadsheets.",
    "Integration and payment issues stall without an in-house specialist for every incident.",
    "Automation is launched without testing, logging or human oversight for consequential actions.",
  ],
  useCases: [
    "AI-assisted document processing and information extraction from approved sources",
    "Customer-support workflows that draft replies for human review",
    "Internal knowledge assistants limited to approved business documents",
    "Order, invoice and appointment notifications across systems",
    "Data import/export jobs and recurring operational reports",
    "Routing inbound enquiries to the right person or queue",
    "Website, API, webhook and payment-gateway troubleshooting",
  ],
  process: [
    {
      title: "Define the business problem",
      body: "Start with the outcome you need, the systems involved and what must remain under human control.",
    },
    {
      title: "Assess fit and risk",
      body: "Choose suitable tools or models only where they help. Some workflows are better automated without generative AI.",
    },
    {
      title: "Implement and test",
      body: "Build against an agreed scope, add logging where useful, and test before the workflow is relied on in production.",
    },
    {
      title: "Handover and optional support",
      body: "Document how it works, what to monitor and when to escalate. Ongoing support is available through scoped plans.",
    },
  ],
  oversight: [
    "Customer data and business documents are not sent to third-party AI services without appropriate authorization.",
    "AI integrations are opt-in and configured for each project.",
    "Consequential actions should keep a human approval step where appropriate.",
    "AI output can be wrong—evaluation, logging and access control matter more than demos.",
    "No claim of regulatory certification or guaranteed model accuracy is made.",
  ],
  packages: supportPackages,
  faqs: [
    {
      q: "Will AI replace my team?",
      a: "No. The goal is to remove repetitive work and assist people—not to promise that automation can replace all human review.",
    },
    {
      q: "Do you sell prompt packs?",
      a: "No. Work focuses on assessing workflows, integrating tools into your systems and documenting how to operate them.",
    },
    {
      q: "Is support available 24/7?",
      a: "No. Technical support is offered with clear scope, business-hour availability and response-time expectations agreed in writing. Immediate responses are not promised.",
    },
    {
      q: "Are third-party API costs included?",
      a: "Usually not. Model usage, hosting and software licences are typically billed by the provider and called out separately in the proposal.",
    },
    {
      q: "Are the package prices fixed?",
      a: "The listed figures are proposed starting points and may change. Each engagement confirms inclusions, exclusions and final pricing before work begins.",
    },
  ],
} as const;
