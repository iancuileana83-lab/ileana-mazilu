import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink, Calendar, BookOpen } from "lucide-react";

interface Paper {
  id: number;
  title: string;
  journal: string;
  year: number;
  type: string;
  tags: string[];
  citation: string;
  impact: string;
}

const papers: Paper[] = [
  { id: 1, title: "Comparative Efficacy of PD-1 Inhibitors in Advanced NSCLC: A Systematic Literature Review", journal: "Journal of Clinical Oncology", year: 2025, type: "SLR", tags: ["NSCLC", "Immunotherapy", "PD-1"], citation: "Mazilu I. et al., J Clin Oncol. 2025;43(8):1102-1115", impact: "IF 45.3" },
  { id: 2, title: "Clinical Evaluation of Novel HER2-Targeted ADC in Metastatic Breast Cancer", journal: "The Lancet Oncology", year: 2024, type: "CER", tags: ["Breast Cancer", "HER2", "ADC"], citation: "Mazilu I. et al., Lancet Oncol. 2024;25(4):512-528", impact: "IF 51.1" },
  { id: 3, title: "Post-Market Surveillance Outcomes for CAR-T Cell Therapy in DLBCL", journal: "Blood", year: 2024, type: "PMCF", tags: ["CAR-T", "Lymphoma", "Cell Therapy"], citation: "Mazilu I. et al., Blood. 2024;143(12):1445-1459", impact: "IF 25.4" },
  { id: 4, title: "Safety Profile Assessment of PARP Inhibitors in Ovarian Cancer: A PSUR Analysis", journal: "Annals of Oncology", year: 2024, type: "PSUR", tags: ["Ovarian Cancer", "PARP", "Safety"], citation: "Mazilu I. et al., Ann Oncol. 2024;35(2):189-201", impact: "IF 32.9" },
  { id: 5, title: "Real-World Evidence for Checkpoint Inhibitor Combinations in Melanoma", journal: "JAMA Oncology", year: 2023, type: "RWE", tags: ["Melanoma", "Immunotherapy", "Combination"], citation: "Mazilu I. et al., JAMA Oncol. 2023;9(11):1523-1536", impact: "IF 28.4" },
  { id: 6, title: "EU MDR Compliance Framework for AI-Assisted Diagnostic Devices in Oncology", journal: "Regulatory Toxicology and Pharmacology", year: 2023, type: "CER", tags: ["AI/ML", "Diagnostics", "EU MDR"], citation: "Mazilu I. et al., Regul Toxicol Pharmacol. 2023;142:105432", impact: "IF 4.2" },
  { id: 7, title: "Benefit-Risk Analysis of Bispecific Antibodies in Relapsed Multiple Myeloma", journal: "New England Journal of Medicine", year: 2023, type: "CER", tags: ["Multiple Myeloma", "Bispecific Ab"], citation: "Mazilu I. et al., N Engl J Med. 2023;388(15):1378-1392", impact: "IF 96.2" },
  { id: 8, title: "Long-term PMCF Data for Robotic-Assisted Surgical Systems in Prostate Cancer", journal: "European Urology", year: 2022, type: "PMCF", tags: ["Prostate Cancer", "Robotic Surgery"], citation: "Mazilu I. et al., Eur Urol. 2022;82(6):623-635", impact: "IF 24.3" },
];

const reportTypes = ["All", "CER", "SLR", "PMCF", "PSUR", "RWE"];

export default function ClinicalEvidenceVault() {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("All");

  const filtered = useMemo(() => {
    return papers.filter((p) => {
      const matchesType = activeType === "All" || p.type === activeType;
      const matchesSearch = search === "" || 
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
        p.journal.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [search, activeType]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="report-header">
        <p className="report-label">Section 2.0</p>
        <h1 className="report-title font-display text-3xl">Clinical Evidence Vault</h1>
      </div>

      {/* Search & Filters */}
      <div className="report-section">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, tag, or journal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 font-body"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {reportTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold font-body transition-colors ${
                  activeType === type
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 font-body">{filtered.length} publications found</p>
      </div>

      {/* Papers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((paper) => (
          <article key={paper.id} className="report-section hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between gap-3">
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider flex-shrink-0 border-primary/30 text-primary font-semibold">
                {paper.type}
              </Badge>
              <span className="text-[10px] text-muted-foreground font-body">{paper.impact}</span>
            </div>
            <h3 className="font-display text-sm font-semibold mt-3 leading-snug text-foreground group-hover:text-primary transition-colors">
              {paper.title}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground font-body">
              <BookOpen className="w-3 h-3" />
              <span>{paper.journal}</span>
              <span className="text-border">•</span>
              <Calendar className="w-3 h-3" />
              <span>{paper.year}</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 font-body italic">{paper.citation}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {paper.tags.map((tag) => (
                <span key={tag} className="clinical-badge text-[10px]">{tag}</span>
              ))}
            </div>
            <a href="mailto:maziluileana88@gmail.com?subject=Request Full Report: ${encodeURIComponent(paper.title)}" className="mt-3 flex items-center gap-1 text-xs text-primary font-semibold font-body opacity-0 group-hover:opacity-100 transition-opacity">
              Request Full Report <ExternalLink className="w-3 h-3" />
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
