import { ExternalLink, ArrowRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  AI Projects Data                                                   */
/* ------------------------------------------------------------------ */

const healthcareProjects = [
  {
    name: "MedAd Compliance AI — Web Platform",
    problem: "Drafting EU MDR compliance documentation (CER, PMCF, PSUR) for Class III medical devices is a manual, time-consuming process requiring specialized regulatory expertise.",
    solution: "A web platform generating CER/PMCF document drafts using Google Gemini, built end-to-end and monetized via Stripe.",
    status: "Live and functional; submitted to the \"Build with Gemini\" XPRIZE, currently in judging.",
    link: "https://ileana-mazilu.lovable.app",
    linkLabel: "View platform",
  },
  {
    name: "MedAd Compliance AI — Android App",
    problem: "Regulatory professionals need to review or draft compliance documentation on the go.",
    solution: "Native Android app (Capacitor-wrapped), with in-app billing via RevenueCat.",
    status: "In closed testing on Google Play across 177 countries; submitted to Shipaton (RevenueCat's official hackathon).",
    link: "https://play.google.com/apps/testing/com.ileanamazilu.app",
    linkLabel: "Opt in to test",
  },
  {
    name: "RxTrack Agent — Google ADK & AWS Versions",
    problem: "Pharma and healthcare teams need automated agents to track and reason over regulatory data.",
    solution: "Built twice, on two different stacks — Google ADK + Gemini + Firestore, and AWS Strands SDK + Bedrock + Firestore — to demonstrate platform flexibility.",
    status: "Both submitted to their respective hackathons.",
    link: "https://github.com/iancuileana83-lab/rxtrack-agent-adk",
    linkLabel: "View on GitHub",
  },
  {
    name: "ClinicalMatch AI — Trial Matching Dashboard",
    problem: "Matching patients to relevant clinical trials is manual and fragmented.",
    solution: "A live patient-to-trial matching dashboard with a real scoring algorithm, built with a CockroachDB backend.",
    status: "Live and deployed; submitted to the CockroachDB x AWS hackathon.",
    link: "https://clinicalmatch.vercel.app",
    linkLabel: "View live demo",
  },
  {
    name: "CALL-E — Clinic Appointment Concierge",
    problem: "Clinics need automated call handling for appointment scheduling.",
    solution: "A voice/call agent for clinic booking.",
    status: "Contributed as a merged pull request to an open-source phone-call-agent project.",
    link: "https://github.com/CALLE-AI/awesome-phone-call-agents/pull/249",
    linkLabel: "View merged PR",
  },
  {
    name: "MedAd Nutrient Compliance Pipeline",
    problem: "Structured extraction and validation from complex compliance source documents is slow to do manually.",
    solution: "A pipeline combining Nutrient DWS with Google Gemini for automated document processing.",
    status: "Built and submitted to the DevNetwork hackathon.",
    link: "https://github.com/iancuileana83-lab/medad-nutrient-demo",
    linkLabel: "View on GitHub",
  },
];

const devToolsProjects = [
  {
    name: "Query Letter Copilot",
    problem: "Writers pitching literary agents or publications often struggle to craft compelling, targeted queries.",
    solution: "Built on Nebius Token Factory with the Nemotron model, deployed on Google Cloud Run.",
    status: "Live and deployed; submitted to the Nebius x NVIDIA hackathon.",
    link: "https://query-letter-copilot-30747896454.europe-west4.run.app",
    linkLabel: "View live demo",
  },
  {
    name: "Ad Script Clearance Agent",
    problem: "Reviewing ad scripts for legal/compliance clearance is a manual, error-prone process.",
    solution: "An agentic clearance tool built and deployed on Replit.",
    status: "Live; submitted to the \"Agentic Cinema\" hackathon.",
    link: "https://tired-joyful-links--maziluileana88.replit.app",
    linkLabel: "View live demo",
  },
];

const otherProjects = [
  {
    name: "SentinelScan — Web3 Fraud Scanner",
    problem: "Web3 users have limited tools to quickly check a wallet, contract, or transaction for fraud signals.",
    solution: "A frontend (Bolt) and backend (Python/FastAPI on Google Cloud Run) using Gemini for fraud analysis — fully live, not just a demo.",
    status: "Permanently deployed; submitted to BLI Legal Tech Hackathon 2, registered for Hack Apertus.",
    link: "https://web3-fraud-scanner-d-qh0r.bolt.host",
    linkLabel: "View live demo",
  },
];

/* ------------------------------------------------------------------ */
/*  Reusable Project Card                                              */
/* ------------------------------------------------------------------ */

function ProjectCard({ project }: { project: typeof healthcareProjects[0] }) {
  return (
    <div className="space-y-2 text-sm text-foreground/85 leading-relaxed font-body max-w-3xl border-l-2 border-primary/20 pl-4 py-1">
      <h3 className="font-semibold text-foreground font-display text-base">{project.name}</h3>
      <p><span className="font-semibold text-foreground">Problem:</span> {project.problem}</p>
      <p><span className="font-semibold text-foreground">Solution:</span> {project.solution}</p>
      <p><span className="font-semibold text-foreground">Status:</span> {project.status}</p>
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-primary font-semibold hover:underline"
      >
        {project.linkLabel} <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AIProjects() {
  return (
    <div className="space-y-10 animate-fade-in">
      {/* Page header */}
      <div className="report-header">
        <p className="report-label">Section 6.0</p>
        <h1 className="report-title font-display text-3xl">AI Projects Portfolio</h1>
      </div>

      <div className="report-section">
        <p className="text-sm text-foreground/85 leading-relaxed font-body max-w-3xl">
          Building on 20 years of pharmaceutical and regulatory affairs experience, I design and build AI-powered
          tools spanning healthcare compliance, agentic automation, and beyond. Below are the projects I've built,
          the problem each one solves, and where each stands today.
        </p>
      </div>

      {/* ---- Healthcare & Regulatory AI ---- */}
      <div className="report-section">
        <div className="report-header">
          <p className="report-label">6.1 Healthcare & Regulatory AI</p>
          <h2 className="report-title font-display text-xl">Applied AI for Compliance & Clinical Workflows</h2>
        </div>
        <div className="flex flex-col gap-6 mt-4">
          {healthcareProjects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </div>

      {/* ---- Agentic & Dev Tools ---- */}
      <div className="report-section">
        <div className="report-header">
          <p className="report-label">6.2 Agentic & Dev Tools</p>
          <h2 className="report-title font-display text-xl">Automation Beyond Healthcare</h2>
        </div>
        <div className="flex flex-col gap-6 mt-4">
          {devToolsProjects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </div>

      {/* ---- Web3 & Other ---- */}
      <div className="report-section">
        <div className="report-header">
          <p className="report-label">6.3 Web3 & Other</p>
          <h2 className="report-title font-display text-xl">Exploring Adjacent Domains</h2>
        </div>
        <div className="flex flex-col gap-6 mt-4">
          {otherProjects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </div>

      {/* ---- Closing line ---- */}
      <div className="report-section">
        <p className="text-sm text-foreground/85 leading-relaxed font-body max-w-3xl italic">
          Every project here was built solo, combining hands-on regulatory/medical writing expertise with applied
          AI engineering — from idea to live, working deployment.
        </p>
      </div>
    </div>
  );
}
