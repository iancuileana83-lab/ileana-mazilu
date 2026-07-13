import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { NavLink } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="ml-3" />
            <div className="ml-4 flex items-center gap-2">
              <span className="report-label">Portfolio</span>
              <span className="text-border mx-1">|</span>
              <span className="text-xs text-muted-foreground font-body">Senior Clinical Evaluation Medical Writer</span>
            </div>
            <nav className="ml-auto mr-4 flex items-center gap-2">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `text-xs px-3 py-1.5 rounded-md transition ${isActive ? "bg-secondary text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`
                }
              >
                Portfolio
              </NavLink>
              <NavLink
                to="/medad-ai"
                className={({ isActive }) =>
                  `text-xs px-3 py-1.5 rounded-md transition inline-flex items-center gap-1.5 ${isActive ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium" : "border border-primary/20 text-primary hover:bg-primary/5"}`
                }
              >
                <Sparkles className="w-3 h-3" /> MedAd Compliance AI
              </NavLink>
            </nav>
          </header>
          <main className="flex-1 p-6 md:p-10 max-w-6xl">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
