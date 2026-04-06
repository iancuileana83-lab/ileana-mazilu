import professionalPhoto from "@/assets/professional-photo.jpg";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Years Experience", value: "15+" },
  { label: "CERs Authored", value: "120+" },
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
            Certified clinical researcher with 15+ years of expertise in regulatory medical writing
            for the pharmaceutical and medical device industries. Specializing in clinical evaluation reports (CERs),
            post-market clinical follow-up (PMCF) documentation, and periodic safety update reports (PSURs)
            under EU MDR 2017/745 and MEDDEV 2.7/1 Rev. 4 frameworks.
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
    </div>
  );
}
