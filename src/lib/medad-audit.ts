// MedAd Compliance AI — regulatory audit engine.
// Runs a lightweight pattern-library pass over user-submitted ad copy and
// returns a structured, dynamic report used for both the on-page results
// and the downloadable PDF.

export type Severity = "Critical" | "High" | "Medium";

export interface Finding {
  phrase: string;        // exact phrase matched in the submitted text
  category: string;      // short category label (e.g. "Absolute efficacy claim")
  severity: Severity;
  regulation: string;    // specific citation
  reason: string;        // plain-language why it's risky
  rewrite: string;       // suggested compliant replacement
}

export interface ChecklistItem {
  criterion: string;
  framework: string;
  passed: boolean;
  detail: string;
}

export interface PlatformVariant {
  platform: string;
  label: string;
  content: string;
}

export interface AuditReport {
  submittedAt: Date;
  category: string;
  frameworks: string[];
  original: string;
  phrasesChecked: number;
  findings: Finding[];
  flaggedCount: number;
  compliantCount: number;
  finalCompliantCopy: string;
  variants: PlatformVariant[];
  checklist: ChecklistItem[];
}

interface Rule {
  pattern: RegExp;
  category: string;
  severity: Severity;
  regulation: string;
  reason: string;
  rewrite: string;         // literal replacement text
  label: string;           // short label for rewrite description
}

// Regulatory pattern library — encoded from FDA / EU MDR / FTC guidance.
const RULES: Rule[] = [
  {
    pattern: /\bcure[sd]?\b/gi,
    category: "Absolute efficacy claim",
    severity: "Critical",
    regulation: "FDA 21 CFR §202.1(e)(6)(i) — false or misleading efficacy claims",
    reason:
      "Words like 'cure' promise a definitive medical outcome that no prescription therapy can guarantee. FDA treats this as a false claim and issues warning letters on first offense.",
    rewrite: "clinically studied to support",
    label: "'clinically studied to support'",
  },
  {
    pattern: /\bmiracul(?:ous|ously)\b|\bmiracle\b/gi,
    category: "Unsubstantiated superlative",
    severity: "High",
    regulation: "FDA 21 CFR §202.1(e)(6)(ii) & FTC Act §5",
    reason:
      "Superlatives like 'miracle' imply results beyond what clinical data supports and are treated as deceptive advertising.",
    rewrite: "evidence-based",
    label: "'evidence-based'",
  },
  {
    pattern: /\b(100%\s+safe|completely\s+safe|totally\s+safe|perfectly\s+safe|safe)\b/gi,
    category: "Unqualified safety claim",
    severity: "Critical",
    regulation: "EU MDR Art. 7 & FDA 21 CFR §202.1(e)(6)(iii)",
    reason:
      "Every medical intervention has a risk profile. Claiming a product is 'safe' without risk disclosure violates fair-balance requirements in both FDA and EU MDR frameworks.",
    rewrite: "with a monitored safety profile",
    label: "'with a monitored safety profile'",
  },
  {
    pattern: /\bguarante(?:e|ed|es)\b/gi,
    category: "Outcome guarantee",
    severity: "Critical",
    regulation: "FDA 21 CFR §202.1(e)(6) & FTC endorsement guides",
    reason:
      "Guaranteeing a clinical outcome is prohibited in prescription and medical device advertising — clinical response varies by patient.",
    rewrite: "may support",
    label: "'may support'",
  },
  {
    pattern: /\bno\s+side\s+effects?\b/gi,
    category: "False risk disclosure",
    severity: "Critical",
    regulation: "FDA fair-balance requirement, 21 CFR §202.1(e)(5)",
    reason:
      "'No side effects' contradicts every prescribing information document. This is one of the most frequently cited violations in FDA warning letters.",
    rewrite: "with a monitored risk profile — consult the prescribing information",
    label: "reference to prescribing information",
  },
  {
    pattern: /\b(best|#\s*1|number\s+one|world'?s\s+best|leading)\b/gi,
    category: "Comparative superlative",
    severity: "High",
    regulation: "FTC Act §5 & FDA 21 CFR §202.1(e)(6)(ii)",
    reason:
      "Comparative superlatives ('best', '#1') require head-to-head clinical evidence. Without cited comparators they are treated as deceptive.",
    rewrite: "clinically differentiated",
    label: "'clinically differentiated'",
  },
  {
    pattern: /\b(revolutionary|breakthrough|game[-\s]?changing)\b/gi,
    category: "Puffery / unsupported novelty",
    severity: "Medium",
    regulation: "FDA 21 CFR §202.1(e)(6)(ii)",
    reason:
      "'Breakthrough' is an FDA-designated regulatory status. Using it in ad copy without the designation misrepresents the product's regulatory standing.",
    rewrite: "novel",
    label: "'novel'",
  },
  {
    pattern: /\bpainless\b/gi,
    category: "Unqualified experience claim",
    severity: "Medium",
    regulation: "FDA 21 CFR §202.1(e)(6)(iii)",
    reason:
      "'Painless' overstates the patient experience — individual tolerance varies and this claim is not supportable without controlled data.",
    rewrite: "designed to minimize discomfort",
    label: "'designed to minimize discomfort'",
  },
  {
    pattern: /\binstant(?:ly|aneous)?\b/gi,
    category: "Overstated onset",
    severity: "Medium",
    regulation: "FDA 21 CFR §202.1(e)(6)(iii)",
    reason:
      "Onset claims must reflect pharmacokinetic data. 'Instant' is rarely accurate and triggers regulatory review.",
    rewrite: "rapid-onset (per clinical data)",
    label: "'rapid-onset (per clinical data)'",
  },
  {
    pattern: /\bnatural(?:ly)?\b/gi,
    category: "Ambiguous 'natural' claim",
    severity: "Medium",
    regulation: "FDA guidance on 'natural' labeling & FTC Act §5",
    reason:
      "'Natural' has no accepted medical definition and can imply safety or efficacy that is not established.",
    rewrite: "plant-derived",
    label: "'plant-derived'",
  },
];

const HCP_GATING_RE = /(healthcare\s+professionals?|for\s+hcps?|prescribing\s+information|physicians?|oncologists?|clinicians?)/i;
const RISK_DISCLOSURE_RE = /(risk|side\s+effect|adverse|contraindication|consult|prescribing\s+information)/i;
const PRESCRIPTION_RE = /(prescribed|prescription|talk\s+to\s+your|consult|physician|clinician|oncologist)/i;

function tokenCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function applyRewrites(text: string, findings: Finding[]): string {
  let out = text;
  // Replace each unique phrase (case-insensitive) once per occurrence.
  const seenReplacements = new Map<string, string>();
  for (const f of findings) {
    const key = f.phrase.toLowerCase();
    if (!seenReplacements.has(key)) seenReplacements.set(key, f.rewrite);
  }
  for (const [phrase, rewrite] of seenReplacements) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(escaped, "gi"), rewrite);
  }
  return out;
}

function buildVariants(finalCopy: string, category: string): PlatformVariant[] {
  const trimmed = finalCopy.trim().replace(/\s+/g, " ");
  const first = trimmed.split(/(?<=[.!?])\s+/)[0] ?? trimmed;
  const headline = first.length > 90 ? first.slice(0, 87).trimEnd() + "..." : first;
  const shortDesc = trimmed.length > 150 ? trimmed.slice(0, 147).trimEnd() + "..." : trimmed;

  return [
    {
      platform: "Instagram",
      label: "Social Hook · Instagram",
      content: `${headline} Talk to your ${category.toLowerCase().includes("device") ? "clinician" : "physician"} about eligibility. #ForHCPs`,
    },
    {
      platform: "LinkedIn",
      label: "Professional Post · LinkedIn",
      content: `${shortDesc} Designed with ${category} specialists — request the clinical dossier. For healthcare professionals.`,
    },
    {
      platform: "Google Ads",
      label: "Google Ads · Headline + Description",
      content: `Headline: ${headline.replace(/[.!?]+$/, "")}\nDescription: ${shortDesc} For healthcare professionals.`,
    },
  ];
}

function buildChecklist(
  original: string,
  findings: Finding[],
  frameworks: string[]
): ChecklistItem[] {
  const has = (cat: string) => findings.some((f) => f.category === cat);
  const hasHcpGating = HCP_GATING_RE.test(original);
  const hasRisk = RISK_DISCLOSURE_RE.test(original);
  const hasPrescription = PRESCRIPTION_RE.test(original);
  const fdaSelected = frameworks.some((f) => /FDA/i.test(f));
  const euSelected = frameworks.some((f) => /EU|MDR/i.test(f));
  const patientFriendly = frameworks.some((f) => /Patient/i.test(f));

  const items: ChecklistItem[] = [
    {
      criterion: "No absolute efficacy claims",
      framework: "FDA 21 CFR §202.1(e)(6)",
      passed: !has("Absolute efficacy claim"),
      detail: has("Absolute efficacy claim")
        ? "Absolute claim detected — see flagged phrases."
        : "No cure/heal/eliminate-style claims detected.",
    },
    {
      criterion: "No unqualified safety claims",
      framework: euSelected ? "EU MDR Art. 7" : "FDA fair balance",
      passed: !has("Unqualified safety claim"),
      detail: has("Unqualified safety claim")
        ? "Unqualified 'safe' language detected."
        : "Safety language, if present, is qualified.",
    },
    {
      criterion: "No outcome guarantees",
      framework: "FDA 21 CFR §202.1(e)(6)",
      passed: !has("Outcome guarantee"),
      detail: has("Outcome guarantee")
        ? "'Guarantee' language detected."
        : "No guaranteed-outcome language found.",
    },
    {
      criterion: "No comparative superlatives without evidence",
      framework: "FTC Act §5 / FDA advertising",
      passed: !has("Comparative superlative"),
      detail: has("Comparative superlative")
        ? "Superlative claim requires cited comparator data."
        : "No unsupported superlatives.",
    },
    {
      criterion: "No 'no side effects' claim",
      framework: "FDA 21 CFR §202.1(e)(5)",
      passed: !has("False risk disclosure"),
      detail: has("False risk disclosure")
        ? "False risk-free language detected."
        : "Risk disclosure not contradicted.",
    },
    {
      criterion: "Risk / side-effect disclosure present",
      framework: "FDA fair balance / EU MDR Art. 7",
      passed: hasRisk,
      detail: hasRisk
        ? "Risk or prescribing-information reference detected."
        : "No risk disclosure — appended in compliant rewrite.",
    },
    {
      criterion: "HCP audience gating present",
      framework: "MDCG 2022-14",
      passed: hasHcpGating,
      detail: hasHcpGating
        ? "Professional-audience language detected."
        : "No HCP gating — 'For healthcare professionals.' appended.",
    },
    {
      criterion: "Prescription / consultation call-to-action",
      framework: "FDA DTC advertising guidance",
      passed: hasPrescription,
      detail: hasPrescription
        ? "Consultation / prescription language present."
        : "No consultation CTA — added to compliant copy.",
    },
  ];

  if (fdaSelected) {
    items.push({
      criterion: "FDA fair-balance between benefit and risk",
      framework: "FDA 21 CFR §202.1(e)",
      passed: hasRisk && !has("Unqualified safety claim") && !has("False risk disclosure"),
      detail:
        hasRisk && !has("Unqualified safety claim") && !has("False risk disclosure")
          ? "Benefit statements balanced with risk information."
          : "Benefit statements outweigh risk information — rebalance required.",
    });
  }
  if (euSelected) {
    items.push({
      criterion: "EU MDR Art. 7 — no misleading claims",
      framework: "Regulation (EU) 2017/745, Art. 7",
      passed:
        !has("Unqualified safety claim") &&
        !has("Absolute efficacy claim") &&
        !has("Puffery / unsupported novelty"),
      detail:
        "Reviewed for text/images that could mislead the user on intended purpose, safety or performance.",
    });
  }
  if (patientFriendly) {
    const wc = tokenCount(original);
    const avgSentence =
      wc / Math.max(1, (original.match(/[.!?]+/g) || []).length);
    const readable = avgSentence < 22;
    items.push({
      criterion: "Patient-friendly plain-language readability",
      framework: "CDC Clear Communication Index",
      passed: readable,
      detail: readable
        ? `Avg. sentence length ${avgSentence.toFixed(1)} words — within readable range.`
        : `Avg. sentence length ${avgSentence.toFixed(1)} words — shorten sentences for lay audiences.`,
    });
  }

  return items;
}

export function runAudit(input: {
  description: string;
  category: string;
  frameworks: string[];
}): AuditReport {
  const original = input.description.trim();
  const findings: Finding[] = [];

  for (const rule of RULES) {
    const matches = original.match(rule.pattern);
    if (!matches) continue;
    // De-duplicate identical phrases per rule.
    const unique = Array.from(new Set(matches.map((m) => m.trim())));
    for (const phrase of unique) {
      findings.push({
        phrase,
        category: rule.category,
        severity: rule.severity,
        regulation: rule.regulation,
        reason: rule.reason,
        rewrite: rule.label,
      });
    }
  }

  // Apply phrase-level rewrites to build the compliant copy.
  const phraseRewrites: Finding[] = findings.map((f) => {
    const rule = RULES.find((r) => r.category === f.category)!;
    return { ...f, rewrite: rule.rewrite };
  });
  let finalCopy = applyRewrites(original, phraseRewrites);

  // Append gating & risk disclosure if missing.
  if (!HCP_GATING_RE.test(finalCopy)) {
    finalCopy = finalCopy.replace(/\s*$/, "") + " For healthcare professionals.";
  }
  if (!RISK_DISCLOSURE_RE.test(finalCopy)) {
    finalCopy =
      finalCopy.replace(/\s*$/, "") +
      " Consult the prescribing information for the full risk-benefit profile.";
  }

  const phrasesChecked = RULES.length + 3; // rules + gating + risk + readability
  const checklist = buildChecklist(original, findings, input.frameworks);
  const variants = buildVariants(finalCopy, input.category);

  return {
    submittedAt: new Date(),
    category: input.category,
    frameworks: input.frameworks,
    original: original || "(No description was provided in the console.)",
    phrasesChecked,
    findings,
    flaggedCount: findings.length,
    compliantCount: checklist.filter((c) => c.passed).length,
    finalCompliantCopy: finalCopy.trim(),
    variants,
    checklist,
  };
}

export function severityColor(sev: Severity): [number, number, number] {
  switch (sev) {
    case "Critical":
      return [153, 27, 27];
    case "High":
      return [180, 83, 9];
    case "Medium":
      return [161, 98, 7];
  }
}
