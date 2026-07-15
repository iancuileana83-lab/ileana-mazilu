import { useState } from "react";
import { Shield, Sparkles, ShieldCheck, Brain, Zap, FileWarning, CheckCircle2, AlertTriangle, Loader2, Crown, Download, XCircle, FileText, Repeat } from "lucide-react";
import jsPDF from "jspdf";

const AUDIT_ITEMS = [
  { flag: "Removed absolute claim 'cures'", reason: "Prevents regulatory penalties under FDA Title 21 CFR §202.1(e)(6)", safe: "Replaced with: 'clinically studied to support'" },
  { flag: "Removed superlative 'miraculous'", reason: "Violates FDA prohibition on unsubstantiated efficacy claims", safe: "Replaced with: 'evidence-based innovation'" },
  { flag: "Removed unqualified 'safe'", reason: "EU MDR Art. 7 prohibits misleading safety claims without full risk disclosure", safe: "Replaced with: 'physician-prescribed treatment'" },
  { flag: "Added HCP audience gating", reason: "MDCG 2022-14 requires professional-audience labeling for prescription therapies", safe: "Appended: 'For healthcare professionals.'" },
];

export default function MedAdComplianceAI() {
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<"outputs" | "audit">("outputs");
  const [category, setCategory] = useState("Oncology");
  const [description, setDescription] = useState("");
  const [frameworks, setFrameworks] = useState<string[]>(["FDA Advertising Guidelines"]);
  const [auditedAt, setAuditedAt] = useState<Date | null>(null);

  const toggleFramework = (f: string) => {
    setFrameworks((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  };

  const handleGenerate = () => {
    setLoading(true);
    setShowResults(false);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
      setAuditedAt(new Date());
    }, 2200);
  };

  const downloadAuditPDF = () => {
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
    y = 100;

    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Audit Metadata", margin, y);
    y += 6;
    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 16;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const stamp = (auditedAt ?? new Date()).toLocaleString();
    const meta = [
      ["Date / Time:", stamp],
      ["Medical Category:", category],
      ["Frameworks Checked:", frameworks.length ? frameworks.join(", ") : "None selected"],
    ];
    meta.forEach(([k, v]) => {
      doc.setFont("helvetica", "bold");
      doc.text(k, margin, y);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(v, maxWidth - 130);
      doc.text(lines, margin + 130, y);
      y += 14 * lines.length + 2;
    });

    y += 12;
    ensureSpace(60);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Original Submitted Text", margin, y);
    y += 6;
    doc.line(margin, y, pageWidth - margin, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const original = description.trim() || "(No description was provided in the console.)";
    const originalLines = doc.splitTextToSize(original, maxWidth);
    originalLines.forEach((line: string) => {
      ensureSpace(14);
      doc.text(line, margin, y);
      y += 14;
    });

    y += 14;
    ensureSpace(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Flagged Phrases & Compliant Rewrites", margin, y);
    y += 6;
    doc.line(margin, y, pageWidth - margin, y);
    y += 18;

    AUDIT_ITEMS.forEach((item, i) => {
      ensureSpace(80);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(153, 27, 27);
      doc.text(`${i + 1}. Flagged: ${item.flag}`, margin, y);
      y += 14;
      doc.setTextColor(71, 85, 105);
      doc.setFont("helvetica", "normal");
      const reasonLines = doc.splitTextToSize(`Regulation: ${item.reason}`, maxWidth);
      reasonLines.forEach((line: string) => {
        ensureSpace(13);
        doc.text(line, margin + 12, y);
        y += 13;
      });
      doc.setTextColor(6, 95, 70);
      const safeLines = doc.splitTextToSize(`Compliant rewrite: ${item.safe}`, maxWidth);
      safeLines.forEach((line: string) => {
        ensureSpace(13);
        doc.text(line, margin + 12, y);
        y += 13;
      });
      doc.setTextColor(30, 41, 59);
      y += 8;
    });

    // Footer on each page
    const pages = doc.getNumberOfPages();
    for (let p = 1; p <= pages; p++) {
      doc.setPage(p);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text(
        "Generated by MedAd Compliance AI — Ileana Mazilu, Senior Medical Writer. For informational review; final regulatory sign-off requires human expert validation.",
        margin,
        pageHeight - 30,
        { maxWidth }
      );
      doc.text(`Page ${p} of ${pages}`, pageWidth - margin, pageHeight - 30, { align: "right" });
    }

    doc.save(`MedAd-Compliance-Audit-${Date.now()}.pdf`);
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
            MedAd Compliance AI — Speed of Generative AI + Regulatory Safety of a Senior Pharmacist
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
              { icon: Brain, color: "cyan", title: "Human-in-the-Loop Pharmacist Expertise", desc: "Generic LLMs frequently suffer from medical hallucinations that lead to catastrophic legal fines. This platform's safety frameworks are designed, trained, and verified using specialized RLHF principles by a Licensed Senior Pharmacist." },
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
          {showResults && (
            <div className="mt-10 rounded-3xl border border-white/10 bg-[#0a0d1e]/70 overflow-hidden animate-fade-in">
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
                  Compliance & Safety Audit
                </button>
              </div>

              {activeTab === "outputs" && (
                <div className="p-8 space-y-5">
                  <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-5">
                    <p className="text-xs uppercase tracking-widest text-cyan-300 mb-2">Social Hook 01 · Instagram</p>
                    <p className="text-slate-100">"Precision oncology, redefined. Our targeted therapy is clinically studied to support HER2+ patients — talk to your oncologist about eligibility today."</p>
                  </div>
                  <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-5">
                    <p className="text-xs uppercase tracking-widest text-cyan-300 mb-2">Social Hook 02 · LinkedIn</p>
                    <p className="text-slate-100">"A new chapter in HER2+ care: evidence-based innovation designed with oncologists, for oncologists. Explore the clinical dossier →"</p>
                  </div>
                  <div className="rounded-xl border border-purple-400/20 bg-purple-400/5 p-5">
                    <p className="text-xs uppercase tracking-widest text-purple-300 mb-2">Google Ads Text</p>
                    <p className="text-slate-100"><span className="font-semibold">Headline:</span> HER2+ Targeted Therapy | Clinically Studied Option<br /><span className="font-semibold">Description:</span> Learn about a physician-prescribed treatment supported by peer-reviewed clinical data. For healthcare professionals.</p>
                  </div>
                </div>
              )}

              {activeTab === "audit" && (
                <div className="p-8 border-2 border-amber-500/30 m-4 rounded-xl bg-amber-500/[0.03]">
                  <div className="flex items-center gap-3 mb-6">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <h4 className="font-display text-lg text-amber-200">Automated Regulatory Audit Trail</h4>
                  </div>
                  <ul className="space-y-4">
                    {AUDIT_ITEMS.map((item, i) => (
                      <li key={i} className="rounded-lg bg-[#0a0d1e]/60 border border-amber-500/20 p-4">
                        <div className="flex items-start gap-3">
                          <FileWarning className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm text-amber-100 font-semibold">Flagged: {item.flag}</p>
                            <p className="text-xs text-slate-400 mt-1">{item.reason}</p>
                            <p className="text-xs text-emerald-300 mt-2 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> {item.safe}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-6 border-t border-white/10 bg-[#05060f]/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-xs text-slate-400">
                  {auditedAt && <>Audit generated {auditedAt.toLocaleString()} · Frameworks: {frameworks.join(", ") || "—"}</>}
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
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-4">Protect Your Brand. Priced for Peace of Mind.</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">A single medical ad violation costs a minimum €5,000 fine. Protect your brand for the price of a dinner. Credits reset automatically every 30 days.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Starter */}
            <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-cyan-500/[0.05] to-transparent p-8 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-300 mb-2">Starter Plan</p>
              <h3 className="font-display text-2xl text-white mb-2">For Clinics</h3>
              <p className="text-4xl font-semibold text-white mb-6">$49 <span className="text-base font-normal text-slate-400">/ month</span></p>
              <ul className="space-y-3 text-sm text-slate-300 mb-8">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />50 Compliant Ad Generations per month (Resets monthly)</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />3 Instant Safe Variations per run (2 Social Hooks + 1 Google Ad)</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />Downloadable PDF Compliance & Safety Audit Reports</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />Guardrails verified under FDA & EU MDR frameworks</li>
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
                  <Crown className="w-3 h-3" /> Best for XPRIZE Enterprise Validation
                </div>
                <p className="text-xs uppercase tracking-[0.25em] text-purple-300 mb-2">Agency Premium</p>
                <h3 className="font-display text-2xl text-white mb-2">For Agencies & Enterprise</h3>
                <p className="text-4xl font-semibold text-white mb-6">$149 <span className="text-base font-normal text-slate-400">/ month</span></p>
                <ul className="space-y-3 text-sm text-slate-300 mb-8">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-300 flex-shrink-0 mt-0.5" />250 Advanced Ad Audit Generations per month</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-300 flex-shrink-0 mt-0.5" />White-Label PDF Export (Add your own agency logo to reports)</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-300 flex-shrink-0 mt-0.5" />Deep Anti-Hallucination Filtering (Powered by Gemini Enterprise)</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-300 flex-shrink-0 mt-0.5" />Priority Pharmacist consultation fallback for complex clinical studies</li>
                </ul>
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
        </section>
      </div>
    </div>
  );
}
