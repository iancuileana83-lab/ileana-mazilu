import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import ExecutiveSummary from "./pages/ExecutiveSummary";
import ClinicalEvidenceVault from "./pages/ClinicalEvidenceVault";

import Services from "./pages/Services";
import ProjectHighlights from "./pages/ProjectHighlights";
import MedAdComplianceAI from "./pages/MedAdComplianceAI";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<ExecutiveSummary />} />
            <Route path="/evidence" element={<ClinicalEvidenceVault />} />
            
            <Route path="/services" element={<Services />} />
            <Route path="/highlights" element={<ProjectHighlights />} />
            <Route path="/medad-ai" element={<MedAdComplianceAI />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
