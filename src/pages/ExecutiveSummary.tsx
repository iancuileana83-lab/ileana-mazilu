import { useState } from "react";
import { Link } from "react-router-dom";
import professionalPhoto from "@/assets/professional-photo.jpg";
import { Badge } from "@/components/ui/badge";
import { FileDown, Mail, Phone, Linkedin, CheckCircle, FlaskConical, Search, LayoutGrid, Download, Sparkles, ArrowRight, GraduationCap, Award, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const stats = [
  { label: "Years in Pharma", value: "20+" },
  { label: "Medical Writing Focus", value: "3 yrs" },
];

const highlights = [
  "Authoring clinical evaluation reports (CERs) for medical devices in alignment with EU MDR 2017/745 requirements",
  "Experience preparing post-market clinical follow-up (PMCF) documentation with a focus on oncology",
  "Applying systematic literature review methodology aligned with MEDDEV 2.7/1 Rev. 4 and MDCG 2020 guidelines",
  "Contributing to pharmacovigilance safety reporting (PSURs) drawing on 20+ years of pharmaceutical practice",
  "Building reusable CER and PMCF templates that support consistent, audit-ready regulatory documentation",
];

const credentials = [
  {
    title: "Pharmacy Assistant Diploma (Postliceală de Farmacie)",
    institution: "Carol Davila University of Medicine and Pharmacy",
    year: "2005",
    icon: GraduationCap,
    description: "Practical pharmaceutical training supporting 20+ years of hands-on experience in pharmacology, clinical safety, and pharmacy practice.",
  },
  {
    title: "Engineering Degree",
    institution: "USAMV",
    year: "2012",
    icon: Award,
    description: "Technical and analytical foundation supporting medical device evaluation and regulatory systems.",
  },
];

export default function ExecutiveSummary() {
  const [openModal, setOpenModal] = useState<string | null>(null);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Document Header */}
      <div className="report-header flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="report-label">Section 1.0</p>
          <h1 className="report-title font-display text-3xl">Executive Summary</h1>
        </div>
        <Link
          to="/medad-ai"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:from-cyan-400 hover:to-purple-400 transition"
        >
          <Sparkles className="w-4 h-4" />
          Try MedAd Compliance AI
          <ArrowRight className="w-4 h-4" />
        </Link>
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
            Senior Clinical Evaluation Medical Writer and Pharmacy Technician with over 20 years of practical experience
            in the pharmaceutical sector, providing a deep understanding of pharmacology and clinical safety.
            Over the last 3 years, I have specialized as a Medical Writer with a primary focus on Oncology and Clinical Evidence Appraisal,
            authoring clinical evaluation reports (CERs), post-market clinical follow-up (PMCF) documentation,
            and periodic safety update reports (PSURs). My career bridges decades of pharmaceutical expertise
            with rigorous clinical evaluation standards, ensuring full compliance with EU MDR 2017/745
            for high-risk medical devices.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="report-section text-center py-6">
            <p className="text-3xl font-display font-bold text-primary">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-body">{stat.label}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-foreground/75 font-body italic text-center -mt-2">
        20+ years of pharmacy experience, with 3 years specializing in medical writing and regulatory documentation (CER, PMCF, PSUR).
      </p>

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

      {/* Certifications & Credentials */}
      <div className="report-section">
        <div className="report-header">
          <p className="report-label">1.2 Certifications & Credentials</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {credentials.map((credential) => (
            <Card key={credential.title} className="border-primary/10 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6 flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                  <credential.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-semibold text-foreground">{credential.title}</h3>
                  <p className="text-sm text-primary font-medium font-body">{credential.institution}</p>
                  <p className="text-xs text-muted-foreground font-body">{credential.year}</p>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed pt-1">{credential.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Technical Portfolio & Evidence */}
      <div className="report-section">
        <div className="report-header">
          <p className="report-label">1.3 Technical Portfolio & Evidence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-primary/10 hover:border-primary/30 transition-colors">
            <CardContent className="pt-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">Clinical Evaluation Samples</h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                Anonymized excerpts from Class III CERs, focusing on clinical data appraisal and benefit-risk analysis for oncology devices.
              </p>
              <Button variant="outline" size="sm" className="w-full gap-2 font-body" onClick={() => setOpenModal("sample")}>
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
                Standardized search strings and inclusion/exclusion criteria for PubMed/Embase, aligned with MDCG 2020 guidelines.
              </p>
              <Button variant="outline" size="sm" className="w-full gap-2 font-body" onClick={() => setOpenModal("protocol")}>
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
                An overview of the therapeutic areas and document types I can support across regulatory writing engagements.
              </p>
              <Button variant="outline" size="sm" className="w-full gap-2 font-body" onClick={() => setOpenModal("matrix")}>
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

        {/* Modals */}
        <Dialog open={openModal === "sample"} onOpenChange={(open) => !open && setOpenModal(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Section 4.2: Clinical Data Appraisal & Analysis</DialogTitle>
              <DialogDescription className="font-body">Anonymized Class III CER excerpt</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 font-body text-sm text-foreground/85 leading-relaxed">
              <p><span className="font-semibold text-foreground">Device:</span> Implantable Chemotherapy Port (Class III)</p>
              <p><span className="font-semibold text-foreground">Indication:</span> Long-term vascular access for chemotherapy.</p>
              <p><span className="font-semibold text-foreground">Analysis:</span> A systematic search identified 12 high-quality studies (N=1,450). Device patency rate: 98.2%. Implantation success: 100%.</p>
              <p><span className="font-semibold text-foreground">Safety:</span> SAE rate (infection/migration) at 1.2%, within SOTA limits.</p>
              <p><span className="font-semibold text-foreground">Conclusion:</span> Favorable benefit-risk profile; clinical benefits outweigh residual risks under IFU compliance.</p>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={openModal === "protocol"} onOpenChange={(open) => !open && setOpenModal(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">PubMed Search String</DialogTitle>
              <DialogDescription className="font-body">Standardized literature search protocol</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 font-body text-sm text-foreground/85 leading-relaxed">
              <div className="bg-muted rounded-md p-4 font-mono text-xs leading-relaxed">
                ("Oncology Service, Hospital"[Mesh] OR "Neoplasms"[Mesh]) AND ("Diagnostic Imaging"[Mesh] OR "Artificial Intelligence"[Mesh]) AND ("Clinical Evaluation"[Title/Abstract] OR "Performance Study"[Title/Abstract]) AND ("2021/01/01"[Date - Publication] : "2026/03/01"[Date - Publication])
              </div>
              <div>
                <p className="font-semibold text-foreground mb-2">Selection Criteria:</p>
                <p><span className="font-semibold text-foreground">Inclusion:</span> Human subjects, English/German/French, RCTs, prospective cohort studies.</p>
                <p><span className="font-semibold text-foreground">Exclusion:</span> Case reports &lt;5 patients, animal studies, purely technical papers without clinical endpoints.</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={openModal === "matrix"} onOpenChange={(open) => !open && setOpenModal(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Therapeutic Footprint</DialogTitle>
              <DialogDescription className="font-body">Areas of expertise and document types I can support</DialogDescription>
            </DialogHeader>
            <div className="space-y-2 font-body text-sm text-foreground/85 leading-relaxed">
              {[
                ["Oncology", "CER, PMCF Plans, SSCP"],
                ["Cardiovascular", "PSUR, Drug-Eluting Stents"],
                ["Orthopedics", "Hip/Knee Arthroplasty"],
                ["Neurology", "Neurostimulation Devices"],
                ["Endocrinology", "Insulin Delivery Systems"],
                ["Nephrology", "Dialysis Equipment"],
              ].map(([area, detail]) => (
                <div key={area} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                  <span className="font-semibold text-foreground min-w-[120px]">{area}:</span>
                  <span>{detail}</span>
                </div>
              ))}
              <p className="text-muted-foreground italic pt-2">
                Primary focus on oncology and medical devices, with adjacent experience across additional therapeutic areas.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="report-section">
        <div className="report-header">
          <p className="report-label">1.4 Contact & Resources</p>
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
              For a detailed discussion of my regulatory writing experience and therapeutic focus areas, please contact me directly.
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
              <a href="https://www.linkedin.com/in/ileana-mazilu-aa211181/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors">
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

      {/* Client Testimonials */}
      <div className="report-section">
        <div className="report-header">
          <p className="report-label">1.5 Client Testimonials</p>
        </div>
        <div className="bg-muted/40 rounded-lg border border-dashed border-border p-8 text-center">
          <Quote className="w-8 h-8 text-primary/40 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground font-body italic leading-relaxed max-w-xl mx-auto">
            Testimonials coming soon as we onboard our first clients. This section will be updated with verified feedback from regulatory, medtech, and pharmaceutical partners.
          </p>
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
