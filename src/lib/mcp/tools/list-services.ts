import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "list_services",
  title: "List consulting services",
  description:
    "List the medical writing and regulatory consulting services Ileana Mazilu offers, including CERs, literature search protocols, and AI-assisted compliance review.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const services = [
      {
        id: "clinical-evaluation-reports",
        name: "Clinical Evaluation Reports (CERs)",
        description:
          "MDR-compliant Class II/III CERs, including data appraisal, benefit-risk analysis, and post-market surveillance integration.",
      },
      {
        id: "literature-search-protocols",
        name: "Literature Search Protocols",
        description:
          "PubMed / Embase search strings and inclusion/exclusion criteria aligned with MDCG 2020-13 guidelines.",
      },
      {
        id: "regulatory-submissions",
        name: "Regulatory Submissions",
        description:
          "Technical documentation and dossier authoring for EU MDR, FDA, and EUDAMED submissions across 12+ therapeutic areas.",
      },
      {
        id: "medad-compliance-ai",
        name: "MedAd Compliance AI",
        description:
          "AI-powered medical advertising compliance auditing with pharmacist-verified guardrails for FDA and EU MDR frameworks.",
      },
    ];
    return {
      content: [{ type: "text", text: JSON.stringify(services, null, 2) }],
      structuredContent: { services },
    };
  },
});
