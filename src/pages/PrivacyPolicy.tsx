import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicy() {
  return (
    <div className="report-section max-w-4xl mx-auto">
      <div className="report-header">
        <span className="report-label">Legal</span>
        <h1 className="report-title">Privacy Policy</h1>
      </div>

      <div className="prose prose-slate max-w-none">
        <p className="text-sm text-muted-foreground mb-8">ClinicalMatch AI</p>

        <p className="mb-6">
          ClinicalMatch AI ("the App", "we", "us") respects your privacy. This Privacy Policy explains what information we collect, how we use it, and your rights regarding that information.
        </p>

        <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">1. Information We Collect</h2>
        <p className="mb-4">
          When you use ClinicalMatch AI, you may provide information such as:
        </p>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>Age, diagnosis, and relevant medical history</li>
          <li>Location or region (to identify nearby clinical trials)</li>
          <li>Contact information, if you choose to reach out to a research team through the App</li>
        </ul>
        <p className="mb-6">
          This information is provided voluntarily by you and is used solely to identify clinical trials that may match your profile.
        </p>

        <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">2. How We Use Your Information</h2>
        <p className="mb-4">We use the information you provide to:</p>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>Match your profile against publicly available clinical trial eligibility criteria using AI-based analysis</li>
          <li>Display relevant clinical trial results, locations, and contact details</li>
          <li>Improve the accuracy and functionality of the App</li>
        </ul>
        <p className="mb-6">We do not sell your personal or health information to third parties.</p>

        <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">3. AI Processing</h2>
        <p className="mb-6">
          ClinicalMatch AI uses artificial intelligence (including third-party AI models) to analyze the information you provide and generate matches. Data submitted for matching may be processed by these AI services solely for the purpose of generating your results.
        </p>

        <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">4. Data Sharing</h2>
        <p className="mb-4">We do not share your personal information with third parties for marketing purposes. Information may be shared only:</p>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>With your explicit action (e.g., when you choose to contact a clinical trial's research team)</li>
          <li>When required by law</li>
        </ul>

        <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">5. Data Retention</h2>
        <p className="mb-6">
          We retain your information only as long as necessary to provide the App's functionality, or as required by applicable law.
        </p>

        <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">6. Your Rights</h2>
        <p className="mb-6">
          You may request access to, correction of, or deletion of your personal information at any time by contacting us at the email below.
        </p>

        <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">7. Children's Privacy</h2>
        <p className="mb-6">
          ClinicalMatch AI is not intended for use by individuals under the age of 18. We do not knowingly collect information from minors.
        </p>

        <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">8. Medical Disclaimer</h2>
        <p className="mb-6">
          ClinicalMatch AI is an informational tool only. It does not provide medical advice, diagnosis, or treatment recommendations, and is not a substitute for professional medical consultation.
        </p>

        <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">9. Changes to This Policy</h2>
        <p className="mb-6">
          We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.
        </p>

        <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">10. Contact Us</h2>
        <p className="mb-2">
          If you have questions about this Privacy Policy or your data, contact us at:
        </p>
        <p>
          <a
            href="mailto:maziluileana88@gmail.com"
            className="text-primary hover:underline font-medium"
          >
            maziluileana88@gmail.com
          </a>
        </p>
      </div>

      <Separator className="my-8" />

      <p className="text-xs text-muted-foreground">
        Last updated: August 2026
      </p>
    </div>
  );
}
