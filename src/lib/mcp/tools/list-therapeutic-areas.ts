import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "list_therapeutic_areas",
  title: "List therapeutic areas",
  description:
    "List the 12+ therapeutic areas Ileana Mazilu has covered across 80+ regulatory submissions.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const areas = [
      "Oncology",
      "Cardiovascular",
      "Neurology",
      "Orthopedics",
      "Gynecology",
      "Ophthalmology",
      "AI-Diagnostics",
      "Endocrinology",
      "Dermatology",
      "Respiratory",
      "Gastroenterology",
      "Urology",
    ];
    return {
      content: [
        {
          type: "text",
          text: `Therapeutic areas covered (${areas.length}):\n- ${areas.join("\n- ")}`,
        },
      ],
      structuredContent: { areas, count: areas.length },
    };
  },
});
