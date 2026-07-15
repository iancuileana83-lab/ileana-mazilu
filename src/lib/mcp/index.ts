import { defineMcp } from "@lovable.dev/mcp-js";
import getProfessionalProfile from "./tools/get-professional-profile";
import listServices from "./tools/list-services";
import listTherapeuticAreas from "./tools/list-therapeutic-areas";
import requestConsultation from "./tools/request-consultation";

export default defineMcp({
  name: "ileana-mazilu-portfolio-mcp",
  title: "Ileana Mazilu Portfolio MCP",
  version: "0.1.0",
  instructions:
    "Public MCP server exposing Ileana Mazilu's Senior Medical Writing portfolio: professional profile, consulting services, therapeutic-area coverage, and a helper to draft consultation requests. All data is public portfolio information.",
  tools: [getProfessionalProfile, listServices, listTherapeuticAreas, requestConsultation],
});
