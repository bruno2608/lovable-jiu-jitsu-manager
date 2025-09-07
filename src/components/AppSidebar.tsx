
import {
  Users,
  BarChart,
  CalendarDays,
  Award,
  Settings,
  Menu,
  LogIn,
  Mail,
  Building,
  Tag,
  FileText,
  CheckSquare
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
  useSidebar,
} from "@/components/ui/sidebar";
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
    title: "Presença",
    url: "/presenca",
    icon: CheckSquare,
  },
  {
    title: "Graduações",
    url: "/graduacoes",
    icon: Award,
  },
  {
    title: "Mensagens",
    url: "/mensagens",
    icon: Mail,
  },
  {
    title: "Instituição",
    url: "/instituicao",
    icon: Building,
  },
  {
    title: "Promoções",
    url: "/promocoes",
    icon: Tag,
  },
  {
    title: "Relatórios",
    url: "/relatorios",
    icon: FileText,
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar>
      <SidebarHeader className={`py-4 border-b border-sidebar-border ${isCollapsed ? 'px-2' : 'px-6'}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'}`}>
          <div className="h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center">
            <span className="font-bold text-sidebar-primary-foreground">JJ</span>
          </div>
          {!isCollapsed && (
            <span className="font-bold text-sidebar-foreground">Jiu-Jitsu Manager</span>
          )}
        </div>
        {!isCollapsed && (
          <div className="mt-4 px-2">
            <SidebarTrigger>
              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-sidebar-foreground opacity-50">
                <Menu className="h-6 w-6" />
              </Button>
            </SidebarTrigger>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url} className="flex items-center gap-3 justify-center">
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {!isCollapsed && (
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
        )}
      </SidebarContent>
      <SidebarFooter className={`py-4 border-t border-sidebar-border ${isCollapsed ? 'px-2' : 'px-3'}`}>
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            className={`${isCollapsed ? 'w-10 p-0 flex justify-center' : 'w-full justify-start'}`}
          >
            <LogIn className={`${isCollapsed ? '' : 'mr-2'} h-4 w-4`} />
            {!isCollapsed && 'Conectar Supabase'}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
