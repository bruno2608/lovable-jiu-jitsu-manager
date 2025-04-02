
import {
  Users,
  BarChart,
  CalendarDays,
  Award,
  Settings,
  Menu,
  LogIn
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

// Menu items for navigation
const mainMenuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart,
  },
  {
    title: "Alunos",
    url: "/alunos",
    icon: Users,
  },
  {
    title: "Aulas",
    url: "/aulas",
    icon: CalendarDays,
  },
  {
    title: "Graduações",
    url: "/graduacoes",
    icon: Award,
  }
];

export function AppSidebar() {
  const isMobile = useIsMobile();
  
  return (
    <Sidebar>
      <SidebarHeader className="py-4 border-b border-sidebar-border">
        <div className="px-6 flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center">
            <span className="font-bold text-sidebar-primary-foreground">JJ</span>
          </div>
          <span className="font-bold text-sidebar-foreground">Jiu-Jitsu Manager</span>
        </div>
        <div className="mt-4 px-2">
          <SidebarTrigger>
            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-sidebar-foreground opacity-50">
              <Menu className="h-6 w-6" />
            </Button>
          </SidebarTrigger>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Configurações</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/configuracoes" className="flex items-center gap-3">
                    <Settings className="h-5 w-5" />
                    <span>Configurações</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="py-4 border-t border-sidebar-border">
        <div className="px-3">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <LogIn className="mr-2 h-4 w-4" />
            Conectar Supabase
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
