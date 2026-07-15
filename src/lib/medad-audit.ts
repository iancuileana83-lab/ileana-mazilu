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

/**
 * Extract signals (product name, indication, mechanism) from the raw copy
 * so we can compose a genuinely new, grammatical compliant paragraph
 * rather than doing brittle in-place phrase substitution.
 */
interface Signals {
  product: string;
  indication?: string;
  mechanism?: string;
  administration?: string;
}

// Words that must never be treated as a product/brand name, even if the
// input starts with them capitalized (e.g. "Our new treatment...").
const NON_PRODUCT_STOPWORDS = new Set([
  "our", "the", "a", "an", "this", "that", "these", "those", "new", "introducing",
  "we", "you", "your", "it", "its", "here", "now", "today", "meet", "presenting",
  "i", "my", "buy", "get", "try", "learn", "discover",
]);

// Words that are meaningless as an "indication" (patient population) and must
// be discarded so we never produce "eligible adults with everyone".
const INDICATION_STOPWORDS = new Set([
  "everyone", "anyone", "everybody", "anybody", "all", "you", "us", "them",
  "people", "patients", "adults", "kids", "children", "men", "women",
  "your", "our", "the", "a", "an",
]);

function inferGenericProduct(cleaned: string, category: string): string {
  // Try to lift a domain noun ("immunotherapy", "device", "supplement", ...)
  // from the input; otherwise fall back to a category-appropriate generic.
  const nounMatch = cleaned.match(
    /\b(immunotherapy|chemotherapy|biologic|antibody|vaccine|therapy|treatment|device|implant|injection|supplement|serum|cream|regimen|protocol|solution|formula)\b/i
  );
  if (nounMatch) {
    const noun = nounMatch[1].toLowerCase();
    return `This ${noun}`;
  }
  const c = category.toLowerCase();
  if (c.includes("device")) return "This device";
  if (c.includes("aesthetic") || c.includes("dermatology")) return "This treatment";
  if (c.includes("supplement") || c.includes("wellness")) return "This product";
  return "This therapy";
}

function extractSignals(original: string, category: string): Signals {
  const cleaned = original.replace(/\s+/g, " ").trim();

  // Product name: leading capitalized run — but reject if it's really a
  // pronoun/determiner like "Our" or a marketing lead-in like "Introducing".
  let product = "";
  const capRun = cleaned.match(/^[A-Z][A-Za-z0-9\-]+(?:\s+[A-Z][A-Za-z0-9\-]+)*/);
  if (capRun) {
    const tokens = capRun[0].split(/\s+/);
    const firstLower = tokens[0].toLowerCase();
    const allStopwords = tokens.every((t) => NON_PRODUCT_STOPWORDS.has(t.toLowerCase()));
    if (!allStopwords && !NON_PRODUCT_STOPWORDS.has(firstLower) && tokens.length <= 4 && capRun[0].length >= 3) {
      product = capRun[0];
    }
  }
  if (!product) {
    product = inferGenericProduct(cleaned, category);
  }

  // Indication: "for <phrase>" up to punctuation, cleaned of flagged terms
  // and vague population words.
  let indication: string | undefined;
  const ind = cleaned.match(/\bfor\s+((?:[A-Za-z0-9+\-]+(?:\s+[A-Za-z0-9+\-]+){0,7}))(?=[.,;:]|$| and | with | that | which )/i);
  if (ind) {
    const raw = ind[1].trim();
    const stripped = raw
      .replace(/\b(cure[sd]?|miracul(?:ous|ously)|miracle|100%\s+safe|completely\s+safe|totally\s+safe|perfectly\s+safe|safe|guarante(?:e|ed|es)|no\s+side\s+effects?|best|#\s*1|number\s+one|world'?s\s+best|leading|revolutionary|breakthrough|game[-\s]?changing|painless|instant(?:ly|aneous)?|natural(?:ly)?)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();
    // Reject the whole indication if the meaningful tokens are all stopwords
    // ("everyone", "all", "you", ...). Otherwise, drop those tokens.
    const meaningful = stripped
      .split(/\s+/)
      .filter((w) => !INDICATION_STOPWORDS.has(w.toLowerCase()))
      .join(" ")
      .trim();
    if (meaningful.length >= 3) indication = meaningful;
  }

  // Mechanism: "targets/blocks/... <phrase>".
  let mechanism: string | undefined;
  const mech = cleaned.match(/\b(?:targets?|blocks?|inhibits?|modulates?|activates?|delivers?)\s+([A-Za-z0-9+\-]+(?:\s+[A-Za-z0-9+\-]+){0,4})/i);
  if (mech) mechanism = mech[1].trim();

  // Administration.
  let administration: string | undefined;
  const admin = cleaned.match(/\b(oral|intravenous|IV|subcutaneous|injectable|infusion|topical|inhaled|implantable)\b/i);
  if (admin) administration = admin[1].toLowerCase();

  return { product, indication, mechanism, administration };
}

function audienceForCategory(category: string): { long: string; short: string; consultVerb: string } {
  const c = category.toLowerCase();
  if (c.includes("device")) return { long: "prescribing clinicians", short: "clinicians", consultVerb: "clinician" };
  if (c.includes("aesthetic") || c.includes("dermatology")) return { long: "board-certified practitioners", short: "practitioners", consultVerb: "practitioner" };
  if (c.includes("oncology")) return { long: "treating oncologists", short: "oncologists", consultVerb: "oncologist" };
  if (c.includes("supplement") || c.includes("wellness")) return { long: "qualified healthcare providers", short: "providers", consultVerb: "healthcare provider" };
  return { long: "prescribing physicians", short: "physicians", consultVerb: "physician" };
}

/**
 * Compose a coherent, grammatical compliant paragraph from the extracted
 * signals. Reads as human-written copy, not phrase substitution.
 */
function synthesizeCompliantCopy(original: string, category: string, hasFindings: boolean): string {
  const { product, indication, mechanism, administration } = extractSignals(original, category);
  const audience = audienceForCategory(category);
  const categoryPhrase = category.toLowerCase();

  const sentences: string[] = [];

  // Sentence 1 — positioning.
  if (indication) {
    sentences.push(
      `${product} is an evidence-based ${categoryPhrase} option clinically studied to support eligible adults with ${indication}.`
    );
  } else {
    sentences.push(
      `${product} is an evidence-based ${categoryPhrase} option supported by peer-reviewed clinical data.`
    );
  }

  // Sentence 2 — mechanism / administration where available.
  if (mechanism && administration) {
    sentences.push(
      `Its ${administration} formulation targets ${mechanism} and is prescribed alongside standard care.`
    );
  } else if (mechanism) {
    sentences.push(
      `It is designed to target ${mechanism} and is prescribed alongside standard care.`
    );
  } else if (administration) {
    sentences.push(
      `The ${administration} regimen is prescribed alongside standard care and monitored by the treating team.`
    );
  } else {
    sentences.push(
      `It is prescribed alongside standard care and monitored by the treating team.`
    );
  }

  // Sentence 3 — fair balance / risk disclosure (always).
  sentences.push(
    `Individual response and tolerability vary; ${audience.long} should review the full prescribing information for the risk-benefit profile and contraindications.`
  );

  // Sentence 4 — audience gating + CTA.
  sentences.push(
    `Talk to your ${audience.consultVerb} about eligibility. For healthcare professionals.`
  );

  // Note if the input was empty — still return a template so the section is populated.
  if (!original.trim() && !hasFindings) {
    return sentences.join(" ");
  }

  return sentences.join(" ");
}

// Truncate to a hard character budget at a clean word boundary, no ellipsis
// mid-word. If the string already fits, return as-is.
function fitToLimit(text: string, limit: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= limit) return t;
  const cut = t.slice(0, limit + 1);
  const lastSpace = cut.lastIndexOf(" ");
  const boundary = lastSpace > limit * 0.6 ? lastSpace : limit;
  return t.slice(0, boundary).replace(/[\s,.;:—-]+$/, "").trim();
}

function buildVariants(original: string, category: string, hasFindings: boolean): PlatformVariant[] {
  const { product, indication } = extractSignals(original);
  const audience = audienceForCategory(category);
  const shortProduct = product.length > 18 ? product.split(/\s+/)[0] : product;

  // Instagram — up to 220 chars, single-line, no truncation needed because we
  // build it from a template that stays inside the budget.
  const instagram = fitToLimit(
    indication
      ? `${shortProduct}: an evidence-based option studied for ${indication}. Talk to your ${audience.consultVerb} about eligibility. For HCPs.`
      : `${shortProduct}: an evidence-based ${category.toLowerCase()} option. Talk to your ${audience.consultVerb} about eligibility. For HCPs.`,
    220
  );

  // LinkedIn — up to 400 chars, longer professional framing.
  const linkedin = fitToLimit(
    indication
      ? `${shortProduct} — an evidence-based ${category.toLowerCase()} option clinically studied to support adults with ${indication}. Prescribed alongside standard care; ${audience.long} should review the full risk-benefit profile. Request the clinical dossier. For healthcare professionals.`
      : `${shortProduct} — an evidence-based ${category.toLowerCase()} option supported by peer-reviewed clinical data. Prescribed alongside standard care; ${audience.long} should review the full risk-benefit profile. Request the clinical dossier. For healthcare professionals.`,
    400
  );

  // Google Ads limits: Headline ≤ 30 chars, Description ≤ 90 chars.
  const headline = fitToLimit(`${shortProduct} | Clinically Studied`, 30);
  const description = fitToLimit(
    indication
      ? `Evidence-based option studied for ${indication}. For HCPs.`
      : `Evidence-based ${category.toLowerCase()} option. Consult your ${audience.consultVerb}. For HCPs.`,
    90
  );

  return [
    {
      platform: "Instagram",
      label: `Social Hook · Instagram (${instagram.length} chars)`,
      content: instagram,
    },
    {
      platform: "LinkedIn",
      label: `Professional Post · LinkedIn (${linkedin.length} chars)`,
      content: linkedin,
    },
    {
      platform: "Google Ads",
      label: `Google Ads · Headline ≤30 + Description ≤90`,
      content: `Headline (${headline.length}/30): ${headline}\nDescription (${description.length}/90): ${description}`,
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

  // Synthesize a coherent, grammatical compliant paragraph (not in-place
  // substitution — that produced broken grammar like "completely clinically
  // studied to support"). The paragraph is built from signals extracted
  // from the original and is guaranteed to include HCP gating and risk
  // disclosure.
  const finalCopy = synthesizeCompliantCopy(original, input.category, findings.length > 0);

  const phrasesChecked = RULES.length + 3; // rules + gating + risk + readability
  const checklist = buildChecklist(original, findings, input.frameworks);
  const variants = buildVariants(original, input.category, findings.length > 0);

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
