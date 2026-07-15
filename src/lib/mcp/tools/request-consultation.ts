import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "request_consultation",
  title: "Request a consultation",
  description:
    "Generate a pre-filled mailto link the caller can use to reach Ileana Mazilu about a specific medical writing or regulatory consulting need.",
  inputSchema: {
    topic: z
      .string()
      .min(3)
      .max(200)
      .describe("Short topic or subject line for the consultation request."),
    details: z
      .string()
      .max(2000)
      .optional()
      .describe("Optional additional context (project type, timeline, therapeutic area)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ topic, details }) => {
    const email = "maziluileana88@gmail.com";
    const subject = encodeURIComponent(`Consultation request: ${topic}`);
    const body = encodeURIComponent(
      details ?? "Hello Ileana,\n\nI would like to discuss a potential consultation.\n\nThank you.",
    );
    const mailto = `mailto:${email}?subject=${subject}&body=${body}`;
    return {
      content: [
        {
          type: "text",
          text: `To request a consultation, email ${email} or open:\n${mailto}`,
        },
      ],
      structuredContent: { email, mailto, topic },
    };
  },
});
