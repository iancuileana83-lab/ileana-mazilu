import { useEffect, useState } from "react";

interface TourStep {
  targetId: string;
  title: string;
  description: string;
}

const STEPS: TourStep[] = [
  {
    targetId: "tour-cer-generator",
    title: "Generate CER/PMCF documents",
    description: "Tap here to generate a draft CER or PMCF document in seconds, based on the information you enter.",
  },
  {
    targetId: "tour-pricing-lite",
    title: "Lite plan",
    description: "Includes 15 ad generations per month, a single variation, no PDF reports and no CER/PMCF generator.",
  },
  {
    targetId: "tour-pricing-pro",
    title: "Pro plan",
    description: "Unlocks the full CER/PMCF generator, PDF reports and multiple variations — ideal for regular professional use.",
  },
];

const STORAGE_KEY = "medad_onboarding_seen";

export default function OnboardingTour() {
  const [stepIndex, setStepIndex] = useState<number>(-1);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setStepIndex(0);
    }
  }, []);

  useEffect(() => {
    if (stepIndex < 0 || stepIndex >= STEPS.length) return;
    const el = document.getElementById(STEPS[stepIndex].targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setRect(el.getBoundingClientRect());
    }
  }, [stepIndex]);

  if (stepIndex < 0 || stepIndex >= STEPS.length) return null;

  const step = STEPS[stepIndex];

  const finish = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setStepIndex(-1);
  };

  const next = () => {
    if (stepIndex + 1 >= STEPS.length) {
      finish();
    } else {
      setStepIndex(stepIndex + 1);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", pointerEvents: "auto" }} onClick={finish} />
      {rect && (
        <div
          style={{
            position: "absolute",
            top: Math.max(rect.top - 8, 8),
            left: Math.max(rect.left - 8, 8),
            width: rect.width + 16,
            height: rect.height + 16,
            border: "3px solid #2563eb",
            borderRadius: 8,
            boxShadow: "0 0 0 4000px rgba(0,0,0,0.5)",
            pointerEvents: "none",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 16,
          right: 16,
          background: "white",
          borderRadius: 12,
          padding: 20,
          pointerEvents: "auto",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: "#111" }}>{step.title}</h3>
        <p style={{ margin: "0 0 16px", fontSize: 14, color: "#444" }}>{step.description}</p>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={finish} style={{ background: "none", border: "none", color: "#888", fontSize: 14 }}>
            Skip
          </button>
          <button
            onClick={next}
            style={{ background: "#2563eb", color: "white", border: "none", borderRadius: 6, padding: "8px 16px", fontSize: 14, fontWeight: 600 }}
          >
            {stepIndex + 1 >= STEPS.length ? "Got it" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
