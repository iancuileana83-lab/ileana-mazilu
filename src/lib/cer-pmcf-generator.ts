// CER / PMCF Regulatory Document Generator.
// Deterministic, template-driven generator that produces substantive
// multi-paragraph content for every required section of a Clinical
// Evaluation Report (MDR Annex XIV Part A / MEDDEV 2.7/1 Rev. 4) and a
// Post-Market Clinical Follow-Up plan (MDR Annex XIV Part B). Content is
// composed from user inputs so nothing is truncated or skipped.

export type DeviceClass = "I" | "IIa" | "IIb" | "III";
export type EvaluationRoute = "equivalence" | "clinical-investigation" | "hybrid";

export interface CerInputs {
  deviceName: string;
  manufacturer: string;
  classification: DeviceClass;
  intendedPurpose: string;
  therapeuticArea: string;
  patientPopulation: string;
  technicalCharacteristics: string;
  evaluationRoute: EvaluationRoute;
  equivalentDevice?: string;
  knownRisks?: string;
  evaluatorName?: string;
  evaluatorCredentials?: string;
}

export interface PmcfInputs {
  deviceName: string;
  manufacturer: string;
  classification: DeviceClass;
  intendedPurpose: string;
  therapeuticArea: string;
  patientPopulation: string;
  pmcfMethod: "prospective-registry" | "survey" | "literature-surveillance" | "post-market-study" | "mixed";
  pmcfDurationMonths: number;
  cerReference?: string;
}

export interface DocSection {
  number: string;
  title: string;
  paragraphs: string[];
}

export interface GeneratedDocument {
  type: "CER" | "PMCF";
  title: string;
  subtitle: string;
  generatedAt: Date;
  meta: [string, string][];
  sections: DocSection[];
}

// ---------- helpers ----------

const CLASS_DESCRIPTION: Record<DeviceClass, string> = {
  I: "Class I (low risk, generally non-invasive)",
  IIa: "Class IIa (medium risk, short-term invasive or measuring function)",
  IIb: "Class IIb (medium-to-high risk, long-term invasive or active therapeutic)",
  III: "Class III (high risk, life-supporting, implantable or incorporating a medicinal substance)",
};

const CLASS_ROUTE_GUIDANCE: Record<DeviceClass, string> = {
  I: "For Class I devices, clinical evaluation typically relies on literature review, own post-market data, and, where relevant, equivalence to a well-established technology.",
  IIa: "For Class IIa devices, clinical evaluation combines scientific literature, own clinical experience, and post-market surveillance data; a full clinical investigation is generally not required unless residual risks are not addressed by the available evidence.",
  IIb: "For Class IIb devices, clinical evidence expectations are higher: pivotal clinical investigations are commonly required, and literature-only routes must be strongly justified — particularly for implantable or long-term-contact devices.",
  III: "For Class III devices, MDR Article 61(4) requires clinical investigations unless the manufacturer can duly justify relying on clinical data on an equivalent device with contractual access to full technical documentation; the bar for equivalence is technical, biological, and clinical.",
};

function j(...parts: (string | undefined | false | null)[]): string {
  return parts.filter(Boolean).join(" ");
}

function bulletBlock(items: string[]): string {
  return items.map((i) => `• ${i}`).join("\n");
}

// ---------- CER section builders ----------

function cerScope(i: CerInputs): DocSection {
  return {
    number: "1",
    title: "Scope of the Clinical Evaluation",
    paragraphs: [
      j(
        `This Clinical Evaluation Report (CER) documents the systematic appraisal of all available clinical data`,
        `for ${i.deviceName}, manufactured by ${i.manufacturer}. It has been prepared in accordance with`,
        `Regulation (EU) 2017/745 (MDR) Annex XIV Part A and the methodology described in MEDDEV 2.7/1 Rev. 4.`
      ),
      j(
        `The device is classified as ${CLASS_DESCRIPTION[i.classification]} under MDR Annex VIII classification rules.`,
        `Its intended purpose, as declared by the manufacturer, is: "${i.intendedPurpose}".`,
        `The target patient population is ${i.patientPopulation}, within the field of ${i.therapeuticArea}.`
      ),
      j(
        `The scope of this evaluation covers safety, clinical performance, and the acceptability of the benefit-risk`,
        `profile for all intended clinical indications, user populations, and use environments. Off-label uses,`,
        `contraindicated populations, and non-CE-marked configurations are explicitly excluded from the scope`,
        `and are addressed only where necessary to justify the intended-use boundary.`
      ),
      j(
        `The CER is a living document: it will be updated at the frequency mandated for a`,
        `${CLASS_DESCRIPTION[i.classification]} device — annually for Class III and implantable devices, and at least`,
        `every 2–5 years for lower-risk devices — or sooner if post-market surveillance identifies new safety or`,
        `performance signals.`
      ),
    ],
  };
}

function cerBackground(i: CerInputs): DocSection {
  return {
    number: "2",
    title: "Clinical Background, Current Knowledge and State of the Art",
    paragraphs: [
      j(
        `The state of the art for ${i.therapeuticArea} has been established through a structured review of`,
        `clinical practice guidelines (e.g. ESMO, NCCN, NICE, ESC or the relevant specialty society), consensus`,
        `statements, systematic reviews, and health-technology assessments published in the last ten years.`,
        `The alternative therapeutic and diagnostic options available to ${i.patientPopulation} — including standard`,
        `of care, competing devices, and conservative management — are described together with their reported`,
        `safety and performance benchmarks.`
      ),
      j(
        `Unmet clinical needs identified in the current literature include limitations in efficacy, tolerability,`,
        `procedural complexity, accessibility, or long-term durability of existing options. ${i.deviceName} is`,
        `positioned against this benchmark: the CER quantifies where the device is expected to reach parity`,
        `with the state of the art and where it is expected to offer measurable clinical benefit.`
      ),
      j(
        `Adverse event rates, complication profiles, and long-term outcomes reported for the comparator`,
        `technologies constitute the acceptability thresholds against which ${i.deviceName}'s clinical data`,
        `are appraised in Section 6.`
      ),
    ],
  };
}

function cerDeviceUnderEvaluation(i: CerInputs): DocSection {
  return {
    number: "3",
    title: "Device Under Evaluation — Technical Characteristics",
    paragraphs: [
      j(
        `${i.deviceName} is a ${CLASS_DESCRIPTION[i.classification]} device manufactured by ${i.manufacturer}.`,
        `Its intended purpose is: "${i.intendedPurpose}".`
      ),
      j(
        `Key technical characteristics, materials, mechanism of action and principles of operation:`
      ),
      i.technicalCharacteristics.trim() ||
        "Not provided by the manufacturer at the time of drafting; a technical description block must be supplied by the R&D team prior to notified-body submission.",
      j(
        `The device is supplied in the configurations described in the technical documentation, with labelling,`,
        `Instructions for Use (IFU) and packaging that reflect the intended user, use environment, and any`,
        `training or user qualification requirements. Software components, where present, are developed under`,
        `IEC 62304 and their clinical impact is addressed within the risk management file (ISO 14971).`
      ),
      i.knownRisks?.trim()
        ? j(`Known residual risks and hazards addressed by the risk management process include: ${i.knownRisks.trim()}.`)
        : "Residual risks are enumerated in the risk management file and cross-referenced in the clinical benefit-risk analysis in Section 6.",
    ],
  };
}

function cerTypeOfEvaluation(i: CerInputs): DocSection {
  const routeLabel: Record<EvaluationRoute, string> = {
    equivalence: "Equivalence route (MDR Article 61(4)-(5) and MDCG 2020-5)",
    "clinical-investigation": "Clinical investigation route (MDR Article 62 and Annex XV)",
    hybrid: "Hybrid route combining literature, equivalence and own clinical data",
  };
  return {
    number: "4",
    title: "Type of Evaluation",
    paragraphs: [
      j(`The clinical evaluation strategy selected for ${i.deviceName} is: ${routeLabel[i.evaluationRoute]}.`),
      CLASS_ROUTE_GUIDANCE[i.classification],
      i.evaluationRoute === "equivalence"
        ? j(
            `The equivalence route requires demonstration of technical, biological and clinical equivalence to a`,
            `predicate device with sufficient depth of clinical data. The manufacturer confirms contractual access`,
            `to the full technical documentation of the equivalent device where required by MDR Article 61(5) for`,
            `implantable and Class III devices.`
          )
        : i.evaluationRoute === "clinical-investigation"
        ? j(
            `Pre-market clinical investigation(s) have been designed to generate primary clinical evidence for`,
            `safety and performance in the intended-use population, in line with ISO 14155 and MDR Annex XV.`
          )
        : j(
            `The hybrid strategy is justified by the mixed availability of clinical data: literature and equivalence`,
            `close the gaps not covered by the manufacturer's own clinical investigations and post-market data.`
          ),
    ],
  };
}

function cerDataSources(i: CerInputs): DocSection {
  return {
    number: "5",
    title: "Clinical Data Sources",
    paragraphs: [
      j(
        `Three complementary data streams have been searched, appraised and integrated in accordance with`,
        `MEDDEV 2.7/1 Rev. 4 §8–§9:`
      ),
      bulletBlock([
        "Scientific literature: systematic search executed in PubMed / MEDLINE, Embase and the Cochrane Library. Search strings, inclusion/exclusion criteria, PRISMA flow diagram and appraisal grids are archived in the CEP (Clinical Evaluation Plan) annex. Grey literature (regulatory databases, HTA reports, congress abstracts) is screened to mitigate publication bias.",
        `Own clinical data: pre-market clinical investigations, first-in-human data, feasibility studies, and any prior CE-mark clinical evidence generated by ${i.manufacturer} on ${i.deviceName} or its predecessor configurations.`,
        "Post-market surveillance data: PMCF studies, registry outputs, complaint and vigilance data (incidents, FSCAs), Periodic Safety Update Reports (PSURs where applicable), and post-market clinical follow-up survey results.",
      ]),
      i.evaluationRoute === "equivalence" && i.equivalentDevice
        ? j(
            `In addition, clinical data on the equivalent device ${i.equivalentDevice} have been reviewed with the`,
            `same appraisal methodology and the equivalence justification is presented in Section 7.`
          )
        : "",
      j(
        `Each source is graded for methodological quality, relevance to the device and indication, and weight`,
        `of evidence, using a documented appraisal template prior to being integrated into the benefit-risk`,
        `analysis.`
      ),
    ].filter(Boolean),
  };
}

function cerAnalysis(i: CerInputs): DocSection {
  return {
    number: "6",
    title: "Analysis of Clinical Data — Safety, Performance and Benefit-Risk",
    paragraphs: [
      j(
        `The pooled clinical data are analysed against pre-defined acceptance criteria for clinical safety, clinical`,
        `performance, and the acceptability of side-effects, as declared in the CEP. Endpoints are aligned with`,
        `standard-of-care benchmarks identified in Section 2 for ${i.therapeuticArea}.`
      ),
      j(
        `Safety analysis: incidence, severity, seriousness and causality of device-related adverse events,`,
        `serious adverse events (SAEs), device deficiencies and use-errors are tabulated. Results are compared`,
        `to the safety benchmarks of the state of the art. Complications judged unacceptable individually or in`,
        `aggregate are addressed through design changes, IFU updates, training, or targeted PMCF activities.`
      ),
      j(
        `Performance analysis: clinical performance endpoints declared in the intended purpose are quantitatively`,
        `evaluated (e.g. diagnostic accuracy, therapeutic effect size, time-to-outcome, durability). Sub-population`,
        `analyses cover ${i.patientPopulation} and any special populations identified in Section 1.`
      ),
      j(
        `Benefit-risk determination: the clinical benefit — quantified through validated outcome measures and`,
        `patient-relevant endpoints — is weighed against the totality of residual risks identified in the risk`,
        `management file. The benefit-risk profile is judged acceptable when the demonstrated clinical benefit`,
        `outweighs the residual risks under normal conditions of use, and when residual uncertainties are`,
        `addressed through post-market activities.`
      ),
    ],
  };
}

function cerEquivalence(i: CerInputs): DocSection {
  const applies = i.evaluationRoute === "equivalence" || i.evaluationRoute === "hybrid";
  if (!applies) {
    return {
      number: "7",
      title: "Equivalence Justification",
      paragraphs: [
        "Not applicable. The clinical evaluation strategy for this device does not rely on equivalence to a predicate; primary clinical evidence has been generated as described in Section 4.",
      ],
    };
  }
  return {
    number: "7",
    title: "Equivalence Justification",
    paragraphs: [
      j(
        `Equivalence to ${i.equivalentDevice || "the predicate device declared in the CEP"} is justified across the three`,
        `dimensions required by MDR Annex XIV §3 and detailed in MDCG 2020-5:`
      ),
      bulletBlock([
        "Technical equivalence: same design, specifications, principles of operation, critical performance requirements; identical or comparable use conditions; comparable methods of deployment.",
        "Biological equivalence: same materials or substances in contact with the same body tissues or fluids, with comparable duration and kind of contact; biocompatibility profile assessed per ISO 10993.",
        "Clinical equivalence: used for the same clinical condition, same intended purpose, same severity and stage of disease, at the same site in the body, in a similar population, with comparable performance.",
      ]),
      j(
        `Any differences between ${i.deviceName} and the equivalent device are individually described, justified,`,
        `and shown not to introduce clinically significant impact on safety or performance. Contractual access to`,
        `the equivalent device's technical documentation is confirmed where MDR Article 61(5) requires it.`
      ),
    ],
  };
}

function cerPmsPmcf(i: CerInputs): DocSection {
  return {
    number: "8",
    title: "Post-Market Surveillance (PMS) and PMCF Integration",
    paragraphs: [
      j(
        `A Post-Market Surveillance system compliant with MDR Article 83 is in place. It systematically collects`,
        `and evaluates real-world data on ${i.deviceName}: vigilance reporting (Articles 87–89), trend reporting,`,
        `complaint handling, and PSUR generation at the frequency required for a ${CLASS_DESCRIPTION[i.classification]} device.`
      ),
      j(
        `A Post-Market Clinical Follow-Up (PMCF) plan has been established under MDR Annex XIV Part B. It is`,
        `designed to confirm the safety and performance of the device throughout its expected lifetime, to`,
        `identify previously unknown side-effects and monitor known ones, to detect emerging risks in`,
        `sub-populations, and to ensure the ongoing acceptability of the benefit-risk profile.`
      ),
      j(
        `Outputs from PMCF activities and the wider PMS system feed back into this CER through a documented`,
        `feedback loop: they update the residual risk profile, the state of the art description, and the benefit-risk`,
        `conclusion. Signals that cross pre-defined thresholds trigger an unscheduled CER update.`
      ),
    ],
  };
}

function cerConclusion(i: CerInputs): DocSection {
  return {
    number: "9",
    title: "Conclusion — Benefit-Risk and Suitability for Intended Purpose",
    paragraphs: [
      j(
        `Based on the totality of appraised clinical evidence — literature, own clinical data, and post-market`,
        `data — the clinical benefits of ${i.deviceName} in the intended-use population (${i.patientPopulation})`,
        `are demonstrated to outweigh the residual risks under normal conditions of use.`
      ),
      j(
        `The device conforms to the relevant General Safety and Performance Requirements set out in MDR`,
        `Annex I, in particular sections 1, 8 and 9, and its clinical performance and safety are consistent with`,
        `the state of the art for ${i.therapeuticArea}.`
      ),
      j(
        `Residual uncertainties are limited, characterised, and addressed by the PMS and PMCF plan referenced`,
        `in Section 8. This CER is therefore concluded as favourable: ${i.deviceName} is suitable for its declared`,
        `intended purpose and the benefit-risk profile is acceptable. The report will be updated in line with the`,
        `frequency mandated for a ${CLASS_DESCRIPTION[i.classification]} device or upon receipt of any signal`,
        `that materially alters the benefit-risk determination.`
      ),
    ],
  };
}

function cerEvaluators(i: CerInputs): DocSection {
  const name = i.evaluatorName || "Ileana Mazilu";
  const cred =
    i.evaluatorCredentials ||
    "Senior Medical Writer; 20+ years pharmaceutical experience; specialised in Oncology and Clinical Evidence Appraisal; trained on ICH-GCP; author of Clinical Evaluation Reports for high-risk medical devices under MDR 2017/745.";
  return {
    number: "10",
    title: "Qualification of Evaluators",
    paragraphs: [
      j(
        `This CER has been authored and signed by ${name}. Documented qualifications: ${cred}`
      ),
      j(
        `The evaluator meets the requirements of MEDDEV 2.7/1 Rev. 4 §6.4 with respect to higher-education`,
        `degree, professional experience in the relevant field (${i.therapeuticArea}), and demonstrated`,
        `knowledge of research methodology, information management, regulatory requirements, and medical`,
        `writing. Any deviation from the recommended profile is justified in a Curriculum Vitae annexed to`,
        `this report. The evaluator's independence from decisions that could bias the appraisal is declared;`,
        `any conflicts of interest are disclosed in the annex.`
      ),
    ],
  };
}

export function generateCer(inputs: CerInputs): GeneratedDocument {
  const sections = [
    cerScope(inputs),
    cerBackground(inputs),
    cerDeviceUnderEvaluation(inputs),
    cerTypeOfEvaluation(inputs),
    cerDataSources(inputs),
    cerAnalysis(inputs),
    cerEquivalence(inputs),
    cerPmsPmcf(inputs),
    cerConclusion(inputs),
    cerEvaluators(inputs),
  ];
  return {
    type: "CER",
    title: `Clinical Evaluation Report — ${inputs.deviceName}`,
    subtitle: `MDR 2017/745 Annex XIV Part A · ${CLASS_DESCRIPTION[inputs.classification]}`,
    generatedAt: new Date(),
    meta: [
      ["Device:", inputs.deviceName],
      ["Manufacturer:", inputs.manufacturer],
      ["Classification:", CLASS_DESCRIPTION[inputs.classification]],
      ["Intended purpose:", inputs.intendedPurpose],
      ["Therapeutic area:", inputs.therapeuticArea],
      ["Evaluation route:", inputs.evaluationRoute],
      ["Author:", inputs.evaluatorName || "Ileana Mazilu, Senior Medical Writer"],
    ],
    sections,
  };
}

// ---------- PMCF section builders ----------

const PMCF_METHOD_LABEL: Record<PmcfInputs["pmcfMethod"], string> = {
  "prospective-registry": "Prospective real-world registry",
  survey: "Structured HCP and patient surveys",
  "literature-surveillance": "Ongoing literature surveillance",
  "post-market-study": "Dedicated post-market clinical study",
  mixed: "Mixed-method PMCF programme",
};

function pmcfMethodology(i: PmcfInputs): DocSection {
  return {
    number: "1",
    title: "General Methodology",
    paragraphs: [
      j(
        `This Post-Market Clinical Follow-Up (PMCF) plan for ${i.deviceName} (${i.manufacturer}) has been`,
        `prepared under MDR 2017/745 Annex XIV Part B and MDCG 2020-7. The overall objective is to`,
        `proactively collect and evaluate clinical data from the use of the device within its CE-marked intended`,
        `purpose, in order to confirm safety and performance throughout its expected lifetime.`
      ),
      j(
        `The methodology combines quantitative clinical outcome data with qualitative signal detection. Data are`,
        `collected under GDPR-compliant informed consent, coded, and analysed by pre-specified statistical plans.`,
        `PMCF activities are integrated with the wider PMS system (Article 83), the vigilance workflow (Articles`,
        `87–89), and the PSUR (Article 86) as applicable to a ${CLASS_DESCRIPTION[i.classification]} device.`
      ),
      j(
        `Specific PMCF objectives include: confirming clinical safety and performance in the real-world`,
        `${i.patientPopulation} population; identifying previously unknown side-effects and monitoring known`,
        `residual risks; detecting emerging risks based on factual evidence; ensuring the continued acceptability`,
        `of the benefit-risk profile; and identifying possible systematic misuse or off-label use that may impact`,
        `on the risk analysis.`
      ),
    ],
  };
}

function pmcfJustification(i: PmcfInputs): DocSection {
  return {
    number: "2",
    title: "Justification for PMCF (or justification if not required)",
    paragraphs: [
      j(
        `Under MDR Annex XIV Part B §5, PMCF is required unless a duly justified exemption applies. Given the`,
        `device classification (${CLASS_DESCRIPTION[i.classification]}) and the therapeutic area (${i.therapeuticArea}),`,
        `PMCF is required and the justification for its scope is as follows:`
      ),
      bulletBlock([
        "Residual clinical uncertainties identified in the CER — including long-term performance, low-frequency adverse events, and rare sub-population outcomes — cannot be fully resolved by pre-market data alone.",
        "The state of the art continues to evolve; ongoing surveillance is required to keep the benefit-risk determination current.",
        "Real-world use conditions differ from controlled pre-market studies; PMCF confirms that clinical performance is maintained in routine practice with the intended users.",
      ]),
      i.classification === "I"
        ? j(
            `A reduced PMCF scope may be justified for this Class I device where the residual clinical`,
            `uncertainty is low and PMS activities under Article 83 already provide adequate signal detection.`,
            `The justification for any such reduction is documented in the CER and reviewed at each update.`
          )
        : j(
            `A full PMCF programme is therefore implemented. Any decision to narrow or extend scope during the`,
            `programme is documented, technically justified, and reflected in an updated PMCF plan.`
          ),
    ],
  };
}

function pmcfMethod(i: PmcfInputs): DocSection {
  return {
    number: "3",
    title: "Specific Evaluation Method",
    paragraphs: [
      j(`The PMCF method selected is: ${PMCF_METHOD_LABEL[i.pmcfMethod]}.`),
      i.pmcfMethod === "prospective-registry"
        ? j(
            `A prospective registry enrols consecutive, real-world patients treated with ${i.deviceName}. Baseline`,
            `demographics, indication, device configuration, procedural data, and clinical outcomes at pre-defined`,
            `follow-up intervals are captured through validated electronic case report forms. A statistical analysis`,
            `plan (SAP) specifies primary and secondary endpoints, sample size, interim analyses and stopping rules.`
          )
        : i.pmcfMethod === "survey"
        ? j(
            `Structured questionnaires administered to prescribing HCPs and, where appropriate, patients capture`,
            `real-world safety, performance, satisfaction, and off-label observations. Instruments are validated,`,
            `translated where required, and administered at pre-defined cadences with defined response-rate`,
            `targets and non-responder analysis.`
          )
        : i.pmcfMethod === "literature-surveillance"
        ? j(
            `A recurring, structured literature surveillance is executed against a locked search string in PubMed`,
            `and Embase, with pre-specified inclusion criteria, appraisal grids and PRISMA reporting. Signals are`,
            `escalated into the vigilance and risk management systems as required.`
          )
        : i.pmcfMethod === "post-market-study"
        ? j(
            `A dedicated post-market clinical study is designed under ISO 14155 and MDCG 2021-6, with an`,
            `investigational plan, ethics-committee approval, informed consent, monitoring, and a clinical study`,
            `report. Primary and secondary endpoints match the residual clinical uncertainties identified in the CER.`
          )
        : j(
            `A mixed-method PMCF programme combines registry data, HCP/patient surveys, and continuous`,
            `literature surveillance. Each component targets a specific residual clinical uncertainty identified in`,
            `the CER; outputs are triangulated in the periodic PMCF Evaluation Report.`
          ),
      j(
        `Data quality is safeguarded by source-data verification, monitoring plans proportional to risk, and`,
        `blinded independent adjudication of key adverse events. All personal data are handled under GDPR.`
      ),
    ],
  };
}

function pmcfTimeline(i: PmcfInputs): DocSection {
  const months = i.pmcfDurationMonths;
  return {
    number: "4",
    title: "Timeline and Milestones",
    paragraphs: [
      j(`Total PMCF duration: ${months} months from CE-mark or from the effective plan-start date.`),
      "Milestones:",
      bulletBlock([
        "M0 — PMCF plan approval, protocol lock, registry / instruments validated, sites and investigators onboarded.",
        `M+${Math.max(3, Math.round(months * 0.15))} — first enrolments; data-capture monitoring begins; interim signal review.`,
        `M+${Math.max(6, Math.round(months * 0.4))} — mid-programme interim analysis; PMCF Evaluation Report v1; feedback into CER.`,
        `M+${Math.max(12, Math.round(months * 0.75))} — extended follow-up analysis; benefit-risk re-assessment; PSUR input as applicable.`,
        `M+${months} — final PMCF Evaluation Report; CER updated; decisions on next PMCF cycle documented.`,
      ]),
      j(
        `Unscheduled interim analyses are triggered by pre-defined safety signals (e.g. SAE rate, complaint`,
        `trends, vigilance events) and reported to competent authorities as required.`
      ),
    ],
  };
}

function pmcfLinkToCer(i: PmcfInputs): DocSection {
  return {
    number: "5",
    title: "Link to CER (Feedback Loop)",
    paragraphs: [
      j(
        `PMCF outputs are contractually integrated with the Clinical Evaluation Report`,
        i.cerReference ? `(${i.cerReference})` : "(latest approved CER version)",
        `through a documented feedback loop. Each PMCF Evaluation Report is used to:`
      ),
      bulletBlock([
        "Update the residual risk profile and the risk management file (ISO 14971).",
        "Update the state-of-the-art description in the CER Section 2.",
        "Re-assess the benefit-risk determination in the CER Section 6 / 9.",
        "Confirm — or, where necessary, restrict — the intended purpose, target population, or IFU wording.",
        "Trigger design changes, training, or field safety corrective actions where signals warrant them.",
      ]),
      j(
        `Signals that cross pre-defined significance thresholds are escalated immediately to the risk management`,
        `and vigilance systems, and initiate an unscheduled CER update independent of the routine update cycle.`
      ),
    ],
  };
}

export function generatePmcf(inputs: PmcfInputs): GeneratedDocument {
  const sections = [
    pmcfMethodology(inputs),
    pmcfJustification(inputs),
    pmcfMethod(inputs),
    pmcfTimeline(inputs),
    pmcfLinkToCer(inputs),
  ];
  return {
    type: "PMCF",
    title: `Post-Market Clinical Follow-Up Plan — ${inputs.deviceName}`,
    subtitle: `MDR 2017/745 Annex XIV Part B · MDCG 2020-7 · ${CLASS_DESCRIPTION[inputs.classification]}`,
    generatedAt: new Date(),
    meta: [
      ["Device:", inputs.deviceName],
      ["Manufacturer:", inputs.manufacturer],
      ["Classification:", CLASS_DESCRIPTION[inputs.classification]],
      ["Intended purpose:", inputs.intendedPurpose],
      ["Therapeutic area:", inputs.therapeuticArea],
      ["PMCF method:", PMCF_METHOD_LABEL[inputs.pmcfMethod]],
      ["Duration:", `${inputs.pmcfDurationMonths} months`],
      ["Linked CER:", inputs.cerReference || "Latest approved CER version"],
    ],
    sections,
  };
}
