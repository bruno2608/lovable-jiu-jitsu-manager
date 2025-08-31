
import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface AppLayoutProps {
  children: React.ReactNode;
}

// Component for the floating sidebar toggle that appears when sidebar is collapsed
function FloatingSidebarToggle() {
  const { state } = useSidebar();
  
  // Only show when sidebar is collapsed
  if (state !== "collapsed") {
    return null;
  }
  
  return (
    <div className="fixed top-4 left-4 z-50 md:block">
      <SidebarTrigger>
        <Button variant="outline" size="icon" className="h-10 w-10 rounded-full shadow-md bg-background">
          <Menu className="h-5 w-5" />
        </Button>
      </SidebarTrigger>
    </div>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto">
          <FloatingSidebarToggle />
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          <div className="container py-6 px-4 md:px-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default AppLayout;
