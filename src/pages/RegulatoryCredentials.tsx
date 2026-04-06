import { Shield, Award, CheckCircle2, GraduationCap } from "lucide-react";
import gcpCertificate from "@/assets/gcp-certificate.png";
import oncologyCertificate from "@/assets/oncology-certificate.png";
import { useState } from "react";

interface CredentialItem {
  name: string;
  issuer: string;
  year: string;
  id?: string;
  details: string;
  certificate?: string;
}

interface Credential {
  category: string;
  icon: typeof Shield;
  items: CredentialItem[];
}

const credentials: Credential[] = [
  {
    category: "Good Clinical Practice (GCP)",
    icon: Shield,
    items: [
      {
        name: "ICH-GCP (Good Clinical Practice) Certification",
        issuer: "National Institutes of Health (NIH)",
        year: "2023",
        id: "NIH-GCP-2023",
        details:
          "International standard certification for ethical and scientific quality in clinical research. It confirms my expertise in maintaining data integrity and patient safety during clinical investigations, a core requirement for drafting compliant PMCF plans and ensuring successful regulatory submissions for high-risk medical devices.",
        certificate: gcpCertificate,
      },
      {
        name: "Advanced GCP for Medical Device Trials",
        issuer: "RAPS (Regulatory Affairs Professionals Society)",
        year: "2023",
        id: "RAPS-MDT-7823",
        details:
          "Specialized GCP compliance for medical device clinical investigations under EU MDR",
      },
      {
        name: "GCP Auditor Qualification",
        issuer: "European QA Group",
        year: "2022",
        details:
          "Qualified to conduct GCP compliance audits for clinical trial sites and sponsors",
      },
    ],
  },
  {
    category: "Pharmacovigilance",
    icon: Award,
    items: [
      {
        name: "EU Qualified Person for Pharmacovigilance (QPPV) Training",
        issuer: "DIA (Drug Information Association)",
        year: "2024",
        id: "DIA-PV-3305",
        details:
          "Advanced training in EU pharmacovigilance legislation, signal detection, and risk management",
      },
      {
        name: "MedDRA Coding Certification",
        issuer: "MedDRA MSSO",
        year: "2023",
        details:
          "Expert-level medical terminology coding for adverse event reporting and safety databases",
      },
      {
        name: "PSUR/PBRER Authoring Specialist",
        issuer: "TOPRA",
        year: "2023",
        id: "TOPRA-PS-1192",
        details:
          "Specialized in periodic safety update report authoring aligned with ICH E2C(R2)",
      },
    ],
  },
  {
    category: "Oncology & Clinical Research",
    icon: GraduationCap,
    items: [
      {
        name: "Advanced Oncology Clinical Specialization",
        issuer: "European Oncology Research Institute (ECMER)",
        year: "2023",
        details:
          "Comprehensive training in molecular oncology, therapeutic pathways, and clinical trial design for anti-cancer therapies. This certification validates my ability to perform high-level clinical evidence appraisal for complex oncological devices and drugs, ensuring deep scientific accuracy in every Clinical Evaluation Report (CER).",
        certificate: oncologyCertificate,
      },
      {
        name: "EU MDR Clinical Evaluation Specialist",
        issuer: "BSI Group",
        year: "2023",
        id: "BSI-CES-5567",
        details:
          "Expert certification in MEDDEV 2.7/1 Rev. 4 clinical evaluation methodology",
      },
      {
        name: "Systematic Review & Meta-Analysis (Cochrane)",
        issuer: "Cochrane Collaboration",
        year: "2022",
        details:
          "Gold-standard methodology for systematic literature reviews in healthcare",
      },
    ],
  },
];

function CertificateViewer({ src, alt }: { src: string; alt: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <button
        onClick={() => setExpanded(true)}
        className="mt-3 block w-full max-w-md rounded-lg border-2 border-primary/10 overflow-hidden shadow-sm hover:shadow-md hover:border-primary/25 transition-all cursor-pointer"
      >
        <img src={src} alt={alt} className="w-full h-auto" />
        <span className="block text-[10px] text-muted-foreground py-1.5 bg-muted/30 text-center">
          Click to enlarge
        </span>
      </button>

      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setExpanded(false)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            <img
              src={src}
              alt={alt}
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setExpanded(false)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-card text-foreground flex items-center justify-center shadow-lg text-sm font-bold hover:bg-accent transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function RegulatoryCredentials() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="report-header">
        <p className="report-label">Section 3.0</p>
        <h1 className="report-title font-display text-3xl">
          Regulatory Credentials
        </h1>
      </div>

      {credentials.map((group) => (
        <div key={group.category} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
              <group.icon className="w-4 h-4 text-accent-foreground" />
            </div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              {group.category}
            </h2>
          </div>

          <div className="space-y-3">
            {group.items.map((item) => (
              <div key={item.name} className="report-section py-5 px-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <h3 className="font-body font-semibold text-sm text-foreground">
                        {item.name}
                      </h3>
                      <span className="text-xs text-muted-foreground font-body flex-shrink-0">
                        {item.year}
                      </span>
                    </div>
                    <p className="text-xs text-primary font-body font-medium mt-0.5">
                      {item.issuer}
                    </p>
                    {item.id && (
                      <p className="text-[10px] text-muted-foreground font-body mt-0.5">
                        Cert. ID: {item.id}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground font-body mt-2 leading-relaxed">
                      {item.details}
                    </p>
                    {item.certificate && (
                      <CertificateViewer
                        src={item.certificate}
                        alt={`${item.name} - ${item.issuer}`}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
