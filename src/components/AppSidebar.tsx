import { FileText, Shield, Briefcase, User, Stethoscope } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Executive Summary", url: "/", icon: User },
  { title: "Clinical Evidence Vault", url: "/evidence", icon: FileText },
  { title: "Regulatory Credentials", url: "/credentials", icon: Shield },
  { title: "Services", url: "/services", icon: Briefcase },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Branding */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-sidebar-primary flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-sidebar-accent-foreground truncate">Dr. Elena Vasquez</p>
                <p className="text-xs text-sidebar-foreground truncate">Medical Writer</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer */}
        {!collapsed && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/50">Confidential Portfolio</p>
            <p className="text-[10px] text-sidebar-foreground/40 mt-1">© 2026 All Rights Reserved</p>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
