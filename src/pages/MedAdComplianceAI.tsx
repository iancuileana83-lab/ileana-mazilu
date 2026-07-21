import { useState } from "react";
import { Shield, Sparkles, ShieldCheck, Brain, Zap, FileWarning, CheckCircle2, AlertTriangle, Loader2, Crown, Download, XCircle, FileText, Repeat, ClipboardCheck, Stethoscope, Mail } from "lucide-react";
import jsPDF from "jspdf";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { runAudit, severityColor, type AuditReport } from "@/lib/medad-audit";
import {
  generateCer,
  generatePmcf,
  type CerInputs,
  type PmcfInputs,
  type GeneratedDocument,
  type DeviceClass,
  type EvaluationRoute,
} from "@/lib/cer-pmcf-generator";

export default function MedAdComplianceAI() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"outputs" | "audit" | "checklist">("outputs");
  const [category, setCategory] = useState("Oncology");
  const [description, setDescription] = useState("");
  const [frameworks, setFrameworks] = useState<string[]>(["FDA Advertising Guidelines"]);
  const [report, setReport] = useState<AuditReport | null>(null);

  // Long-form CER / PMCF regulatory-doc generator state
  const [docMode, setDocMode] = useState<"CER" | "PMCF">("CER");
  const [docLoading, setDocLoading] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<GeneratedDocument | null>(null);
  const [activeDocSection, setActiveDocSection] = useState<number>(0);

  const [cerInputs, setCerInputs] = useState<CerInputs>({
    deviceName: "",
    manufacturer: "",
    classification: "IIb",
    intendedPurpose: "",
    therapeuticArea: "Oncology",
    patientPopulation: "adult patients meeting the CE-marked indication",
    technicalCharacteristics: "",
    evaluationRoute: "equivalence",
    equivalentDevice: "",
    knownRisks: "",
    evaluatorName: "Ileana Mazilu",
    evaluatorCredentials: "",
  });

  const [pmcfInputs, setPmcfInputs] = useState<PmcfInputs>({
    deviceName: "",
    manufacturer: "",
    classification: "IIb",
    intendedPurpose: "",
    therapeuticArea: "Oncology",
    patientPopulation: "adult patients meeting the CE-marked indication",
    pmcfMethod: "prospective-registry",
    pmcfDurationMonths: 24,
    cerReference: "",
  });

  // Consultation request modal state
  const [consultOpen, setConsultOpen] = useState(false);
  const [consultName, setConsultName] = useState("");
  const [consultEmail, setConsultEmail] = useState("");
  const [consultMessage, setConsultMessage] = useState("");
  const [consultError, setConsultError] = useState<string | null>(null);

  const toggleFramework = (f: string) => {
    setFrameworks((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  };

  const submitConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultError(null);
    if (!consultName.trim() || !consultEmail.trim() || !consultMessage.trim()) {
      setConsultError("Please fill in all fields before submitting.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(consultEmail.trim())) {
      setConsultError("Please enter a valid email address.");
      return;
    }
    const subject = encodeURIComponent("Agency Premium — Priority Email Consultation Request");
    const body = encodeURIComponent(
      `Name: ${consultName.trim()}\nEmail: ${consultEmail.trim()}\n\nMessage:\n${consultMessage.trim()}`
    );
    window.location.href = `mailto:maziluileana88@gmail.com?subject=${subject}&body=${body}`;
    setConsultOpen(false);
    setConsultName("");
    setConsultEmail("");
    setConsultMessage("");
  };

  const handleGenerate = () => {
    setLoading(true);
    setReport(null);
    setTimeout(() => {
      const r = runAudit({ description, category, frameworks });
      setReport(r);
      setActiveTab("outputs");
      setLoading(false);
    }, 2200);
  };

  const downloadAuditPDF = () => {
    if (!report) return;
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 54;
    const maxWidth = pageWidth - margin * 2;
    let y = margin;

    const ensureSpace = (needed: number) => {
      if (y + needed > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    const drawSectionHeader = (label: string) => {
      ensureSpace(40);
      doc.setTextColor(30, 41, 59);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(label, margin, y);
      y += 6;
      doc.setDrawColor(200);
      doc.line(margin, y, pageWidth - margin, y);
      y += 16;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
    };

    const drawParagraph = (text: string, indent = 0, color: [number, number, number] = [30, 41, 59]) => {
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, maxWidth - indent);
      lines.forEach((line: string) => {
        ensureSpace(14);
        doc.text(line, margin + indent, y);
        y += 14;
      });
    };

    // Header bar
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 70, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("MedAd Compliance AI", margin, 32);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(180, 200, 220);
    doc.text("Regulatory Audit Report", margin, 50);
    y = 90;

    // Prominent draft disclaimer banner
    doc.setFillColor(254, 243, 199);
    doc.rect(margin, y, maxWidth, 40, "F");
    doc.setDrawColor(217, 119, 6);
    doc.rect(margin, y, maxWidth, 40);
    doc.setTextColor(120, 53, 15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("AI-GENERATED DRAFT — REQUIRES HUMAN EXPERT REVIEW", margin + 10, y + 15);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      "Ad copy, rewrites and audit findings are AI-generated drafts. Review with a qualified medical writer and legal counsel before publication. No guaranteed FDA / EU MDR compliance outcome is implied.",
      margin + 10,
      y + 28,
      { maxWidth: maxWidth - 20 }
    );
    y += 56;

    // Metadata
    drawSectionHeader("Audit Metadata");
    const meta: [string, string][] = [
      ["Date / Time:", report.submittedAt.toLocaleString()],
      ["Medical Category:", report.category],
      ["Frameworks Checked:", report.frameworks.length ? report.frameworks.join(", ") : "None selected"],
      ["Auditor:", "MedAd Compliance AI — Ileana Mazilu, Senior Medical Writer"],
    ];
    meta.forEach(([k, v]) => {
      ensureSpace(16);
      doc.setFont("helvetica", "bold");
      doc.text(k, margin, y);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(v, maxWidth - 140);
      doc.text(lines, margin + 140, y);
      y += 14 * lines.length + 2;
    });

    // Executive summary
    y += 10;
    drawSectionHeader("Executive Summary");
    const critical = report.findings.filter((f) => f.severity === "Critical").length;
    const high = report.findings.filter((f) => f.severity === "High").length;
    const medium = report.findings.filter((f) => f.severity === "Medium").length;
    const summary = [
      `Pattern rules evaluated: ${report.phrasesChecked}`,
      `Phrases flagged: ${report.flaggedCount}  (Critical: ${critical}, High: ${high}, Medium: ${medium})`,
      `Compliance criteria passed: ${report.compliantCount} of ${report.checklist.length}`,
      `Overall status: ${report.flaggedCount === 0 && report.compliantCount === report.checklist.length ? "PASS — ready for client review" : critical > 0 ? "BLOCK — critical violations require rewrite" : "REWRITE RECOMMENDED — flagged phrases replaced in compliant copy"}`,
    ];
    summary.forEach((line) => drawParagraph(line));

    // Original submitted text
    y += 10;
    drawSectionHeader("Original Submitted Text");
    drawParagraph(report.original);

    // Flagged phrases
    y += 10;
    drawSectionHeader("Flagged Phrases — Severity, Regulation, Reason & Rewrite");
    if (report.findings.length === 0) {
      drawParagraph("No flagged phrases were detected in the submitted text.", 0, [6, 95, 70]);
    } else {
      report.findings.forEach((f, i) => {
        ensureSpace(90);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...severityColor(f.severity));
        doc.text(`${i + 1}. [${f.severity}] "${f.phrase}" — ${f.category}`, margin, y);
        y += 14;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(71, 85, 105);
        doc.text("Regulation:", margin + 12, y);
        doc.setFont("helvetica", "normal");
        drawParagraph(f.regulation, 90, [30, 41, 59]);
        y -= 14; // drawParagraph advances; keep alignment consistent
        y += 14;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(71, 85, 105);
        doc.text("Why it's risky:", margin + 12, y);
        doc.setFont("helvetica", "normal");
        y += 14;
        drawParagraph(f.reason, 12, [51, 65, 85]);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(6, 95, 70);
        doc.text("Suggested rewrite:", margin + 12, y);
        doc.setFont("helvetica", "normal");
        y += 14;
        drawParagraph(f.rewrite, 12, [6, 95, 70]);
        y += 6;
      });
    }

    // Final compliant ad copy
    y += 6;
    drawSectionHeader("Final Compliant Ad Copy (Ready to Use)");
    drawParagraph(report.finalCompliantCopy, 0, [15, 23, 42]);

    // Platform-specific variants
    y += 10;
    drawSectionHeader("Platform-Specific Variants");
    report.variants.forEach((v) => {
      ensureSpace(40);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.text(v.label, margin, y);
      y += 14;
      doc.setFont("helvetica", "normal");
      drawParagraph(v.content, 12, [51, 65, 85]);
      y += 6;
    });

    // Compliance checklist
    y += 6;
    drawSectionHeader("Compliance Checklist — All Criteria Reviewed");
    report.checklist.forEach((c) => {
      ensureSpace(34);
      doc.setFont("helvetica", "bold");
      if (c.passed) {
        doc.setTextColor(6, 95, 70);
        doc.text(`[PASS]  ${c.criterion}`, margin, y);
      } else {
        doc.setTextColor(153, 27, 27);
        doc.text(`[FAIL]  ${c.criterion}`, margin, y);
      }
      y += 13;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(9);
      doc.text(`Framework: ${c.framework}`, margin + 14, y);
      y += 12;
      doc.setFontSize(10);
      drawParagraph(c.detail, 14, [51, 65, 85]);
      y += 4;
    });

    // Footer on each page
    const pages = doc.getNumberOfPages();
    for (let p = 1; p <= pages; p++) {
      doc.setPage(p);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text(
        "Generated by MedAd Compliance AI — Ileana Mazilu, Senior Medical Writer. Automated review; final regulatory sign-off requires human expert validation.",
        margin,
        pageHeight - 30,
        { maxWidth }
      );
      doc.text(`Page ${p} of ${pages}`, pageWidth - margin, pageHeight - 30, { align: "right" });
    }

    doc.save(`MedAd-Compliance-Audit-${Date.now()}.pdf`);
  };

  // ---- Long-form regulatory document generation ----
  const handleGenerateDoc = () => {
    setDocLoading(true);
    setGeneratedDoc(null);
    setTimeout(() => {
      const d = docMode === "CER" ? generateCer(cerInputs) : generatePmcf(pmcfInputs);
      setGeneratedDoc(d);
      setActiveDocSection(0);
      setDocLoading(false);
    }, 1800);
  };

  const downloadDocPDF = () => {
    if (!generatedDoc) return;
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 54;
    const maxWidth = pageWidth - margin * 2;
    let y = margin;

    const ensureSpace = (needed: number) => {
      if (y + needed > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };
    const writeParagraph = (text: string, size = 10, color: [number, number, number] = [30, 41, 59]) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(size);
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line: string) => {
        ensureSpace(size + 4);
        doc.text(line, margin, y);
        y += size + 4;
      });
    };

    // Cover header bar
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 90, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(generatedDoc.title, margin, 38, { maxWidth: maxWidth });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(180, 200, 220);
    doc.text(generatedDoc.subtitle, margin, 62, { maxWidth: maxWidth });
    doc.text(`Generated ${generatedDoc.generatedAt.toLocaleString()}`, margin, 78);
    y = 120;

    // Prominent draft disclaimer banner
    doc.setFillColor(254, 243, 199);
    doc.rect(margin, y, maxWidth, 44, "F");
    doc.setDrawColor(217, 119, 6);
    doc.rect(margin, y, maxWidth, 44);
    doc.setTextColor(120, 53, 15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("AI-GENERATED DRAFT — REQUIRES HUMAN EXPERT REVIEW", margin + 10, y + 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      "This document is an AI-assisted draft. It must be reviewed, verified and formally accepted by a qualified medical writer and the manufacturer's PRRC before regulatory use. No guaranteed EU MDR / FDA compliance outcome is implied.",
      margin + 10,
      y + 30,
      { maxWidth: maxWidth - 20 }
    );
    y += 60;

    // Metadata block
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text("Document Metadata", margin, y);
    y += 6;
    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 16;
    generatedDoc.meta.forEach(([k, v]) => {
      ensureSpace(18);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      doc.text(k, margin, y);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(v, maxWidth - 150);
      doc.text(lines, margin + 150, y);
      y += 14 * lines.length + 2;
    });

    y += 8;

    // Sections
    generatedDoc.sections.forEach((s) => {
      ensureSpace(40);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(30, 41, 59);
      doc.text(`${s.number}. ${s.title}`, margin, y);
      y += 6;
      doc.setDrawColor(180);
      doc.line(margin, y, pageWidth - margin, y);
      y += 14;
      s.paragraphs.forEach((p) => {
        writeParagraph(p);
        y += 4;
      });
      y += 8;
    });

    // Footer
    const pages = doc.getNumberOfPages();
    for (let p = 1; p <= pages; p++) {
      doc.setPage(p);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text(
        `${generatedDoc.type} generated by MedAd Compliance AI — Ileana Mazilu, Senior Medical Writer. Automated draft; final regulatory sign-off requires human expert validation.`,
        margin,
        pageHeight - 30,
        { maxWidth }
      );
      doc.text(`Page ${p} of ${pages}`, pageWidth - margin, pageHeight - 30, { align: "right" });
    }

    doc.save(`${generatedDoc.type}-${generatedDoc.title.replace(/[^A-Za-z0-9]+/g, "-")}-${Date.now()}.pdf`);
  };


  return (
    <div className="min-h-screen -m-6 md:-m-10 bg-[#05060f] text-slate-100 font-body">
      {/* Ambient gradient bg */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute top-40 -right-40 w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#05060f_80%)]" />
        </div>

        {/* HERO */}
        <section className="relative px-6 md:px-12 pt-16 pb-20 max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/30 bg-cyan-400/5 text-cyan-300 text-xs uppercase tracking-[0.25em] mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Gemini-Powered · Regulatory Grade
          </div>
          <h1 className="font-display text-4xl md:text-6xl leading-[1.05] font-semibold bg-gradient-to-br from-white via-cyan-100 to-purple-200 bg-clip-text text-transparent">
            MedAd Compliance AI — Speed of Generative AI + Regulatory Safety of a Senior Medical Writer
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-300/90 max-w-3xl">
            An intelligent, Gemini-powered alignment tool that automatically generates and audits medical ad copy to prevent legal hallucinations, FDA warnings, and EU MDR compliance violations.
          </p>
        </section>

        {/* WHY NOT JUST CHATGPT */}
        <section className="relative px-6 md:px-12 py-16 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-purple-300/80 mb-3">Direct Comparison</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-white">
              Why not just use <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">ChatGPT?</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: FileWarning,
                title: "Regulatory pattern library",
                chatgpt: "ChatGPT doesn't know the specific FDA / EU MDR flagged phrases that trigger warning letters.",
                us: "We've encoded real regulatory patterns from 15 years of clinical writing experience — the exact words, claims and structures that fail audits.",
              },
              {
                icon: FileText,
                title: "Audit trail, not just text",
                chatgpt: "ChatGPT gives you text and moves on. No proof, no paper trail.",
                us: "We give you a downloadable compliance audit PDF you can show clients or legal — every flag traced to the regulation it violates.",
              },
              {
                icon: Repeat,
                title: "Consistent agency workflow",
                chatgpt: "ChatGPT starts from zero every time — different tone, different rules, different misses on every prompt.",
                us: "We give consistent, repeatable checks built for agency workflows — the same guardrails apply on run #1 and run #500.",
              },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl p-[1px] bg-gradient-to-br from-purple-500/40 via-cyan-500/20 to-transparent">
                <div className="rounded-2xl h-full bg-[#0a0d1e]/90 p-7 border border-white/5">
                  <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-300 flex items-center justify-center mb-5">
                    <c.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white mb-4">{c.title}</h3>
                  <div className="flex gap-2 items-start mb-3">
                    <XCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-slate-400 leading-relaxed"><span className="text-slate-300 font-semibold">ChatGPT:</span> {c.chatgpt}</p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-slate-300 leading-relaxed"><span className="text-cyan-300 font-semibold">MedAd AI:</span> {c.us}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* WHY MEDAD */}
        <section className="relative px-6 md:px-12 py-16 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/80 mb-3">Value Justification</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              Why Healthcare Brands Trust MedAd AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">Over Generic ChatGPT/Gemini Chatbots</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, color: "cyan", title: "Zero-Effort Prompt Engineering", desc: "Generic AI requires writing massive, complex prompt instructions and manually copy-pasting hundreds of pages of FDA/EU regulations. MedAd AI embeds these deep legal guardrails natively in the background. One click, instant compliance." },
              { icon: Shield, color: "purple", title: "The Legal Shield (Compliance Audit)", desc: "ChatGPT just outputs text without explaining why. MedAd AI acts as a digital lawyer, generating a transparent, step-by-step audit report that highlights banned words, cites the specific medical regulations violated, and provides safe alternatives." },
              { icon: Brain, color: "cyan", title: "Human-in-the-Loop Medical Writing Expertise", desc: "Generic LLMs frequently suffer from medical hallucinations that lead to catastrophic legal fines. This platform's safety frameworks are designed, trained, and verified using specialized RLHF principles by a Senior Clinical Evaluation Medical Writer with 20+ years of pharmaceutical experience." },
            ].map((card) => (
              <div key={card.title} className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/40 via-purple-500/20 to-transparent">
                <div className="rounded-2xl h-full bg-[#0a0d1e]/90 backdrop-blur p-7 border border-white/5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${card.color === "cyan" ? "bg-cyan-500/10 text-cyan-300" : "bg-purple-500/10 text-purple-300"}`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white mb-3">{card.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* DEMO FORM */}
        <section className="relative px-6 md:px-12 py-16 max-w-5xl mx-auto">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-8 md:p-10 backdrop-blur">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/80">Live Demo</p>
                <h3 className="font-display text-2xl text-white">Compliance Generation Console</h3>
              </div>
            </div>

            <div className="grid gap-6">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Medical Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#0a0d1e] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan-400/60 focus:outline-none"
                >
                  <option>Oncology</option>
                  <option>Aesthetics & Dermatology</option>
                  <option>Supplements & Wellness</option>
                  <option>Medical Devices</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-2 block">Raw Product or Treatment Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="e.g. Novel targeted immunotherapy for HER2+ metastatic breast cancer. Highlight mechanism of action, patient benefit profile, and administration schedule for oncology HCP campaign..."
                  className="w-full bg-[#0a0d1e] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-3 block">Target Compliance Framework</label>
                <div className="grid sm:grid-cols-3 gap-3">
                  {["FDA Advertising Guidelines", "EU Medical Device Regulation", "Patient-Friendly Translation"].map((f) => (
                    <label key={f} className={`cursor-pointer flex items-start gap-3 p-4 rounded-lg border transition ${frameworks.includes(f) ? "border-cyan-400/60 bg-cyan-400/5" : "border-white/10 bg-[#0a0d1e]"}`}>
                      <input type="checkbox" checked={frameworks.includes(f)} onChange={() => toggleFramework(f)} className="mt-1 accent-cyan-400" />
                      <span className="text-sm text-slate-200">{f}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="mt-2 relative overflow-hidden rounded-xl py-4 px-6 font-semibold text-white bg-gradient-to-r from-cyan-500 via-cyan-400 to-purple-500 hover:from-cyan-400 hover:to-purple-400 transition shadow-[0_0_40px_-10px_rgba(34,211,238,0.6)] disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Gemini API running pharmacovigilance checks...
                  </span>
                ) : (
                  "Generate & Audit Compliant Campaign"
                )}
              </button>
            </div>
          </div>

          {/* RESULTS */}
          {report && (
            <div className="mt-10 rounded-3xl border border-white/10 bg-[#0a0d1e]/70 overflow-hidden animate-fade-in">
              <div className="px-6 py-3 bg-amber-500/10 border-b border-amber-400/30 text-amber-200 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span><span className="font-semibold">AI-generated draft.</span> Requires human expert review and validation before publication or regulatory use. No guaranteed FDA/EU MDR compliance outcome is implied.</span>
              </div>
              {/* Executive summary strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
                {[
                  { label: "Rules evaluated", value: report.phrasesChecked, color: "text-slate-200" },
                  { label: "Phrases flagged", value: report.flaggedCount, color: report.flaggedCount === 0 ? "text-emerald-300" : "text-amber-300" },
                  { label: "Critical / High", value: `${report.findings.filter((f) => f.severity === "Critical").length} / ${report.findings.filter((f) => f.severity === "High").length}`, color: "text-rose-300" },
                  { label: "Checklist passed", value: `${report.compliantCount} / ${report.checklist.length}`, color: "text-cyan-300" },
                ].map((s) => (
                  <div key={s.label} className="bg-[#0a0d1e] px-5 py-4">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500">{s.label}</p>
                    <p className={`font-display text-2xl mt-1 ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex border-b border-white/10">
                <button
                  onClick={() => setActiveTab("outputs")}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition ${activeTab === "outputs" ? "bg-cyan-500/10 text-cyan-300 border-b-2 border-cyan-400" : "text-slate-400 hover:text-white"}`}
                >
                  Compliant Ad Outputs
                </button>
                <button
                  onClick={() => setActiveTab("audit")}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition ${activeTab === "audit" ? "bg-amber-500/10 text-amber-300 border-b-2 border-amber-400" : "text-slate-400 hover:text-white"}`}
                >
                  Flagged Phrases ({report.flaggedCount})
                </button>
                <button
                  onClick={() => setActiveTab("checklist")}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition ${activeTab === "checklist" ? "bg-emerald-500/10 text-emerald-300 border-b-2 border-emerald-400" : "text-slate-400 hover:text-white"}`}
                >
                  Compliance Checklist
                </button>
              </div>

              {activeTab === "outputs" && (
                <div className="p-8 space-y-5">
                  <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/[0.06] p-5">
                    <p className="text-xs uppercase tracking-widest text-emerald-300 mb-2">Final Compliant Ad Copy · Ready to Use</p>
                    <p className="text-slate-100 whitespace-pre-wrap leading-relaxed">{report.finalCompliantCopy}</p>
                  </div>
                  {report.variants.map((v) => (
                    <div key={v.platform} className={`rounded-xl border p-5 ${v.platform === "Google Ads" ? "border-purple-400/20 bg-purple-400/5" : "border-cyan-400/20 bg-cyan-400/5"}`}>
                      <p className={`text-xs uppercase tracking-widest mb-2 ${v.platform === "Google Ads" ? "text-purple-300" : "text-cyan-300"}`}>{v.label}</p>
                      <p className="text-slate-100 whitespace-pre-wrap">{v.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "audit" && (
                <div className="p-8 border-2 border-amber-500/30 m-4 rounded-xl bg-amber-500/[0.03]">
                  <div className="flex items-center gap-3 mb-6">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <h4 className="font-display text-lg text-amber-200">Automated Regulatory Audit Trail</h4>
                  </div>
                  {report.findings.length === 0 ? (
                    <p className="text-sm text-emerald-300 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> No flagged phrases detected in the submitted text.</p>
                  ) : (
                    <ul className="space-y-4">
                      {report.findings.map((f, i) => {
                        const sevColor = f.severity === "Critical" ? "bg-rose-500/15 text-rose-300 border-rose-400/40" : f.severity === "High" ? "bg-amber-500/15 text-amber-300 border-amber-400/40" : "bg-yellow-500/10 text-yellow-200 border-yellow-400/30";
                        return (
                          <li key={i} className="rounded-lg bg-[#0a0d1e]/60 border border-amber-500/20 p-4">
                            <div className="flex items-start gap-3">
                              <FileWarning className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border ${sevColor}`}>{f.severity}</span>
                                  <p className="text-sm text-amber-100 font-semibold">"{f.phrase}"</p>
                                  <span className="text-xs text-slate-500">· {f.category}</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1"><span className="text-slate-300 font-semibold">Regulation:</span> {f.regulation}</p>
                                <p className="text-xs text-slate-400 mt-1"><span className="text-slate-300 font-semibold">Why it's risky:</span> {f.reason}</p>
                                <p className="text-xs text-emerald-300 mt-2 flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5" /> <span><span className="font-semibold">Rewrite:</span> {f.rewrite}</span></p>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}

              {activeTab === "checklist" && (
                <div className="p-8 space-y-3">
                  {report.checklist.map((c, i) => (
                    <div key={i} className={`rounded-lg border p-4 flex items-start gap-3 ${c.passed ? "border-emerald-500/20 bg-emerald-500/[0.04]" : "border-rose-500/25 bg-rose-500/[0.05]"}`}>
                      {c.passed ? <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className={`text-sm font-semibold ${c.passed ? "text-emerald-200" : "text-rose-200"}`}>{c.criterion}</p>
                          <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${c.passed ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"}`}>{c.passed ? "Pass" : "Fail"}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{c.framework}</p>
                        <p className="text-xs text-slate-400 mt-1">{c.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-6 border-t border-white/10 bg-[#05060f]/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-xs text-slate-400">
                  Audit generated {report.submittedAt.toLocaleString()} · Frameworks: {report.frameworks.join(", ") || "—"}
                </div>
                <button
                  onClick={downloadAuditPDF}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold text-sm shadow-[0_0_30px_-10px_rgba(34,211,238,0.6)] transition"
                >
                  <Download className="w-4 h-4" />
                  Download Compliance Audit PDF
                </button>
              </div>
            </div>
          )}
        </section>


        {/* LONG-FORM REGULATORY DOC GENERATOR (CER / PMCF) */}
        <section className="relative px-6 md:px-12 py-16 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-purple-300/80 mb-3">Regulatory Documentation Engine</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-white">
              Long-Form <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">CER & PMCF</span> Generator
            </h2>
            <p className="mt-4 text-slate-400 max-w-3xl mx-auto">
              Generate structured, MDR 2017/745-aligned draft documentation — a 10-section Clinical Evaluation Report or a 5-section Post-Market Clinical Follow-Up plan — from a compact device profile. Every section is populated with substantive, audit-ready content and exported as a formatted PDF.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-8 md:p-10 backdrop-blur">
            {/* Mode switch */}
            <div className="flex gap-3 mb-8">
              {(["CER", "PMCF"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setDocMode(m); setGeneratedDoc(null); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition ${docMode === m ? "border-cyan-400/60 bg-cyan-400/10 text-cyan-200" : "border-white/10 bg-[#0a0d1e] text-slate-400 hover:text-white"}`}
                >
                  {m === "CER" ? <ClipboardCheck className="w-4 h-4" /> : <Stethoscope className="w-4 h-4" />}
                  {m === "CER" ? "Clinical Evaluation Report (10 sections)" : "PMCF Plan (5 sections)"}
                </button>
              ))}
            </div>

            {docMode === "CER" ? (
              <div className="grid md:grid-cols-2 gap-5">
                <FieldInput label="Device name" value={cerInputs.deviceName} onChange={(v) => setCerInputs({ ...cerInputs, deviceName: v })} placeholder="e.g. OncoPort IV Access System" />
                <FieldInput label="Manufacturer / Legal manufacturer" value={cerInputs.manufacturer} onChange={(v) => setCerInputs({ ...cerInputs, manufacturer: v })} placeholder="e.g. MedDevice EU S.A." />
                <FieldSelect label="MDR classification" value={cerInputs.classification} onChange={(v) => setCerInputs({ ...cerInputs, classification: v as DeviceClass })} options={["I", "IIa", "IIb", "III"]} />
                <FieldInput label="Therapeutic area" value={cerInputs.therapeuticArea} onChange={(v) => setCerInputs({ ...cerInputs, therapeuticArea: v })} placeholder="e.g. Oncology, Cardiology" />
                <FieldTextarea className="md:col-span-2" label="Intended purpose (verbatim from IFU)" value={cerInputs.intendedPurpose} onChange={(v) => setCerInputs({ ...cerInputs, intendedPurpose: v })} placeholder="e.g. Long-term central venous access for the administration of chemotherapy in adult oncology patients." />
                <FieldInput label="Target patient population" value={cerInputs.patientPopulation} onChange={(v) => setCerInputs({ ...cerInputs, patientPopulation: v })} placeholder="e.g. adult oncology patients requiring long-term IV chemotherapy" />
                <FieldSelect label="Evaluation route" value={cerInputs.evaluationRoute} onChange={(v) => setCerInputs({ ...cerInputs, evaluationRoute: v as EvaluationRoute })} options={[["equivalence", "Equivalence"], ["clinical-investigation", "Clinical investigation"], ["hybrid", "Hybrid"]]} />
                <FieldTextarea className="md:col-span-2" label="Technical characteristics, materials, mechanism of action" value={cerInputs.technicalCharacteristics} onChange={(v) => setCerInputs({ ...cerInputs, technicalCharacteristics: v })} placeholder="Titanium port body, silicone septum, polyurethane catheter. Subcutaneous implantation with catheter tip at cavoatrial junction. Passive access via non-coring needle..." />
                {(cerInputs.evaluationRoute === "equivalence" || cerInputs.evaluationRoute === "hybrid") && (
                  <FieldInput className="md:col-span-2" label="Equivalent (predicate) device" value={cerInputs.equivalentDevice || ""} onChange={(v) => setCerInputs({ ...cerInputs, equivalentDevice: v })} placeholder="e.g. PowerPort ClearVUE (Bard Access Systems)" />
                )}
                <FieldTextarea className="md:col-span-2" label="Known residual risks (optional)" value={cerInputs.knownRisks || ""} onChange={(v) => setCerInputs({ ...cerInputs, knownRisks: v })} placeholder="e.g. catheter-related thrombosis, infection, extravasation, mechanical failure" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                <FieldInput label="Device name" value={pmcfInputs.deviceName} onChange={(v) => setPmcfInputs({ ...pmcfInputs, deviceName: v })} placeholder="e.g. OncoPort IV Access System" />
                <FieldInput label="Manufacturer" value={pmcfInputs.manufacturer} onChange={(v) => setPmcfInputs({ ...pmcfInputs, manufacturer: v })} placeholder="e.g. MedDevice EU S.A." />
                <FieldSelect label="MDR classification" value={pmcfInputs.classification} onChange={(v) => setPmcfInputs({ ...pmcfInputs, classification: v as DeviceClass })} options={["I", "IIa", "IIb", "III"]} />
                <FieldInput label="Therapeutic area" value={pmcfInputs.therapeuticArea} onChange={(v) => setPmcfInputs({ ...pmcfInputs, therapeuticArea: v })} />
                <FieldTextarea className="md:col-span-2" label="Intended purpose" value={pmcfInputs.intendedPurpose} onChange={(v) => setPmcfInputs({ ...pmcfInputs, intendedPurpose: v })} />
                <FieldInput label="Target patient population" value={pmcfInputs.patientPopulation} onChange={(v) => setPmcfInputs({ ...pmcfInputs, patientPopulation: v })} />
                <FieldSelect label="PMCF method" value={pmcfInputs.pmcfMethod} onChange={(v) => setPmcfInputs({ ...pmcfInputs, pmcfMethod: v as PmcfInputs["pmcfMethod"] })} options={[["prospective-registry", "Prospective registry"], ["survey", "HCP / patient survey"], ["literature-surveillance", "Literature surveillance"], ["post-market-study", "Post-market study"], ["mixed", "Mixed-method"]]} />
                <FieldInput label="Duration (months)" type="number" value={String(pmcfInputs.pmcfDurationMonths)} onChange={(v) => setPmcfInputs({ ...pmcfInputs, pmcfDurationMonths: Math.max(3, parseInt(v) || 24) })} />
                <FieldInput className="md:col-span-2" label="Linked CER reference (optional)" value={pmcfInputs.cerReference || ""} onChange={(v) => setPmcfInputs({ ...pmcfInputs, cerReference: v })} placeholder="e.g. CER-OncoPort-v3.2 dated 2026-04-15" />
              </div>
            )}

            <button
              onClick={handleGenerateDoc}
              disabled={docLoading || (docMode === "CER" ? !cerInputs.deviceName || !cerInputs.intendedPurpose : !pmcfInputs.deviceName || !pmcfInputs.intendedPurpose)}
              className="mt-8 w-full relative overflow-hidden rounded-xl py-4 px-6 font-semibold text-white bg-gradient-to-r from-purple-500 via-cyan-400 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 transition shadow-[0_0_40px_-10px_rgba(168,85,247,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {docLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Composing MDR-aligned {docMode} draft…
                </span>
              ) : (
                `Generate Structured ${docMode} Draft`
              )}
            </button>
          </div>

          {/* Generated document viewer */}
          {generatedDoc && (
            <div className="mt-10 rounded-3xl border border-white/10 bg-[#0a0d1e]/70 overflow-hidden animate-fade-in">
              <div className="px-6 py-3 bg-amber-500/10 border-b border-amber-400/30 text-amber-200 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span><span className="font-semibold">AI-generated draft.</span> This {generatedDoc.type} is an AI-assisted draft and requires human expert review, factual verification, and PRRC sign-off before use in a regulatory submission. No guaranteed EU MDR compliance outcome is implied.</span>
              </div>
              <div className="p-6 md:p-8 border-b border-white/10 bg-gradient-to-r from-purple-500/[0.08] to-cyan-500/[0.05]">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300 mb-2">{generatedDoc.type} · Draft</p>
                <h3 className="font-display text-2xl md:text-3xl text-white">{generatedDoc.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{generatedDoc.subtitle}</p>
              </div>

              <div className="grid md:grid-cols-[260px_1fr]">
                {/* Section nav */}
                <aside className="border-b md:border-b-0 md:border-r border-white/10 bg-[#05060f]/60 p-3 max-h-[560px] overflow-y-auto">
                  {generatedDoc.sections.map((s, idx) => (
                    <button
                      key={s.number}
                      onClick={() => setActiveDocSection(idx)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 text-sm transition ${activeDocSection === idx ? "bg-cyan-400/10 text-cyan-200 border border-cyan-400/30" : "text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent"}`}
                    >
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 mr-2">§{s.number}</span>
                      {s.title}
                    </button>
                  ))}
                </aside>

                {/* Section content */}
                <div className="p-6 md:p-10 max-h-[560px] overflow-y-auto">
                  {(() => {
                    const s = generatedDoc.sections[activeDocSection];
                    return (
                      <>
                        <p className="text-xs uppercase tracking-[0.3em] text-purple-300 mb-2">Section {s.number}</p>
                        <h4 className="font-display text-2xl text-white mb-6">{s.title}</h4>
                        <div className="space-y-5 text-slate-300 text-[15px] leading-relaxed">
                          {s.paragraphs.map((p, i) => (
                            <p key={i} className="whitespace-pre-wrap">{p}</p>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="p-6 border-t border-white/10 bg-[#05060f]/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-xs text-slate-400">
                  {generatedDoc.sections.length} sections generated · {generatedDoc.generatedAt.toLocaleString()}
                </div>
                <button
                  onClick={downloadDocPDF}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white font-semibold text-sm shadow-[0_0_30px_-10px_rgba(168,85,247,0.6)] transition"
                >
                  <Download className="w-4 h-4" />
                  Download Full {generatedDoc.type} as PDF
                </button>
              </div>
            </div>
          )}
        </section>


        {/* CTA */}
        <section className="relative px-6 md:px-12 py-16 max-w-5xl mx-auto">
          <div className="rounded-3xl p-[1px] bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500">
            <div className="rounded-3xl bg-[#05060f] p-10 md:p-12 text-center">
              <ShieldCheck className="w-10 h-10 text-cyan-300 mx-auto mb-5" />
              <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
                Need an advanced clinical study adapted or a custom enterprise compliance framework? <span className="text-white font-semibold">Book a dedicated validation session with Ileana Mazilu</span> <span className="text-slate-400">(Senior Medical Writer & AI Subject Matter Expert).</span>
              </p>
              <a
                href="mailto:maziluileana88@gmail.com?subject=Enterprise Validation Session Request"
                className="inline-flex mt-8 items-center gap-2 px-8 py-3 rounded-full bg-white text-[#05060f] font-semibold hover:bg-cyan-100 transition"
              >
                Book Validation Session
              </a>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="relative px-6 md:px-12 py-20 max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-4">Protect Your Brand. Priced for Peace of Mind.</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Non-compliant medical advertising can result in significant regulatory fines and reputational damage. Credits reset automatically every 30 days.</p>
          </div>
          <p className="text-center text-sm text-cyan-200/80 max-w-3xl mx-auto mb-10">
            Choose the plan that fits your compliance needs — <span className="text-white font-semibold">marketing compliance</span> (ad copy audit &amp; safe rewrites) is included in both plans; <span className="text-white font-semibold">regulatory documentation drafting</span> (CER / PMCF long-form generator) is available on both plans as an AI-assisted drafting tool requiring human expert review.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Starter */}
            <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-cyan-500/[0.05] to-transparent p-8 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-300 mb-2">Starter Plan · For Clinics</p>
              <h3 className="font-display text-2xl text-white mb-2">Marketing Compliance Essentials</h3>
              <p className="text-4xl font-semibold text-white mb-6">$49 <span className="text-base font-normal text-slate-400">/ month</span></p>
              <p className="text-[11px] uppercase tracking-widest text-cyan-300/80 mb-3">Service 1 · Compliant Ad / Marketing Copy</p>
              <ul className="space-y-3 text-sm text-slate-300 mb-4">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />50 Compliant Ad Generations per month (resets monthly)</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />3 Safe Variations per run (2 Social Hooks + 1 Google Ad)</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />Downloadable PDF Compliance &amp; Safety Audit Reports</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />Guardrails aligned to FDA &amp; EU MDR frameworks (drafts require human expert review)</li>
              </ul>
              <p className="text-[11px] uppercase tracking-widest text-purple-300/80 mb-3">Service 2 · Regulatory Documentation</p>
              <ul className="space-y-3 text-sm text-slate-300 mb-8">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-300 flex-shrink-0 mt-0.5" />Access to CER / PMCF long-form draft generator (AI-assisted drafts; human expert review required)</li>
              </ul>
              <a
                href="https://buy.stripe.com/6oU9ASfwKfSdd9Sa701wY00"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#05060f] font-semibold transition"
              >
                Upgrade to Starter
              </a>
            </div>

            {/* Agency */}
            <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-purple-500 via-cyan-400 to-purple-500">
              <div className="rounded-2xl bg-[#0a0d1e] p-8 h-full">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-200 text-[11px] uppercase tracking-widest mb-4">
                  <Crown className="w-3 h-3" /> Best for Agencies &amp; Enterprise
                </div>
                <p className="text-xs uppercase tracking-[0.25em] text-purple-300 mb-2">Agency Premium</p>
                <h3 className="font-display text-2xl text-white mb-2">For Agencies &amp; Enterprise</h3>
                <p className="text-4xl font-semibold text-white mb-6">$149 <span className="text-base font-normal text-slate-400">/ month</span></p>
                <p className="text-[11px] uppercase tracking-widest text-cyan-300/80 mb-3">Service 1 · Compliant Ad / Marketing Copy</p>
                <ul className="space-y-3 text-sm text-slate-300 mb-4">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />250 Advanced Ad Audit Generations per month</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />White-Label PDF Export (add your agency logo to reports)</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />Deep Anti-Hallucination Filtering (Gemini-powered)</li>
                </ul>
                <p className="text-[11px] uppercase tracking-widest text-purple-300/80 mb-3">Service 2 · Regulatory Documentation</p>
                <ul className="space-y-3 text-sm text-slate-300 mb-4">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-300 flex-shrink-0 mt-0.5" />Full CER &amp; PMCF long-form draft generator (AI-assisted drafts; human expert review required)</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-300 flex-shrink-0 mt-0.5" />Priority email consultation with senior medical writer for complex clinical studies (response via email, no live calls)</li>
                </ul>

                <div className="rounded-xl border border-purple-400/20 bg-purple-500/[0.05] p-4 mb-6">
                  <p className="text-sm text-slate-200 mb-3">
                    Submit your consultation request here — our senior medical writer will respond via email within <span className="text-white font-semibold">2–3 business days</span>.
                  </p>
                  <Dialog open={consultOpen} onOpenChange={setConsultOpen}>
                    <DialogTrigger asChild>
                      <button className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border border-purple-400/40 bg-purple-500/10 text-purple-200 hover:bg-purple-500/20 hover:text-white font-medium text-sm transition">
                        <Mail className="w-4 h-4" />
                        Request Consultation
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0a0d1e] border border-white/10 text-slate-100 max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-white font-display text-xl">Request Priority Email Consultation</DialogTitle>
                        <DialogDescription className="text-slate-400">
                          Fill in your details and we will email you back within 2–3 business days. No live calls.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={submitConsultation} className="space-y-4 mt-2">
                        <div>
                          <label className="text-xs uppercase tracking-widest text-slate-400 mb-2 block">Name</label>
                          <Input
                            value={consultName}
                            onChange={(e) => setConsultName(e.target.value)}
                            placeholder="Your name"
                            className="bg-[#05060f] border-white/10 text-white placeholder:text-slate-600 focus:border-purple-400/60"
                          />
                        </div>
                        <div>
                          <label className="text-xs uppercase tracking-widest text-slate-400 mb-2 block">Email</label>
                          <Input
                            type="email"
                            value={consultEmail}
                            onChange={(e) => setConsultEmail(e.target.value)}
                            placeholder="you@company.com"
                            className="bg-[#05060f] border-white/10 text-white placeholder:text-slate-600 focus:border-purple-400/60"
                          />
                        </div>
                        <div>
                          <label className="text-xs uppercase tracking-widest text-slate-400 mb-2 block">Message</label>
                          <Textarea
                            value={consultMessage}
                            onChange={(e) => setConsultMessage(e.target.value)}
                            placeholder="Describe your clinical study or regulatory documentation needs...]                            rows={4}
                            className="bg-[#05060f] border-white/10 text-white placeholder:text-slate-600 focus:border-purple-400/60 resize-none"
                          />
                        </div>
                        {consultError && (
                          <p className="text-sm text-rose-300 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            {consultError}
                          </p>
                        )}
                        <button
                          type="submit"
                          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white font-semibold transition"
                        >
                          <Mail className="w-4 h-4" />
                          Send Consultation Request
                        </button>
                        <p className="text-xs text-slate-500 text-center">
                          This opens your email client with a pre-filled message addressed to maziluileana88@gmail.com.
                        </p>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <a
                  href="https://buy.stripe.com/aFa3cuesG49vedW7YS1wY01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white font-semibold transition"
                >
                  Activate Agency License
                </a>
              </div>
            </div>
          </div>
          <p className="text-center text-[11px] text-slate-500 max-w-3xl mx-auto mt-8 italic">
            All content produced by MedAd Compliance AI — ad copy audits and CER/PMCF drafts — is an AI-generated draft that requires human expert review and validation before use in regulatory submissions, patient-facing communications, or paid advertising. No claim of certified FDA or EU MDR compliance outcomes is made.
          </p>
        </section>
      </div>
    </div>
  );
}

// -- Reusable input components for the CER / PMCF console --
interface FieldBaseProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

function FieldInput({ label, value, onChange, placeholder, className = "", type = "text" }: FieldBaseProps & { type?: string }) {
  return (
    <div className={className}>
      <label className="text-xs uppercase tracking-widest text-slate-400 mb-2 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0a0d1e] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 text-sm focus:border-cyan-400/60 focus:outline-none"
      />
    </div>
  );
}

function FieldTextarea({ label, value, onChange, placeholder, className = "" }: FieldBaseProps) {
  return (
    <div className={className}>
      <label className="text-xs uppercase tracking-widest text-slate-400 mb-2 block">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-[#0a0d1e] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 text-sm focus:border-cyan-400/60 focus:outline-none resize-none"
      />
    </div>
  );
}

interface FieldSelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: (string | [string, string])[];
  className?: string;
}

function FieldSelect({ label, value, onChange, options, className = "" }: FieldSelectProps) {
  return (
    <div className={className}>
      <label className="text-xs uppercase tracking-widest text-slate-400 mb-2 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0a0d1e] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-cyan-400/60 focus:outline-none"
      >
        {options.map((opt) => {
          const [v, l] = Array.isArray(opt) ? opt : [opt, opt];
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </div>
  );
}

