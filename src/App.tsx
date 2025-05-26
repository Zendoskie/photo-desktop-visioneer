
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
import { AppSidebar } from "@/components/AppSidebar"; // Import the new sidebar

const queryClient = new QueryClient();

const MainLayout = () => (
  <SidebarProvider defaultOpen={true} > {/* Sidebar open by default */}
    <div className="flex h-screen w-full bg-appDark">
      <AppSidebar />
      <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
        {/* Content will be rendered here by Outlet */}
        <Outlet /> 
      </main>
    </div>
  </SidebarProvider>
);

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

