import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_professional_profile",
  title: "Get professional profile",
  description:
    "Return Ileana Mazilu's professional profile: name, headline, contact info, LinkedIn, availability, and a short bio for Senior Medical Writing / regulatory work.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const profile = {
      name: "Ileana Mazilu",
      headline: "Senior Medical Writer & Regulatory Consultant",
      email: "maziluileana88@gmail.com",
      phone: "+40 766 687 508",
      linkedin: "https://www.linkedin.com/in/ileana-mazilu-aa211181",
      availability: "Available for Senior Medical Writing Consultations",
      bio: "Senior Medical Writer with 80+ regulatory submissions across 12+ therapeutic areas, specializing in Class III Clinical Evaluation Reports (CERs), MDCG 2020-aligned literature search protocols, benefit-risk analysis, and AI-assisted regulatory workflows.",
      website: "https://ileana-mazilu.lovable.app",
    };
    return {
      content: [{ type: "text", text: JSON.stringify(profile, null, 2) }],
      structuredContent: profile,
    };
  },
});
