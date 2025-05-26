
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import IntroPage from "./pages/IntroPage";
import NotFound from "./pages/NotFound";
import AIChat from "./pages/AIChat";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button"; 
import { PanelLeft } from "lucide-react";

const queryClient = new QueryClient();

const MainLayout = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-appDark">
        {/* Persistent sidebar trigger that's always visible */}
        <div className="fixed top-3 left-3 z-50 md:hidden">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full bg-appBlue/80 text-appText border-appBorder hover:bg-appBlue hover:text-appGreen"
            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', metaKey: true }))}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        </div>
        
        <AppSidebar />
        <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
          <Outlet /> 
        </main>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <ThemeProvider defaultTheme="dark">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* The main div that wrapped everything is effectively replaced by MainLayout's structure or body styles */}
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<IntroPage />} />
            {/* Routes that should have the sidebar */}
            <Route element={<MainLayout />}>
              <Route path="/evaluate" element={<Index activeTab="evaluate" />} />
              <Route path="/enumeration" element={<Index activeTab="enumeration" />} />
              <Route path="/analytics" element={<Index activeTab="analytics" />} />
              <Route path="/ai-chat" element={<AIChat />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
