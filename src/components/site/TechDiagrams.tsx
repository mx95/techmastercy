/**
 * Lightweight CSS/SVG diagrams for technical communication.
 * Decorative only — paired with text for accessibility.
 */

function Frame({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figure
      className={`overflow-hidden rounded-xl border border-white/10 bg-[#0a101c] ${className}`}
      aria-label={title}
    >
      <div className="border-b border-white/10 px-4 py-2.5">
        <figcaption className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-accent-soft">
          {title}
        </figcaption>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </figure>
  );
}

function Node({ label, accent = false }: { label: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-md border px-3 py-2 text-center text-xs font-medium sm:text-sm ${
        accent
          ? "border-accent/50 bg-accent-dim/50 text-accent-soft"
          : "border-white/15 bg-background-elevated/80 text-foreground"
      }`}
    >
      {label}
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex items-center justify-center py-1 text-accent-soft" aria-hidden>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 3v11M10 14l-3.5-3.5M10 14l3.5-3.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function PaymentFlowDiagram() {
  return (
    <Frame title="Payment flow">
      <div className="mx-auto flex max-w-xs flex-col gap-1">
        <Node label="Customer checkout" />
        <Arrow />
        <Node label="Payment provider" accent />
        <Arrow />
        <Node label="Webhook / callback" />
        <Arrow />
        <Node label="Server verifies amount" accent />
        <Arrow />
        <Node label="Order marked paid" />
      </div>
    </Frame>
  );
}

export function WebhookDiagram() {
  return (
    <Frame title="Webhook handling">
      <svg viewBox="0 0 320 160" className="h-auto w-full" role="img" aria-hidden>
        <rect x="12" y="56" width="72" height="48" rx="8" fill="#111827" stroke="#22d3ee" strokeOpacity="0.5" />
        <text x="48" y="84" textAnchor="middle" fill="#67e8f9" fontSize="11" fontFamily="ui-sans-serif,system-ui">
          Provider
        </text>
        <path d="M90 80 H140" stroke="#22d3ee" strokeWidth="2" markerEnd="url(#arrow)" />
        <rect x="140" y="40" width="88" height="80" rx="8" fill="#152033" stroke="#67e8f9" strokeOpacity="0.6" />
        <text x="184" y="68" textAnchor="middle" fill="#f8fafc" fontSize="11" fontFamily="ui-sans-serif,system-ui">
          Receiver
        </text>
        <text x="184" y="88" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="ui-sans-serif,system-ui">
          verify · dedupe
        </text>
        <text x="184" y="104" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="ui-sans-serif,system-ui">
          update order
        </text>
        <path d="M234 80 H278" stroke="#22d3ee" strokeWidth="2" />
        <rect x="278" y="56" width="30" height="48" rx="6" fill="#0b1220" stroke="#22d3ee" strokeOpacity="0.45" />
        <text x="293" y="84" textAnchor="middle" fill="#67e8f9" fontSize="10" fontFamily="ui-sans-serif,system-ui">
          DB
        </text>
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 Z" fill="#22d3ee" />
          </marker>
        </defs>
      </svg>
    </Frame>
  );
}

export function ApiDiagram() {
  return (
    <Frame title="API integration">
      <div className="grid grid-cols-3 items-center gap-2 text-center">
        <Node label="Your app" />
        <div className="text-xs text-accent-soft" aria-hidden>
          REST API →
        </div>
        <Node label="Partner system" accent />
        <div className="col-span-3 mt-3 text-xs leading-relaxed text-foreground-muted">
          Clear contracts, authentication and failure paths between systems.
        </div>
      </div>
    </Frame>
  );
}

export function AutomationDiagram() {
  return (
    <Frame title="Business automation">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Node label="Trigger" />
        <span className="text-accent-soft" aria-hidden>
          →
        </span>
        <Node label="Workflow" accent />
        <span className="text-accent-soft" aria-hidden>
          →
        </span>
        <Node label="Human review" />
        <span className="text-accent-soft" aria-hidden>
          →
        </span>
        <Node label="Action" />
      </div>
    </Frame>
  );
}
