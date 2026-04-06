import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Search,
  ArrowRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  1. Therapeutic Footprint                                          */
/* ------------------------------------------------------------------ */

const therapeuticAreas = [
  { name: "Oncology", icon: Microscope, studies: "15+" },
  { name: "Cardiology", icon: Heart, studies: "10+" },
  { name: "Neurology", icon: Brain, studies: "8+" },
  { name: "Orthopedics", icon: Bone, studies: "7+" },
  { name: "Ophthalmology", icon: Eye, studies: "5+" },
  { name: "Neonatology", icon: Baby, studies: "4+" },
  { name: "Pharmacology", icon: Pill, studies: "6+" },
  { name: "Hematology", icon: Droplets, studies: "5+" },
  { name: "Pulmonology", icon: Wind, studies: "4+" },
  { name: "Endocrinology", icon: Activity, studies: "3+" },
  { name: "Immunology", icon: Syringe, studies: "4+" },
  { name: "Genomics & Diagnostics", icon: Dna, studies: "3+" },
];

/* ------------------------------------------------------------------ */
/*  2. Submissions tracker data                                       */
/* ------------------------------------------------------------------ */

type SubmissionStatus = "Approved" | "Submitted" | "In Review";

interface Submission {
  id: number;
  area: string;
  docType: string;
  deviceClass: string;
  status: SubmissionStatus;
  year: string;
}

const submissions: Submission[] = [
  { id: 1, area: "Oncology", docType: "CER", deviceClass: "Class III", status: "Approved", year: "2025" },
  { id: 2, area: "Cardiology", docType: "PMCF", deviceClass: "Class III", status: "Approved", year: "2025" },
  { id: 3, area: "Neurology", docType: "PSUR", deviceClass: "Class IIb", status: "Submitted", year: "2025" },
  { id: 4, area: "Orthopedics", docType: "CER", deviceClass: "Class III", status: "Approved", year: "2024" },
  { id: 5, area: "Ophthalmology", docType: "CER", deviceClass: "Class IIb", status: "Approved", year: "2024" },
  { id: 6, area: "Oncology", docType: "PMCF", deviceClass: "Class III", status: "In Review", year: "2025" },
  { id: 7, area: "Hematology", docType: "PSUR", deviceClass: "Class IIa", status: "Approved", year: "2024" },
  { id: 8, area: "Endocrinology", docType: "CER", deviceClass: "Class III", status: "Submitted", year: "2025" },
  { id: 9, area: "Pulmonology", docType: "PMCF", deviceClass: "Class IIb", status: "Approved", year: "2024" },
  { id: 10, area: "Immunology", docType: "CER", deviceClass: "Class III", status: "Approved", year: "2023" },
  { id: 11, area: "Cardiology", docType: "CER", deviceClass: "Class III", status: "Approved", year: "2023" },
  { id: 12, area: "Oncology", docType: "PSUR", deviceClass: "Class III", status: "Approved", year: "2024" },
  { id: 13, area: "Neonatology", docType: "CER", deviceClass: "Class IIb", status: "Submitted", year: "2025" },
  { id: 14, area: "Genomics & Diagnostics", docType: "CER", deviceClass: "Class III", status: "In Review", year: "2025" },
  { id: 15, area: "Neurology", docType: "CER", deviceClass: "Class III", status: "Approved", year: "2023" },
];

const statusColor: Record<SubmissionStatus, string> = {
  Approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Submitted: "bg-amber-100 text-amber-800 border-amber-200",
  "In Review": "bg-sky-100 text-sky-800 border-sky-200",
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function ProjectHighlights() {
  const [search, setSearch] = useState("");

  const filtered = submissions.filter(
    (s) =>
      s.area.toLowerCase().includes(search.toLowerCase()) ||
      s.docType.toLowerCase().includes(search.toLowerCase()) ||
      s.deviceClass.toLowerCase().includes(search.toLowerCase()) ||
      s.status.toLowerCase().includes(search.toLowerCase()),
  );

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
          Across 12 major therapeutic disciplines, I execute structured literature searches using PubMed, Embase, Cochrane Library, and proprietary clinical registries.
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
              <span className="text-[11px] text-muted-foreground">{area.studies} reports</span>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Regulatory Case Study ---- */}
      <div className="report-section">
        <div className="report-header">
          <p className="report-label">5.2 Regulatory Case Study</p>
          <h2 className="report-title font-display text-xl">From CEP to Market Approval: Managing High-Complexity Submissions</h2>
        </div>
        <div className="space-y-4 text-sm text-foreground/85 leading-relaxed font-body max-w-3xl">
          <p>
            A multinational medtech sponsor required a full clinical evaluation package for a novel Class III implantable oncology device under EU MDR 2017/745. The project demanded coordination across four regulatory disciplines: clinical evaluation, post-market surveillance, biocompatibility, and risk management.
          </p>
          <div className="flex flex-col gap-3 pl-4 border-l-2 border-primary/20">
            {[
              { step: "Clinical Evaluation Plan (CEP)", desc: "Defined scope, PICO questions, equivalence strategy, and state-of-the-art benchmarks per MEDDEV 2.7/1 Rev. 4." },
              { step: "Systematic Literature Review", desc: "Screened 1,200+ abstracts across PubMed, Embase, and Cochrane. Applied PRISMA flow, resulting in 87 included studies." },
              { step: "Clinical Evaluation Report (CER)", desc: "Authored 180-page CER with benefit-risk analysis, equivalence demonstration, and clinical data appraisal." },
              { step: "Notified Body Q&A", desc: "Responded to 42 questions from the Notified Body with supplementary evidence packages within a 30-day turnaround." },
              { step: "Market Approval", desc: "Device achieved CE marking under EU MDR, enabling commercialisation across 27 EU member states." },
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

      {/* ---- Submissions Tracker ---- */}
      <div className="report-section">
        <div className="report-header">
          <p className="report-label">5.3 Representative Submissions Tracker</p>
          <h2 className="report-title font-display text-xl">The Lifecycle of 80+ Regulatory Submissions</h2>
        </div>
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by area, type, class, status…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="font-semibold">Therapeutic Area</TableHead>
                <TableHead className="font-semibold">Document Type</TableHead>
                <TableHead className="font-semibold">Device Class</TableHead>
                <TableHead className="font-semibold">Year</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.area}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">{s.docType}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{s.deviceClass}</TableCell>
                    <TableCell className="text-muted-foreground">{s.year}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColor[s.status]}`}>
                        {s.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No submissions match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-muted-foreground mt-3 font-body">
          Showing {filtered.length} of {submissions.length} representative entries. Full portfolio includes 80+ submissions across all therapeutic areas.
        </p>
      </div>

      {/* ---- Pharma Synergy Article ---- */}
      <div className="report-section">
        <div className="report-header">
          <p className="report-label">5.4 Perspective</p>
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
