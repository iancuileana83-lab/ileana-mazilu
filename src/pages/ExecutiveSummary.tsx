import { useState } from "react";
import professionalPhoto from "@/assets/professional-photo.jpg";
import { Badge } from "@/components/ui/badge";
import { FileDown, Mail, Phone, Linkedin, CheckCircle, FlaskConical, Search, LayoutGrid, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const stats = [
  { label: "Years in Pharma", value: "20+" },
  { label: "Medical Writing Focus", value: "3 yrs" },
  { label: "Regulatory Submissions", value: "80+" },
  { label: "Therapeutic Areas", value: "12" },
];

const highlights = [
  "Led clinical evaluation report authoring for Class III medical devices across EU MDR 2017/745 requirements",
  "Principal medical writer for 40+ oncology PMCF study reports submitted to Notified Bodies",
  "Developed systematic literature review protocols aligned with MEDDEV 2.7/1 Rev. 4 guidelines",
  "Expert contributor to pharmacovigilance safety reports (PSURs) for multinational pharma sponsors",
  "Designed standardized CER templates adopted by three Fortune 500 medtech organizations",
];

export default function ExecutiveSummary() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Document Header */}
      <div className="report-header">
        <p className="report-label">Section 1.0</p>
        <h1 className="report-title font-display text-3xl">Executive Summary</h1>
      </div>

      {/* Profile Card */}
      <div className="report-section flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          <div className="w-48 h-56 rounded-lg overflow-hidden border-2 border-primary/10 shadow-md">
            <img
              src={professionalPhoto}
              alt="Ileana Mazilu, Senior Clinical Evaluation Medical Writer"
              className="w-full h-full object-cover"
              width={512}
              height={640}
            />
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">Ileana Mazilu</h2>
            <p className="text-muted-foreground font-body mt-1">Senior Clinical Evaluation Medical Writer | Oncology & Medical Devices Specialist</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="clinical-badge">EU MDR Specialist</Badge>
            <Badge variant="secondary" className="clinical-badge">Oncology</Badge>
            <Badge variant="secondary" className="clinical-badge">Class III Devices</Badge>
            <Badge variant="secondary" className="clinical-badge">ICH-GCP</Badge>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed font-body max-w-2xl">
            Senior consultant with over 20 years of extensive experience in the pharmaceutical sector,
            providing a deep understanding of pharmacology and clinical safety. Over the last 3 years,
            I have specialized as a Medical Writer with a primary focus on Oncology and Clinical Evidence Appraisal,
            authoring clinical evaluation reports (CERs), post-market clinical follow-up (PMCF) documentation,
            and periodic safety update reports (PSURs). My career bridges decades of pharmaceutical expertise
            with rigorous clinical evaluation standards, ensuring full compliance with EU MDR 2017/745
            for high-risk medical devices.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="report-section text-center py-6">
            <p className="text-3xl font-display font-bold text-primary">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-body">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Key Achievements */}
      <div className="report-section">
        <div className="report-header">
          <p className="report-label">1.1 Key Achievements</p>
        </div>
        <ul className="space-y-3">
          {highlights.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm font-body text-foreground/85 leading-relaxed">
              <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-accent-foreground">{i + 1}</span>
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Technical Portfolio & Evidence */}
      <div className="report-section">
        <div className="report-header">
          <p className="report-label">1.2 Technical Portfolio & Evidence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-primary/10 hover:border-primary/30 transition-colors">
            <CardContent className="pt-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">Clinical Evaluation Samples</h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                Representative anonymized excerpts from Class III CERs, showcasing data appraisal and benefit-risk analysis.
              </p>
              <Button variant="outline" size="sm" className="w-full gap-2 font-body">
                View Sample
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/10 hover:border-primary/30 transition-colors">
            <CardContent className="pt-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Search className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">Search Protocols & Methodology</h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                Standardized literature search strings and protocols for PubMed and Embase, aligned with MDCG 2020 guidelines.
              </p>
              <Button variant="outline" size="sm" className="w-full gap-2 font-body">
                View Protocol
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/10 hover:border-primary/30 transition-colors">
            <CardContent className="pt-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">Therapeutic Expertise Matrix</h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                A comprehensive map of 12+ therapeutic areas covered in 80+ regulatory submissions.
              </p>
              <Button variant="outline" size="sm" className="w-full gap-2 font-body">
                View Matrix
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <a href="/professional_dossier.pdf" download>
            <Button size="lg" className="gap-3 text-base font-body px-10 py-6 text-lg shadow-lg hover:shadow-xl transition-shadow bg-primary hover:bg-primary/90">
              <Download className="w-6 h-6" />
              Download Complete Professional Dossier (PDF)
            </Button>
          </a>
        </div>
      </div>
      <div className="report-section">
        <div className="report-header">
          <p className="report-label">1.3 Contact & Resources</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Download CV */}
          <div className="flex-1 space-y-4">
            <a href="/ileana_mazilu_cv.pdf" download>
              <Button size="lg" className="w-full md:w-auto gap-2 text-base font-body">
                <FileDown className="w-5 h-5" />
                Download Full Professional CV
              </Button>
            </a>
            <p className="text-xs text-muted-foreground font-body italic">
              For a complete portfolio of my 80+ regulatory submissions and therapeutic deep-dives, please contact me directly.
            </p>
          </div>

          {/* Contact Card */}
          <div className="flex-1 space-y-3 bg-accent/30 rounded-lg p-5 border border-primary/10">
            <h3 className="font-display text-lg font-semibold text-foreground">Direct Contact</h3>
            <div className="space-y-2 font-body text-sm">
              <a href="mailto:maziluileana88@gmail.com" className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors">
                <Mail className="w-4 h-4 text-primary" />
                maziluileana88@gmail.com
              </a>
              <a href="tel:+40766687508" className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors">
                <Phone className="w-4 h-4 text-primary" />
                +40 766 687 508
              </a>
              <a href="https://www.linkedin.com/in/ileana-mazilu-aa211181" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors">
                <Linkedin className="w-4 h-4 text-primary" />
                LinkedIn Profile
              </a>
            </div>
            <div className="pt-2">
              <Badge variant="secondary" className="clinical-badge gap-1">
                <CheckCircle className="w-3 h-3" />
                Available for Senior Medical Writing Consultations
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="border-t border-border pt-6 mt-4">
        <p className="text-[11px] text-muted-foreground/70 font-body leading-relaxed text-center max-w-3xl mx-auto">
          © 2026 Ileana Mazilu. <span className="font-semibold">Confidentiality Notice:</span> All project samples and data presented in this portfolio have been anonymized or modified to protect proprietary information and comply with Non-Disclosure Agreements (NDAs) and GDPR standards. Full clinical details are available upon request during a secure interview process.
        </p>
      </div>
    </div>
  );
}
