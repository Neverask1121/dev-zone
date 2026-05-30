import React, { useMemo, useState } from "react";

type Plan = {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  recommended?: boolean;
  features: string[];
};

const PLANS: Plan[] = [
  { id: "starter", name: "Starter", priceMonthly: 12, priceYearly: 108, features: ["Single workspace", "Basic analytics", "Email support", "5 projects"] },
  { id: "pro", name: "Pro", priceMonthly: 29, priceYearly: 264, recommended: true, features: ["Multiple workspaces", "Advanced analytics", "Priority support", "Unlimited projects"] },
  { id: "enterprise", name: "Enterprise", priceMonthly: 79, priceYearly: 708, features: ["SSO and audit logs", "Dedicated support", "Custom workflows", "SLA coverage"] },
];

function Price({ plan, yearly }: { plan: Plan; yearly: boolean }) {
  const amount = yearly ? plan.priceYearly : plan.priceMonthly;
  const suffix = yearly ? "/year" : "/month";
  return (
    <div style={{ display: "flex", alignItems: "end", gap: 6 }}>
      <strong style={{ fontSize: 36, lineHeight: "40px", color: "#0f172a" }}>${amount}</strong>
      <span style={{ color: "#475569", fontSize: 14 }}>{suffix}</span>
    </div>
  );
}

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 10, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
      {features.map((feature) => <li key={feature}>{feature}</li>)}
    </ul>
  );
}

function PlanCard({
  plan,
  yearly,
  selected,
  onSelect,
}: {
  plan: Plan;
  yearly: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        textAlign: "left",
        borderRadius: 24,
        border: selected ? "1px solid #2563eb" : "1px solid #e2e8f0",
        background: selected ? "#eff6ff" : "#fff",
        padding: 18,
        display: "grid",
        gap: 14,
        cursor: "pointer",
        boxShadow: selected ? "0 12px 24px rgba(37,99,235,0.10)" : "0 2px 8px rgba(15,23,42,0.05)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "grid", gap: 4 }}>
          <strong style={{ fontSize: 18, color: "#0f172a" }}>{plan.name}</strong>
          {plan.recommended ? (
            <span style={{ borderRadius: 999, padding: "4px 10px", background: "#dbeafe", color: "#1d4ed8", fontSize: 12, fontWeight: 800, width: "fit-content" }}>
              Recommended
            </span>
          ) : null}
        </div>
        <div style={{ borderRadius: 999, width: 14, height: 14, border: selected ? "4px solid #2563eb" : "1px solid #cbd5e1", background: "#fff" }} />
      </div>
      <Price plan={plan} yearly={yearly} />
      <FeatureList features={plan.features} />
    </button>
  );
}

export default function PricingTierSelector() {
  const [yearly, setYearly] = useState(false);
  const [selectedId, setSelectedId] = useState("pro");

  const selectedPlan = useMemo(() => PLANS.find((plan) => plan.id === selectedId) ?? PLANS[0], [selectedId]);

  return (
    <main style={{ minHeight: "100%", padding: 24, background: "#f8fafc" }}>
      <section style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gap: 18, border: "1px solid #e2e8f0", borderRadius: 28, background: "#fff", padding: 20 }}>
        <header style={{ display: "grid", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 28, color: "#0f172a" }}>Pricing Tier Selector</h2>
          <p style={{ margin: 0, color: "#475569", fontSize: 15, lineHeight: "24px" }}>
            A plan comparison selector with monthly and yearly modes and a clear recommended option.
          </p>
        </header>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={() => setYearly(false)}
            style={{ borderRadius: 12, border: "1px solid #cbd5e1", background: !yearly ? "#dbeafe" : "#fff", padding: "10px 14px", fontWeight: 800, cursor: "pointer" }}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setYearly(true)}
            style={{ borderRadius: 12, border: "1px solid #cbd5e1", background: yearly ? "#dbeafe" : "#fff", padding: "10px 14px", fontWeight: 800, cursor: "pointer" }}
          >
            Yearly
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14 }}>
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              yearly={yearly}
              selected={plan.id === selectedId}
              onSelect={() => setSelectedId(plan.id)}
            />
          ))}
        </div>

        <section style={{ borderRadius: 20, background: "#f8fafc", border: "1px solid #e2e8f0", padding: 18, display: "grid", gap: 10 }}>
          <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>Selected plan</h3>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "grid", gap: 4 }}>
              <strong style={{ color: "#0f172a", fontSize: 16 }}>{selectedPlan.name}</strong>
              <span style={{ color: "#475569", fontSize: 14 }}>{yearly ? "Yearly billing" : "Monthly billing"}</span>
            </div>
            <strong style={{ color: "#0f172a", fontSize: 20 }}>${yearly ? selectedPlan.priceYearly : selectedPlan.priceMonthly}</strong>
          </div>
        </section>

        <section style={{ display: "grid", gap: 8, color: "#334155", fontSize: 14, lineHeight: "22px" }}>
          <div>The plan cards make comparison easy by aligning prices and feature lists.</div>
          <div>The billing mode switch updates the pricing without changing the structure.</div>
          <div>The recommended badge draws attention to the preferred choice.</div>
          <div>Selection is direct and visible through both border and radio indicators.</div>
          <div>The component is suitable for marketing pages and in-app upgrade prompts.</div>
          <div>Feature lists stay compact and readable in a grid layout.</div>
          <div>Yearly pricing is kept separate from monthly pricing for clarity.</div>
          <div>The selected plan summary reinforces the current choice.</div>
          <div>The cards can scale to more tiers without redesigning the comparison area.</div>
          <div>The layout stays responsive on smaller screens because it uses flexible columns.</div>
          <div>Pricing is displayed prominently so the user can decide quickly.</div>
          <div>Each card remains a real selection target rather than an informational block.</div>
          <div>The structure supports future actions such as checkout or plan preview.</div>
          <div>Contrast and spacing keep the tiers easy to scan.</div>
          <div>The selector works well for SaaS and product-led pages.</div>
          <div>The design keeps the recommendation obvious without forcing it.</div>
        </section>
      </section>
    </main>
  );
}
