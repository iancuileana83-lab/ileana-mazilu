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
      bio: "Senior Clinical Evaluation Medical Writer and Pharmacy Technician with 20+ years of pharmaceutical experience and 3 years specializing in medical writing and regulatory documentation (CER, PMCF, PSUR), aligned with EU MDR 2017/745, MEDDEV 2.7/1 Rev. 4, and MDCG 2020 guidelines.",
      website: "https://ileana-mazilu.lovable.app",
    };
    return {
      content: [{ type: "text", text: JSON.stringify(profile, null, 2) }],
      structuredContent: profile,
    };
  },
});
