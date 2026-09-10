import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, ShieldCheck, FileText } from "lucide-react";

const projects = [
  {
    title: "MedAd Compliance AI",
    status: "Live prototype",
    icon: ShieldCheck,
    description:
      "A no-code prototype that reviews promotional health copy against EU MDR advertising principles and drafts compliant rewrites. All output is an AI-generated draft requiring human regulatory review.",
    to: "/medad-ai",
    cta: "Open the tool",
    tags: ["Lovable", "Gemini API", "EU MDR self-study"],
  },
  {
    title: "CER / PMCF Draft Generator",
    status: "Prototype module",
    icon: FileText,
    description:
      "A structured document scaffolding experiment that produces section-by-section Clinical Evaluation Report and PMCF outlines for review by a qualified evaluator.",
    to: "/medad-ai",
    cta: "See it in MedAd AI",
    tags: ["Structured drafting", "MEDDEV 2.7/1 Rev. 4 concepts"],
  },
];

export default function AIProjects() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="report-header">
        <p className="report-label">Section 5.0</p>
        <h1 className="report-title font-display text-3xl">AI Projects</h1>
      </div>

      <div className="report-section space-y-3">
        <p className="text-sm font-body text-foreground/85 leading-relaxed max-w-3xl">
          Self-directed experiments built with no-code tools to explore how AI can support medical and regulatory
          writing workflows. These are learning prototypes, not validated regulatory software.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p) => (
          <Card key={p.title} className="border-primary/10 hover:border-primary/30 transition-colors">
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <p.icon className="w-5 h-5 text-primary" />
                </div>
                <Badge variant="secondary" className="clinical-badge">{p.status}</Badge>
              </div>
              <h2 className="font-display text-lg font-semibold text-foreground">{p.title}</h2>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">{p.description}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {p.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="clinical-badge">{t}</Badge>
                ))}
              </div>
              <Link to={p.to}>
                <Button variant="outline" size="sm" className="w-full gap-2 font-body mt-2">
                  <Sparkles className="w-4 h-4" />
                  {p.cta}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
