import {
  Heart,
  Brain,
  Bone,
  Eye,
  Baby,
  Pill,
  Droplets,
  Wind,
  Activity,
  Syringe,
  Microscope,
  Dna,
  ArrowRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Therapeutic Footprint                                             */
/* ------------------------------------------------------------------ */

const therapeuticAreas = [
  { name: "Oncology", icon: Microscope },
  { name: "Cardiology", icon: Heart },
  { name: "Neurology", icon: Brain },
  { name: "Orthopedics", icon: Bone },
  { name: "Ophthalmology", icon: Eye },
  { name: "Neonatology", icon: Baby },
  { name: "Pharmacology", icon: Pill },
  { name: "Hematology", icon: Droplets },
  { name: "Pulmonology", icon: Wind },
  { name: "Endocrinology", icon: Activity },
  { name: "Immunology", icon: Syringe },
  { name: "Genomics & Diagnostics", icon: Dna },
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function ProjectHighlights() {
  return (
    <div className="space-y-10 animate-fade-in">
      {/* Page header */}
      <div className="report-header">
        <p className="report-label">Section 5.0</p>
        <h1 className="report-title font-display text-3xl">Project Highlights</h1>
      </div>

      {/* ---- Therapeutic Footprint ---- */}
      <div className="report-section">
        <div className="report-header">
          <p className="report-label">5.1 Therapeutic Footprint</p>
          <h2 className="report-title font-display text-xl">Therapeutic Versatility: A Multi-Disciplinary Approach</h2>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed font-body mb-6 max-w-3xl">
          Across a broad range of therapeutic disciplines, I execute structured literature searches using PubMed, Embase, Cochrane Library, and other clinical evidence sources.
          My methodology combines PICO-based search strategies with Boolean logic operators, followed by systematic screening aligned with PRISMA standards.
          This framework enables rapid expertise acquisition in unfamiliar therapeutic areas while maintaining the appraisal rigour expected by Notified Bodies and Competent Authorities.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {therapeuticAreas.map((area) => (
            <div
              key={area.name}
              className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 text-center transition-colors hover:border-primary/30 hover:bg-accent/40"
            >
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <area.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-semibold text-foreground font-body">{area.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Illustrative Regulatory Workflow ---- */}
      <div className="report-section">
        <div className="report-header">
          <p className="report-label">5.2 Illustrative Regulatory Workflow</p>
          <h2 className="report-title font-display text-xl">From Clinical Evaluation Plan to Market Approval</h2>
        </div>
        <div className="space-y-4 text-sm text-foreground/85 leading-relaxed font-body max-w-3xl">
          <p>
            The following outlines a typical clinical evaluation workflow for a Class III medical device under EU MDR 2017/745, illustrating how clinical evaluation, post-market surveillance, biocompatibility, and risk management activities are coordinated. This is a general methodology overview, not a claim of specific past engagements.
          </p>
          <div className="flex flex-col gap-3 pl-4 border-l-2 border-primary/20">
            {[
              { step: "Clinical Evaluation Plan (CEP)", desc: "Define scope, PICO questions, equivalence strategy, and state-of-the-art benchmarks per MEDDEV 2.7/1 Rev. 4." },
              { step: "Systematic Literature Review", desc: "Structured searches across PubMed, Embase, and Cochrane, with PRISMA-aligned screening and appraisal." },
              { step: "Clinical Evaluation Report (CER)", desc: "Authoring of the CER covering benefit-risk analysis, equivalence demonstration, and clinical data appraisal." },
              { step: "Notified Body Q&A", desc: "Preparation of supplementary evidence packages and structured responses to Notified Body questions." },
              { step: "Market Approval", desc: "Support of the CE marking process under EU MDR to enable commercialisation across EU member states." },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground">{item.step}:</span>{" "}
                  <span>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---- Pharma Synergy Article ---- */}
      <div className="report-section">
        <div className="report-header">
          <p className="report-label">5.3 Perspective</p>
          <h2 className="report-title font-display text-xl">The Synergy Between Pharmaceutical Expertise and Medical Device Safety</h2>
        </div>
        <div className="space-y-4 text-sm text-foreground/85 leading-relaxed font-body max-w-3xl">
          <p>
            The convergence of pharmaceutical science and medical device regulation has created a new paradigm in clinical evaluation — one that rewards professionals who can navigate both worlds with equal fluency. With over 20 years in the pharmaceutical sector, my career has been shaped by the rigorous standards of pharmacovigilance, drug safety monitoring, and adverse event analysis. This foundation has proven indispensable in the field of medical device clinical evaluation.
          </p>
          <p>
            In pharmaceutical practice, safety assessment follows a well-established hierarchy: from pre-clinical toxicology through Phase I–IV clinical trials, and into post-market surveillance via Periodic Safety Update Reports (PSURs). This systematic approach to risk identification directly translates to the medical device landscape, where Clinical Evaluation Reports demand the same level of analytical rigour when assessing benefit-risk profiles for Class IIb and Class III devices.
          </p>
          <p>
            My pharmaceutical background provides three critical advantages in clinical evaluation writing. First, a deep understanding of pharmacology enables more nuanced appraisal of combination products — devices that incorporate or are used in conjunction with medicinal substances. Second, familiarity with signal detection and causality assessment methodologies (such as the WHO-UMC system) enhances the quality of safety data analysis within Post-Market Clinical Follow-up (PMCF) reports. Third, experience with regulatory authority interactions — from EMA scientific advice procedures to national competent authority inspections — ensures that every submission anticipates the questions and evidence standards that reviewers apply.
          </p>
          <p>
            The result is a Clinical Evaluation Report that does more than satisfy regulatory checkboxes. It presents a coherent, pharmacologically informed narrative of device safety and performance, backed by the same evidentiary standards that govern the most scrutinised pharmaceutical products in the European market. This cross-disciplinary expertise is not merely an advantage — in the era of EU MDR 2017/745, it is a necessity.
          </p>
        </div>
      </div>
    </div>
  );
}
