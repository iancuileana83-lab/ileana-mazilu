import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

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
          </header>
          <main className="flex-1 p-6 md:p-10 max-w-6xl">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
