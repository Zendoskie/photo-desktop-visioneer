import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Code, ListChecks, BarChart3, MessageCircle } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [
  { title: "Evaluate", href: "/evaluate", icon: Code },
  { title: "Enumeration", href: "/enumeration", icon: ListChecks },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "AI Chat", href: "/ai-chat", icon: MessageCircle },
];

export function AppSidebar() {
  const { state: sidebarState } = useSidebar();
  const location = useLocation();
  const isCollapsed = sidebarState === 'collapsed';

  return (
    <Sidebar
      className={cn(
        "border-r border-appBorder bg-appBlue dark:bg-appBlue/30 transition-all duration-300 ease-in-out flex flex-col h-full",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      <SidebarHeader className="p-3 flex items-center border-b border-appBorder">
        {!isCollapsed && <span className="font-semibold text-appGreen text-lg ml-2">OpenE</span>}
        <SidebarTrigger 
          className={cn(
            "text-appText hover:text-appGreen data-[state=open]:text-appGreen",
            !isCollapsed && "ml-auto" 
          )}
        />
      </SidebarHeader>
      <SidebarContent className="flex-grow p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.href}
                tooltip={isCollapsed ? { children: item.title, side: "right", align: "center" } : undefined}
                className={cn(
                  "justify-start text-appText hover:bg-appText/10 hover:text-appGreen data-[active=true]:bg-appGreen/20 data-[active=true]:text-appGreen data-[active=true]:font-semibold",
                  isCollapsed && "justify-center aspect-square h-auto p-2.5",
                  !isCollapsed && "py-2 px-3"
                )}
              >
                <NavLink to={item.href} className={cn(isCollapsed && "flex justify-center items-center w-full h-full")}>
                  <item.icon className={cn("h-5 w-5 shrink-0", !isCollapsed && "mr-3")} />
                  {!isCollapsed && <span className="truncate">{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-3 border-t border-appBorder">
        <div className={cn("flex", isCollapsed ? "justify-center" : "justify-start")}>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
