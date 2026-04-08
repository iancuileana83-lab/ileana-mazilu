import { FileText, BarChart3, ShieldCheck, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Service {
  icon: typeof FileText;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  timeline: string;
  standards: string[];
}

const services: Service[] = [
  {
    icon: FileText,
    title: "Clinical Evaluation Reports (CER)",
    subtitle: "EU MDR 2017/745 Compliant",
    description: "Comprehensive clinical evaluation reports authored in full compliance with MEDDEV 2.7/1 Rev. 4, supporting CE marking submissions for Class I–III medical devices. Each report includes systematic literature reviews, clinical data appraisal, and benefit-risk determinations.",
    deliverables: ["Full CER document with annexes", "Systematic Literature Review protocol & report", "Clinical data appraisal tables", "State-of-the-art summary", "Benefit-risk analysis"],
    timeline: "6–12 weeks",
    standards: ["MEDDEV 2.7/1 Rev. 4", "EU MDR 2017/745", "ISO 14971"],
  },
  {
    icon: BarChart3,
    title: "Post-Market Clinical Follow-up (PMCF)",
    subtitle: "Ongoing Safety & Performance Monitoring",
    description: "Design and authoring of PMCF plans and evaluation reports to demonstrate continued safety and performance of marketed medical devices. Includes PMCF survey design, registry analysis, and proactive post-market surveillance strategies.",
    deliverables: ["PMCF Plan", "PMCF Evaluation Report", "PMCF survey/questionnaire design", "Registry data analysis", "Trend reporting & signal detection"],
    timeline: "4–8 weeks",
    standards: ["MDCG 2020-7", "MDCG 2020-8", "EU MDR Annex XIV Part B"],
  },
  {
    icon: ShieldCheck,
    title: "Periodic Safety Update Reports (PSUR)",
    subtitle: "ICH E2C(R2) Aligned",
    description: "Expert authoring of PSURs and PBRERs for pharmaceutical products, incorporating cumulative safety data analysis, signal evaluation, and benefit-risk re-assessment. Delivered in eCTD-ready format for global regulatory submissions.",
    deliverables: ["Complete PSUR/PBRER document", "Cumulative safety data tables", "Signal detection & evaluation summaries", "Benefit-risk re-assessment", "Regulatory authority response support"],
    timeline: "8–14 weeks",
    standards: ["ICH E2C(R2)", "EU GVP Module VII", "FDA 21 CFR 314.80"],
  },
];

export default function Services() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="report-header">
        <p className="report-label">Section 4.0</p>
        <h1 className="report-title font-display text-3xl">Services</h1>
      </div>

      <div className="space-y-6">
        {services.map((service) => (
          <div key={service.title} className="report-section">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                <service.icon className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="font-display text-xl font-semibold text-foreground">{service.title}</h2>
                  <p className="text-xs text-primary font-body font-semibold uppercase tracking-wider mt-1">{service.subtitle}</p>
                </div>
                <p className="text-sm text-foreground/80 font-body leading-relaxed">{service.description}</p>

                <div className="clinical-divider" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="report-label mb-3">Key Deliverables</p>
                    <ul className="space-y-2">
                      {service.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-sm font-body text-foreground/80">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="report-label mb-2">Typical Timeline</p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-body font-semibold text-foreground">{service.timeline}</span>
                      </div>
                    </div>
                    <div>
                      <p className="report-label mb-2">Applicable Standards</p>
                      <div className="flex flex-wrap gap-1.5">
                        {service.standards.map((s) => (
                          <span key={s} className="clinical-badge text-[10px]">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="report-section text-center py-10">
        <h3 className="font-display text-xl font-semibold text-foreground">Ready to Discuss Your Project?</h3>
        <p className="text-sm text-muted-foreground font-body mt-2 max-w-md mx-auto">
          I offer confidential initial consultations to assess your regulatory writing needs and provide a tailored project proposal.
        </p>
        <a href="mailto:maziluileana88@gmail.com">
          <Button className="mt-6 font-body" size="lg">
            Get in Touch <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </a>
      </div>
    </div>
  );
}
